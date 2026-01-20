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
                    <CarouselContent className="ml-0 gap-[15px] pr-4">
                        {items.map((item) => (
                            <CarouselItem
                                key={item.id}
                                className="pl-0 basis-auto"
                            >
                                <Link
                                    href={`/category/${categorySlug}/subcategory/${subcategorySlug}/${item.service.slug}`}
                                    className="group flex flex-col items-start w-[86px]"
                                >
                                    {/* Image container - 86x85 for mobile */}
                                    <div className="relative w-[86px] h-[85px] overflow-hidden bg-white rounded-[10px]">
                                        <Image
                                            src={item.service.image}
                                            alt={item.service.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    {/* Service name - 12px font, 600 weight, 11px gap */}
                                    <h3 className="mt-[11px] text-[12px] leading-[15px] font-semibold text-black text-left group-hover:text-primary transition-colors line-clamp-1 w-full">
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
            <div className="hidden md:block  ">
                <Carousel
                    opts={{
                        align: "start",
                        loop: false,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="ml-0 gap-[18px] lg:gap-[26px] justify-between">
                        {items.map((item) => (
                            <CarouselItem
                                key={item.id}
                                className="pl-0 basis-auto"
                            >
                                <Link
                                    href={`/category/${categorySlug}/subcategory/${subcategorySlug}/${item.service.slug}`}
                                    className="group flex flex-col items-start w-[156px] lg:w-[215px]"
                                >
                                    {/* Image container - 156x85 tablet, 215x117 desktop */}
                                    <div className="relative w-[156px] lg:w-[215px] h-[85px] lg:h-[117px] overflow-hidden bg-white rounded-lg">
                                        <Image
                                            src={item.service.image}
                                            alt={item.service.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    {/* Service name - 18px font, 400 weight, 12px gap */}
                                    <h3 className="mt-3 text-[18px] leading-[22px] font-normal text-[#201616] text-left group-hover:text-primary transition-colors line-clamp-1 w-full">
                                        {item.service.name}
                                    </h3>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious
                        variant="outline"
                        className="hidden"
                    />
                    <CarouselNext
                        variant="outline"
                        className="absolute -right-[22px] top-[50px] h-[35px] w-[35px] rounded-full bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] border border-black/10"
                    />
                </Carousel>
            </div>
        </>
    );
}


