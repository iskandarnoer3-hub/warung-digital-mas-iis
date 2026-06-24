import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  const db = getDb()
  if (!db) {
    return NextResponse.json(
      { success: false, error: 'Database unavailable' },
      { status: 503 }
    );
  }

  try {
    const { id, imageId } = await params;

    // Get image info first to delete file
    const image = await db.serviceImage.findFirst({
      where: { id: imageId, serviceId: id },
    });

    if (!image) {
      return NextResponse.json({ success: false, error: 'Image not found' }, { status: 404 });
    }

    // Delete from database
    await db.serviceImage.delete({ where: { id: imageId } });

    // Try to delete the file from disk if it's a local upload
    if (image.url.startsWith('/uploads/')) {
      try {
        const { unlink } = await import('fs/promises');
        const path = await import('path');
        const filePath = path.join(process.cwd(), 'public', image.url);
        const { existsSync } = await import('fs');
        if (existsSync(filePath)) {
          await unlink(filePath);
        }
      } catch (e) {
        console.error('File delete error (non-critical):', e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete image error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete image' }, { status: 500 });
  }
}
