import Image from "next/image";
import Link from "next/link";
import getCategories from "@/app/(admin)/admin/dashboard/category/actions/category/get-categories";
import { Button } from "@/components/ui/button";

export default async function ServicesPage() {
    const categories = await getCategories();
    const activeCategories = categories.filter(cat => cat.isActive);

    return (
        <>
            {/* Categories Grid */}
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-4 md:gap-6">
                    {activeCategories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/services/${category.slug}`}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden border border-gray-200 group-hover:border-primary transition-colors">
                                <Image
                                    src={category.logo || category.image}
                                    alt={category.name}
                                    fill
                                    className="object-contain p-1"
                                />
                            </div>
                            <span className="text-xs sm:text-sm text-center text-gray-700 group-hover:text-primary transition-colors line-clamp-2">
                                {category.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* See More Button */}
            <div className="container mx-auto px-4 py-6 flex justify-center">
                <Button
                    asChild
                    variant="outline"
                    className="px-8 py-2 border-2 border-navbar-primary text-navbar-primary font-semibold hover:bg-navbar-primary hover:text-white transition-colors rounded-md"
                >
                    <Link href="/">
                        আরও দেখুন
                    </Link>
                </Button>
            </div>
        </>
    );
}