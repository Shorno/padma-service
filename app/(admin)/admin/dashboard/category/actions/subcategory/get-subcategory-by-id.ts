"use server"

import { db } from "@/db/config";
import { subCategory, category } from "@/db/schema/category";
import { eq } from "drizzle-orm";

export async function getSubcategoryById(id: number) {
    const result = await db
        .select({
            id: subCategory.id,
            name: subCategory.name,
            header: subCategory.header,
            description: subCategory.description,
            slug: subCategory.slug,
            categoryId: subCategory.categoryId,
            image: subCategory.image,
            logo: subCategory.logo,
            isActive: subCategory.isActive,
            displayOrder: subCategory.displayOrder,
            categoryName: category.name,
        })
        .from(subCategory)
        .leftJoin(category, eq(subCategory.categoryId, category.id))
        .where(eq(subCategory.id, id))
        .limit(1);

    if (result.length === 0) {
        return null;
    }

    return result[0];
}
