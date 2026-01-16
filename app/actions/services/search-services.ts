"use server"

import { db } from "@/db/config";
import { service } from "@/db/schema/service";
import { ilike } from "drizzle-orm";

export async function searchServices(query: string) {
    return await db.query.service.findMany({
        where: ilike(service.name, `%${query}%`),
        with: {
            category: true,
            subCategory: true,
            images: true,
        },
        limit: 10,
    })
}
