import Image from "next/image";

interface BookingSectionProps {
    variant?: "compact" | "full";
    className?: string;
}

/**
 * Reusable booking section component with phone icon, tagline, and phone number
 * Can be used on service detail pages, subcategory pages, etc.
 */
export function BookingSection({ variant = "full", className = "" }: BookingSectionProps) {
    return (
        <div className={`flex flex-col items-center gap-3 py-4 ${className}`}>
            {/* Booking Tagline */}
            <div className="flex items-center justify-center gap-2">
                <Image
                    src="/logos/call-icon.svg"
                    alt="Phone"
                    width={24}
                    height={24}
                    className="flex-shrink-0"
                />
                <span
                    className="text-lg font-medium"
                    style={{ color: 'var(--booking-tagline)' }}
                >
                    মোবাইলে বুকিং | কম খরচ | নিরাপত্তা
                </span>
            </div>

            {/* Service Time */}
            <span className="text-sm font-medium text-gray-700">
                ৩০ মিনিটেই সার্ভিস
            </span>

            {/* Phone Button */}
            <a
                href="tel:01755997447"
                className="flex items-center bg-black text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
                <span className="bg-navbar-primary text-white px-2 py-1 rounded mr-2 text-xs font-semibold">
                    ক্লিক
                </span>
                01755997447
            </a>

            {variant === "full" && (
                <>
                    {/* Brand Section */}
                    <div className="flex items-center gap-2 mt-2">
                        <Image
                            src="/logos/call-icon.svg"
                            alt="পদ্মা সার্ভিস"
                            width={28}
                            height={28}
                        />
                        <span className="text-lg font-bold text-pink-600">
                            পদ্মা সার্ভিস
                        </span>
                    </div>
                    <span className="text-sm text-black font-semibold">
                        এক ক্লিকে সকল সার্ভিস
                    </span>
                </>
            )}
        </div>
    );
}
