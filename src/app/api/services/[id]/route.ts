import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const service = await db.service.findUnique({
      where: { id },
      include: { landingPage: true, images: { orderBy: { order: 'asc' } } },
    })

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
  try {
    const { id } = await params

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
