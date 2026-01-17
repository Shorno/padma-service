"use server"

import { db } from "@/db/config";
import { banner, bannerImage } from "@/db/schema/banner";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteBanner(id: number) {
    try {
        // Images will cascade delete due to foreign key
        await db.delete(banner).where(eq(banner.id, id));

        revalidatePath("/admin/dashboard/banner");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Error deleting banner:", error);
        return { success: false, error: "Failed to delete banner" };
    }
}

export async function deleteBannerImage(id: number) {
    try {
        await db.delete(bannerImage).where(eq(bannerImage.id, id));

        revalidatePath("/admin/dashboard/banner");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Error deleting banner image:", error);
        return { success: false, error: "Failed to delete banner image" };
    }
}
