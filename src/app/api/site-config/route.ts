import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const configs = await db.siteConfig.findMany()

    // Convert array of records into a key-value map
    const data: Record<string, string> = {}
    for (const config of configs) {
      data[config.key] = config.value
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching site config:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch site configuration' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
    return NextResponse.json(
      { success: false, error: 'Failed to update site configuration' },
      { status: 500 }
    )
  }
}
