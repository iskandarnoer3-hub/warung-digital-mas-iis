import { getDb } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = getDb()
  if (!db) {
    return NextResponse.json(
      { success: false, error: 'Database unavailable' },
      { status: 503 }
    )
  }

  try {
    const { id } = await params
    const body = await request.json()

    const existing = await db.article.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      )
    }

    const updateData: Record<string, unknown> = {}
    const allowedFields = [
      'title', 'slug', 'excerpt', 'content', 'imageUrl', 'published',
    ]

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    // Auto-generate slug from title if title changed and slug not provided
    if (body.title && !body.slug) {
      const newSlug = body.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      updateData.slug = newSlug
    }

    // Check slug uniqueness if slug is being updated
    if (updateData.slug && updateData.slug !== existing.slug) {
      const slugConflict = await db.article.findUnique({
        where: { slug: updateData.slug as string },
      })
      if (slugConflict && slugConflict.id !== id) {
        return NextResponse.json(
          { success: false, error: 'An article with this slug already exists' },
          { status: 409 }
        )
      }
    }

    const article = await db.article.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, data: article })
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = getDb()
  if (!db) {
    return NextResponse.json(
      { success: false, error: 'Database unavailable' },
      { status: 503 }
    )
  }

  try {
    const { id } = await params

    const existing = await db.article.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      )
    }

    await db.article.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      data: { message: 'Article deleted' },
    })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete article' },
      { status: 500 }
    )
  }
}
