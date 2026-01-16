"use server"

import { db } from "@/db/config"
import { service } from "@/db/schema"
import { and, asc, desc, eq, ilike } from "drizzle-orm"

interface GetServicesParams {
    category?: string
    subcategory?: string
    sort?: string
    isPublished?: string
    search?: string
}

export async function getServices(params: GetServicesParams) {
    const {
        category,
        subcategory,
        sort = "newest",
        isPublished,
        search,
    } = params

    // Build where conditions
    const conditions = []

    if (category) {
        const categoryData = await db.query.category.findFirst({
            where: (cat, { eq }) => eq(cat.slug, category),
        })
        if (categoryData) {
            conditions.push(eq(service.categoryId, categoryData.id))
        }
    }

    if (subcategory) {
        const subCategoryData = await db.query.subCategory.findFirst({
            where: (subCat, { eq }) => eq(subCat.slug, subcategory),
        })
        if (subCategoryData) {
            conditions.push(eq(service.subCategoryId, subCategoryData.id))
        }
    }

    if (isPublished === "true") {
        conditions.push(eq(service.isPublished, true))
    } else if (isPublished === "false") {
        conditions.push(eq(service.isPublished, false))
    }

    if (search) {
        conditions.push(ilike(service.name, `%${search}%`))
    }

    // Build order by
    let orderBy
    switch (sort) {
        case "name-asc":
            orderBy = [asc(service.name)]
            break
        case "name-desc":
            orderBy = [desc(service.name)]
            break
        case "oldest":
            orderBy = [asc(service.createdAt)]
            break
        case "newest":
        default:
            orderBy = [desc(service.createdAt)]
            break
    }

    return await db.query.service.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        with: {
            category: {
                columns: {
                    slug: true,
                    name: true,
                },
            },
            subCategory: {
                columns: {
                    name: true,
                },
            },
        },
        orderBy,
    })
}
