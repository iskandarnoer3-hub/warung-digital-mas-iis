import { getDb } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

async function sendToTelegram(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error('Telegram credentials not configured')
  }

  // Telegram message limit is 4096 chars, split if needed
  const chunks: string[] = []
  let current = ''

  for (const line of text.split('\n')) {
    if (current.length + line.length + 1 > 4000) {
      chunks.push(current)
      current = line
    } else {
      current += (current ? '\n' : '') + line
    }
  }
  if (current) chunks.push(current)

  for (const chunk of chunks) {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: chunk,
          parse_mode: 'HTML',
        }),
      }
    )
  }
}

// POST /api/backup - Send database backup to Telegram (secret)
export async function POST(request: NextRequest) {
  const db = getDb()
  if (!db) {
    return NextResponse.json(
      { success: false, error: 'Database unavailable' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const { type } = body

    const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })

    if (type === 'services') {
      const services = await db.service.findMany({
        include: { landingPage: true },
        orderBy: { order: 'asc' },
      })

      let text = `<b>📦 BACKUP JASA - Mas Iis</b>\n⏰ ${timestamp}\nTotal: ${services.length} jasa\n\n`

      for (const svc of services) {
        text += `<b>${svc.order}. ${svc.name}</b>\n`
        text += `   Kategori: ${svc.category}\n`
        text += `   Harga: Rp ${svc.price.toLocaleString('id-ID')} - Rp ${svc.priceMax.toLocaleString('id-ID')}\n`
        text += `   Desc: ${svc.shortDesc}\n`
        text += `   Bonus: ${svc.bonus || '-'}\n`
        text += `   Aktif: ${svc.active ? '✅' : '❌'}\n\n`
      }

      await sendToTelegram(text)
    } else if (type === 'articles') {
      const articles = await db.article.findMany({
        orderBy: { createdAt: 'desc' },
      })

      let text = `<b>📝 BACKUP ARTIKEL - Mas Iis</b>\n⏰ ${timestamp}\nTotal: ${articles.length} artikel\n\n`

      for (const art of articles) {
        text += `<b>${art.title}</b>\n`
        text += `   Status: ${art.published ? '✅ Published' : '📝 Draft'}\n`
        text += `   ${art.excerpt || '-'}\n\n`
      }

      await sendToTelegram(text)
    } else if (type === 'chats') {
      const recentChats = await db.chatLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      })

      let text = `<b>💬 BACKUP CHAT - Mas Iis</b>\n⏰ ${timestamp}\nTotal: ${recentChats.length} pesan terakhir\n\n`

      for (const chat of recentChats) {
        const t = new Date(chat.createdAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
        text += `<b>[${chat.role}]</b> ${t}\n${chat.message.substring(0, 200)}\n\n`
      }

      await sendToTelegram(text)
    } else if (type === 'leads') {
      // Get unique sessions with chat counts
      const sessions = await db.chatLog.groupBy({
        by: ['sessionId'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      })

      let text = `<b>👥 BACKUP LEADS - Mas Iis</b>\n⏰ ${timestamp}\nTotal: ${sessions.length} sesi\n\n`

      for (const session of sessions.slice(0, 20)) {
        text += `Sesi: ${session.sessionId} (${session._count.id} pesan)\n`
      }

      await sendToTelegram(text)
    } else {
      // Full backup
      const [services, articles] = await Promise.all([
        db.service.findMany({ orderBy: { order: 'asc' } }),
        db.article.findMany({ orderBy: { createdAt: 'desc' } }),
      ])

      let text = `<b>🔄 FULL BACKUP - Mas Iis</b>\n⏰ ${timestamp}\n\n`
      text += `<b>Jasa:</b> ${services.length}\n`
      text += `<b>Artikel:</b> ${articles.length}\n\n`

      for (const svc of services) {
        text += `${svc.order}. ${svc.name} (${svc.category}) - ${svc.active ? '✅' : '❌'}\n`
      }

      await sendToTelegram(text)
    }

    return NextResponse.json({ success: true, message: 'Backup sent successfully' })
  } catch (error) {
    console.error('Backup error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send backup' },
      { status: 500 }
    )
  }
}
