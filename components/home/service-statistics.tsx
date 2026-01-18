"use client";

const statistics = [
    {
        count: "17,380 +",
        label: "বিশ্বস্ত ক্লায়েন্ট",
    },
    {
        count: "130 +",
        label: "বিজনেস পার্টনার",
    },
    {
        count: "15,000 +",
        label: "রেগুলার ক্লায়েন্ট",
    },
];

export function ServiceStatistics() {
    return (
        <div className="flex flex-row items-start justify-between md:justify-start gap-4 sm:gap-8 lg:gap-16">
            {statistics.map((stat, index) => (
                <div
                    key={index}
                    className="flex flex-col gap-0.5 sm:gap-1"
                >
                    <span className="text-base sm:text-xl lg:text-[25px] font-semibold text-service-benefits-text">
                        {stat.count}
                    </span>
                    <span className="text-xs sm:text-base lg:text-xl text-service-benefits-text font-normal">
                        {stat.label}
                    </span>
                </div>
            ))}
        </div>
    );
}
