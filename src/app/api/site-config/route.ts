import { getDb, resetDb } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// Force dynamic - never cache
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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

function isPreparedStmtError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  return msg.includes('prepared statement') || msg.includes('42P05')
}

export async function GET() {
  // Always return success with at least default config
  // This prevents 500 errors that break the frontend
  try {
    const db = getDb()
    if (!db) {
      return NextResponse.json({ success: true, data: DEFAULT_SITE_CONFIG })
    }

    const configs = await db.siteConfig.findMany().catch(() => [])

    // Convert array of records into a key-value map
    const data: Record<string, string> = { ...DEFAULT_SITE_CONFIG }
    for (const config of configs) {
      data[config.key] = config.value
    }

    return NextResponse.json({ success: true, data })
  } catch (dbError) {
    console.error('site-config GET error, returning defaults:', dbError)
    if (isPreparedStmtError(dbError)) {
      resetDb()
    }
    // ALWAYS return success with default config - never 500
    return NextResponse.json({ success: true, data: DEFAULT_SITE_CONFIG })
  }
}

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

    const config = await db.siteConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })

    return NextResponse.json({ success: true, data: config })
  } catch (error) {
    console.error('Error upserting site config:', error)
    if (isPreparedStmtError(error)) {
      resetDb()
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update site configuration' },
      { status: 500 }
    )
  }
}
