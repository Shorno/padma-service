import { notFound } from "next/navigation";
import { getCategoryContent } from "@/app/(client)/actions/get-category-content";
import { CategoryContentSection } from "@/components/home/category-content-section";
import { db } from "@/db/config";
import { eq } from "drizzle-orm";
import { category } from "@/db/schema/category";

// Generate static params for all categories
export async function generateStaticParams() {
    const categories = await db.query.category.findMany({
        where: eq(category.isActive, true),
        columns: { slug: true },
    });

    return categories.map((cat) => ({
        categorySlug: cat.slug,
    }));
}

interface CategoryContentPageProps {
    params: Promise<{ categorySlug: string }>;
}

/**
 * Parallel route slot for category content.
 * Renders CategoryContentSection with the selected category.
 * This is a static (SSG) page - pre-rendered at build time.
 */
export default async function CategoryContentPage({ params }: CategoryContentPageProps) {
    const { categorySlug } = await params;

    const content = await getCategoryContent(categorySlug);

    if (!content.category) {
        notFound();
    }

    return (
        <CategoryContentSection
            content={content}
            isLoading={false}
        />
    );
}
