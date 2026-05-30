import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { AI_SYSTEM_PROMPT } from '@/lib/ai-system-prompt'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

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
      { role: 'assistant', content: AI_SYSTEM_PROMPT },
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

      // Remove any accidental asterisks from AI response (WhatsApp safety)
      reply = reply.replace(/\*\*/g, '').replace(/\*/g, '')
    } catch (aiError) {
      console.error('AI completion error:', aiError)
      reply =
        'Maaf kak, AI lagi sibuk nih. Langsung WA Mas Iis aja: 0882-0008-58698'
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
      `<b>Chat Baru - Mas Iis</b>\n` +
        `Waktu: ${timestamp}\n` +
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
