"use server"

import {db} from "@/db/config"
import {homepageSection} from "@/db/schema"
import {eq} from "drizzle-orm"

export async function getHomepageSectionById(id: number) {
    return await db.query.homepageSection.findFirst({
        where: eq(homepageSection.id, id),
        with: {
            subCategory: {
                columns: {
                    id: true,
                    name: true,
                    slug: true,
                    categoryId: true,
                }
            },
            items: {
                with: {
                    service: {
                        columns: {
                            id: true,
                            name: true,
                            slug: true,
                            image: true,
                        }
                    }
                },
                orderBy: (item, {asc}) => [asc(item.displayOrder)]
            }
        }
    })
}
