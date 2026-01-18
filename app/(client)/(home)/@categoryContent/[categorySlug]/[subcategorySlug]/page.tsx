import { notFound } from "next/navigation";
import { getCategoryContent } from "@/app/(client)/actions/get-category-content";
import { CategoryContentSection } from "@/components/home/category-content-section";
import { db } from "@/db/config";
import { eq } from "drizzle-orm";
import { subCategory } from "@/db/schema/category";

// Generate static params for all subcategories
export async function generateStaticParams() {
    const subcategories = await db.query.subCategory.findMany({
        where: eq(subCategory.isActive, true),
        with: {
            category: {
                columns: { slug: true },
            },
        },
        columns: { slug: true },
    });

    return subcategories.map((sub) => ({
        categorySlug: sub.category.slug,
        subcategorySlug: sub.slug,
    }));
}

interface SubcategoryContentPageProps {
    params: Promise<{ categorySlug: string; subcategorySlug: string }>;
}

/**
 * Parallel route slot for subcategory content.
 * Renders CategoryContentSection with the selected subcategory.
 * This is a static (SSG) page - pre-rendered at build time.
 */
export default async function SubcategoryContentPage({ params }: SubcategoryContentPageProps) {
    const { categorySlug, subcategorySlug } = await params;

    const content = await getCategoryContent(categorySlug, subcategorySlug);

    if (!content.category || !content.selectedSubcategory) {
        notFound();
    }

    return (
        <CategoryContentSection
            content={content}
            isLoading={false}
        />
    );
}
