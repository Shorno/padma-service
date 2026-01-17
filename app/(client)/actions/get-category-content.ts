"use server"

import { db } from "@/db/config"
import { category, subCategory, service, subCategoryCarousel, subCategoryCarouselImage } from "@/db/schema"
import { eq, and, asc } from "drizzle-orm"

export interface CarouselImageData {
    id: number
    image: string
    link: string | null
    displayOrder: number
    isActive: boolean
}

export interface CarouselData {
    position: "left" | "middle" | "right"
    images: CarouselImageData[]
}

export interface SubCategoryWithDetails {
    id: number
    name: string
    slug: string
    header: string | null
    description: string | null
    buttonLabel: string | null
    image: string
    logo: string
    displayOrder: number
}

export interface ServiceData {
    id: number
    name: string
    slug: string
    image: string
    description: string | null
    categorySlug: string
}

export interface CategoryContentResult {
    category: {
        id: number
        name: string
        slug: string
    } | null
    subcategories: SubCategoryWithDetails[]
    selectedSubcategory: SubCategoryWithDetails | null
    services: ServiceData[]
    carousels: CarouselData[]
}

export async function getCategoryContent(
    categorySlug: string,
    subcategorySlug?: string
): Promise<CategoryContentResult> {
    // Get category
    const categoryData = await db.query.category.findFirst({
        where: eq(category.slug, categorySlug),
        columns: {
            id: true,
            name: true,
            slug: true,
        },
    })

    if (!categoryData) {
        return {
            category: null,
            subcategories: [],
            selectedSubcategory: null,
            services: [],
            carousels: [],
        }
    }

    // Get all active subcategories for this category
    const subcategories = await db.query.subCategory.findMany({
        where: and(
            eq(subCategory.categoryId, categoryData.id),
            eq(subCategory.isActive, true)
        ),
        orderBy: [asc(subCategory.displayOrder)],
    })

    if (subcategories.length === 0) {
        return {
            category: categoryData,
            subcategories: [],
            selectedSubcategory: null,
            services: [],
            carousels: [],
        }
    }

    // Select subcategory - either by slug or first one
    let selectedSubcategory: SubCategoryWithDetails | null = null
    if (subcategorySlug) {
        selectedSubcategory = subcategories.find(sub => sub.slug === subcategorySlug) || subcategories[0]
    } else {
        selectedSubcategory = subcategories[0]
    }

    // Get services for the selected subcategory
    const servicesData = await db.query.service.findMany({
        where: and(
            eq(service.subCategoryId, selectedSubcategory.id),
            eq(service.isPublished, true)
        ),
        with: {
            category: {
                columns: {
                    slug: true,
                },
            },
        },
        orderBy: (service, { desc }) => [desc(service.createdAt)],
        limit: 20, // Limit to reasonable amount
    })

    // Get carousel images for the selected subcategory
    const carouselData = await db
        .select()
        .from(subCategoryCarousel)
        .where(eq(subCategoryCarousel.subCategoryId, selectedSubcategory.id))
        .orderBy(asc(subCategoryCarousel.id))

    const carousels: CarouselData[] = []

    for (const carousel of carouselData) {
        const images = await db
            .select({
                id: subCategoryCarouselImage.id,
                image: subCategoryCarouselImage.image,
                link: subCategoryCarouselImage.link,
                displayOrder: subCategoryCarouselImage.displayOrder,
                isActive: subCategoryCarouselImage.isActive,
            })
            .from(subCategoryCarouselImage)
            .where(
                and(
                    eq(subCategoryCarouselImage.carouselId, carousel.id),
                    eq(subCategoryCarouselImage.isActive, true)
                )
            )
            .orderBy(asc(subCategoryCarouselImage.displayOrder))

        carousels.push({
            position: carousel.position as "left" | "middle" | "right",
            images,
        })
    }

    return {
        category: categoryData,
        subcategories: subcategories.map(sub => ({
            id: sub.id,
            name: sub.name,
            slug: sub.slug,
            header: sub.header,
            description: sub.description,
            buttonLabel: sub.buttonLabel,
            image: sub.image,
            logo: sub.logo,
            displayOrder: sub.displayOrder,
        })),
        selectedSubcategory: {
            id: selectedSubcategory.id,
            name: selectedSubcategory.name,
            slug: selectedSubcategory.slug,
            header: selectedSubcategory.header,
            description: selectedSubcategory.description,
            buttonLabel: selectedSubcategory.buttonLabel,
            image: selectedSubcategory.image,
            logo: selectedSubcategory.logo,
            displayOrder: selectedSubcategory.displayOrder,
        },
        services: servicesData.map(svc => ({
            id: svc.id,
            name: svc.name,
            slug: svc.slug,
            image: svc.image,
            description: svc.description,
            categorySlug: svc.category.slug,
        })),
        carousels,
    }
}
