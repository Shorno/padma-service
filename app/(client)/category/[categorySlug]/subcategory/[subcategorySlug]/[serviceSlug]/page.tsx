import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/app/actions/services/get-service-by-slug";
import { db } from "@/db/config";
import { service } from "@/db/schema/service";
import { eq, isNotNull } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

// Generate static params for services under subcategories (bottom-up approach)
export async function generateStaticParams() {
    const services = await db.query.service.findMany({
        where: (svc, { eq, and, isNotNull }) => and(
            eq(svc.isPublished, true),
            isNotNull(svc.subCategoryId)
        ),
        with: {
            category: {
                columns: { slug: true },
            },
            subCategory: {
                columns: { slug: true },
            },
        },
        columns: { slug: true },
    });

    return services
        .filter((svc) => svc.subCategory !== null)
        .map((svc) => ({
            categorySlug: svc.category.slug,
            subcategorySlug: svc.subCategory!.slug,
            serviceSlug: svc.slug,
        }));
}

interface ServiceDetailPageProps {
    params: Promise<{
        categorySlug: string;
        subcategorySlug: string;
        serviceSlug: string
    }>;
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
    const { categorySlug, subcategorySlug, serviceSlug } = await params;

    const service = await getServiceBySlug(serviceSlug);

    if (!service) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <nav className="text-sm text-muted-foreground mb-4">
                <Link href={`/category/${categorySlug}`} className="hover:underline">
                    {service.category.name}
                </Link>
                {service.subCategory && (
                    <>
                        {" / "}
                        <Link
                            href={`/category/${categorySlug}/subcategory/${subcategorySlug}`}
                            className="hover:underline"
                        >
                            {service.subCategory.name}
                        </Link>
                    </>
                )}
            </nav>

            {/* Service Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold">{service.name}</h1>
            </div>

            {/* Main Image */}
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
                <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Description */}
            {service.description && (
                <div
                    className="prose prose-sm md:prose-base max-w-none"
                    dangerouslySetInnerHTML={{ __html: service.description }}
                />
            )}

            {/* Additional Images */}
            {service.images && service.images.length > 0 && (
                <section className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {service.images.map((img) => (
                            <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden">
                                <Image
                                    src={img.imageUrl}
                                    alt={service.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
