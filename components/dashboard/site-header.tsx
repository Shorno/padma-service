"use client"
import { Button } from "@/components/ui/button"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname, useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { LogOutIcon } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import React from "react"
import { LanguageSwitcher } from "@/components/language-switcher";

export function SiteHeader() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogOut = async () => {
        const { error } = await authClient.signOut()
        if (!error) {
            toast.success("Logged out successfully")
            router.replace("/")
        }
    }

    const pathSegments = pathname.split('/').filter(Boolean)
    const dashboardIndex = pathSegments.indexOf('dashboard')
    const breadcrumbSegments = dashboardIndex !== -1
        ? pathSegments.slice(dashboardIndex + 1)
        : []

    // For mobile: show only first and last segment with ellipsis in between
    const shouldCollapse = breadcrumbSegments.length > 2

    return (
        <header
            className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />

                {breadcrumbSegments.length > 0 ? (
                    <Breadcrumb className="min-w-0 flex-1">
                        <BreadcrumbList className="flex-nowrap">
                            {/* Dashboard - always visible */}
                            <BreadcrumbItem className="hidden sm:inline-flex">
                                <BreadcrumbLink asChild>
                                    <Link href="/admin/dashboard">Dashboard</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden sm:inline-flex" />

                            {/* Desktop: Show all segments */}
                            {breadcrumbSegments.map((segment, index) => {
                                const href = `/admin/dashboard/${breadcrumbSegments.slice(0, index + 1).join('/')}`
                                const isLast = index === breadcrumbSegments.length - 1
                                const label = segment.charAt(0).toUpperCase() + segment.slice(1)

                                return (
                                    <React.Fragment key={href}>
                                        {index > 0 && <BreadcrumbSeparator className="hidden sm:inline-flex" />}
                                        <BreadcrumbItem className="hidden sm:inline-flex">
                                            {isLast ? (
                                                <BreadcrumbPage className="truncate max-w-[150px]">{label}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link href={href}>{label}</Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                )
                            })}

                            {/* Mobile: Show ellipsis if too long, otherwise show segments */}
                            {shouldCollapse ? (
                                <>
                                    <BreadcrumbItem className="sm:hidden">
                                        <BreadcrumbEllipsis />
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="sm:hidden" />
                                    <BreadcrumbItem className="sm:hidden">
                                        <BreadcrumbPage className="truncate max-w-[120px]">
                                            {breadcrumbSegments[breadcrumbSegments.length - 1].charAt(0).toUpperCase() +
                                                breadcrumbSegments[breadcrumbSegments.length - 1].slice(1)}
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </>
                            ) : (
                                breadcrumbSegments.map((segment, index) => {
                                    const href = `/admin/dashboard/${breadcrumbSegments.slice(0, index + 1).join('/')}`
                                    const isLast = index === breadcrumbSegments.length - 1
                                    const label = segment.charAt(0).toUpperCase() + segment.slice(1)

                                    return (
                                        <React.Fragment key={`mobile-${href}`}>
                                            {index > 0 && <BreadcrumbSeparator className="sm:hidden" />}
                                            <BreadcrumbItem className="sm:hidden">
                                                {isLast ? (
                                                    <BreadcrumbPage className="truncate max-w-[120px]">{label}</BreadcrumbPage>
                                                ) : (
                                                    <BreadcrumbLink asChild>
                                                        <Link href={href}>{label}</Link>
                                                    </BreadcrumbLink>
                                                )}
                                            </BreadcrumbItem>
                                        </React.Fragment>
                                    )
                                })
                            )}
                        </BreadcrumbList>
                    </Breadcrumb>
                ) : (
                    <h1 className="text-base font-medium">Dashboard</h1>
                )}

                <div className="ml-auto flex items-center gap-2">
                    <Button
                        variant="destructive"
                        size="sm"
                        className="hidden sm:flex cursor-pointer"
                        onClick={handleLogOut}
                    >
                        <LogOutIcon />
                        <span>Logout</span>
                    </Button>
                    <LanguageSwitcher />
                </div>
            </div>
        </header>
    )
}
