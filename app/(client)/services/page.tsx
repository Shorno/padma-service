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
            <div className="content-container py-6">
                <div className="flex flex-row justify-center items-center gap-[35px] md:gap-[16px] lg:gap-[16px] flex-wrap">
                    {activeCategories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/services/${category.slug}`}
                            className="flex flex-col justify-center items-center gap-[6px] md:gap-[8px] lg:gap-[15px] w-[50px] md:w-[100px] lg:w-[100px] h-[65px] md:h-[80px] lg:h-[85px] group"
                        >
                            <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden group-hover:opacity-80 transition-opacity">
                                <Image
                                    src={category.logo || category.image}
                                    alt={category.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-[12px] leading-[15px] md:text-[16px] md:leading-[19px] font-normal text-black text-center group-hover:text-primary transition-colors whitespace-nowrap md:line-clamp-1 w-full">
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