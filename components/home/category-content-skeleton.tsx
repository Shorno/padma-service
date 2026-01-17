"use client";

/**
 * Loading skeleton for Category Content Section
 * Matches the exact responsive sizing used in CategoryContentSection
 */
export function CategoryContentSkeleton() {
    return (
        <section className="bg-white animate-pulse">
            {/* Three Carousels Section Skeleton */}
            <div className="container mx-auto px-4 md:px-6 py-4">
                <div className="flex flex-col md:flex-row gap-4 items-stretch">
                    {/* Left Carousel Skeleton - 1/4 width on desktop */}
                    <div className="hidden md:block md:w-1/4">
                        <div className="w-full h-32 sm:h-36 md:h-20 lg:h-44 bg-gray-200 rounded-lg" />
                    </div>

                    {/* Middle Carousel Skeleton - 1/2 width on desktop, full on mobile */}
                    <div className="w-full md:w-1/2">
                        <div className="w-full h-32 sm:h-36 md:h-20 lg:h-44 bg-gray-200 rounded-lg" />
                    </div>

                    {/* Right Carousel Skeleton - 1/4 width on desktop */}
                    <div className="hidden md:block md:w-1/4">
                        <div className="w-full h-32 sm:h-36 md:h-20 lg:h-44 bg-gray-200 rounded-lg" />
                    </div>
                </div>

                {/* Header Skeleton - Below Carousels */}
                <div className="text-center mt-6 mx-auto md:max-w-sm lg:max-w-none">
                    <div className="h-6 md:h-4 lg:h-8 bg-gray-200 rounded mx-auto w-3/4 md:w-full" />
                </div>

                {/* Booking Tagline Skeleton */}
                <div className="flex items-center justify-center gap-2 mt-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full" />
                    <div className="h-5 bg-gray-200 rounded w-48" />
                </div>
            </div>

            {/* Service Posts Grid Skeleton */}
            <div className="container mx-auto py-4 px-4 md:px-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                            {/* Image skeleton with matching responsive heights */}
                            <div className="w-full h-36 sm:h-40 md:h-24 lg:h-44 bg-gray-200 rounded-lg" />
                            {/* Text skeleton */}
                            <div className="h-4 bg-gray-200 rounded mt-2 w-3/4" />
                        </div>
                    ))}
                </div>

                {/* See More Button Skeleton */}
                <div className="flex justify-center mt-6">
                    <div className="h-10 w-32 bg-gray-200 rounded" />
                </div>
            </div>

            {/* Static Footer Section Skeleton */}
            <div className="container mx-auto px-4 md:px-6 py-6 border-t border-gray-200 mt-4">
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full" />
                        <div className="h-6 w-24 bg-gray-200 rounded" />
                    </div>
                    <div className="h-8 w-36 bg-gray-200 rounded-lg" />
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                </div>
            </div>
        </section>
    );
}
