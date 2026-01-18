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
        <section className="space-y-3 md:space-y-4">
            {/* Section Header with line between title and link */}
            <div className="flex items-center gap-2 md:gap-4 container mx-auto px-4 md:px-6">
                <h2 className="text-sm md:text-xl font-semibold text-gray-900 shrink-0">
                    {title}
                </h2>
                {/* Horizontal line */}
                <div className="flex-1 h-px bg-gray-200" />
                <Link
                    href={`/category/${categorySlug}/subcategory/${subcategorySlug}`}
                    className="flex items-center gap-0.5 text-xs md:text-sm text-primary hover:text-primary/80 transition-colors font-medium shrink-0"
                >
                    এ ক্যাটাগরিটি দেখুন
                    <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
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


