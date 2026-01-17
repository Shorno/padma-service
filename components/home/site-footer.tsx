"use client";

import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
    return (
        <footer className="bg-white pt-20">
            {/* Pink divider line */}
            <div className="w-full border border-nav-link-primary" />

            {/* Main footer content */}
            <div className="container mx-auto px-4 md:px-4 py-6">
                <div className="flex flex-col md:flex-row gap-8 md:gap-2">
                    {/* Column 1: Download App Section - Last on mobile, first on desktop */}
                    <div className="flex flex-col gap-5 md:w-1/3 order-last md:order-first">
                        <h3 className="text-sm font-semibold text-[#2F3432]">
                            ডাউনলোড করুন আমাদের মোবাইল অ্যাপ
                        </h3>
                        <div className="flex justify-start items-center gap-4 -m-2 -my-10">
                            <Link href="#" className="block">
                                <Image
                                    src="/logos/google-play.png"
                                    alt="Get it on Google Play"
                                    width={200}
                                    height={50}
                                    className="w-auto h-24"
                                />
                            </Link>
                            <Link href="#" className="block">
                                <Image
                                    src="/logos/apple-store-logo.png"
                                    alt="Download on App Store"
                                    width={200}
                                    height={50}
                                    className="h-10 w-auto md:-ml-4 lg:-ml-6"
                                />
                            </Link>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="text-sm text-[#2F3432]">
                                আমাদের সাথে যুক্ত হোন
                            </span>
                            <Link href="https://facebook.com" target="_blank">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z"
                                        fill="#1877F2"
                                    />
                                </svg>
                            </Link>
                        </div>
                        <Link href="#" className="text-sm text-[#0674DB] hover:underline">
                            আমাদের ফেসবুক পেইজে লাইক দিন
                        </Link>
                    </div>

                    {/* Column 2: Job Search Section */}
                    <div className="flex flex-col gap-5 md:w-1/4 md:pl-8">
                        <h3 className="text-sm font-semibold text-[#2F3432]">
                            ভাল চাকরি পেতে
                        </h3>
                        <div className="flex flex-col gap-2">
                            <Link href="#" className="text-sm text-[#0674DB] hover:underline">
                                নির্দিস্ট পদে চাকরি খুজুন
                            </Link>
                            <Link href="#" className="text-sm text-[#0674DB] hover:underline">
                                এখানেই সিভি জমাদিন (ফ্রি)
                            </Link>
                            <Link href="#" className="text-sm text-[#0674DB] hover:underline">
                                ব্যানার ও বিজ্ঞাপন
                            </Link>
                        </div>
                    </div>

                    {/* Column 3: Recruitment Section */}
                    <div className="flex flex-col gap-5 md:w-1/4">
                        <h3 className="text-sm font-semibold text-[#2F3432]">
                            চাকরির নিয়োগ দিন
                        </h3>
                        <div className="flex flex-col gap-2">
                            <Link href="#" className="text-sm text-[#0674DB] hover:underline">
                                দক্ষ জনবল পেতে
                            </Link>
                            <Link href="#" className="text-sm text-[#0674DB] hover:underline">
                                বিজ্ঞাপন দিন
                            </Link>
                            <Link href="#" className="text-sm text-[#0674DB] hover:underline">
                                বিভিন্ন ক্যাটাগরিতে বিজ্ঞাপন দিন
                            </Link>
                        </div>
                    </div>

                    {/* Column 4: About Section */}
                    <div className="flex flex-col gap-4 md:w-1/4">
                        <h3 className="text-sm font-semibold text-[#2F3432]">
                            আমাদের সম্পর্কে
                        </h3>
                        <div className="flex flex-col gap-2">
                            <Link href="/about" className="text-sm text-[#0674DB] hover:underline">
                                আমাদের কথা
                            </Link>
                            <Link href="#" className="text-sm text-[#0674DB] hover:underline">
                                পেশা
                            </Link>
                            <Link href="/terms" className="text-sm text-[#0674DB] hover:underline">
                                শর্তাবলী ও নীতিমালা
                            </Link>
                            <Link href="/privacy" className="text-sm text-[#0674DB] hover:underline">
                                গোপনীয়তা এবং নীতিমালা
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
