"use client";

import * as React from "react";
import { Play } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

// Sample testimonial videos - replace with actual data
const testimonialVideos = [
    {
        id: 1,
        thumbnail: "/images/testimonials/video1.jpg",
        videoUrl: "https://www.youtube.com/watch?v=example1",
        title: "Customer Testimonial 1",
    },
    {
        id: 2,
        thumbnail: "/images/testimonials/video2.jpg",
        videoUrl: "https://www.youtube.com/watch?v=example2",
        title: "Customer Testimonial 2",
    },
    {
        id: 3,
        thumbnail: "/images/testimonials/video3.jpg",
        videoUrl: "https://www.youtube.com/watch?v=example3",
        title: "Customer Testimonial 3",
    },
    {
        id: 4,
        thumbnail: "/images/testimonials/video4.jpg",
        videoUrl: "https://www.youtube.com/watch?v=example4",
        title: "Customer Testimonial 4",
    },
];

export function TestimonialCarousel() {
    const handleVideoClick = (videoUrl: string) => {
        window.open(videoUrl, "_blank");
    };

    return (
        <section className="w-full bg-white py-10 lg:py-16">
            <div className="container mx-auto px-4 md:px-6">
                {/* Section Header */}
                <div className="text-center mb-8">
                    <h2 className="text-xl lg:text-2xl font-semibold text-service-benefits-text">
                        আমাদের গ্রাহকদের মতামত
                    </h2>
                </div>

                {/* Video Carousel */}
                <Carousel
                    opts={{
                        align: "center",
                        loop: true,
                    }}
                    className="w-full max-w-4xl mx-auto"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {testimonialVideos.map((video) => (
                            <CarouselItem
                                key={video.id}
                                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                            >
                                <div
                                    className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group bg-gradient-to-br from-pink-100 to-pink-200"
                                    onClick={() => handleVideoClick(video.videoUrl)}
                                >
                                    {/* Placeholder gradient - replace with actual thumbnail */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-service-benefits-icon/20 to-service-benefits-icon/40 flex items-center justify-center">
                                        {/* Play Button Overlay */}
                                        <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-service-benefits-icon flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                            <Play className="w-5 h-5 lg:w-7 lg:h-7 text-white ml-1" fill="white" />
                                        </div>
                                    </div>

                                    {/* Video Title */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                        <p className="text-white text-xs lg:text-sm truncate">
                                            {video.title}
                                        </p>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious className="hidden sm:flex -left-12" />
                    <CarouselNext className="hidden sm:flex -right-12" />
                </Carousel>
            </div>
        </section>
    );
}
