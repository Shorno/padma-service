"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ServiceWithRelations } from "./service-columns"
import DeleteServiceDialog from "./delete-service-dialog"

interface ServiceCardProps {
    service: ServiceWithRelations
}

export default function ServiceCard({ service }: ServiceCardProps) {
    return (
        <div className="rounded-lg border bg-card p-3">
            <div className="flex gap-3">
                {/* Image */}
                <div className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden bg-muted">
                    <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium truncate">{service.name}</h3>
                        <div className="flex items-center gap-1 shrink-0">
                            <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                                <Link href={service.subCategory
                                    ? `/category/${service.category.slug}/subcategory/${service.subCategory.slug}/${service.slug}`
                                    : `/category/${service.category.slug}/${service.slug}`
                                } target="_blank">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                                <Link href={`/admin/dashboard/services/${service.id}/edit`}>
                                    <Pencil className="h-3.5 w-3.5" />
                                </Link>
                            </Button>
                            <DeleteServiceDialog
                                serviceId={service.id}
                                serviceName={service.name}
                                iconOnly
                            />
                        </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                        {service.category.name}
                        {service.subCategory && ` / ${service.subCategory.name}`}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <Badge variant={service.isPublished ? "default" : "secondary"} className="text-xs">
                            {service.isPublished ? "Published" : "Draft"}
                        </Badge>
                        {service.isFeatured && (
                            <Badge variant="outline" className="text-xs">
                                Featured
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
