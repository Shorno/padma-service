"use client";

import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";
import { type SubCategoryWithDetails } from "@/app/(client)/actions/get-category-content";
import { cn } from "@/lib/utils";

interface SubcategoryCarouselProps {
    subcategories: SubCategoryWithDetails[];
    selectedSubcategorySlug: string | null;
    onSubcategoryClick: (slug: string) => void;
}

export function SubcategoryCarousel({
    subcategories,
    selectedSubcategorySlug,
    onSubcategoryClick,
}: SubcategoryCarouselProps) {
    if (subcategories.length === 0) return null;

    return (
        <div className="container mx-auto px-6 py-3">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {subcategories.map((subcategory) => {
                        const isSelected = selectedSubcategorySlug === subcategory.slug;

                        return (
                            <CarouselItem
                                key={subcategory.id}
                                className="pl-4 basis-1/4 sm:basis-1/5 md:basis-1/6 lg:basis-1/8"
                            >
                                <button
                                    onClick={() => onSubcategoryClick(subcategory.slug)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 group w-full",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 overflow-hidden rounded-full transition-all",
                                            isSelected
                                                ? "ring-2 ring-primary ring-offset-2"
                                                : "group-hover:opacity-80"
                                        )}
                                    >
                                        <Image
                                            src={subcategory.logo || subcategory.image}
                                            alt={subcategory.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <span
                                        className={cn(
                                            "text-xs sm:text-sm text-center transition-colors line-clamp-2",
                                            isSelected
                                                ? "text-primary font-medium"
                                                : "text-gray-700 group-hover:text-primary"
                                        )}
                                    >
                                        {subcategory.name}
                                    </span>
                                </button>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
                <CarouselPrevious
                    variant="ghost"
                    className="left-0 -translate-x-1/2 border-0 bg-transparent hover:bg-transparent"
                />
                <CarouselNext
                    variant="ghost"
                    className="right-0 translate-x-1/2 border-0 bg-transparent hover:bg-transparent"
                />
            </Carousel>
        </div>
    );
}
