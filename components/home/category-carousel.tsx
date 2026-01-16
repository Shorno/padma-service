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
    console.log(categories)
    return (
        <section className="py-2 bg-white">
            <div className="container mx-auto px-4">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {categories.map((category) => (
                            <CarouselItem
                                key={category.id}
                                className="pl-2 md:pl-4 basis-1/4 sm:basis-1/5 md:basis-1/6 lg:basis-1/8"
                            >
                                <Link
                                    href={`/category/${category.slug}`}
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    {/* Image Container */}
                                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden group-hover:opacity-80 transition-opacity">
                                        <Image
                                            src={category.logo || category.image}
                                            alt={category.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    {/* Category Name */}
                                    <span className="text-xs sm:text-sm text-center text-gray-700 group-hover:text-primary transition-colors line-clamp-2">
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
