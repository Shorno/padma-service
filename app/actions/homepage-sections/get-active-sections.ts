"use server"

import { db } from "@/db/config"
import { homepageSection } from "@/db/schema"
import { asc, eq } from "drizzle-orm"

export interface ActiveHomepageSection {
    id: number
    title: string | null
    displayOrder: number
    subCategory: {
        id: number
        name: string
        slug: string
        category: {
            slug: string
        }
    }
    items: {
        id: number
        displayOrder: number
        service: {
            id: number
            name: string
            slug: string
            image: string
        }
    }[]
}

export async function getActiveHomepageSections(): Promise<ActiveHomepageSection[]> {
    const sections = await db.query.homepageSection.findMany({
        where: eq(homepageSection.isActive, true),
        with: {
            subCategory: {
                columns: {
                    id: true,
                    name: true,
                    slug: true,
                },
                with: {
                    category: {
                        columns: {
                            slug: true
                        }
                    }
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
                orderBy: (item, { asc }) => [asc(item.displayOrder)]
            }
        },
        orderBy: [asc(homepageSection.displayOrder)]
    })

    // Filter out sections with no items
    return (sections as ActiveHomepageSection[]).filter(section => section.items.length > 0)
}
