import type { Metadata } from "next";
import { CategoryCarousel } from "@/components/home/category-carousel";
import getCategories from "@/app/(admin)/admin/dashboard/category/actions/category/get-categories";

export const metadata: Metadata = {
    title: "Home",
    description: "Discover our carefully curated selection of pure honey and premium nuts, sourced from the finest producers. Shop premium natural organic products at KhaatiBazar.",
};

export default async function HomePage() {
    const categories = await getCategories();
    const activeCategories = categories.filter(cat => cat.isActive);

    return (
        <>
            <CategoryCarousel categories={activeCategories} />
        </>
    )
}
