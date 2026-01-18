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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[20px] gap-y-6 md:gap-x-[24px] lg:gap-x-[44px]">
            {services.map((service) => (
                <Link
                    key={service.id}
                    href={subcategorySlug
                        ? `/category/${categorySlug}/subcategory/${subcategorySlug}/${service.slug}`
                        : `/category/${categorySlug}/${service.slug}`
                    }
                    className="group flex flex-col items-center gap-[6px] w-[150px] md:w-[153px] lg:w-[215px] h-[91px] md:h-[90px] lg:h-[120px] mx-auto"
                >
                    {/* Fixed size image container - responsive */}
                    <div className="relative w-[150px] md:w-[148px] lg:w-[210px] h-[68px] md:h-[67px] lg:h-[95px] overflow-hidden bg-white rounded-lg">
                        <Image
                            src={service.image}
                            alt={service.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    {/* Centered name below image - responsive */}
                    <h3 className="text-[12px] leading-[15px] font-extrabold md:text-[14px] md:leading-[17px] md:font-semibold text-black text-center group-hover:text-primary transition-colors line-clamp-1 max-w-full">
                        {service.name}
                    </h3>
                </Link>
            ))}
        </div>
    );
}
