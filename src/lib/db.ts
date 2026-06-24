// Database module - gracefully handles unavailable databases
// All API routes should use: const db = getDb(); if (!db) { /* use fallback */ }

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let _client: PrismaClient | null = null
let _initAttempted = false

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
    const dbUrl = process.env.DATABASE_URL || process.env.PRISMA_DATABASE_URL || process.env.SUPABASE_DATABASE_URL

    // Only create client if we have a valid PostgreSQL URL
    if (dbUrl && (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://'))) {
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
    console.log('No valid database URL found, using fallback data')
    return null
  } catch (e) {
    console.error('DB init failed, using fallback data:', e)
    return null
  }
}

// Reset the client (useful for connection error recovery)
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

// Default export: lazy getter that returns the client (or null)
// Usage: import { getDb } from '@/lib/db'; const db = getDb();
export default getDb
