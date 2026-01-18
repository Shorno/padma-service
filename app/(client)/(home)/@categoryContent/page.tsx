import { BannerSection } from "@/components/home/banner-section";
import { getBannerWithImages } from "@/app/(admin)/admin/dashboard/banner/actions/get-banner";
import {BookingSection} from "@/components/shared/booking-section";
import {ServiceBenefitsSection} from "@/components/home/service-benefits-section";
import {TestimonialCarousel} from "@/components/home/testimonial-carousel";
import { HomepageSectionsGrid } from "@/components/home/homepage-sections-grid";

/**
 * Root page for @categoryContent slot (at `/`).
 * This is needed in addition to default.tsx because:
 * - default.tsx only renders on hard navigation (refresh)
 * - page.tsx renders on both soft and hard navigation
 * 
 * Without this, soft navigating from `/categorySlug` to `/` 
 * would keep showing the category content instead of the banner.
 */
export default async function CategoryContentRootPage() {
    const banner = await getBannerWithImages();

    return (
        <>
            <div className={"content-container"}>
                <BannerSection banner={banner} />
                <HomepageSectionsGrid />
                <BookingSection/>
            </div>
            <ServiceBenefitsSection />

            <div className={"content-container"}>
                <TestimonialCarousel/>
                <BookingSection/>
            </div>
        </>
    );
}
