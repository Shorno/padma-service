"use client";

import { ServiceFeaturesGrid } from "./service-features-grid";
import { TeamImageSection } from "./team-image-section";
import { ServiceStatistics } from "./service-statistics";

export function ServiceBenefitsSection() {
    return (
        <section className="w-full bg-service-benefits-bg py-8 lg:py-12">
            <div className="container mx-auto px-4 md:px-6">
                {/* Content Row: Features Grid + Team Image side by side */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-10">
                    {/* Left Column - Service Features */}
                    <div className="w-full lg:w-1/2">
                        <ServiceFeaturesGrid />
                    </div>

                    {/* Right Column - Team Image */}
                    <div className="w-full lg:w-1/2">
                        <TeamImageSection imageSrc={"/images/team.png"} />
                    </div>
                </div>

                {/* Statistics Row */}
                <div className="mt-10 lg:mt-12">
                    <ServiceStatistics />
                </div>
            </div>
        </section>
    );
}
