"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryCarousel } from "./category-carousel";
import { BannerSection } from "./banner-section";
import { CategoryContentSection } from "./category-content-section";
import { CategoryContentSkeleton } from "./category-content-skeleton";
import { getCategoryContent, type CategoryContentResult } from "@/app/(client)/actions/get-category-content";
import { type Category } from "@/db/schema/category";
import { type Banner, type BannerImage } from "@/db/schema/banner";

type BannerWithImages = Banner & { images: BannerImage[] };

interface HomePageWrapperProps {
    categories: Category[];
    banner: BannerWithImages | null | undefined;
    initialCategoryContent?: CategoryContentResult | null;
    initialCategorySlug?: string | null;
}

export function HomePageWrapper({
    categories,
    banner,
    initialCategoryContent,
    initialCategorySlug
}: HomePageWrapperProps) {
    const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
    const queryClient = useQueryClient();

    // Seed the cache with server-fetched data on mount
    useEffect(() => {
        if (initialCategoryContent && initialCategorySlug) {
            queryClient.setQueryData(
                ["categoryContent", initialCategorySlug],
                initialCategoryContent
            );
        }
    }, [initialCategoryContent, initialCategorySlug, queryClient]);

    // Use TanStack Query for fetching category content with caching
    const { data: categoryContent, isLoading, isFetching } = useQuery({
        queryKey: ["categoryContent", selectedCategorySlug],
        queryFn: () => getCategoryContent(selectedCategorySlug!),
        enabled: !!selectedCategorySlug,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    });

    const handleCategoryClick = (categorySlug: string) => {
        // Toggle behavior: clicking same category returns to home
        if (selectedCategorySlug === categorySlug) {
            setSelectedCategorySlug(null);
            return;
        }
        setSelectedCategorySlug(categorySlug);
    };

    // Prefetch category data on hover for faster loading
    const handleCategoryHover = (categorySlug: string) => {
        queryClient.prefetchQuery({
            queryKey: ["categoryContent", categorySlug],
            queryFn: () => getCategoryContent(categorySlug),
            staleTime: 5 * 60 * 1000,
        });
    };

    // Show skeleton when loading initial data (not cached)
    const showSkeleton = selectedCategorySlug && isLoading;

    return (
        <>
            <CategoryCarousel
                categories={categories}
                selectedCategorySlug={selectedCategorySlug}
                onCategoryClick={handleCategoryClick}
                onCategoryHover={handleCategoryHover}
            />

            {showSkeleton ? (
                <CategoryContentSkeleton />
            ) : selectedCategorySlug && categoryContent ? (
                <CategoryContentSection
                    content={categoryContent}
                    isLoading={isFetching}
                />
            ) : (
                <>
                    <BannerSection banner={banner} />
                    {/* Add more home page sections here in the future */}
                </>
            )}
        </>
    );
}

