import { NextRequest, NextResponse } from 'next/server'

// Force dynamic
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// =====================================================
// UPLOAD STRATEGY: Base64 Data URL with compression support
// =====================================================
// Frontend (admin-panel) akan kompres gambar sebelum upload
// pakai src/lib/compress-image.ts. Tapi kita tetap allow
// file sampai 10MB sebagai safety net (untuk PDF/video).
//
// Untuk gambar: frontend kompres ke <1.2MB dulu, jadi
// base64 di DB cuma ~1.6MB (safe untuk Vercel 4.5MB limit).
// =====================================================

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB (frontend akan kompres dulu)
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
  'video/mp4',
  'audio/mpeg',
  'audio/mp3',
]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Tidak ada file yang dipilih' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File terlalu besar (${(file.size / 1024 / 1024).toFixed(2)}MB). Maksimal ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type || !ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Tipe file "${file.type || 'unknown'}" tidak didukung` },
        { status: 400 }
      )
    }

    // Read file as ArrayBuffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert to base64 data URL
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    // Generate a friendly filename for display purposes
    const ext = path_extname(file.name) || mimeToExt(file.type)
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const filename = `${timestamp}-${randomStr}${ext}`

    console.log(`[upload] File converted to data URL: ${file.name} (${file.size} bytes -> ${dataUrl.length} chars)`)

    return NextResponse.json({
      success: true,
      data: {
        url: dataUrl,
        filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        storage: 'data-url',
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Upload gagal',
      },
      { status: 500 }
    )
  }
}

function path_extname(name: string): string {
  const idx = name.lastIndexOf('.')
  return idx >= 0 ? name.substring(idx) : ''
}

function mimeToExt(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'application/pdf': '.pdf',
    'video/mp4': '.mp4',
    'audio/mpeg': '.mp3',
    'audio/mp3': '.mp3',
  }
  return map[mime] || ''
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Upload endpoint ready (base64 data URL mode + compression support). POST a file (multipart/form-data) with field "file".',
    allowedTypes: ALLOWED_TYPES,
    maxSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
    storage: 'data-url (no filesystem needed, works on Vercel)',
    note: 'Frontend akan kompres gambar otomatis sebelum upload (lihat src/lib/compress-image.ts)',
  })
}
