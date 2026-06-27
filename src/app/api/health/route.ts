import { NextResponse } from 'next/server'
import { isGroqAvailable } from '@/lib/groq-ai'
import { tryStaticReply } from '@/lib/knowledge-base'

// Force dynamic
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const BUILD_TIMESTAMP = '2025-06-25-fix-v3'
const FIX_VERSION = 'upload-persist + ai-stable + compress'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || process.env.PRISMA_DATABASE_URL || process.env.SUPABASE_DATABASE_URL

  let sanitizedUrl = 'not-set'
  let isPooler = false
  let hasPgbouncer = false

  if (dbUrl) {
    try {
      sanitizedUrl = dbUrl.replace(/:[^:@]+@/, ':***@')
      isPooler = dbUrl.includes(':6543') || dbUrl.includes('pooler')
      hasPgbouncer = dbUrl.includes('pgbouncer=true')
    } catch {
      sanitizedUrl = 'parse-error'
    }
  }

  const kbTest = tryStaticReply('jam berapa buka')
  const kbWorking = kbTest !== null && kbTest.includes('08.00')

  return NextResponse.json({
    success: true,
    build_info: {
      fix_version: FIX_VERSION,
      build_timestamp: BUILD_TIMESTAMP,
    },
    database: {
      url_set: !!dbUrl,
      sanitized_url: sanitizedUrl,
      is_pooler: isPooler,
      has_pgbouncer_param: hasPgbouncer,
    },
    ai: {
      groq_available: isGroqAvailable(),
      knowledge_base_loaded: kbWorking,
    },
    env_vars: {
      DATABASE_URL: !!process.env.DATABASE_URL,
      DIRECT_URL: !!process.env.DIRECT_URL,
      GROQ_API_KEY: !!process.env.GROQ_API_KEY,
      TELEGRAM_BOT_TOKEN: !!process.env.TELEGRAM_BOT_TOKEN,
      ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
    },
    instructions: {
      verify_deployment: 'If build_info.fix_version = "upload-persist + ai-stable + compress", latest code IS deployed.',
      upload_check: 'Upload sekarang kompres gambar otomatis di frontend (max 1.2MB) sebelum kirim ke server.',
      cache_check: 'API routes sekarang return Cache-Control: no-store. Frontend pakai cache:no-store. Data fresh setelah refresh.',
    },
  })
}
