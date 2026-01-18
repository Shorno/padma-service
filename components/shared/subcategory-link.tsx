"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

interface SubcategoryLinkProps {
    categorySlug: string;
    subcategorySlug: string;
    children: React.ReactNode;
    className?: string;
}

/**
 * Subcategory link with dual navigation:
 * - Normal click → navigates to homepage parallel route (fast, SPA-like)
 * - Right-click/Ctrl+click/Open in new tab → uses full SEO URL
 */
export function SubcategoryLink({
    categorySlug,
    subcategorySlug,
    children,
    className,
}: SubcategoryLinkProps) {
    const router = useRouter();

    const fullHref = `/category/${categorySlug}/subcategory/${subcategorySlug}`;

    const shortHref = `/${categorySlug}`;

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        // Allow Ctrl+click, Cmd+click, middle-click to open in new tab normally
        if (e.ctrlKey || e.metaKey || e.button === 1) {
            return;
        }

        // Prevent default navigation and use short URL
        e.preventDefault();
        router.push(shortHref);
    };

    return (
        <Link
            href={fullHref}
            onClick={handleClick}
            className={className}
        >
            {children}
        </Link>
    );
}
