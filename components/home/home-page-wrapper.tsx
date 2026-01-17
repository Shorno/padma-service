"use client";

import { useState, useTransition } from "react";
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
}

export function HomePageWrapper({ categories, banner }: HomePageWrapperProps) {
    const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
    const [categoryContent, setCategoryContent] = useState<CategoryContentResult | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleCategoryClick = (categorySlug: string) => {
        // Toggle behavior: clicking same category returns to home
        if (selectedCategorySlug === categorySlug) {
            setSelectedCategorySlug(null);
            setCategoryContent(null);
            return;
        }

        setSelectedCategorySlug(categorySlug);
        setCategoryContent(null);

        startTransition(async () => {
            const content = await getCategoryContent(categorySlug);
            setCategoryContent(content);
        });
    };


    const showSkeleton = selectedCategorySlug && (isPending || !categoryContent);

    return (
        <>
            <CategoryCarousel
                categories={categories}
                selectedCategorySlug={selectedCategorySlug}
                onCategoryClick={handleCategoryClick}
            />

            {showSkeleton ? (
                <CategoryContentSkeleton />
            ) : selectedCategorySlug && categoryContent ? (
                <CategoryContentSection
                    content={categoryContent}
                    isLoading={isPending}
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

