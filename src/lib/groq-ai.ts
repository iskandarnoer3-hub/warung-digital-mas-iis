// =====================================================
// DIRECT GROQ API CLIENT
// Memanggil Groq API langsung via fetch (tanpa SDK tambahan)
// Lebih reliable di Vercel serverless karena tidak ada
// dependency pada z-ai-web-dev-sdk yang bisa bermasalah
// di cold-start environment.
// =====================================================

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

// Model Groq yang reliable & cepat (production-grade)
const PRIMARY_MODEL = 'llama-3.3-70b-versatile'
const FALLBACK_MODEL = 'llama-3.1-8b-instant'

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface GroqChatOptions {
  messages: GroqMessage[]
  temperature?: number
  maxTokens?: number
  model?: string
}

/**
 * Cek apakah GROQ_API_KEY tersedia di environment
 */
export function isGroqAvailable(): boolean {
  const key = process.env.GROQ_API_KEY
  return !!key && key.length > 10 && key.startsWith('gsk_')
}

/**
 * Panggil Groq API langsung via fetch.
 * Return string reply, atau throw error jika gagal.
 */
export async function callGroq(options: GroqChatOptions): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY not set in environment')
  }

  const {
    messages,
    temperature = 0.7,
    maxTokens = 1024,
    model = PRIMARY_MODEL,
  } = options

  // Coba primary model dulu, fallback ke model lebih ringan jika gagal
  const modelsToTry = model === PRIMARY_MODEL
    ? [PRIMARY_MODEL, FALLBACK_MODEL]
    : [model]

  let lastError: unknown = null

  for (const currentModel of modelsToTry) {
    try {
      console.log(`[groq] Calling model: ${currentModel}`)
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 45000) // 45s timeout

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: currentModel,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: false,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (!response.ok) {
        const errText = await response.text().catch(() => 'unknown')
        console.error(`[groq] ${currentModel} HTTP ${response.status}: ${errText.substring(0, 200)}`)
        lastError = new Error(`Groq API ${response.status}: ${errText.substring(0, 100)}`)
        // 429 = rate limit, 5xx = server error → coba model lain
        // 401/403 = API key invalid → jangan coba model lain
        if (response.status === 401 || response.status === 403) {
          throw lastError
        }
        continue
      }

      const data = await response.json()
      const content = data?.choices?.[0]?.message?.content

      if (!content || !content.trim()) {
        console.warn(`[groq] ${currentModel} returned empty content`)
        lastError = new Error('Groq returned empty content')
        continue
      }

      // Hapus asterisk (WhatsApp safety - jangan pakai bold/italic markers)
      const cleaned = content
        .replace(/\*\*/g, '')
        .replace(/(?<!\w)\*(?!\w)/g, '')
        .trim()

      console.log(`[groq] ✓ ${currentModel} success (${cleaned.length} chars)`)
      return cleaned
    } catch (err) {
      console.error(`[groq] ${currentModel} error:`, err instanceof Error ? err.message : err)
      lastError = err
      continue
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('All Groq models failed')
}
