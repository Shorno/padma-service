import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db/config";
import { eq, and } from "drizzle-orm";
import { category, subCategory } from "@/db/schema/category";
import { Button } from "@/components/ui/button";

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

interface CategorySubcategoriesPageProps {
    params: Promise<{ categorySlug: string }>;
}

export default async function CategorySubcategoriesPage({ params }: CategorySubcategoriesPageProps) {
    const { categorySlug } = await params;

    // Get category with subcategories
    const categoryData = await db.query.category.findFirst({
        where: and(
            eq(category.slug, categorySlug),
            eq(category.isActive, true)
        ),
    });

    if (!categoryData) {
        notFound();
    }

    // Get active subcategories for this category
    const subcategories = await db.query.subCategory.findMany({
        where: and(
            eq(subCategory.categoryId, categoryData.id),
            eq(subCategory.isActive, true)
        ),
    });

    return (
        <>
            {/* Subcategories Grid */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                    {subcategories.map((sub) => (
                        <Link
                            key={sub.id}
                            href={`/category/${categorySlug}/subcategory/${sub.slug}`}
                            className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:border-primary hover:text-primary transition-colors"
                        >
                            {sub.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* See More Button */}
            <div className="container mx-auto px-4 py-6 flex justify-center">
                <Button
                    asChild
                    variant="outline"
                    className="px-8 py-2 border-2 border-navbar-primary text-navbar-primary font-semibold hover:bg-navbar-primary hover:text-white transition-colors rounded-md"
                >
                    <Link href="/services">
                        আরও দেখুন
                    </Link>
                </Button>
            </div>
        </>
    );
}
