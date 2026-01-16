"use server"


import { db } from "@/db/config";

export async function getCategoriesWithServices(limit: number = 4) {
    const categories = await db.query.category.findMany({
        where: (category, { eq }) => eq(category.isActive, true),
        orderBy: (category, { asc }) => [asc(category.displayOrder)],
    })

    // For each category, get limited services
    const categoriesWithServices = await Promise.all(
        categories.map(async (cat) => {
            const services = await db.query.service.findMany({
                where: (service, { eq, and }) =>
                    and(
                        eq(service.categoryId, cat.id),
                        eq(service.isPublished, true)
                    ),
                with: {
                    category: {
                        columns: {
                            name: true,
                            slug: true
                        },
                    },
                },
                limit: limit,
                orderBy: (service, { desc }) => [desc(service.createdAt)],
            })

            return {
                ...cat,
                services,
                totalServices: services.length,
            }
        })
    )

    // Filter out categories with no services
    return categoriesWithServices.filter((cat) => cat.services.length > 0)
}
