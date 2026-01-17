"use server"

import { db } from "@/db/config";
import { banner, bannerImage } from "@/db/schema/banner";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface UpsertBannerData {
    id?: number;
    title: string;
    isActive?: boolean;
}

export async function upsertBanner(data: UpsertBannerData) {
    try {
        let bannerId: number;

        if (data.id) {
            // Update existing
            await db.update(banner)
                .set({
                    title: data.title,
                    isActive: data.isActive ?? true,
                    updatedAt: new Date()
                })
                .where(eq(banner.id, data.id));
            bannerId = data.id;
        } else {
            // Create new
            const [newBanner] = await db.insert(banner).values({
                title: data.title,
                isActive: data.isActive ?? true,
            }).returning();
            bannerId = newBanner.id;
        }

        revalidatePath("/admin/dashboard/banner");
        revalidatePath("/");

        return { success: true, bannerId };
    } catch (error) {
        console.error("Error upserting banner:", error);
        return { success: false, error: "Failed to save banner" };
    }
}

interface UpsertBannerImageData {
    id?: number;
    bannerId: number;
    image: string;
    link?: string;
    displayOrder?: number;
    isActive?: boolean;
}

export async function upsertBannerImage(data: UpsertBannerImageData) {
    try {
        if (data.id) {
            // Update existing
            await db.update(bannerImage)
                .set({
                    image: data.image,
                    link: data.link || null,
                    displayOrder: data.displayOrder ?? 0,
                    isActive: data.isActive ?? true,
                    updatedAt: new Date()
                })
                .where(eq(bannerImage.id, data.id));
        } else {
            // Create new
            await db.insert(bannerImage).values({
                bannerId: data.bannerId,
                image: data.image,
                link: data.link || null,
                displayOrder: data.displayOrder ?? 0,
                isActive: data.isActive ?? true,
            });
        }

        revalidatePath("/admin/dashboard/banner");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Error upserting banner image:", error);
        return { success: false, error: "Failed to save banner image" };
    }
}
