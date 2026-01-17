"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SubCategory } from "@/db/schema/category"
import DeleteSubcategoryDialog from "./delete-subcategory-dialog"

interface SubcategoryCardProps {
    subcategory: SubCategory
    categoryId: number
}

export default function SubcategoryCard({ subcategory, categoryId }: SubcategoryCardProps) {
    return (
        <div className="rounded-lg border bg-card shadow-sm">
            <div className="flex items-center gap-3 p-3">
                {/* Logo */}
                <div className="relative w-10 h-10 shrink-0 rounded-md overflow-hidden bg-muted">
                    {subcategory.logo ? (
                        <Image
                            src={subcategory.logo}
                            alt={subcategory.name}
                            fill
                            className="object-contain"
                        />
                    ) : subcategory.image ? (
                        <Image
                            src={subcategory.image}
                            alt={subcategory.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                            —
                        </div>
                    )}
                </div>

                {/* Name, Slug & Order */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{subcategory.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{subcategory.slug}</span>
                </div>

                {/* Status Badge */}
                <Badge
                    variant={subcategory.isActive ? "default" : "secondary"}
                    className="shrink-0 text-xs"
                >
                    {subcategory.isActive ? "Active" : "Inactive"}
                </Badge>

                {/* Action Icons */}
                <div className="flex items-center gap-1 shrink-0">
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link href={`/admin/dashboard/category/${categoryId}/subcategory/${subcategory.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                        </Link>
                    </Button>
                    <DeleteSubcategoryDialog
                        subcategory={subcategory}
                        trigger={
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        }
                    />
                </div>
            </div>
        </div>
    )
}
