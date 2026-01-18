"use client";

import Image from "next/image";

interface TeamImageSectionProps {
    imageSrc?: string;
}

export function TeamImageSection({ imageSrc }: TeamImageSectionProps) {
    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Header */}
            <h2 className="text-xl lg:text-[22px] text-service-benefits-text font-normal">
                আমরা সার্ভিসের জন্য প্রস্তত!
            </h2>

            {/* Team Image - matches features grid height (210px on lg) */}
            <div className="relative w-full h-[140px] lg:h-[210px] rounded overflow-hidden bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt="Our Service Team"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 485px"
                    />
                ) : (
                    <span className="text-white text-sm opacity-75">Team Image Placeholder</span>
                )}
            </div>
        </div>
    );
}
