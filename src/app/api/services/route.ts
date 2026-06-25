import { NextRequest, NextResponse } from 'next/server'
import { FALLBACK_SERVICES } from '@/data/fallback-services'
import { getDb, resetDb, withRetry, isPreparedStmtError } from '@/lib/db'

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Track DB availability - shorter cooldown (5s instead of 30s)
// because withRetry handles most transient errors
let dbAvailable = true

export async function GET() {
  // Try database first, but always have fallback ready
  if (dbAvailable) {
    try {
      const db = getDb()
      if (db) {
        const services = await withRetry(() =>
          db.service.findMany({
            where: { active: true },
            orderBy: { order: 'asc' },
            include: { landingPage: true, images: { orderBy: { order: 'asc' } } },
          })
        )
        if (services.length > 0) {
          return NextResponse.json({ success: true, data: services })
        }
      }
    } catch (error) {
      console.error('Error fetching services from DB, using fallback:', error)
      if (isPreparedStmtError(error)) {
        resetDb()
      }
      dbAvailable = false
      // Short cooldown - withRetry already tried to recover
      setTimeout(() => { dbAvailable = true }, 5000)
    }
  }

  // Fallback when DB is unavailable
  return NextResponse.json({ success: true, data: FALLBACK_SERVICES })
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

    const slug = body.slug || generateSlug(body.name)

    // Check for duplicate slug
    const existing = await withRetry(() => db.service.findUnique({ where: { slug } }))
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A service with this slug already exists' },
        { status: 409 }
      )
    }

    const service = await withRetry(() =>
      db.service.create({
        data: {
          name: body.name,
          slug,
          category: body.category || '',
          shortDesc: body.shortDesc || '',
          detailDesc: body.detailDesc || '',
          price: body.price ?? 0,
          priceMax: body.priceMax ?? 0,
          benefit1: body.benefit1 || '',
          benefit2: body.benefit2 || '',
          benefit3: body.benefit3 || '',
          benefit4: body.benefit4 || '',
          benefit5: body.benefit5 || '',
          waText: body.waText || '',
          imageUrl: body.imageUrl || '',
          heroImageUrl: body.heroImageUrl || '',
          videoUrl: body.videoUrl || '',
          audioUrl: body.audioUrl || '',
          externalLink: body.externalLink || '',
          bonus: body.bonus || '',
          slotStatus: body.slotStatus || 'Slot Tersedia',
          slotAvailable: body.slotAvailable ?? true,
          active: body.active ?? true,
          order: body.order ?? 0,
        },
      })
    )

    // Auto-create a LandingPage for the new service
    await withRetry(() =>
      db.landingPage.create({
        data: {
          serviceId: service.id,
          headline: body.landingHeadline || service.name,
          subheadline: body.landingSubheadline || service.shortDesc,
          ctaText: body.landingCtaText || 'Hubungi Sekarang',
          sections: body.landingSections || '[]',
          active: true,
        },
      })
    )

    // Return the service with its landing page
    const result = await withRetry(() =>
      db.service.findUnique({
        where: { id: service.id },
        include: { landingPage: true },
      })
    )

    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    if (isPreparedStmtError(error)) {
      resetDb()
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
