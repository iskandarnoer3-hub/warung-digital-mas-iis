import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await db.landingPage.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Landing page not found' },
        { status: 404 }
      )
    }

    const updateData: Record<string, unknown> = {}
    const allowedFields = [
      'headline', 'subheadline', 'ctaText', 'sections', 'active',
    ]

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const landingPage = await db.landingPage.update({
      where: { id },
      data: updateData,
      include: { service: true },
    })

    return NextResponse.json({ success: true, data: landingPage })
  } catch (error) {
    console.error('Error updating landing page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update landing page' },
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

    const existing = await db.landingPage.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Landing page not found' },
        { status: 404 }
      )
    }

    await db.landingPage.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      data: { message: 'Landing page deleted' },
    })
  } catch (error) {
    console.error('Error deleting landing page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete landing page' },
      { status: 500 }
    )
  }
}
