"use server"

import { db } from "@/db/config"
import { homepageSection } from "@/db/schema"
import { asc } from "drizzle-orm"

export interface HomepageSectionWithDetails {
    id: number
    title: string | null
    displayOrder: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    subCategory: {
        id: number
        name: string
        slug: string
        categoryId: number
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

export async function getHomepageSections(): Promise<HomepageSectionWithDetails[]> {
    const sections = await db.query.homepageSection.findMany({
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
                orderBy: (item, { asc }) => [asc(item.displayOrder)]
            }
        },
        orderBy: [asc(homepageSection.displayOrder)]
    })

    return sections as HomepageSectionWithDetails[]
}
