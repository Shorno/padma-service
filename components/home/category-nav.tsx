"use client";

import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";
import { type Category } from "@/db/schema/category";
import { cn } from "@/lib/utils";

interface CategoryNavProps {
    categories: Category[];
}

/**
 * Category navigation using Link components for URL-based routing.
 * Uses useSelectedLayoutSegment to detect active category from the @categoryContent slot.
 */
export function CategoryNav({ categories }: CategoryNavProps) {
    // Get the active category from the @categoryContent slot
    const activeSegment = useSelectedLayoutSegment("categoryContent");

    const groupedCategories: Category[][] = [];
    for (let i = 0; i < categories.length; i += 8) {
        groupedCategories.push(categories.slice(i, i + 8));
    }

    return (
        <section className="py-2 bg-white">
            {/* Mobile Layout: 2 rows x 4 columns grid carousel */}
            <div className="sm:hidden content-container mx-auto">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="ml-0">
                        {groupedCategories.map((group, groupIndex) => (
                            <CarouselItem
                                key={groupIndex}
                                className="pl-0 basis-full"
                            >
                                <div className="grid grid-cols-4 gap-x-[34px] gap-y-5 justify-items-center">
                                    {group.map((category) => {
                                        const isSelected = activeSegment === category.slug;
                                        // Toggle: clicking selected category goes home, otherwise go to category
                                        const href = isSelected ? "/" : `/${category.slug}`;

                                        return (
                                            <Link
                                                key={category.id}
                                                href={href}
                                                prefetch={true}
                                                className={cn(
                                                    "flex flex-col items-center gap-[6px] group w-[50px] h-[71px]",
                                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "relative w-[50px] h-[50px] overflow-hidden transition-all",
                                                        isSelected
                                                            ? "ring-2 ring-primary ring-offset-1 rounded-lg"
                                                            : "group-hover:opacity-80"
                                                    )}
                                                >
                                                    <Image
                                                        src={category.logo || category.image}
                                                        alt={category.name}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <span
                                                    className={cn(
                                                        "text-[12px] leading-[15px] text-center transition-colors whitespace-nowrap",
                                                        isSelected
                                                            ? "text-primary font-medium"
                                                            : "text-black group-hover:text-primary"
                                                    )}
                                                >
                                                    {category.name}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </CarouselItem>
                        ))}
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

            {/* Desktop/Tablet Layout: Original horizontal carousel */}
            <div className="hidden sm:block content-container">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="ml-0 gap-4 justify-between">
                        {categories.map((category) => {
                            const isSelected = activeSegment === category.slug;
                            const href = isSelected ? "/" : `/${category.slug}`;

                            return (
                                <CarouselItem
                                    key={category.id}
                                    className="pl-0 basis-auto"
                                >
                                    <Link
                                        href={href}
                                        prefetch={true}
                                        className={cn(
                                            "flex flex-col items-center gap-[8px] lg:gap-[15px] group w-[100px] h-[80px] lg:h-[85px]",
                                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "relative w-[50px] h-[50px] overflow-hidden transition-all",
                                                isSelected
                                                    ? "ring-2 ring-primary ring-offset-2 rounded-lg"
                                                    : "group-hover:opacity-80"
                                            )}
                                        >
                                            <Image
                                                src={category.logo || category.image}
                                                alt={category.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <span
                                            className={cn(
                                                "text-[16px] leading-[19px] text-center transition-colors whitespace-nowrap",
                                                isSelected
                                                    ? "text-primary font-medium"
                                                    : "text-black group-hover:text-primary"
                                            )}
                                        >
                                            {category.name}
                                        </span>
                                    </Link>
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
        </section>
    );
}
