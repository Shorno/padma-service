import { notFound } from "next/navigation";
import { db } from "@/db/config";
import { eq } from "drizzle-orm";
import { category, subCategory } from "@/db/schema/category";
import { service } from "@/db/schema/service";
import Link from "next/link";
import Image from "next/image";

interface CategoryPageProps {
    params: Promise<{ categorySlug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { categorySlug } = await params;

    // Get category
    const categoryData = await db.query.category.findFirst({
        where: eq(category.slug, categorySlug),
    });

    if (!categoryData) {
        notFound();
    }

    // Get subcategories for this category
    const subcategories = await db.query.subCategory.findMany({
        where: eq(subCategory.categoryId, categoryData.id),
        orderBy: (sc, { asc }) => [asc(sc.displayOrder)],
    });

    // Get services directly under this category (without subcategory)
    const services = await db.query.service.findMany({
        where: (svc, { eq, and, isNull }) => and(
            eq(svc.categoryId, categoryData.id),
            eq(svc.isPublished, true),
            isNull(svc.subCategoryId)
        ),
        limit: 20,
        orderBy: (svc, { desc }) => [desc(svc.createdAt)],
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">{categoryData.name}</h1>

            {/* Subcategories */}
            {subcategories.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Subcategories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {subcategories.map((sub) => (
                            <Link
                                key={sub.id}
                                href={`/category/${categorySlug}/subcategory/${sub.slug}`}
                                className="group flex flex-col items-center"
                            >
                                {sub.image && (
                                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
                                        <Image
                                            src={sub.image}
                                            alt={sub.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                )}
                                <span className="mt-2 text-sm font-medium text-center group-hover:text-primary transition-colors">
                                    {sub.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Direct Services */}
            {services.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold mb-4">Services</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {services.map((svc) => (
                            <Link
                                key={svc.id}
                                href={`/category/${categorySlug}/${svc.slug}`}
                                className="group flex flex-col items-center"
                            >
                                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
                                    <Image
                                        src={svc.image}
                                        alt={svc.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform"
                                    />
                                </div>
                                <span className="mt-2 text-sm font-medium text-center group-hover:text-primary transition-colors line-clamp-2">
                                    {svc.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
