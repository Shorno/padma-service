import type { Metadata } from "next";
import { HomePageWrapper } from "@/components/home/home-page-wrapper";
import getCategories from "@/app/(admin)/admin/dashboard/category/actions/category/get-categories";
import { getBannerWithImages } from "@/app/(admin)/admin/dashboard/banner/actions/get-banner";
import { getCategoryContent } from "@/app/(client)/actions/get-category-content";

export const metadata: Metadata = {
    title: "Home",
    description: "Discover our carefully curated selection of pure honey and premium nuts, sourced from the finest producers. Shop premium natural organic products at KhaatiBazar.",
};

export default async function HomePage() {
    const [categories, banner] = await Promise.all([
        getCategories(),
        getBannerWithImages(),
    ]);
    const activeCategories = categories.filter(cat => cat.isActive);

    // Prefetch first category content on server for instant first load
    const firstCategorySlug = activeCategories[0]?.slug;
    const firstCategoryContent = firstCategorySlug
        ? await getCategoryContent(firstCategorySlug)
        : null;

    return (
        <HomePageWrapper
            categories={activeCategories}
            banner={banner}
            initialCategoryContent={firstCategoryContent}
            initialCategorySlug={firstCategorySlug || null}
        />
    );
}
