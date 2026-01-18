"use server"

import { db } from "@/db/config"
import { homepageSection } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

interface ActionResult {
    success: boolean
    error?: string
}

export async function deleteHomepageSection(id: number): Promise<ActionResult> {
    try {
        await db
            .delete(homepageSection)
            .where(eq(homepageSection.id, id))

        revalidatePath("/admin/dashboard/homepage-sections")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Error deleting homepage section:", error)
        return { success: false, error: "Failed to delete section" }
    }
}
