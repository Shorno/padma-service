"use client";

import Image from "next/image";
import Link from "next/link";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

interface ServiceItem {
    id: number;
    displayOrder: number;
    service: {
        id: number;
        name: string;
        slug: string;
        image: string;
    };
}

interface ServicesSectionCarouselProps {
    items: ServiceItem[];
    categorySlug: string;
    subcategorySlug: string;
}

export function ServicesSectionCarousel({
    items,
    categorySlug,
    subcategorySlug,
}: ServicesSectionCarouselProps) {
    return (
        <>
            {/* Mobile: Embla Carousel - matches service-posts-grid sizing */}
            <div className="md:hidden">
                <Carousel
                    opts={{
                        align: "start",
                        loop: false,
                        dragFree: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 px-4">
                        {items.map((item) => (
                            <CarouselItem
                                key={item.id}
                                className="pl-2 basis-[28%]"
                            >
                                <Link
                                    href={`/category/${categorySlug}/subcategory/${subcategorySlug}/${item.service.slug}`}
                                    className="group flex flex-col items-center"
                                >
                                    {/* Image container - smaller for mobile */}
                                    <div className="relative w-full aspect-square overflow-hidden bg-white rounded-lg">
                                        <Image
                                            src={item.service.image}
                                            alt={item.service.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    {/* Service name - smaller text for mobile */}
                                    <h3 className="mt-1.5 text-[11px] font-medium text-gray-900 text-center group-hover:text-primary transition-colors line-clamp-2 w-full">
                                        {item.service.name}
                                    </h3>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious
                        variant="outline"
                        size="icon"
                        className="left-1 h-7 w-7 rounded-full bg-white/90 shadow-md border-0"
                    />
                    <CarouselNext
                        variant="outline"
                        size="icon"
                        className="right-1 h-7 w-7 rounded-full bg-white/90 shadow-md border-0"
                    />
                </Carousel>
            </div>

            {/* Desktop/Tablet: Embla Carousel - matches service-posts-grid sizing */}
            <div className="hidden md:block container mx-auto px-6">
                <Carousel
                    opts={{
                        align: "start",
                        loop: false,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {items.map((item) => (
                            <CarouselItem
                                key={item.id}
                                className="pl-4 basis-1/4"
                            >
                                <Link
                                    href={`/category/${categorySlug}/subcategory/${subcategorySlug}/${item.service.slug}`}
                                    className="group flex flex-col items-center"
                                >
                                    {/* Image container - same as service-posts-grid */}
                                    <div className="relative w-full h-24 lg:h-44 overflow-hidden bg-white rounded-lg">
                                        <Image
                                            src={item.service.image}
                                            alt={item.service.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    {/* Service name - same as service-posts-grid */}
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 text-center group-hover:text-primary transition-colors line-clamp-2 max-w-full">
                                        {item.service.name}
                                    </h3>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious
                        variant="outline"
                        className="-left-4 h-9 w-9 rounded-full bg-white shadow-md border"
                    />
                    <CarouselNext
                        variant="outline"
                        className="-right-4 h-9 w-9 rounded-full bg-white shadow-md border"
                    />
                </Carousel>
            </div>
        </>
    );
}


