import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

const SYSTEM_PROMPT = `Kamu adalah AI CS (Customer Service) untuk "Mas Iis - Warung Solusi" yang berlokasi di Sindanglaut, Kab. Cirebon. Kamu ramah, sopan, dan sedikit humoris. Jawab dalam bahasa Indonesia yang santai.

INFO BISNIS:
- Nama brand: Mas Iis - Warung Solusi
- Lokasi: Sindanglaut, Kab. Cirebon
- WhatsApp: 0882-0008-58698
- Pembayaran: Transfer bank BCA saja, bisa bayar di tempat untuk area Cirebon
- Garansi: Hingga 30 hari untuk sebagian besar jasa

17 JASA YANG TERSEDIA:
1. Servis Laptop & MacBook (Rp 150K-1.5jt) - Elektronik
2. Bimbingan Skripsi/Tesis/Disertasi/Artikel Ilmiah (Rp 1.5-5jt) - Pendidikan
3. Jasa Cek Turnitin & AI (Rp 50-150K) - Pendidikan
4. Paket Belajar A, B, C (Rp 300-800K) - Pendidikan
5. Jasa Jahit Baju Borongan Sekolah (Rp 45-150K/pcs) - Fashion
6. Desain Grafis Profesional (Rp 250K-1.5jt) - Digital
7. Jasa Agency Acara Lengkap (Rp 5-25jt) - Event
8. Jasa MC Profesional (Rp 750K-3jt) - Event
9. Gambus & El-Husna Sound System (Rp 1.5-5jt) - Event
10. Jual Beli Kambing Qurban & Aqiqah (Rp 2.5-5jt) - Peternakan
11. Website Profil Minimalis (Rp 1.5-10jt) - IT
12. Konsultan Manajemen Sekolah (Rp 3-15jt) - Konsultan
13. CEO Copywriting (Rp 500K-3jt) - Digital
14. Jasa Kaligrafi Arab (Rp 300K-2jt) - Seni
15. Hiasan Pigura Custom (Rp 250K-1.5jt) - Seni
16. Hias Taman Profesional - 40 tahun pengalaman (Rp 500K-10jt) - Seni
17. Jasa Hiburan Angklung (Rp 1.2-3jt) - Event

ATURAN:
- Jika ditanya harga, sebutkan range harga
- Jika ditanya area luar Cirebon, jelaskan bahwa jasa online bisa dari mana saja, tapi jasa yang butuh kehadiran hanya area Cirebon
- Jika ditanya pembayaran, jelaskan hanya BCA transfer atau bayar di tempat area Cirebon
- Arahkan ke WhatsApp 0882-0008-58698 untuk pemesanan
- Jangan pernah sebutkan teknologi backend, Telegram, Supabase, atau API
- Jawab dengan singkat, jelas, dan ramah
- Boleh pakai emoji tapi jangan berlebihan`

// Singleton ZAI instance
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create()
  }
  return zaiInstance
}

async function sendToTelegram(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return
  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text.substring(0, 4096),
          parse_mode: 'HTML',
        }),
      }
    )
  } catch (err) {
    console.error('Failed to send Telegram notification:', err)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, sessionId } = body

    if (!message || !sessionId) {
      return NextResponse.json(
        { success: false, error: 'message and sessionId are required' },
        { status: 400 }
      )
    }

    // Save the user message to ChatLog
    await db.chatLog.create({
      data: {
        sessionId,
        role: 'user',
        message,
      },
    })

    // Get recent chat history for context (last 10 messages)
    const chatHistory = await db.chatLog.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
    chatHistory.reverse()

    // Build messages for AI (z-ai uses 'assistant' role for system prompt)
    const aiMessages: Array<{ role: string; content: string }> = [
      { role: 'assistant', content: SYSTEM_PROMPT },
      ...chatHistory.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.message,
      })),
    ]

    let reply = ''

    try {
      const zai = await getZAI()
      const completion = await zai.chat.completions.create({
        messages: aiMessages,
        thinking: { type: 'disabled' },
      })

      reply =
        completion.choices?.[0]?.message?.content ||
        'Maaf kak, coba lagi ya. Langsung WA Mas Iis: 0882-0008-58698'
    } catch (aiError) {
      console.error('AI completion error:', aiError)
      reply =
        'Maaf kak, AI lagi sibuk nih. Langsung WA Mas Iis aja: 0882-0008-58698 💬'
    }

    // Save the assistant reply to ChatLog
    await db.chatLog.create({
      data: {
        sessionId,
        role: 'assistant',
        message: reply,
      },
    })

    // Send notification to Telegram (secret backend backup)
    const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
    sendToTelegram(
      `<b>💬 Chat Baru - Mas Iis</b>\n` +
        `⏰ ${timestamp}\n` +
        `<b>User:</b> ${message.substring(0, 500)}\n` +
        `<b>AI:</b> ${reply.substring(0, 500)}`
    ).catch(() => {})

    return NextResponse.json({ success: true, data: { reply, sessionId } })
  } catch (error) {
    console.error('Error in chat route:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
