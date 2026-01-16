"use server"

import { db } from "@/db/config";
import { eq } from "drizzle-orm";
import { service } from "@/db/schema/service";

export async function getServiceBySlug(slug: string) {
    return await db.query.service.findFirst({
        where: eq(service.slug, slug),
        with: {
            category: {
                columns: {
                    name: true,
                    slug: true,
                },
            },
            subCategory: {
                columns: {
                    name: true,
                },
            },
            images: true,
        },
    })
}
