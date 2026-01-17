import { notFound } from "next/navigation";
import { db } from "@/db/config";
import { eq, and } from "drizzle-orm";
import { subCategory, category } from "@/db/schema/category";
import { service } from "@/db/schema/service";
import Image from "next/image";
import Link from "next/link";

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

    // First get the category
    const categoryData = await db.query.category.findFirst({
        where: eq(category.slug, categorySlug),
    });

    if (!categoryData) {
        notFound();
    }

    // Then get the subcategory
    const subcategoryData = await db.query.subCategory.findFirst({
        where: and(
            eq(subCategory.slug, subcategorySlug),
            eq(subCategory.categoryId, categoryData.id)
        ),
    });

    if (!subcategoryData) {
        notFound();
    }

    // Get services under this subcategory
    const services = await db.query.service.findMany({
        where: and(
            eq(service.subCategoryId, subcategoryData.id),
            eq(service.isPublished, true)
        ),
        orderBy: (svc, { desc }) => [desc(svc.createdAt)],
    });

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <nav className="text-sm text-muted-foreground mb-2">
                    <Link href={`/category/${categorySlug}`} className="hover:underline">
                        {categoryData.name}
                    </Link>
                    {" / "}
                    <span>{subcategoryData.name}</span>
                </nav>
                <h1 className="text-2xl md:text-3xl font-bold">
                    {subcategoryData.header || subcategoryData.name}
                </h1>
            </div>

            {/* Subcategory Banner */}
            {subcategoryData.image && (
                <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-8">
                    <Image
                        src={subcategoryData.image}
                        alt={subcategoryData.name}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            {/* Services Grid */}
            {services.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {services.map((svc) => (
                        <Link
                            key={svc.id}
                            href={`/category/${categorySlug}/subcategory/${subcategorySlug}/${svc.slug}`}
                            className="group flex flex-col"
                        >
                            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                                <Image
                                    src={svc.image}
                                    alt={svc.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <h3 className="mt-2 text-sm font-medium text-center group-hover:text-primary transition-colors line-clamp-2">
                                {svc.name}
                            </h3>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground py-8">
                    No services found in this subcategory
                </p>
            )}

            {/* Description */}
            {subcategoryData.description && (
                <div
                    className="mt-8 prose prose-sm md:prose-base max-w-none"
                    dangerouslySetInnerHTML={{ __html: subcategoryData.description }}
                />
            )}
        </div>
    );
}
