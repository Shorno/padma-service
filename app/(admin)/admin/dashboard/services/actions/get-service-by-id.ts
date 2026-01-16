"use server"

import { db } from "@/db/config";
import { eq } from "drizzle-orm";
import { service } from "@/db/schema/service";

export default async function getServiceById(id: number) {
    return await db.query.service.findFirst({
        where: eq(service.id, id),
        with: {
            category: true,
            subCategory: true,
            images: true,
        }
    })
}
