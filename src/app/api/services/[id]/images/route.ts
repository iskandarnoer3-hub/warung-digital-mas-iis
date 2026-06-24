import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = getDb()
  if (!db) {
    return NextResponse.json({ success: true, data: [] });
  }

  try {
    const { id } = await params;
    const images = await db.serviceImage.findMany({
      where: { serviceId: id },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error('Fetch images error:', error);
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = getDb()
  if (!db) {
    return NextResponse.json(
      { success: false, error: 'Database unavailable' },
      { status: 503 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { url, caption, order, type } = body;

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    const image = await db.serviceImage.create({
      data: {
        serviceId: id,
        url,
        caption: caption || '',
        type: type || 'gallery',
        order: order || 0,
      },
    });

    return NextResponse.json({ success: true, data: image });
  } catch (error) {
    console.error('Create image error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create image' }, { status: 500 });
  }
}
