import { NextRequest, NextResponse } from 'next/server'
import { FALLBACK_SERVICES } from '@/data/fallback-services'
import { getDb, resetDb } from '@/lib/db'

// Track DB availability to avoid repeated connection attempts
let dbAvailable = true

function isPreparedStmtError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  return msg.includes('prepared statement') || msg.includes('42P05')
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // If this is a fallback ID, skip DB entirely - serve from local data
  if (id.startsWith('fallback-')) {
    const fallback = FALLBACK_SERVICES.find(s => s.id === id)
    if (fallback) {
      return NextResponse.json({ success: true, data: fallback })
    }
  }

  // Try local data first by slug (fast, no DB needed)
  const localBySlug = FALLBACK_SERVICES.find(s => s.slug === id)
  if (localBySlug) {
    return NextResponse.json({ success: true, data: localBySlug })
  }

  // Try by order number
  const orderNum = parseInt(id, 10)
  if (!isNaN(orderNum) && orderNum >= 1 && orderNum <= 17) {
    const byOrder = FALLBACK_SERVICES.find(s => s.order === orderNum)
    if (byOrder) {
      return NextResponse.json({ success: true, data: byOrder })
    }
  }

  // Try database for IDs that aren't fallback patterns
  if (dbAvailable && !id.startsWith('fallback-')) {
    const db = getDb()
    if (db) {
      try {
        const service = await db.service.findUnique({
          where: { id },
          include: { landingPage: true, images: { orderBy: { order: 'asc' } } },
        })

        if (service) {
          return NextResponse.json({ success: true, data: service })
        }

        // Try slug lookup in DB
        const bySlug = await db.service.findUnique({
          where: { slug: id },
          include: { landingPage: true, images: { orderBy: { order: 'asc' } } },
        })

        if (bySlug) {
          return NextResponse.json({ success: true, data: bySlug })
        }
      } catch (error) {
        console.error('DB error, using fallback:', error)
        if (isPreparedStmtError(error)) {
          resetDb()
        }
        dbAvailable = false
        setTimeout(() => { dbAvailable = true }, 30000)
      }
    }
  }

  return NextResponse.json(
    { success: false, error: 'Service not found' },
    { status: 404 }
  )
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = getDb()
  if (!db) {
    return NextResponse.json(
      { success: false, error: 'Database unavailable' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()

    const existing = await db.service.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    const updateData: Record<string, unknown> = {}
    const allowedFields = [
      'name', 'slug', 'category', 'shortDesc', 'detailDesc',
      'price', 'priceMax', 'benefit1', 'benefit2', 'benefit3',
      'benefit4', 'benefit5', 'waText', 'imageUrl', 'heroImageUrl',
      'videoUrl', 'audioUrl', 'externalLink', 'bonus',
      'slotStatus', 'slotAvailable', 'active', 'order',
    ]

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    if (body.name && !body.slug) {
      const newSlug = body.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      updateData.slug = newSlug
    }

    if (updateData.slug && updateData.slug !== existing.slug) {
      const slugConflict = await db.service.findUnique({
        where: { slug: updateData.slug as string },
      })
      if (slugConflict && slugConflict.id !== id) {
        return NextResponse.json(
          { success: false, error: 'A service with this slug already exists' },
          { status: 409 }
        )
      }
    }

    const service = await db.service.update({
      where: { id },
      data: updateData,
      include: { landingPage: true, images: { orderBy: { order: 'asc' } } },
    })

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = getDb()
  if (!db) {
    return NextResponse.json(
      { success: false, error: 'Database unavailable' },
      { status: 503 }
    )
  }

  try {
    const existing = await db.service.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    await db.service.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      data: { message: 'Service and associated data deleted' },
    })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}
