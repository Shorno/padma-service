import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getActiveHomepageSections, type ActiveHomepageSection } from "@/app/actions/homepage-sections/get-active-sections"
import { ServicesSectionCarousel } from "./services-section-carousel"

export async function HomepageSectionsGrid() {
    const sections = await getActiveHomepageSections()

    if (sections.length === 0) {
        return null
    }

    return (
        <div className="py-6 space-y-6 md:py-8 md:space-y-12">
            {sections.map((section) => (
                <HomepageSection key={section.id} section={section} />
            ))}
        </div>
    )
}

interface HomepageSectionProps {
    section: ActiveHomepageSection
}

function HomepageSection({ section }: HomepageSectionProps) {
    const title = section.title || section.subCategory.name
    const categorySlug = section.subCategory.category.slug
    const subcategorySlug = section.subCategory.slug

    return (
        <section className="space-y-[10px] md:space-y-[10px]">
            {/* Section Header with line between title and link */}
            <div className="flex items-center gap-2 md:gap-4 pr-[10px] md:pr-[10px]">
                <h2 className="text-[15px] md:text-[18px] font-semibold md:font-bold text-[#201616] shrink-0 leading-[18px] md:leading-[22px]">
                    {title}
                </h2>
                {/* Horizontal line */}
                <div className="flex-1 h-px bg-black/30" />
                <Link
                    href={`/category/${categorySlug}/subcategory/${subcategorySlug}`}
                    className="flex items-center gap-1 md:gap-4 text-[15px] md:text-[18px] text-[#E93A85] hover:text-[#E93A85]/80 transition-colors font-semibold md:font-normal shrink-0 leading-[18px] md:leading-[22px]"
                >
                    <span className="hidden md:inline">এ ক্যাটাগরিটি দেখুন</span>
                    <span className="md:hidden">আরও দেখুন</span>
                    <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-[#E93A85]" />
                </Link>
            </div>

            {/* Services Carousel/Grid */}
            <ServicesSectionCarousel
                items={section.items}
                categorySlug={categorySlug}
                subcategorySlug={subcategorySlug}
            />
        </section>
    )
}


