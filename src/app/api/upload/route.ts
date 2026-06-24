import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Force dynamic
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Vercel has read-only filesystem EXCEPT for /tmp
// For persistent storage on Vercel, use Supabase Storage / S3 / Vercel Blob
// This endpoint saves to /tmp (ephemeral) - works for preview but not persistent
// For production, integrate with Vercel Blob or Supabase Storage

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
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
    const folder = (formData.get('folder') as string) || 'uploads'
    const subdir = (formData.get('subdir') as string) || ''

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File too large. Max ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `File type ${file.type} not allowed` },
        { status: 400 }
      )
    }

    // Sanitize folder name
    const safeFolder = folder.replace(/[^a-zA-Z0-9-_]/g, '').substring(0, 50)
    const safeSubdir = subdir.replace(/[^a-zA-Z0-9-_]/g, '').substring(0, 50)

    // Generate unique filename
    const ext = path.extname(file.name) || mimeToExt(file.type)
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const filename = `${timestamp}-${randomStr}${ext}`

    // Build path: /tmp/uploads/[folder]/[subdir]/filename
    // On Vercel, /tmp is writable but ephemeral
    // For persistent storage, use Vercel Blob or Supabase Storage
    const uploadDir = path.join(
      '/tmp',
      'uploads',
      safeFolder,
      safeSubdir
    ).replace(/\/+$/, '')

    // Create directory
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Write file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)

    // Public URL (this works in dev; in production need external storage)
    // For now, return a path that can be used to identify the file
    const publicPath = `/uploads/${safeFolder}/${safeSubdir ? safeSubdir + '/' : ''}${filename}`

    console.log(`[upload] File saved: ${filePath} (${file.size} bytes)`)

    return NextResponse.json({
      success: true,
      data: {
        url: publicPath,
        filename,
        size: file.size,
        type: file.type,
        folder: safeFolder,
        path: filePath,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      },
      { status: 500 }
    )
  }
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
    message: 'Upload endpoint ready. POST a file (multipart/form-data) with field "file".',
    allowedTypes: ALLOWED_TYPES,
    maxSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
  })
}
