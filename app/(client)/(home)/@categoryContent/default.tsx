import { BannerSection } from "@/components/home/banner-section";
import { getBannerWithImages } from "@/app/(admin)/admin/dashboard/banner/actions/get-banner";

/**
 * Default slot content when no category is selected (at `/`).
 * Shows the banner section.
 */
export default async function CategoryContentDefault() {
    const banner = await getBannerWithImages();

    return <BannerSection banner={banner} />;
}
