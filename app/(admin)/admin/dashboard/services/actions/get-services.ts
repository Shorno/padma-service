"use server"

import { db } from "@/db/config";

export default async function getServices() {
    return await db.query.service.findMany({
        with: {
            category: true,
            subCategory: true,
            images: true,
        },
        orderBy: (service, { desc }) => [desc(service.createdAt)]
    })
}
