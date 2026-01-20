"use client";

import {Home, Menu, Search} from "lucide-react";
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
        <nav className="flex flex-col sticky top-0 z-50">
            {/* Main navbar content */}
            <div className="bg-navbar-primary pt-2 pb-0 min-h-[123px] md:min-h-30">
                <div className="content-container mx-auto">
                    {/* Mobile Layout (< md) */}
                    <div className="flex md:hidden items-start justify-between pt-2">
                        {/* Left Section: Logo, Phone, Tagline */}
                        <div className="flex flex-col items-start gap-1.5">
                            {/* Logo Row with brand name */}
                            <div className="flex flex-col gap-1.5">
                                <Link className="flex items-center gap-[5px]" href={"/"}>
                                    <Image
                                        src="/logos/call-icon.svg"
                                        alt="পদ্মা সার্ভিস"
                                        width={33}
                                        height={33}
                                        className="rounded-full border border-navbar-light"
                                    />
                                    <span className="text-navbar-light font-bold text-lg leading-[22px]">
                                        পদ্মা সার্ভিস
                                    </span>
                                </Link>

                                {/* Phone Number Tag */}
                                <div
                                    className="flex items-center justify-center bg-navbar-light border border-navbar-border px-2.5 h-[30px] w-[137px] gap-[3px]"
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span
                                        className="flex items-center justify-center bg-[#E93A85] text-navbar-light font-semibold px-2.5 h-[23px] w-[33px]"
                                        style={{
                                            borderRadius: '4px',
                                            fontSize: '13px',
                                            lineHeight: '16px',
                                        }}
                                    >
                                        ক্লিক
                                    </span>
                                    <a
                                        href="tel:01755997447"
                                        className="text-navbar-text-dark font-normal"
                                        style={{
                                            fontSize: '14.5px',
                                            lineHeight: '18px',
                                        }}
                                    >
                                        01755997447
                                    </a>
                                </div>
                            </div>

                            {/* Tagline */}
                            <span
                                className="text-navbar-light font-semibold"
                                style={{
                                    fontSize: '13px',
                                    lineHeight: '17px',
                                }}
                            >
                                এক ক্লিকে সকল সার্ভিস
                            </span>
                        </div>

                        {/* Right Section: All Services, Search, Home, Menu */}
                        <div className="flex items-center gap-[12px] mt-[39px]">
                            {/* All Services Button */}
                            <Button
                                asChild
                                className="flex items-center justify-center bg-[rgba(210,12,109,0.6)] hover:bg-[rgba(210,12,109,0.7)] text-navbar-light font-semibold
                                w-12 h-[30px] p-0"
                                style={{
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    lineHeight: '16px',
                                }}
                            >
                                <Link href="/services" className="text-center leading-tight">
                                    সকল<br />সার্ভিস
                                </Link>
                            </Button>

                            {/* Search Icon with background */}
                            <Button
                                size="icon"
                                variant="ghost"
                                className="bg-white/80 size-[30px] hover:bg-white/90 rounded"
                            >
                                <Search className="text-[#999085]" />
                            </Button>

                            {/* Home Icon */}
                            <Link
                                href="/"
                                className="flex items-center justify-center w-[32px] h-[32px] text-white/80 hover:text-white transition-colors"
                            >
                                <Home strokeWidth={2} size={30} />
                            </Link>

                            {/* Menu Icon (Hamburger) */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    {/*<Button*/}
                                    {/*    variant="ghost"*/}
                                    {/*    className="flex flex-col justify-center items-center gap-[4px] w-[28px] h-[27px] p-0 hover:bg-transparent"*/}
                                    {/*>*/}
                                    {/*    <span className="w-[22px] h-0 border-2 border-white rounded" />*/}
                                    {/*    <span className="w-[22px] h-0 border-2 border-white rounded" />*/}
                                    {/*    <span className="w-[22px] h-0 border-2 border-white rounded" />*/}
                                    {/*</Button>*/}
                                    <Menu className={"text-white"} size={30}/>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    sideOffset={35}
                                    className="w-[calc(100vw-32px)] p-0 border-0 shadow-lg overflow-hidden rounded-md mx-4"
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

                    {/* Desktop Layout (>= md) */}
                    <div className="hidden md:flex items-center justify-between gap-4">
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

                            {/* Phone Number Tag */}
                            <div className="flex items-center gap-2 mt-2">
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
                        <div className="flex items-center gap-2 flex-1 max-w-md">
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
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <Link
                                href="/"
                                className="text-navbar-light hover:text-navbar-light/80 transition-colors"
                            >
                                <div className="flex flex-col items-center">
                                    <Home className="h-6 w-6" />
                                </div>
                            </Link>

                            {/* Desktop Menu - Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-navbar-light hover:bg-navbar-light/10"
                                    >
                                        <Menu className="h-6 w-6" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    sideOffset={55}
                                    className="w-[486px] p-0 border-0 shadow-lg overflow-hidden rounded-md"
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
