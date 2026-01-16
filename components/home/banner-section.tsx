import Image from "next/image";
import Link from "next/link";
import { type Banner } from "@/db/schema/banner";

interface BannerSectionProps {
    banner: Banner | null | undefined;
}

export function BannerSection({ banner }: BannerSectionProps) {
    if (!banner) return null;

    const content = (
        <section className="bg-white">
            <div className="container mx-auto px-4">
                {/* Title */}
                <h2 className="text-center text-lg md:text-xl font-semibold text-black my-4 md:my-8">
                    {banner.title}
                </h2>

                {/* Banner Image */}
                <div className="relative w-full h-32 sm:h-40 md:h-48 lg:h-56 overflow-hidden rounded-lg">
                    <Image
                        src={banner.image}
                        alt={banner.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>
        </section>
    );

    // Wrap in link if link exists
    if (banner.link) {
        return (
            <Link href={banner.link} className="block hover:opacity-95 transition-opacity">
                {content}
            </Link>
        );
    }

    return content;
}
