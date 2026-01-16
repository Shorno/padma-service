"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Service, ServiceImage } from "@/db/schema/service"
import { Category, SubCategory } from "@/db/schema/category"
import EditServiceDialog from "./edit-service-dialog"
import DeleteServiceDialog from "./delete-service-dialog"
import { useTranslations } from "next-intl"

export interface ServiceWithRelations extends Service {
    images: ServiceImage[]
    category: Category
    subCategory: SubCategory | null
}

export function useServiceColumns() {
    const t = useTranslations('services');

    const columns: ColumnDef<ServiceWithRelations>[] = [
        {
            accessorKey: "image",
            header: t('image'),
            cell: ({ row }) => (
                <div className="w-16 h-16 relative">
                    <Image
                        src={row.getValue("image")}
                        alt={row.getValue("name")}
                        fill
                        className="object-cover rounded-md"
                    />
                </div>
            ),
            enableSorting: false,
            size: 80,
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
                <div className="font-medium">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "category",
            header: () => <div className="text-center">{t('category')}</div>,
            cell: ({ row }) => {
                const service = row.original
                return (
                    <div className="text-center">
                        <div className="font-medium">{service.category.name}</div>
                        {service.subCategory && (
                            <div className="text-xs text-muted-foreground">
                                {service.subCategory.name}
                            </div>
                        )}
                    </div>
                )
            },
        },
        {
            accessorKey: "description",
            header: () => <div className="text-center">{t('description')}</div>,
            cell: ({ row }) => {
                const description = row.getValue("description") as string | null
                return (
                    <div className="text-center max-w-xs truncate">
                        {description ? description.substring(0, 50) + (description.length > 50 ? '...' : '') : '-'}
                    </div>
                )
            },
        },
        {
            accessorKey: "isPublished",
            header: () => <div className="text-center">{t('status')}</div>,
            cell: ({ row }) => {
                const isPublished = row.getValue("isPublished") as boolean
                return (
                    <div className="flex justify-center">
                        <Badge variant={isPublished ? "default" : "secondary"}>
                            {isPublished ? t('published') : t('draft')}
                        </Badge>
                    </div>
                )
            },
        },
        {
            accessorKey: "isFeatured",
            header: () => <div className="text-center">{t('featured')}</div>,
            cell: ({ row }) => {
                const isFeatured = row.getValue("isFeatured") as boolean
                return (
                    <div className="flex justify-center">
                        <Badge variant={isFeatured ? "default" : "outline"}>
                            {isFeatured ? t('yes') : t('no')}
                        </Badge>
                    </div>
                )
            },
        },
        {
            id: "actions",
            header: () => <div className="text-center">{t('actions')}</div>,
            enableHiding: false,
            cell: ({ row }) => {
                const service = row.original

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
                                <EditServiceDialog service={service} />
                                <DeleteServiceDialog
                                    serviceId={service.id}
                                    serviceName={service.name}
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
