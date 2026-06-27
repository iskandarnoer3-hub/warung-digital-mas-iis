import { getDb, resetDb, withRetry, isPreparedStmtError } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// Force dynamic - never cache
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// CRITICAL: Headers to prevent any caching
// Without this, Vercel CDN + browser cache the GET response,
// so when user uploads new hero image and refreshes, they see OLD cached data.
const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store',
}

// Default site config when database is unavailable
const DEFAULT_SITE_CONFIG: Record<string, string> = {
  hero_image: '/hero-bg-new.png',
  site_name: 'Mas Iis - Warung Solusi',
  site_description: 'Warung Solusi Terpercaya di Cirebon. 17 jasa lengkap.',
  whatsapp_number: '0882-0008-58698',
  address: 'Sindanglaut, Kab. Cirebon, Jawa Barat',
  operating_hours: 'Senin-Sabtu 08.00-21.00 WIB',
  stats_customers: '500+',
  stats_rating: '4.9/5',
  stats_services: '17',
  warranty_policy: 'Garansi hingga 30 hari untuk sebagian besar jasa',
  bank_info: 'BCA Transfer',
}

export async function GET() {
  // Always return success with at least default config
  // This prevents 500 errors that break the frontend
  try {
    const db = getDb()
    if (!db) {
      return NextResponse.json(
        { success: true, data: DEFAULT_SITE_CONFIG },
        { headers: NO_CACHE_HEADERS }
      )
    }

    try {
      const configs = await withRetry(() => db.siteConfig.findMany())

      // Convert array of records into a key-value map
      const data: Record<string, string> = { ...DEFAULT_SITE_CONFIG }
      for (const config of configs) {
        data[config.key] = config.value
      }

      return NextResponse.json(
        { success: true, data },
        { headers: NO_CACHE_HEADERS }
      )
    } catch (dbError) {
      console.error('site-config DB error, returning defaults:', dbError)
      if (isPreparedStmtError(dbError)) {
        resetDb()
      }
      return NextResponse.json(
        { success: true, data: DEFAULT_SITE_CONFIG },
        { headers: NO_CACHE_HEADERS }
      )
    }
  } catch (dbError) {
    console.error('site-config GET error, returning defaults:', dbError)
    return NextResponse.json(
      { success: true, data: DEFAULT_SITE_CONFIG },
      { headers: NO_CACHE_HEADERS }
    )
  }
}

export async function POST(request: NextRequest) {
  const db = getDb()
  if (!db) {
    return NextResponse.json(
      { success: false, error: 'Database unavailable. Cek DATABASE_URL di Vercel env vars.' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()

    const { key, value } = body

    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A valid "key" string is required' },
        { status: 400 }
      )
    }

    if (typeof value !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A valid "value" string is required' },
        { status: 400 }
      )
    }

    // Log untuk debugging
    console.log(`[site-config] POST key="${key}" valueLength=${value.length} (db=${db ? 'available' : 'null'})`)

    try {
      const config = await withRetry(() =>
        db.siteConfig.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )

      console.log(`[site-config] ✓ Saved key="${key}" successfully (id=${config.id})`)

      return NextResponse.json(
        { success: true, data: config },
        { headers: NO_CACHE_HEADERS }
      )
    } catch (dbError) {
      console.error(`[site-config] DB error saving key="${key}":`, dbError)
      if (isPreparedStmtError(dbError)) {
        resetDb()
        // Try one more time after reset
        try {
          const db2 = getDb()
          if (db2) {
            const config = await withRetry(() =>
              db2.siteConfig.upsert({
                where: { key },
                update: { value },
                create: { key, value },
              })
            )
            console.log(`[site-config] ✓ Saved key="${key}" after reset (id=${config.id})`)
            return NextResponse.json(
              { success: true, data: config },
              { headers: NO_CACHE_HEADERS }
            )
          }
        } catch (retryErr) {
          console.error(`[site-config] Retry also failed:`, retryErr)
        }
      }
      return NextResponse.json(
        { success: false, error: 'Database error: ' + (dbError instanceof Error ? dbError.message : 'unknown') },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error upserting site config:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update site configuration: ' + (error instanceof Error ? error.message : 'unknown') },
      { status: 500 }
    )
  }
}
