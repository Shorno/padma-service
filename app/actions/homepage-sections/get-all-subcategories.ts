"use server"

import { db } from "@/db/config"
import { subCategory } from "@/db/schema"
import { eq, asc } from "drizzle-orm"

interface SubcategoryForSelect {
    id: number
    name: string
    slug: string
    categoryId: number
    category: {
        id: number
        name: string
        slug: string
    }
}

export async function getAllSubcategories(): Promise<SubcategoryForSelect[]> {
    const subcategories = await db.query.subCategory.findMany({
        where: eq(subCategory.isActive, true),
        columns: {
            id: true,
            name: true,
            slug: true,
            categoryId: true,
        },
        with: {
            category: {
                columns: {
                    id: true,
                    name: true,
                    slug: true,
                }
            }
        },
        orderBy: [asc(subCategory.name)]
    })

    return subcategories as SubcategoryForSelect[]
}
