"use server"

import { db } from "@/db/config";

export async function getAllServices() {
    return await db.query.service.findMany({
        with: {
            category: true,
            subCategory: true,
            images: true,
        },
    })
}
