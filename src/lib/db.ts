// Database module - gracefully handles unavailable databases
// All API routes should use: const db = getDb(); if (!db) { /* use fallback */ }
//
// CRITICAL FIX for Supabase PgBouncer "prepared statement already exists" (42P05)
// and "prepared statement does not exist" (26000) errors:
// We FORCE ?pgbouncer=true&connection_limit=1 onto the DATABASE_URL at runtime,
// so even if the Vercel env var is missing these params, Prisma will use
// PgBouncer-compatible mode (no prepared statements).

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let _client: PrismaClient | null = null
let _initAttempted = false

/**
 * FORCE pgbouncer & connection_limit params onto the database URL.
 * This is the critical fix for Supabase pooler + Prisma prepared statement conflicts.
 *
 * Even if the user's Vercel env var DATABASE_URL is missing these params
 * (e.g. just "postgresql://...supabase.com:6543/postgres"), we add them here.
 */
function ensurePgBouncerParams(url: string): string {
  if (!url) return url
  let result = url

  // Detect pooler connections - check multiple patterns:
  // 1. Port 6543 (Supabase pooler port)
  // 2. URL contains "pooler" (Supabase pooler hostname)
  // 3. URL contains "supabase" AND port 6543
  const isPooler = url.includes(':6543') ||
    url.includes('pooler') ||
    (url.includes('supabase') && url.includes(':6543'))

  if (isPooler) {
    // Add pgbouncer=true if missing
    if (!result.includes('pgbouncer=true')) {
      result += (result.includes('?') ? '&' : '?') + 'pgbouncer=true'
    }
    // Add connection_limit=1 if missing (prevents concurrent prepared stmt conflicts)
    if (!result.includes('connection_limit=')) {
      // Ensure we have a ? before adding &
      if (!result.includes('?')) {
        result += '?'
      } else if (!result.endsWith('&') && !result.endsWith('?')) {
        result += '&'
      }
      result += 'connection_limit=1'
    }
  }

  return result
}

export function getDb(): PrismaClient | null {
  // Return existing client if available
  if (_client) return _client
  if (globalForPrisma.prisma) {
    _client = globalForPrisma.prisma
    return _client
  }

  // Don't keep trying if initialization already failed
  if (_initAttempted) return null
  _initAttempted = true

  try {
    const rawUrl = process.env.DATABASE_URL || process.env.PRISMA_DATABASE_URL || process.env.SUPABASE_DATABASE_URL

    // Only create client if we have a valid PostgreSQL URL
    if (rawUrl && (rawUrl.startsWith('postgresql://') || rawUrl.startsWith('postgres://'))) {
      // CRITICAL: Force pgbouncer params to prevent 42P05/26000 errors
      const dbUrl = ensurePgBouncerParams(rawUrl)
      const wasModified = dbUrl !== rawUrl
      const sanitized = dbUrl.replace(/:[^:@]+@/, ':***@')
      console.log('[db] Pgbouncer fix ACTIVE:', wasModified ? 'params ADDED' : 'params already present')
      console.log('[db] Database URL:', sanitized)
      console.log('[db] Fix version: upload-persist + ai-stable + compress')

      _client = new PrismaClient({
        log: ['error'],
        datasources: {
          db: {
            url: dbUrl,
          },
        },
      })
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = _client
      }
      return _client
    }

    // No valid database URL - return null, API routes will use fallback data
    console.log('[db] No valid database URL found, using fallback data')
    return null
  } catch (e) {
    console.error('[db] init failed, using fallback data:', e)
    return null
  }
}

/**
 * Detect Prisma prepared statement errors (42P05 = already exists, 26000 = does not exist)
 */
export function isPreparedStmtError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  return msg.includes('prepared statement') ||
    msg.includes('42P05') ||
    msg.includes('26000')
}

/**
 * Reset the client (useful for connection error recovery)
 */
export function resetDb(): void {
  if (_client) {
    try {
      _client.$disconnect()
    } catch {}
  }
  _client = null
  _initAttempted = false
  if (globalForPrisma.prisma) {
    try {
      globalForPrisma.prisma.$disconnect()
    } catch {}
    globalForPrisma.prisma = undefined
  }
}

/**
 * Execute a Prisma query with automatic retry on prepared statement errors.
 * On 42P05/26000, resets the client and retries once.
 *
 * Usage:
 *   const services = await withRetry(() => db.service.findMany())
 */
export async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    if (isPreparedStmtError(err)) {
      console.log('[db] Prepared statement error, resetting client and retrying...')
      resetDb()
      // Small delay to let the reset take effect
      await new Promise(resolve => setTimeout(resolve, 200))
      const db = getDb()
      if (db) {
        console.log('[db] Retrying query after reset...')
        return await fn()
      }
    }
    throw err
  }
}

// Default export: lazy getter that returns the client (or null)
export default getDb
