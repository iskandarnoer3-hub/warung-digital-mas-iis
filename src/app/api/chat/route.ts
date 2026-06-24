import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { AI_SYSTEM_PROMPT } from '@/lib/ai-system-prompt'
import { getDb, resetDb } from '@/lib/db'

// Force dynamic, disable static optimization
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
// Vercel: allow up to 60 seconds for AI response
export const maxDuration = 60

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

// Singleton ZAI instance
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null

async function getZAI() {
  if (!zaiInstance) {
    console.log('[chat] Initializing ZAI instance...')
    zaiInstance = await ZAI.create()
    console.log('[chat] ZAI instance ready')
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
    console.error('[chat] Failed to send Telegram notification:', err)
  }
}

function isPreparedStmtError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  return msg.includes('prepared statement') || msg.includes('42P05')
}

// Check if database is available
let dbAvailable = true

export async function POST(request: NextRequest) {
  const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  console.log(`[chat:${requestId}] Received chat request`)

  try {
    const body = await request.json()
    const { message, sessionId } = body

    if (!message || !sessionId) {
      console.log(`[chat:${requestId}] Missing message or sessionId`)
      return NextResponse.json(
        { success: false, error: 'message and sessionId are required' },
        { status: 400 }
      )
    }

    console.log(`[chat:${requestId}] Message: "${message.substring(0, 80)}..."`)

    // Try to save user message to ChatLog (non-blocking if DB is down)
    let chatHistory: Array<{ role: string; content: string }> = []

    if (dbAvailable) {
      try {
        const db = getDb()
        if (db) {
          await db.chatLog.create({
            data: { sessionId, role: 'user', message },
          })

          // Get recent chat history for context (last 10 messages)
          const history = await db.chatLog.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'desc' },
            take: 10,
          })
          history.reverse()
          chatHistory = history.map((msg) => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.message,
          }))
          console.log(`[chat:${requestId}] Loaded ${chatHistory.length} history messages`)
        }
      } catch (dbError) {
        console.error(`[chat:${requestId}] DB error (chat will still work):`, dbError)
        if (isPreparedStmtError(dbError)) {
          resetDb()
        }
        dbAvailable = false
        setTimeout(() => { dbAvailable = true }, 30000)
      }
    }

    // Build messages for AI - use system role for system prompt
    const aiMessages: Array<{ role: string; content: string }> = [
      { role: 'system', content: AI_SYSTEM_PROMPT },
      ...chatHistory,
      { role: 'user', content: message },
    ]

    let reply = ''

    // Retry mechanism for AI calls (max 2 attempts)
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[chat:${requestId}] AI attempt ${attempt}...`)
        const zai = await getZAI()

        const completion = await zai.chat.completions.create({
          messages: aiMessages,
          thinking: { type: 'disabled' },
          // Increase timeout via longer streaming
          stream: false,
        })

        const rawReply = completion.choices?.[0]?.message?.content

        if (rawReply && rawReply.trim().length > 0) {
          // Remove any accidental asterisks from AI response (WhatsApp safety)
          reply = rawReply.replace(/\*\*/g, '').replace(/\*/g, '')
          console.log(`[chat:${requestId}] ✓ AI reply success on attempt ${attempt} (${reply.length} chars)`)
          break
        } else {
          console.warn(`[chat:${requestId}] AI returned empty content on attempt ${attempt}`)
          if (attempt === 2) {
            reply = 'Maaf kak, AI lagi nggak fokus nih. Coba ulangi pertanyaannya, atau langsung WA Mas Iis: 0882-0008-58698 ya kak 😊'
          }
        }
      } catch (aiError) {
        console.error(`[chat:${requestId}] AI attempt ${attempt} failed:`, aiError)
        // Reset ZAI instance on error
        zaiInstance = null

        if (attempt === 2) {
          // Last attempt failed - return fallback message
          const errMsg = aiError instanceof Error ? aiError.message : String(aiError)
          console.error(`[chat:${requestId}] All AI attempts failed. Error: ${errMsg}`)

          reply = 'Maaf kak, AI lagi sibuk nih. Coba lagi sebentar ya, atau langsung WA Mas Iis: 0882-0008-58698 😊'
        } else {
          // Wait 1 second before retry
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    }

    // Try to save assistant reply (non-blocking if DB is down)
    if (dbAvailable && reply) {
      try {
        const db = getDb()
        if (db) {
          await db.chatLog.create({
            data: { sessionId, role: 'assistant', message: reply },
          })
        }
      } catch (dbError) {
        console.error(`[chat:${requestId}] DB save error (non-critical):`, dbError)
        if (isPreparedStmtError(dbError)) {
          resetDb()
        }
        dbAvailable = false
        setTimeout(() => { dbAvailable = true }, 30000)
      }
    }

    // Send notification to Telegram (non-blocking)
    const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
    sendToTelegram(
      `<b>Chat Baru - Mas Iis</b>\n` +
        `Waktu: ${timestamp}\n` +
        `<b>User:</b> ${message.substring(0, 500)}\n` +
        `<b>AI:</b> ${reply.substring(0, 500)}`
    ).catch(() => {})

    console.log(`[chat:${requestId}] ✓ Request completed successfully`)
    return NextResponse.json({ success: true, data: { reply, sessionId } })
  } catch (error) {
    console.error(`[chat:${requestId}] Error in chat route:`, error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process chat message',
        reply: 'Maaf kak, ada gangguan teknis. Coba lagi ya, atau WA Mas Iis: 0882-0008-58698 😊'
      },
      { status: 500 }
    )
  }
}
