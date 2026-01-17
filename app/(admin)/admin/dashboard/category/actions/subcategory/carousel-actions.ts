"use server"

import { db } from "@/db/config"
import { subCategoryCarousel, subCategoryCarouselImage } from "@/db/schema"
import { eq, and, asc } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Types
export type CarouselPosition = "left" | "middle" | "right"

export interface CarouselImageData {
    id: number
    image: string
    link: string | null
    displayOrder: number
    isActive: boolean
}

export interface CarouselData {
    id: number
    position: CarouselPosition
    images: CarouselImageData[]
}

// Get all carousels for a subcategory
export async function getSubcategoryCarousels(subCategoryId: number): Promise<CarouselData[]> {
    const carousels = await db
        .select()
        .from(subCategoryCarousel)
        .where(eq(subCategoryCarousel.subCategoryId, subCategoryId))
        .orderBy(asc(subCategoryCarousel.id))

    const result: CarouselData[] = []

    for (const carousel of carousels) {
        const images = await db
            .select({
                id: subCategoryCarouselImage.id,
                image: subCategoryCarouselImage.image,
                link: subCategoryCarouselImage.link,
                displayOrder: subCategoryCarouselImage.displayOrder,
                isActive: subCategoryCarouselImage.isActive,
            })
            .from(subCategoryCarouselImage)
            .where(eq(subCategoryCarouselImage.carouselId, carousel.id))
            .orderBy(asc(subCategoryCarouselImage.displayOrder))

        result.push({
            id: carousel.id,
            position: carousel.position as CarouselPosition,
            images,
        })
    }

    return result
}

// Ensure carousel exists for a position (create if not exists)
export async function ensureCarousel(subCategoryId: number, position: CarouselPosition) {
    const existing = await db
        .select()
        .from(subCategoryCarousel)
        .where(
            and(
                eq(subCategoryCarousel.subCategoryId, subCategoryId),
                eq(subCategoryCarousel.position, position)
            )
        )
        .limit(1)

    if (existing.length > 0) {
        return existing[0]
    }

    const [newCarousel] = await db
        .insert(subCategoryCarousel)
        .values({
            subCategoryId,
            position,
        })
        .returning()

    return newCarousel
}

// Add image to carousel
export async function addCarouselImage(
    subCategoryId: number,
    position: CarouselPosition,
    imageUrl: string,
    link?: string
) {
    try {
        const carousel = await ensureCarousel(subCategoryId, position)

        // Get max display order
        const maxOrder = await db
            .select({ displayOrder: subCategoryCarouselImage.displayOrder })
            .from(subCategoryCarouselImage)
            .where(eq(subCategoryCarouselImage.carouselId, carousel.id))
            .orderBy(asc(subCategoryCarouselImage.displayOrder))

        const newOrder = maxOrder.length > 0 ? Math.max(...maxOrder.map(m => m.displayOrder)) + 1 : 0

        const [newImage] = await db
            .insert(subCategoryCarouselImage)
            .values({
                carouselId: carousel.id,
                image: imageUrl,
                link: link || null,
                displayOrder: newOrder,
                isActive: true,
            })
            .returning()

        revalidatePath("/")

        return { success: true, data: newImage }
    } catch (error) {
        console.error("Error adding carousel image:", error)
        return { success: false, error: "Failed to add image" }
    }
}

// Update carousel image (link, order, active status)
export async function updateCarouselImage(
    imageId: number,
    data: { link?: string; displayOrder?: number; isActive?: boolean }
) {
    try {
        const [updated] = await db
            .update(subCategoryCarouselImage)
            .set({
                ...data,
                link: data.link ?? undefined,
                updatedAt: new Date(),
            })
            .where(eq(subCategoryCarouselImage.id, imageId))
            .returning()

        revalidatePath("/")

        return { success: true, data: updated }
    } catch (error) {
        console.error("Error updating carousel image:", error)
        return { success: false, error: "Failed to update image" }
    }
}

// Delete carousel image
export async function deleteCarouselImage(imageId: number) {
    try {
        await db
            .delete(subCategoryCarouselImage)
            .where(eq(subCategoryCarouselImage.id, imageId))

        revalidatePath("/")

        return { success: true }
    } catch (error) {
        console.error("Error deleting carousel image:", error)
        return { success: false, error: "Failed to delete image" }
    }
}

// Reorder images within a carousel
export async function reorderCarouselImages(imageIds: number[]) {
    try {
        for (let i = 0; i < imageIds.length; i++) {
            await db
                .update(subCategoryCarouselImage)
                .set({ displayOrder: i, updatedAt: new Date() })
                .where(eq(subCategoryCarouselImage.id, imageIds[i]))
        }

        revalidatePath("/")

        return { success: true }
    } catch (error) {
        console.error("Error reordering carousel images:", error)
        return { success: false, error: "Failed to reorder images" }
    }
}
