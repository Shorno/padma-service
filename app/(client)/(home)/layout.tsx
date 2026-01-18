import { CategoryNav } from "@/components/home/category-nav";
import getCategories from "@/app/(admin)/admin/dashboard/category/actions/category/get-categories";

interface HomeLayoutProps {
    children: React.ReactNode;
    categoryContent: React.ReactNode;
}

/**
 * Layout for homepage route group.
 * Contains CategoryNav and parallel route slot for category content.
 * This layout is ONLY for the homepage, not for other pages like about-us or category details.
 */
export default async function HomeLayout({
    children,
    categoryContent,
}: HomeLayoutProps) {
    const categories = await getCategories();
    const activeCategories = categories.filter(cat => cat.isActive);

    return (
        <>
            {/* Category Navigation - always visible on homepage */}
            <CategoryNav categories={activeCategories} />

            {/* Parallel route slot for category content (banner or category content) */}
            {categoryContent}

            {/* Main homepage content (future sections) */}
            {children}
        </>
    );
}
