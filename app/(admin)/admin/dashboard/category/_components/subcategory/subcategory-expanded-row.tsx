"use client"

import { SubCategory } from "@/db/schema/category"
import { CategoryWithSubcategories } from "../category/category-columns"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import EditSubcategoryDialog from "./edit-subcategory-dialog"
import DeleteSubcategoryDialog from "./delete-subcategory-dialog"

interface SubcategoryExpandedRowProps {
    category: CategoryWithSubcategories
}

export default function SubcategoryExpandedRow({ category }: SubcategoryExpandedRowProps) {
    const subcategories = category.subCategory

    if (subcategories.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-4">
                No subcategories found
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground">
                Subcategories ({subcategories.length})
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {subcategories.map((subcategory) => (
                    <SubcategoryCard
                        key={subcategory.id}
                        subcategory={subcategory}
                        categoryName={category.name}
                    />
                ))}
            </div>
        </div>
    )
}

interface SubcategoryCardProps {
    subcategory: SubCategory
    categoryName: string
}

function SubcategoryCard({ subcategory, categoryName }: SubcategoryCardProps) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg border bg-background hover:bg-accent/50 transition-colors">
            {/* Logo/Image */}
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
                        N/A
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                    {subcategory.name}
                </div>
            </div>

            {/* Status */}
            <Badge
                variant={subcategory.isActive ? "default" : "secondary"}
                className="text-xs shrink-0"
            >
                {subcategory.isActive ? "Active" : "Inactive"}
            </Badge>

            {/* Actions */}
            <div className="flex gap-1 shrink-0">
                <EditSubcategoryDialog
                    subcategory={subcategory}
                    trigger={
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Pencil className="h-3 w-3" />
                        </Button>
                    }
                />
                <DeleteSubcategoryDialog
                    subcategory={subcategory}
                    trigger={
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    }
                />
            </div>
        </div>
    )
}
