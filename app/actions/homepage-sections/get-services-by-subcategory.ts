"use server"

import {db} from "@/db/config"
import {service} from "@/db/schema"
import {and, asc, eq} from "drizzle-orm"

interface ServiceForSelection {
    id: number
    name: string
    slug: string
    image: string
}

export async function getServicesBySubcategory(subCategoryId: number): Promise<ServiceForSelection[]> {
    return await db.query.service.findMany({
        where: and(
            eq(service.subCategoryId, subCategoryId),
            eq(service.isPublished, true)
        ),
        columns: {
            id: true,
            name: true,
            slug: true,
            image: true,
        },
        orderBy: [asc(service.name)]
    })
}
