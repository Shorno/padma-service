"use server"

import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
})

interface UploadResult {
    success: true
    url: string
    publicId: string
}

interface UploadError {
    success: false
    error: string
}

export async function uploadImageToCloudinary(
    formData: FormData
): Promise<UploadResult | UploadError> {
    try {
        const file = formData.get('file') as File
        const folder = (formData.get('folder') as string) || 'uploads'

        if (!file) {
            return { success: false, error: 'No file provided' }
        }

        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'image/svg+xml'
        ]

        if (!allowedTypes.includes(file.type)) {
            return {
                success: false,
                error: 'Invalid file type. Please upload JPG, PNG, WebP, or SVG files.'
            }
        }

        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            return {
                success: false,
                error: 'File too large. Please upload files smaller than 5MB.'
            }
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Check if it's an SVG file
        const isSvg = file.type === 'image/svg+xml'

        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder,
                    // SVGs must use 'image' resource type, not 'auto' (which treats them as raw)
                    resource_type: 'image',
                    // SVGs don't support transformations, skip them for SVG files
                    ...(isSvg ? { format: 'svg' } : {
                        transformation: [
                            { quality: 'auto:good' },
                            { fetch_format: 'auto' }
                        ],
                    }),
                },
                (error, result) => {
                    if (error) reject(error)
                    else if (result) resolve(result)
                    else reject(new Error("Unknown Cloudinary error"))
                }
            ).end(buffer)
        })

        return {
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
        }
    } catch (error) {
        console.error('Cloudinary upload error:', error)
        return {
            success: false,
            error: 'Failed to upload image. Please try again.',
        }
    }
}

export async function deleteImageFromCloudinary(
    publicId: string
): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
        if (!publicId) {
            return { success: false, error: 'No public ID provided' }
        }

        const result = await cloudinary.uploader.destroy(publicId)

        return {
            success: result.result === 'ok',
            message: result.result === 'ok'
                ? 'Image deleted successfully'
                : 'Failed to delete image'
        }
    } catch (error) {
        console.error('Cloudinary delete error:', error)
        return {
            success: false,
            error: 'Failed to delete image'
        }
    }
}
