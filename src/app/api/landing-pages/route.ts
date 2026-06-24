import { getDb } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const db = getDb()
  if (!db) {
    return NextResponse.json({ success: true, data: [] })
  }

  try {
    const landingPages = await db.landingPage.findMany({
      include: { service: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: landingPages })
  } catch (error) {
    console.error('Error fetching landing pages:', error)
    return NextResponse.json({ success: true, data: [] })
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

    if (!body.serviceId) {
      return NextResponse.json(
        { success: false, error: 'serviceId is required' },
        { status: 400 }
      )
    }

    // Verify the service exists
    const service = await db.service.findUnique({
      where: { id: body.serviceId },
    })
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    // Check if a landing page already exists for this service
    const existing = await db.landingPage.findUnique({
      where: { serviceId: body.serviceId },
    })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A landing page already exists for this service' },
        { status: 409 }
      )
    }

    const landingPage = await db.landingPage.create({
      data: {
        serviceId: body.serviceId,
        headline: body.headline || '',
        subheadline: body.subheadline || '',
        ctaText: body.ctaText || 'Hubungi Sekarang',
        sections: body.sections || '[]',
        active: body.active ?? true,
      },
      include: { service: true },
    })

    return NextResponse.json(
      { success: true, data: landingPage },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating landing page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create landing page' },
      { status: 500 }
    )
  }
}
