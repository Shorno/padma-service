"use client"

import * as React from "react"
import { toast } from "sonner"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Loader,
    LayoutGrid,
    Plus,
    Pencil,
    Trash2,
} from "lucide-react"

import {
    getHomepageSections,
    deleteHomepageSection,
} from "@/app/actions/homepage-sections"
import type { HomepageSectionWithDetails } from "@/app/actions/homepage-sections/get-sections"

export default function HomepageSectionsPage() {
    const queryClient = useQueryClient()
    const [deletingSection, setDeletingSection] = React.useState<HomepageSectionWithDetails | null>(null)

    const { data: sections, isLoading } = useQuery({
        queryKey: ["admin-homepage-sections"],
        queryFn: getHomepageSections,
    })

    const deleteMutation = useMutation({
        mutationFn: deleteHomepageSection,
        onSuccess: (result) => {
            if (!result.success) {
                toast.error(result.error || "Failed to delete")
                return
            }
            queryClient.invalidateQueries({ queryKey: ["admin-homepage-sections"] })
            toast.success("Section deleted!")
            setDeletingSection(null)
        },
        onError: () => toast.error("An unexpected error occurred"),
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight">Homepage Sections</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage curated service collections for the homepage
                    </p>
                </div>
                <Button asChild className="w-full sm:w-auto">
                    <Link href="/admin/dashboard/homepage-sections/new">
                        <Plus className="h-4 w-4 mr-2" />
                        New Section
                    </Link>
                </Button>
            </div>

            <Separator />

            {/* Empty State */}
            {(!sections || sections.length === 0) && (
                <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center px-4">
                    <div className="rounded-full bg-muted p-4 mb-4">
                        <LayoutGrid className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No sections yet</h3>
                    <p className="text-muted-foreground text-sm mt-1 mb-4">
                        Create your first homepage section to curate services
                    </p>
                    <Button asChild>
                        <Link href="/admin/dashboard/homepage-sections/new">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Section
                        </Link>
                    </Button>
                </div>
            )}

            {/* Sections List */}
            {sections && sections.length > 0 && (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[60px]">Order</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Subcategory</TableHead>
                                    <TableHead className="w-[100px]">Services</TableHead>
                                    <TableHead className="w-[100px]">Status</TableHead>
                                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sections.map((section) => (
                                    <TableRow key={section.id}>
                                        <TableCell>
                                            <span className="font-mono text-sm">{section.displayOrder}</span>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {section.title || section.subCategory.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {section.subCategory.name}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{section.items.length}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={section.isActive ? "default" : "secondary"}>
                                                {section.isActive ? "Active" : "Hidden"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    asChild
                                                >
                                                    <Link href={`/admin/dashboard/homepage-sections/${section.id}/edit`}>
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => setDeletingSection(section)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                        {sections.map((section) => (
                            <div key={section.id} className="border rounded-lg p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-medium">
                                            {section.title || section.subCategory.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {section.subCategory.name}
                                        </p>
                                    </div>
                                    <Badge variant={section.isActive ? "default" : "secondary"}>
                                        {section.isActive ? "Active" : "Hidden"}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>Order: {section.displayOrder}</span>
                                    <span>{section.items.length} services</span>
                                </div>
                                <div className="flex justify-end gap-2 pt-2 border-t">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/admin/dashboard/homepage-sections/${section.id}/edit`}>
                                            <Pencil className="h-3.5 w-3.5 mr-1" />
                                            Edit
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setDeletingSection(section)}
                                        className="text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
                                    >
                                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Delete Confirmation */}
            <AlertDialog open={!!deletingSection} onOpenChange={() => setDeletingSection(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Section</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete &quot;{deletingSection?.title || deletingSection?.subCategory.name}&quot; section.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deletingSection && deleteMutation.mutate(deletingSection.id)}
                            className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending ? <Loader className="h-4 w-4 animate-spin" /> : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
