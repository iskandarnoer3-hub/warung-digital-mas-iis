import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publishedFilter = searchParams.get('published')

    const where = publishedFilter === 'true' ? { published: true } : {}

    const articles = await db.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: articles })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
