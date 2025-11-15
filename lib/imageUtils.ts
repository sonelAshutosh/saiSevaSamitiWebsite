import imageCompression from 'browser-image-compression'

/**
 * Converts a File object to base64 string
 * @param file - File object from input
 * @returns Promise<string> - Base64 encoded string
 */
export function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      resolve(fileReader.result as string)
    }
    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}

/**
 * Compresses an image file
 * @param file - File object to compress
 * @param options - Compression options (optional)
 * @returns Promise<File> - Compressed file
 */
export async function compressImage(
  file: File,
  options?: {
    maxSizeMB?: number
    maxWidthOrHeight?: number
    useWebWorker?: boolean
  }
): Promise<File> {
  const defaultOptions = {
    maxSizeMB: 0.05, // 50KB
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  }

  const compressionOptions = { ...defaultOptions, ...options }

  try {
    const compressedFile = await imageCompression(file, compressionOptions)
    return compressedFile
  } catch (error) {
    console.error('Error compressing image:', error)
    throw new Error('Failed to compress image')
  }
}

/**
 * Handles complete image upload process: compress and convert to base64
 * @param file - File object from input
 * @param options - Compression options (optional)
 * @returns Promise<string> - Base64 encoded compressed image
 */
export async function handleImageUpload(
  file: File,
  options?: {
    maxSizeMB?: number
    maxWidthOrHeight?: number
    useWebWorker?: boolean
  }
): Promise<string> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }

    // Compress the image
    const compressedFile = await compressImage(file, options)

    // Convert to base64
    const base64String = await convertToBase64(compressedFile)

    return base64String
  } catch (error) {
    console.error('Error processing image:', error)
    throw error
  }
}

/**
 * Validates image file size before upload
 * @param file - File to validate
 * @param maxSizeMB - Maximum size in MB
 * @returns boolean - True if valid
 */
export function validateImageSize(file: File, maxSizeMB: number = 5): boolean {
  const fileSizeMB = file.size / 1024 / 1024
  return fileSizeMB <= maxSizeMB
}

/**
 * Validates image file type
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns boolean - True if valid
 */
export function validateImageType(
  file: File,
  allowedTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
): boolean {
  return allowedTypes.includes(file.type)
}
