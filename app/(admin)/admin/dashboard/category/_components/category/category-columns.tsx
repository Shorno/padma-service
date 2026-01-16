"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Category, SubCategory } from "@/db/schema/category"
import NewSubcategoryDialog from "../subcategory/new-subcategory-dialog"
import EditCategoryDialog from "@/app/(admin)/admin/dashboard/category/_components/category/edit-category-dialog";
import DeleteCategoryDialog from "@/app/(admin)/admin/dashboard/category/_components/category/delete-category-dialog";
import { useTranslations } from "next-intl"

export interface CategoryWithSubcategories extends Category {
    subCategory: SubCategory[]
}

export function useCategoryColumns() {
    const t = useTranslations('categories');

    const columns: ColumnDef<CategoryWithSubcategories>[] = [
        {
            id: "expand",
            header: () => null,
            cell: ({ row }) => {
                const hasSubcategories = row.original.subCategory.length > 0
                return hasSubcategories ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => row.toggleExpanded()}
                    >
                        {row.getIsExpanded() ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </Button>
                ) : (
                    <div className="w-8" />
                )
            },
            size: 40,
        },
        {
            accessorKey: "logo",
            header: t('logo'),
            cell: ({ row }) => {
                const logo = row.getValue("logo") as string | null
                return logo ? (
                    <div className="w-12 h-12 relative">
                        <Image
                            src={logo}
                            alt={`${row.getValue("name")} logo`}
                            fill
                            className="object-contain rounded-md"
                        />
                    </div>
                ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-muted rounded-md text-xs text-muted-foreground">
                        N/A
                    </div>
                )
            },
            enableSorting: false,
            size: 60,
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            {t('name')}
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className="text-center font-medium">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "isActive",
            header: () => <div className="text-center">{t('status')}</div>,
            cell: ({ row }) => {
                const isActive = row.getValue("isActive") as boolean
                return (
                    <div className="flex justify-center">
                        <Badge variant={isActive ? "default" : "secondary"}>
                            {isActive ? t('active') : t('inactive')}
                        </Badge>
                    </div>
                )
            },
            size: 100,
        },
        {
            accessorKey: "displayOrder",
            header: ({ column }) => {
                return (
                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            {t('displayOrder')}
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className="text-center">{row.getValue("displayOrder")}</div>
            ),
            size: 150,
        },
        {
            id: "subcategories",
            header: () => <div className="text-center">{t('subcategories')}</div>,
            cell: ({ row }) => {
                const category = row.original
                const count = category.subCategory.length
                return (
                    <div className="flex justify-center gap-2 items-center">
                        <Badge variant="outline" className="font-normal">
                            {count} {count === 1 ? 'subcategory' : 'subcategories'}
                        </Badge>
                        <NewSubcategoryDialog
                            categoryId={category.id}
                            categoryName={category.name}
                        />
                    </div>
                )
            },
            size: 180,
        },
        {
            id: "actions",
            header: () => <div className="text-center">{t('actions')}</div>,
            enableHiding: false,
            cell: ({ row }) => {
                const category = row.original

                return (
                    <div className="flex justify-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">{t('openMenu')}</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <EditCategoryDialog category={category} />
                                <DropdownMenuSeparator />
                                <DeleteCategoryDialog
                                    category={category}
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        },
    ]

    return columns;
}
