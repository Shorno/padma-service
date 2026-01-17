import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/app/actions/services/get-service-by-slug";
import Image from "next/image";

interface ServiceDetailPageProps {
    params: Promise<{ categorySlug: string; serviceSlug: string }>;
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
    const { serviceSlug } = await params;

    const service = await getServiceBySlug(serviceSlug);

    if (!service) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Service Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{service.name}</h1>
                <p className="text-muted-foreground">
                    {service.category.name}
                    {service.subCategory && ` / ${service.subCategory.name}`}
                </p>
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
