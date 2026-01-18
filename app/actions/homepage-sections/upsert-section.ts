"use server"

import { db } from "@/db/config"
import { homepageSection, homepageSectionItem } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

interface UpsertSectionInput {
    id?: number
    subCategoryId: number
    title?: string | null
    displayOrder?: number
    isActive?: boolean
}

interface ActionResult {
    success: boolean
    error?: string
    data?: { id: number }
}

export async function upsertHomepageSection(input: UpsertSectionInput): Promise<ActionResult> {
    try {
        if (input.id) {
            // Update
            const updated = await db
                .update(homepageSection)
                .set({
                    subCategoryId: input.subCategoryId,
                    title: input.title ?? null,
                    displayOrder: input.displayOrder ?? 0,
                    isActive: input.isActive ?? true,
                    updatedAt: new Date()
                })
                .where(eq(homepageSection.id, input.id))
                .returning({ id: homepageSection.id })

            revalidatePath("/admin/dashboard/homepage-sections")
            revalidatePath("/")
            return { success: true, data: { id: updated[0].id } }
        } else {
            // Insert
            const inserted = await db
                .insert(homepageSection)
                .values({
                    subCategoryId: input.subCategoryId,
                    title: input.title ?? null,
                    displayOrder: input.displayOrder ?? 0,
                    isActive: input.isActive ?? true,
                })
                .returning({ id: homepageSection.id })

            revalidatePath("/admin/dashboard/homepage-sections")
            revalidatePath("/")
            return { success: true, data: { id: inserted[0].id } }
        }
    } catch (error) {
        console.error("Error upserting homepage section:", error)
        return { success: false, error: "Failed to save section" }
    }
}

interface UpdateSectionItemsInput {
    sectionId: number
    serviceIds: number[] // Ordered array of service IDs
}

export async function updateHomepageSectionItems(input: UpdateSectionItemsInput): Promise<ActionResult> {
    try {
        // Delete existing items for this section
        await db
            .delete(homepageSectionItem)
            .where(eq(homepageSectionItem.sectionId, input.sectionId))

        // Insert new items with display order based on array index
        if (input.serviceIds.length > 0) {
            const itemsToInsert = input.serviceIds.map((serviceId, index) => ({
                sectionId: input.sectionId,
                serviceId,
                displayOrder: index,
            }))

            await db.insert(homepageSectionItem).values(itemsToInsert)
        }

        revalidatePath("/admin/dashboard/homepage-sections")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Error updating section items:", error)
        return { success: false, error: "Failed to update section items" }
    }
}
