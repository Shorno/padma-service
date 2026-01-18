"use server"

import { db } from "@/db/config";
import { asc } from "drizzle-orm";
import { category } from "@/db/schema/category";

export default async function getCategories() {
    return await db.query.category.findMany({
        with: {
            subCategory: true
        },
        orderBy: [asc(category.displayOrder), asc(category.id)]
    })
}
