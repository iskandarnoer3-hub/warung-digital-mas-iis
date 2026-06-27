// =====================================================
// IMAGE COMPRESSION HELPER (CLIENT-SIDE)
// =====================================================
// Kompres gambar di browser sebelum upload:
// - Resize ke max dimension (default 1920px)
// - Kompres quality JPEG/WEBP (default 0.8)
// - Target ukuran akhir < targetSizeMB
// - Otomatis iterate quality sampai target tercapai
//
// Manfaat:
// - File 5MB → ~500KB-1MB (cukup untuk base64 di DB)
// - Bypass Vercel 4.5MB body limit
// - Upload lebih cepat
// - DB tidak membengkak
// =====================================================

interface CompressOptions {
  maxWidth?: number
  maxHeight?: number
  initialQuality?: number
  targetSizeMB?: number
  mimeType?: 'image/jpeg' | 'image/webp' | 'image/png'
}

const DEFAULT_OPTS: Required<CompressOptions> = {
  maxWidth: 1920,
  maxHeight: 1080,
  initialQuality: 0.85,
  targetSizeMB: 1.2, // Target < 1.2MB (base64 ~1.6MB, safe under 4.5MB Vercel limit)
  mimeType: 'image/jpeg',
}

/**
 * Kompres gambar di browser pakai Canvas API.
 * Return File yang sudah dikompres.
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const opts = { ...DEFAULT_OPTS, ...options }

  // Skip kalau bukan gambar
  if (!file.type.startsWith('image/')) {
    return file
  }

  // Skip PNG dengan transparansi (jangan dikonversi ke JPEG)
  // Kecuali user explicitly minta JPEG
  const isPngWithTransparency = file.type === 'image/png'
  const useMime = isPngWithTransparency && opts.mimeType === 'image/jpeg'
    ? 'image/png' // Keep PNG to preserve transparency
    : opts.mimeType

  try {
    // Load gambar ke Image element
    const img = await loadImage(file)
    const originalSize = file.size

    // Calculate target dimensions (preserve aspect ratio)
    let { width, height } = calculateDimensions(
      img.width,
      img.height,
      opts.maxWidth,
      opts.maxHeight
    )

    // Create canvas
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      console.warn('[compress] Canvas 2D context not available, returning original')
      return file
    }

    // Fill white background for JPEG (no transparency)
    if (useMime === 'image/jpeg') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
    }

    // Draw image
    ctx.drawImage(img, 0, 0, width, height)

    // Iterative compression to hit target size
    const targetSizeBytes = opts.targetSizeMB * 1024 * 1024
    let quality = opts.initialQuality
    let blob = canvasToBlob(canvas, useMime, quality)

    // Try decreasing quality until under target (min 0.3)
    while ((await blob).size > targetSizeBytes && quality > 0.3) {
      quality -= 0.1
      blob = canvasToBlob(canvas, useMime, quality)
    }

    // If still too large, reduce dimensions and try again
    let attempts = 0
    while ((await blob).size > targetSizeBytes && attempts < 3) {
      width = Math.round(width * 0.8)
      height = Math.round(height * 0.8)
      canvas.width = width
      canvas.height = height
      if (useMime === 'image/jpeg') {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)
      }
      ctx.drawImage(img, 0, 0, width, height)
      quality = 0.7
      blob = canvasToBlob(canvas, useMime, quality)
      attempts++
    }

    const finalBlob = await blob
    const finalSize = finalBlob.size

    // Jika hasil kompresi lebih besar dari original (PNG ke PNG misalnya), pakai original
    if (finalSize >= originalSize) {
      console.log(`[compress] Compressed size (${formatBytes(finalSize)}) >= original (${formatBytes(originalSize)}), keeping original`)
      return file
    }

    // Convert blob to File
    const ext = useMime === 'image/jpeg' ? '.jpg' : useMime === 'image/webp' ? '.webp' : '.png'
    const originalName = file.name.replace(/\.[^.]+$/, '')
    const compressedFile = new File([finalBlob], `${originalName}${ext}`, {
      type: useMime,
      lastModified: Date.now(),
    })

    console.log(
      `[compress] ${file.name}: ${formatBytes(originalSize)} → ${formatBytes(finalSize)} ` +
      `(${Math.round((1 - finalSize / originalSize) * 100)}% reduction, ${width}x${height}, quality ${quality.toFixed(2)})`
    )

    return compressedFile
  } catch (err) {
    console.error('[compress] Error, returning original file:', err)
    return file
  }
}

function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = (err) => {
      URL.revokeObjectURL(url)
      reject(err)
    }
    img.src = url
  })
}

function calculateDimensions(
  origW: number,
  origH: number,
  maxW: number,
  maxH: number
): { width: number; height: number } {
  if (origW <= maxW && origH <= maxH) {
    return { width: origW, height: origH }
  }
  const ratioW = maxW / origW
  const ratioH = maxH / origH
  const ratio = Math.min(ratioW, ratioH)
  return {
    width: Math.round(origW * ratio),
    height: Math.round(origH * ratio),
  }
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('canvas.toBlob returned null'))
      },
      mime,
      quality
    )
  })
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`
}
