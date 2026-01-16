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
import Autoplay from "embla-carousel-autoplay";
import { type Banner, type BannerImage } from "@/db/schema/banner";
import * as React from "react";

type BannerWithImages = Banner & { images: BannerImage[] }

interface BannerSectionProps {
    banner: BannerWithImages | null | undefined;
}

export function BannerSection({ banner }: BannerSectionProps) {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    );

    if (!banner || !banner.images || banner.images.length === 0) return null;

    const { title, images } = banner;

    // Single image - no carousel needed
    if (images.length === 1) {
        const img = images[0];
        const content = (
            <section className="bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-center text-lg md:text-xl font-semibold text-black my-4 md:my-8">
                        {title}
                    </h2>
                    <div className="relative w-full h-40 sm:h-52 md:h-64 lg:h-72 overflow-hidden rounded-lg">
                        <Image
                            src={img.image}
                            alt={title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </section>
        );

        if (img.link) {
            return (
                <Link href={img.link} className="block hover:opacity-95 transition-opacity">
                    {content}
                </Link>
            );
        }

        return content;
    }

    // Multiple images - carousel
    return (
        <section className="bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-center text-lg md:text-xl font-semibold text-black my-4 md:my-8">
                    {title}
                </h2>
                <Carousel
                    plugins={[plugin.current]}
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                >
                    <CarouselContent>
                        {images.map((img) => (
                            <CarouselItem key={img.id} className="basis-full">
                                {img.link ? (
                                    <Link href={img.link} className="block hover:opacity-95 transition-opacity">
                                        <div className="relative w-full h-40 sm:h-52 md:h-64 lg:h-72 overflow-hidden rounded-lg">
                                            <Image
                                                src={img.image}
                                                alt={title}
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="relative w-full h-40 sm:h-52 md:h-64 lg:h-72 overflow-hidden rounded-lg">
                                        <Image
                                            src={img.image}
                                            alt={title}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                )}
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious
                        variant="ghost"
                        className="left-2 border-0 bg-white/80 hover:bg-white"
                    />
                    <CarouselNext
                        variant="ghost"
                        className="right-2 border-0 bg-white/80 hover:bg-white"
                    />
                </Carousel>
            </div>
        </section>
    );
}
