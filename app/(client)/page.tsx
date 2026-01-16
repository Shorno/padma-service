import type { Metadata } from "next";
import {ModeToggle} from "@/components/mode-toggle";

export const metadata: Metadata = {
    title: "Home",
    description: "Discover our carefully curated selection of pure honey and premium nuts, sourced from the finest producers. Shop premium natural organic products at KhaatiBazar.",
};

export default function HomePage() {
    return (
        <>
            <ModeToggle/>

        </>
    )
}
