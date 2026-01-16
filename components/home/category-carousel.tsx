"use client";

import Image from "next/image";
import Link from "next/link";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";
import { type Category } from "@/db/schema/category";

interface CategoryCarouselProps {
    categories: Category[];
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
    const groupedCategories: Category[][] = [];
    for (let i = 0; i < categories.length; i += 8) {
        groupedCategories.push(categories.slice(i, i + 8));
    }

    return (
        <section className="py-2 bg-white">
            {/* Mobile Layout: 2 rows x 4 columns grid carousel */}
            <div className="sm:hidden container mx-auto px-4">
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
                                <div className="grid grid-cols-4 gap-y-3">
                                    {group.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`/category/${category.slug}`}
                                            className="flex flex-col items-center gap-1 group"
                                        >
                                            <div className="relative w-14 h-14 overflow-hidden group-hover:opacity-80 transition-opacity">
                                                <Image
                                                    src={category.logo || category.image}
                                                    alt={category.name}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                            <span className="text-xs text-center text-gray-700 group-hover:text-primary transition-colors line-clamp-1 px-1">
                                                {category.name}
                                            </span>
                                        </Link>
                                    ))}
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
            <div className="hidden sm:block container mx-auto px-6">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {categories.map((category) => (
                            <CarouselItem
                                key={category.id}
                                className="pl-4 basis-1/5 md:basis-1/6 lg:basis-1/8"
                            >
                                <Link
                                    href={`/category/${category.slug}`}
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className="relative w-20 h-20 overflow-hidden group-hover:opacity-80 transition-opacity">
                                        <Image
                                            src={category.logo || category.image}
                                            alt={category.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <span className="text-sm text-center text-gray-700 group-hover:text-primary transition-colors line-clamp-2">
                                        {category.name}
                                    </span>
                                </Link>
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
        </section>
    );
}
