"use client";

import { Home, Menu, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState("");

    const menuItems = [
        { label: "সকল সার্ভিস", href: "/services" },
        { label: "আমাদের সার্ভিস বিষয় জানুন", href: "/about-services" },
        { label: "আমাদের পরিচিতি", href: "/about" },
        { label: "আমাদের সাথে যোগাযোগ", href: "/contact" },
        { label: "আমাদের ঠিকানা", href: "/address" },
    ];

    return (
        <nav className="flex flex-col">
            {/* Main navbar content */}
            <div className="bg-navbar-primary pt-3 pb-0 min-h-30">
                <div className="content-container mx-auto">
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                        {/* Left Section: Logo and Contact */}
                        <div className="flex flex-col items-start flex-shrink min-w-0">
                            {/* Logo Row */}
                            <Link className="flex items-center gap-2" href={"/"}>
                                <Image
                                    src="/logos/call-icon.svg"
                                    alt="পদ্মা সার্ভিস"
                                    width={32}
                                    height={32}
                                    className="rounded-full border border-navbar-light"
                                />
                                <span
                                    className="text-navbar-light font-black text-lg"
                                    style={{ fontSize: 'var(--navbar-font-brand)' }}
                                >
                                    পদ্মা সার্ভিস
                                </span>
                            </Link>

                            {/* Phone Number Tag + Mobile All Services - Same Row */}
                            <div className="flex items-center gap-2 mt-2">
                                {/* Phone Number Tag */}
                                <div
                                    className="flex items-center bg-navbar-light border border-navbar-border px-2 h-8"
                                    style={{ borderRadius: 'var(--navbar-radius-md)' }}
                                >
                                    <span
                                        className="bg-navbar-primary text-navbar-light text-xs px-2 py-0.5 font-semibold"
                                        style={{
                                            borderRadius: 'var(--navbar-radius-sm)',
                                            fontSize: 'var(--navbar-font-btn)'
                                        }}
                                    >
                                        ক্লিক
                                    </span>
                                    <a
                                        href="tel:01755997447"
                                        className="text-navbar-text-dark text-sm font-normal ml-1"
                                        style={{ fontSize: 'var(--navbar-font-btn)' }}
                                    >
                                        01755997447
                                    </a>
                                </div>

                                {/* Mobile All Services Button - Same height as call button */}
                                <Button
                                    asChild
                                    className="md:hidden bg-navbar-deep hover:bg-navbar-deep/90 text-xs  text-navbar-light font-semibold px-3 h-8  whitespace-nowrap"
                                    style={{ borderRadius: 'var(--navbar-radius-md)' }}
                                >
                                    <Link href="/services">
                                        সকল <br/> সার্ভিস
                                    </Link>
                                </Button>
                            </div>

                            {/* Tagline */}
                            <span
                                className="text-navbar-light text-xs mt-2 font-semibold"
                                style={{ fontSize: 'var(--navbar-font-tagline)' }}
                            >
                                এক ক্লিকে সকল সার্ভিস
                            </span>
                        </div>

                        {/* Center Section: Search */}
                        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
                            <div className="relative flex-1">
                                <Input
                                    type="text"
                                    placeholder="সার্চ করুন..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-navbar-light text-navbar-text-dark pr-10 h-9 border-0"
                                    style={{ borderRadius: 'var(--navbar-radius-md)' }}
                                />
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute right-0 top-0 h-9 w-9 text-navbar-text-muted hover:text-navbar-text-dark"
                                >
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button
                                asChild
                                className="bg-navbar-deep hover:bg-navbar-deep/90 text-navbar-light font-semibold px-4 h-9 whitespace-nowrap"
                                style={{
                                    borderRadius: 'var(--navbar-radius-md)',
                                    fontSize: 'var(--navbar-font-link)'
                                }}
                            >
                                <Link href="/services">
                                    সকল সার্ভিস
                                </Link>
                            </Button>
                        </div>

                        {/* Right Section: Home and Menu */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            {/* Mobile Search Icon - near menu */}
                            <Button
                                size="icon"
                                variant="ghost"
                                className="md:hidden text-navbar-light hover:bg-navbar-light/10"
                            >
                                <Search className="h-7! w-7! mt-2" />
                            </Button>

                            <Link
                                href="/"
                                className="hidden md:flex text-navbar-light hover:text-navbar-light/80 transition-colors"
                            >
                                <div className="flex flex-col items-center">
                                    <Home className="h-6! w-6!" />
                                </div>
                            </Link>

                            {/* Mobile Menu - Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-navbar-light hover:bg-navbar-light/10"
                                    >
                                        <Menu className="h-7! w-7! sm:h-6! sm:w-6! mt-2 sm:mt-0" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    sideOffset={55}
                                    className="w-[calc(100vw-32px)] sm:w-[486px] p-0 border-0 shadow-lg overflow-hidden rounded-md mx-4"
                                >
                                    {menuItems.map((item, index) => (
                                        <DropdownMenuItem key={index} asChild className="p-0 focus:bg-nav-link-primary/90">
                                            <Link
                                                href={item.href}
                                                className="w-full h-10 flex items-center pl-[27px] text-base font-semibold bg-nav-link-primary text-white hover:bg-nav-link-primary/90 cursor-pointer"
                                            >
                                                {item.label}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                {/* White curved bottom section */}
                <div
                    className="w-full bg-navbar-light mt-4"
                    style={{
                        height: 'var(--navbar-curve-height)',
                        borderRadius: 'var(--navbar-radius-curve) var(--navbar-radius-curve) 0 0'
                    }}
                />
            </div>
        </nav>
    );
}
