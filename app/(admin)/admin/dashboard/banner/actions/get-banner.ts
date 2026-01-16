"use server"

import {db} from "@/db/config";
import {asc} from "drizzle-orm";
import {bannerImage} from "@/db/schema/banner";

// Get the active banner with all its images
export async function getBannerWithImages() {
    return await db.query.banner.findFirst({
        where: (banner, {eq}) => eq(banner.isActive, true),
        with: {
            images: {
                where: (image, {eq}) => eq(image.isActive, true),
                orderBy: [asc(bannerImage.displayOrder)]
            }
        }
    });
}

// Get all banners for admin
export async function getAllBanners() {
    return await db.query.banner.findMany({
        with: {
            images: {
                orderBy: [asc(bannerImage.displayOrder)]
            }
        }
    });
}

// Get a single banner by ID with its images
export async function getBannerById(id: number) {
    return await db.query.banner.findFirst({
        where: (banner, { eq }) => eq(banner.id, id),
        with: {
            images: {
                orderBy: [asc(bannerImage.displayOrder)]
            }
        }
    });
}
