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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6">
            {services.map((service) => (
                <Link
                    key={service.id}
                    href={`/category/${categorySlug}/${subcategorySlug}/${service.slug}`}
                    className="group flex flex-col items-center"
                >
                    {/* Fixed size image container */}
                    <div className="relative w-full h-36 sm:h-40 md:h-24 lg:h-44 overflow-hidden bg-white rounded-lg">
                        <Image
                            src={service.image}
                            alt={service.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    {/* Centered name below image */}
                    <h3 className="mt-2 text-xs sm:text-sm font-medium text-gray-900 text-center group-hover:text-primary transition-colors line-clamp-2 max-w-full">
                        {service.name}
                    </h3>
                </Link>
            ))}
        </div>
    );
}
