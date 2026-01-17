import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/app/actions/services/get-service-by-slug";
import { db } from "@/db/config";
import Image from "next/image";
import Link from "next/link";
import { BookingSection } from "@/components/shared/booking-section";
import { Button } from "@/components/ui/button";

// Generate static params for services directly under category (no subcategory)
export async function generateStaticParams() {
    const services = await db.query.service.findMany({
        where: (svc, { eq, and, isNull }) => and(
            eq(svc.isPublished, true),
            isNull(svc.subCategoryId)
        ),
        with: {
            category: {
                columns: { slug: true },
            },
        },
        columns: { slug: true },
    });

    return services.map((svc) => ({
        categorySlug: svc.category.slug,
        serviceSlug: svc.slug,
    }));
}

interface ServiceDetailPageProps {
    params: Promise<{ categorySlug: string; serviceSlug: string }>;
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
    const { categorySlug, serviceSlug } = await params;

    const service = await getServiceBySlug(serviceSlug);

    if (!service) {
        notFound();
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Category Button (for services directly under category) */}
            <div className="flex justify-center pt-6 pb-4">
                <Button
                    asChild
                    variant="outline"
                    className="px-6 py-2 border-2 border-gray-800 rounded-full text-gray-800 font-medium hover:bg-gray-100"
                >
                    <Link href={`/category/${categorySlug}`}>
                        {service.category.name}
                    </Link>
                </Button>
            </div>

            {/* Service Title */}
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-lg md:text-xl font-semibold text-gray-900 italic">
                    {service.name}
                </h1>
            </div>

            {/* Featured Image */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-center">
                    <div className="relative w-full max-w-md h-48 md:h-64 overflow-hidden">
                        <Image
                            src={service.image}
                            alt={service.name}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>
            </div>

            {/* Booking Section */}
            <div className="container mx-auto px-4">
                <BookingSection variant="compact" />
            </div>

            {/* Separator Text */}
            <div className="container mx-auto px-4 py-4 text-center">
                <p className="text-sm text-gray-600">
                    পোস্টের ডিভন লিংক, বাটন টেবিল ক্লিয়েন্ট
                </p>
            </div>

            {/* Rich Text Description */}
            {service.description && (
                <div className="container mx-auto px-4 py-6">
                    <div
                        className="prose prose-sm md:prose-base max-w-none 
                            prose-headings:text-gray-900 
                            prose-p:text-gray-700 
                            prose-a:text-primary 
                            prose-strong:text-gray-900 
                            prose-ul:text-gray-700 
                            prose-ol:text-gray-700
                            prose-table:border-collapse
                            prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-2 prose-th:bg-gray-50
                            prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2"
                        dangerouslySetInnerHTML={{ __html: service.description }}
                    />
                </div>
            )}

            {/* Additional Images Gallery */}
            {service.images && service.images.length > 0 && (
                <section className="container mx-auto px-4 py-8">
                    <h2 className="text-xl font-semibold mb-4 text-center">গ্যালারি</h2>
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

            {/* Footer Booking Section */}
            <div className="border-t border-gray-200 mt-4">
                <BookingSection variant="full" className="py-6" />
            </div>
        </div>
    );
}
