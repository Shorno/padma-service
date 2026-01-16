"use server"

import { db } from "@/db/config";
import { banner } from "@/db/schema/banner";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface UpsertBannerData {
    id?: number;
    title: string;
    image: string;
    link?: string;
    isActive?: boolean;
}

export async function upsertBanner(data: UpsertBannerData) {
    try {
        if (data.id) {
            // Update existing
            await db.update(banner)
                .set({
                    title: data.title,
                    image: data.image,
                    link: data.link || null,
                    isActive: data.isActive ?? true,
                    updatedAt: new Date()
                })
                .where(eq(banner.id, data.id));
        } else {
            // Create new
            await db.insert(banner).values({
                title: data.title,
                image: data.image,
                link: data.link || null,
                isActive: data.isActive ?? true,
            });
        }

        revalidatePath("/admin/dashboard/banner");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Error upserting banner:", error);
        return { success: false, error: "Failed to save banner" };
    }
}
