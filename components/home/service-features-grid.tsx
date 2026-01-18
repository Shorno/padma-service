"use client";

import { Phone, Shield, CreditCard, HeadphonesIcon } from "lucide-react";

const features = [
    {
        icon: Phone,
        label: "২৪ ঘন্টা সার্ভিস",
    },
    {
        icon: Shield,
        label: "২৪ ঘন্টা নিরাপদ সার্ভিস",
    },
    {
        icon: CreditCard,
        label: "নিরাপদ লেন-দেন",
    },
    {
        icon: HeadphonesIcon,
        label: "২৪ ঘন্টা সাপোর্ট",
    },
];

export function ServiceFeaturesGrid() {
    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Header */}
            <h2 className="text-xl lg:text-[22px] text-service-benefits-text font-normal">
                আমাদের সার্ভিসের সুবিধা!
            </h2>

            {/* 2x2 Features Grid - matches image height (210px on lg) */}
            <div className="grid grid-cols-2 gap-[10px]">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="flex flex-row items-center gap-3 pl-3 lg:pl-5 
                                   bg-service-benefits-card-bg rounded
                                   h-[65px] lg:h-[100px]"
                    >
                        <feature.icon
                            className="w-6 h-6 lg:w-[35px] lg:h-[35px] text-service-benefits-icon flex-shrink-0"
                            strokeWidth={1.5}
                        />
                        <span className="text-sm lg:text-lg text-service-benefits-text leading-tight">
                            {feature.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
