import { NextResponse } from 'next/server'
import { isGroqAvailable } from '@/lib/groq-ai'
import { tryStaticReply } from '@/lib/knowledge-base'

// Force dynamic
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// =====================================================
// HEALTH CHECK ENDPOINT
// =====================================================
// Visiting /api/health tells you EXACTLY what code is deployed.
// Use this to verify that the latest fixes are live on Vercel.
// =====================================================

const BUILD_TIMESTAMP = '2025-06-25-fix-v2'
const FIX_VERSION = '4-layer-ai + force-pgbouncer + withRetry'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || process.env.PRISMA_DATABASE_URL || process.env.SUPABASE_DATABASE_URL

  // Sanitize URL (remove password)
  let sanitizedUrl = 'not-set'
  let urlParams = 'none'
  let isPooler = false
  let hasPgbouncer = false
  let hasConnectionLimit = false

  if (dbUrl) {
    try {
      sanitizedUrl = dbUrl.replace(/:[^:@]+@/, ':***@')
      isPooler = dbUrl.includes(':6543') || dbUrl.includes('pooler')
      hasPgbouncer = dbUrl.includes('pgbouncer=true')
      hasConnectionLimit = dbUrl.includes('connection_limit=')

      // Extract query params
      const qIdx = dbUrl.indexOf('?')
      urlParams = qIdx >= 0 ? dbUrl.substring(qIdx) : 'none'
    } catch {
      sanitizedUrl = 'parse-error'
    }
  }

  // Test knowledge base
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
      has_connection_limit: hasConnectionLimit,
      url_query_params: urlParams,
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
      verify_deployment: 'If build_info.fix_version = "4-layer-ai + force-pgbouncer + withRetry", latest code IS deployed.',
      pgbouncer_check: 'If database.is_pooler=true, db.ts fix forces pgbouncer=true at runtime. 42P05 errors should stop.',
      if_still_error: 'If 42P05 persists after this fix deploys, ensure DATABASE_URL points to Supabase POOLER (port 6543), not direct (port 5432).',
    },
  })
}
