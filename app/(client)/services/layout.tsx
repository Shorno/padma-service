import type { Metadata } from "next";
import { BookingSection } from "@/components/shared/booking-section";

export const metadata: Metadata = {
    title: "সকল সার্ভিস | পদ্মা সার্ভিস",
    description: "পদ্মা সার্ভিস - নিরাপত্তার জন্য পদ্মা সার্ভিস নিন। সকল সার্ভিস এক জায়গায়।",
};

export default function ServicesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            {/* Header Section - Shared across all services pages */}
            <div className="content-container  py-6 text-center">
                <h1 className="text-lg font-semibold text-gray-900 mb-2">
                    সকল সার্ভিস
                </h1>
                <p className="text-gray-600 text-sm md:text-base font-semibold">
                    নিরাপত্তার জন্য - পদ্মা সার্ভিস নিন
                </p>
            </div>

            {/* Page Content */}
            {children}

            {/* Booking Section - Shared across all services pages */}
            <div className="border-t border-gray-200">
                <BookingSection variant="full" className="py-8" />
            </div>
        </div>
    );
}
