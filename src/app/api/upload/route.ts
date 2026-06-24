import { NextRequest, NextResponse } from 'next/server'

// Force dynamic
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// =====================================================
// UPLOAD STRATEGY: Base64 Data URL
// =====================================================
// Masalah sebelumnya: file ditulis ke /tmp/uploads/... tapi
// Next.js TIDAK menyajikan file dari /tmp (hanya /public/),
// dan di Vercel /tmp itu ephemeral (hilang setelah function).
// Akibatnya: upload "sukses" 200 tapi URL yang dikembalikan
// (/uploads/...) selalu 404 saat diakses.
//
// Solusi: convert file ke base64 data URL langsung.
// - Tidak butuh filesystem (works di Vercel serverless)
// - Browser langsung render data URL
// - Disimpan di DB sebagai string (kolom url)
// - No external storage (Supabase Blob/Vercel Blob/S3) needed
// =====================================================

const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3MB (data URL ~1.33x ukuran asli)
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
    // Format: data:[<mediatype>][;base64],<data>
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
        url: dataUrl,           // This is what gets saved to DB and rendered in <img src="...">
        filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        // Indicate storage method for debugging
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

// Helper: get extension from filename (inline to avoid importing 'path' just for this)
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
    message: 'Upload endpoint ready (base64 data URL mode). POST a file (multipart/form-data) with field "file".',
    allowedTypes: ALLOWED_TYPES,
    maxSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
    storage: 'data-url (no filesystem needed, works on Vercel)',
  })
}
