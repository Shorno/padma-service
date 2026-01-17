"use client";

import Image from "next/image";
import Link from "next/link";
import { type ServiceData } from "@/app/(client)/actions/get-category-content";

interface ServicePostsGridProps {
    services: ServiceData[];
    categorySlug: string;
    subcategorySlug?: string | null;
}

export function ServicePostsGrid({
    services,
    categorySlug,
    subcategorySlug
}: ServicePostsGridProps) {
    if (services.length === 0) return null;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {services.map((service) => (
                <Link
                    key={service.id}
                    href={`/category/${categorySlug}/${subcategorySlug}/${service.slug}`}
                    className="group"
                >
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                        <Image
                            src={service.image}
                            alt={service.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {service.name}
                    </h3>
                </Link>
            ))}
        </div>
    );
}
