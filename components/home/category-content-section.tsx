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
                                <div className="relative w-full h-32 sm:h-40 md:h-48 overflow-hidden rounded-lg">
                                    <Image
                                        src={img.image}
                                        alt="Banner"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </Link>
                        ) : (
                            <div className="relative w-full h-32 sm:h-40 md:h-48 overflow-hidden rounded-lg">
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
                                                    <div className="relative w-full h-32 sm:h-40 md:h-48 overflow-hidden rounded-lg">
                                                        <Image
                                                            src={img.image}
                                                            alt="Banner"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </Link>
                                            ) : (
                                                <div className="relative w-full h-32 sm:h-40 md:h-48 overflow-hidden rounded-lg">
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
                            <div className="relative w-full h-32 sm:h-40 md:h-48 overflow-hidden rounded-lg">
                                <Image
                                    src={selectedSubcategory.image}
                                    alt={selectedSubcategory.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-32 sm:h-40 md:h-48 bg-gray-100 rounded-lg flex items-center justify-center">
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

                {/* Booking Tagline */}
                <div className="flex items-center justify-center gap-2 mt-3">
                    <Image
                        src="/logos/call-icon.svg"
                        alt="Phone"
                        width={24}
                        height={24}
                        className="flex-shrink-0"
                    />
                    <span
                        className="text-sm md:text-base font-semibold"
                        style={{ color: 'var(--booking-tagline)' }}
                    >
                        মোবাইলে বুকিং | কম খরচ | নিরাপত্তা
                    </span>
                </div>
            </div>

            {/* Service Posts Grid */}
            <div className="container mx-auto py-4 px-4 md:px-6">
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

                {/* See More Button */}
                {services.length > 0 && (
                    <div className="flex justify-center mt-6">
                        <Link
                            href={`/category/${content.category.slug}/${selectedSubcategory?.slug || ''}`}
                            className="px-8 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                            আরও দেখুন
                        </Link>
                    </div>
                )}
            </div>

            <div className="container mx-auto px-4 md:px-6 py-6 border-t border-gray-200 mt-4">
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/logos/call-icon.svg"
                            alt="পদ্মা সার্ভিস"
                            width={32}
                            height={32}
                        />
                        <span className="text-xl font-bold text-pink-600">
                            পদ্মা সার্ভিস
                        </span>
                    </div>
                    <a
                        href="tel:01755997447"
                        className="flex items-center bg-black text-white px-2 py-1 rounded-lg text-sm font-medium"
                    >
                        <span className="bg-navbar-primary text-white px-1 py-1 rounded mr-2 text-xs font-semibold">
                            ক্লিক
                        </span>
                        01755997447
                    </a>
                    <span className="text-sm text-black font-semibold">
                        এক ক্লিকে সকল সার্ভিস
                    </span>
                </div>
            </div>


            {/* Rich Text Description Section */}
            {selectedSubcategory?.description && (
                <div className="container mx-auto px-4 md:px-6 py-6">
                    <div
                        className="prose prose-sm md:prose-base max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
                        dangerouslySetInnerHTML={{ __html: selectedSubcategory.description }}
                    />
                </div>
            )}
        </section>
    );
}
