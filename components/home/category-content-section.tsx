"use client";

import Image from "next/image";
import Link from "next/link";
import { ServicePostsGrid } from "./service-posts-grid";
import { type CategoryContentResult } from "@/app/(client)/actions/get-category-content";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import * as React from "react";

interface CategoryContentSectionProps {
    content: CategoryContentResult;
    selectedSubcategorySlug: string | null;
    onSubcategoryClick: (slug: string) => void;
    isLoading: boolean;
}

// Reusable carousel component for side carousels
function SideCarousel({
    images,
    position
}: {
    images: { id: number; image: string; link: string | null }[];
    position: "left" | "right";
}) {
    const plugin = React.useRef(
        Autoplay({ delay: 3500, stopOnInteraction: true })
    );

    if (images.length === 0) return null;

    return (
        <Carousel
            plugins={[plugin.current]}
            opts={{ align: "start", loop: true }}
            className="w-full h-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent className="h-full">
                {images.map((img) => (
                    <CarouselItem key={img.id} className="basis-full">
                        {img.link ? (
                            <Link href={img.link} className="block h-full">
                                <div className="relative w-full h-40 sm:h-52 md:h-64 overflow-hidden rounded-lg">
                                    <Image
                                        src={img.image}
                                        alt="Banner"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </Link>
                        ) : (
                            <div className="relative w-full h-40 sm:h-52 md:h-64 overflow-hidden rounded-lg">
                                <Image
                                    src={img.image}
                                    alt="Banner"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}

export function CategoryContentSection({
    content,
    selectedSubcategorySlug,
    onSubcategoryClick,
    isLoading,
}: CategoryContentSectionProps) {
    const middlePlugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    );

    if (!content.category) return null;

    const { selectedSubcategory, services, carousels } = content;

    // Get carousels by position
    const middleCarousel = carousels.find(c => c.position === "middle");
    const leftCarousel = carousels.find(c => c.position === "left");
    const rightCarousel = carousels.find(c => c.position === "right");

    const hasLeftCarousel = leftCarousel && leftCarousel.images.length > 0;
    const hasRightCarousel = rightCarousel && rightCarousel.images.length > 0;
    const hasMiddleCarousel = middleCarousel && middleCarousel.images.length > 0;

    return (
        <section className="bg-white">
            {/* Three Carousels Section - Left (1/6), Middle (2/3), Right (1/6) */}
            <div className="container mx-auto px-4 md:px-6 py-4">
                <div className="flex flex-col md:flex-row gap-4 items-stretch">
                    {/* Left Carousel - 1/4 width on desktop */}
                    <div className="hidden md:block md:w-1/4">
                        {hasLeftCarousel ? (
                            <SideCarousel
                                images={leftCarousel.images}
                                position="left"
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <p className="text-lg font-bold text-pink-600 leading-tight text-center">
                                    {selectedSubcategory?.header || selectedSubcategory?.name || ""}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Middle Carousel - 1/2 width on desktop, full on mobile */}
                    <div className="w-full md:w-1/2">
                        {hasMiddleCarousel ? (
                            <Carousel
                                plugins={[middlePlugin.current]}
                                opts={{ align: "start", loop: true }}
                                className="w-full"
                                onMouseEnter={middlePlugin.current.stop}
                                onMouseLeave={middlePlugin.current.reset}
                            >
                                <CarouselContent>
                                    {middleCarousel.images.map((img) => (
                                        <CarouselItem key={img.id} className="basis-full">
                                            {img.link ? (
                                                <Link href={img.link} className="block">
                                                    <div className="relative w-full h-40 sm:h-52 md:h-64 overflow-hidden rounded-lg">
                                                        <Image
                                                            src={img.image}
                                                            alt="Banner"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </Link>
                                            ) : (
                                                <div className="relative w-full h-40 sm:h-52 md:h-64 overflow-hidden rounded-lg">
                                                    <Image
                                                        src={img.image}
                                                        alt="Banner"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                {middleCarousel.images.length > 1 && (
                                    <>
                                        <CarouselPrevious variant="ghost" className="left-2 border-0 bg-white/80 hover:bg-white" />
                                        <CarouselNext variant="ghost" className="right-2 border-0 bg-white/80 hover:bg-white" />
                                    </>
                                )}
                            </Carousel>
                        ) : selectedSubcategory?.image ? (
                            <div className="relative w-full h-40 sm:h-52 md:h-64 overflow-hidden rounded-lg">
                                <Image
                                    src={selectedSubcategory.image}
                                    alt={selectedSubcategory.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-40 sm:h-52 md:h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                <p className="text-gray-400">No banner image</p>
                            </div>
                        )}
                    </div>

                    {/* Right Carousel - 1/4 width on desktop */}
                    <div className="hidden md:block md:w-1/4">
                        {hasRightCarousel ? (
                            <SideCarousel
                                images={rightCarousel.images}
                                position="right"
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <p className="text-lg font-bold text-pink-600 leading-tight text-center">
                                    {selectedSubcategory?.header || selectedSubcategory?.name || ""}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Header Section - Below Carousels */}
                {selectedSubcategory?.header && (
                    <div className="text-center mt-6">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                            {selectedSubcategory.header}
                        </h2>
                    </div>
                )}

                {/* Description / Tagline */}
                {selectedSubcategory?.description && (
                    <div className="text-center mt-2">
                        <p className="text-sm md:text-base text-gray-600">
                            {selectedSubcategory.description}
                        </p>
                    </div>
                )}
            </div>

            {/* Service Posts Grid */}
            <div className="container mx-auto px-4 md:px-6 py-4">
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-square bg-gray-200 rounded-lg" />
                                <div className="h-4 bg-gray-200 rounded mt-2 w-3/4" />
                            </div>
                        ))}
                    </div>
                ) : services.length > 0 ? (
                    <ServicePostsGrid
                        services={services}
                        categorySlug={content.category.slug}
                        subcategorySlug={selectedSubcategory?.slug}
                    />
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No services found in this category
                    </div>
                )}
            </div>
        </section>
    );
}
