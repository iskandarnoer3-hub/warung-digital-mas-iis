import { getDb, resetDb } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function isPreparedStmtError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  return msg.includes('prepared statement') || msg.includes('42P05')
}

export async function GET(request: NextRequest) {
  const db = getDb()
  if (!db) {
    return NextResponse.json({ success: true, data: [] })
  }

  try {
    const { searchParams } = new URL(request.url)
    const publishedFilter = searchParams.get('published')

    const where = publishedFilter === 'true' ? { published: true } : {}

    try {
      const articles = await db.article.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json({ success: true, data: articles })
    } catch (dbError) {
      console.error('DB error, returning empty articles:', dbError)
      if (isPreparedStmtError(dbError)) {
        resetDb()
      }
      // Return empty array when DB is down
      return NextResponse.json({ success: true, data: [] })
    }
  } catch (error) {
    console.error('Error fetching articles:', error)
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

    const slug = body.slug || generateSlug(body.title)

    // Check for duplicate slug
    const existing = await db.article.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An article with this slug already exists' },
        { status: 409 }
      )
    }

    const article = await db.article.create({
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt || '',
        content: body.content || '',
        imageUrl: body.imageUrl || '',
        published: body.published ?? false,
      },
    })

    return NextResponse.json({ success: true, data: article }, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create article' },
      { status: 500 }
    )
  }
}
