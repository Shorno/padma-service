import { notFound } from "next/navigation";
import { db } from "@/db/config";
import { eq } from "drizzle-orm";
import { subCategory } from "@/db/schema/category";
import { getCategoryContent } from "@/app/(client)/actions/get-category-content";
import { CategoryContentSection } from "@/components/home/category-content-section";

// Generate static params for all subcategories at build time
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

interface SubcategoryPageProps {
    params: Promise<{ categorySlug: string; subcategorySlug: string }>;
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
    const { categorySlug, subcategorySlug } = await params;

    // Use the same getCategoryContent action used by HomePageWrapper
    const content = await getCategoryContent(categorySlug, subcategorySlug);

    if (!content.category || !content.selectedSubcategory) {
        notFound();
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Reuse the same CategoryContentSection component from home page */}
            <CategoryContentSection
                content={content}
                isLoading={false}
            />
        </div>
    );
}
