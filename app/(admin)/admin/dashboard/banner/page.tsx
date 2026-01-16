"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
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
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import ImageUploader from "@/components/ImageUploader"
import { Loader, ImageIcon, Plus, Pencil, Trash2, GalleryHorizontal, ExternalLink } from "lucide-react"
import { getAllBanners } from "./actions/get-banner"
import { upsertBanner, upsertBannerImage } from "./actions/upsert-banner"
import { deleteBanner, deleteBannerImage } from "./actions/delete-banner"
import { type Banner, type BannerImage } from "@/db/schema/banner"
import Image from "next/image"

type BannerWithImages = Banner & { images: BannerImage[] }

export default function BannerPage() {
    const queryClient = useQueryClient()
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [editingBanner, setEditingBanner] = React.useState<BannerWithImages | null>(null)
    const [deletingBanner, setDeletingBanner] = React.useState<Banner | null>(null)

    const [isImageDialogOpen, setIsImageDialogOpen] = React.useState(false)
    const [editingImage, setEditingImage] = React.useState<BannerImage | null>(null)
    const [selectedBannerId, setSelectedBannerId] = React.useState<number | null>(null)
    const [deletingImage, setDeletingImage] = React.useState<BannerImage | null>(null)

    const { data: banners, isLoading } = useQuery({
        queryKey: ["admin-banners"],
        queryFn: getAllBanners,
    })

    const upsertBannerMutation = useMutation({
        mutationFn: upsertBanner,
        onSuccess: (result) => {
            if (!result.success) {
                toast.error(result.error || "Failed to save banner")
                return
            }
            queryClient.invalidateQueries({ queryKey: ["admin-banners"] })
            toast.success(editingBanner ? "Banner updated!" : "Banner created!")
            setIsDialogOpen(false)
            setEditingBanner(null)
        },
        onError: () => toast.error("An unexpected error occurred"),
    })

    const upsertImageMutation = useMutation({
        mutationFn: upsertBannerImage,
        onSuccess: (result) => {
            if (!result.success) {
                toast.error(result.error || "Failed to save image")
                return
            }
            queryClient.invalidateQueries({ queryKey: ["admin-banners"] })
            toast.success(editingImage ? "Image updated!" : "Image added!")
            setIsImageDialogOpen(false)
            setEditingImage(null)
        },
        onError: () => toast.error("An unexpected error occurred"),
    })

    const deleteBannerMutation = useMutation({
        mutationFn: deleteBanner,
        onSuccess: (result) => {
            if (!result.success) {
                toast.error(result.error || "Failed to delete")
                return
            }
            queryClient.invalidateQueries({ queryKey: ["admin-banners"] })
            toast.success("Banner deleted!")
            setDeletingBanner(null)
        },
        onError: () => toast.error("An unexpected error occurred"),
    })

    const deleteImageMutation = useMutation({
        mutationFn: deleteBannerImage,
        onSuccess: (result) => {
            if (!result.success) {
                toast.error(result.error || "Failed to delete")
                return
            }
            queryClient.invalidateQueries({ queryKey: ["admin-banners"] })
            toast.success("Image deleted!")
            setDeletingImage(null)
        },
        onError: () => toast.error("An unexpected error occurred"),
    })

    const handleAddImage = (bannerId: number) => {
        setSelectedBannerId(bannerId)
        setEditingImage(null)
        setIsImageDialogOpen(true)
    }

    const handleEditImage = (image: BannerImage) => {
        setSelectedBannerId(image.bannerId)
        setEditingImage(image)
        setIsImageDialogOpen(true)
    }

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
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight">Banner Management</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage homepage banners and carousel images
                    </p>
                </div>
                <Button
                    onClick={() => { setEditingBanner(null); setIsDialogOpen(true); }}
                    className="w-full sm:w-auto"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Banner
                </Button>
            </div>

            <Separator />

            {/* Empty State */}
            {(!banners || banners.length === 0) && (
                <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center px-4">
                    <div className="rounded-full bg-muted p-4 mb-4">
                        <GalleryHorizontal className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No banners yet</h3>
                    <p className="text-muted-foreground text-sm mt-1 mb-4">
                        Create your first banner to display on the homepage
                    </p>
                    <Button onClick={() => { setEditingBanner(null); setIsDialogOpen(true); }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Banner
                    </Button>
                </div>
            )}

            {/* Banners List */}
            {banners && banners.length > 0 && (
                <div className="space-y-6 md:space-y-8">
                    {banners.map((bannerItem) => (
                        <div key={bannerItem.id} className="space-y-4">
                            {/* Banner Header */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h2 className="text-base md:text-lg font-semibold">{bannerItem.title}</h2>
                                    <Badge variant={bannerItem.isActive ? "default" : "secondary"}>
                                        {bannerItem.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleAddImage(bannerItem.id)}
                                        className="flex-1 sm:flex-none"
                                    >
                                        <ImageIcon className="h-4 w-4 mr-2" />
                                        Add Image
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setEditingBanner(bannerItem)
                                            setIsDialogOpen(true)
                                        }}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setDeletingBanner(bannerItem)}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Images - Empty State */}
                            {bannerItem.images.length === 0 ? (
                                <div className="border-2 border-dashed rounded-lg p-6 md:p-8 text-center">
                                    <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        No images. Add images to create a carousel.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Desktop Table View */}
                                    <div className="hidden md:block border rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/50">
                                                    <TableHead className="w-[120px]">Preview</TableHead>
                                                    <TableHead>Link URL</TableHead>
                                                    <TableHead className="w-[100px]">Order</TableHead>
                                                    <TableHead className="w-[100px]">Status</TableHead>
                                                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {bannerItem.images.map((img) => (
                                                    <TableRow key={img.id}>
                                                        <TableCell>
                                                            <div className="relative w-24 h-14 rounded overflow-hidden bg-muted">
                                                                <Image
                                                                    src={img.image}
                                                                    alt="Banner"
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {img.link ? (
                                                                <span className="text-sm text-muted-foreground font-mono truncate block max-w-[300px]">
                                                                    {img.link}
                                                                </span>
                                                            ) : (
                                                                <span className="text-sm text-muted-foreground/50">No link</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="font-mono text-sm">{img.displayOrder}</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={img.isActive ? "default" : "secondary"} className="text-xs">
                                                                {img.isActive ? "Active" : "Hidden"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8"
                                                                    onClick={() => handleEditImage(img)}
                                                                >
                                                                    <Pencil className="h-3.5 w-3.5" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                    onClick={() => setDeletingImage(img)}
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
                                        {bannerItem.images.map((img) => (
                                            <div key={img.id} className="border rounded-lg p-3 space-y-3">
                                                <div className="flex gap-3">
                                                    <div className="relative w-20 h-14 rounded overflow-hidden bg-muted shrink-0">
                                                        <Image
                                                            src={img.image}
                                                            alt="Banner"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Badge variant={img.isActive ? "default" : "secondary"} className="text-xs">
                                                                {img.isActive ? "Active" : "Hidden"}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground font-mono">
                                                                Order: {img.displayOrder}
                                                            </span>
                                                        </div>
                                                        {img.link ? (
                                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                <ExternalLink className="h-3 w-3 shrink-0" />
                                                                <span className="truncate">{img.link}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground/50">No link</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-2 pt-2 border-t">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditImage(img)}
                                                    >
                                                        <Pencil className="h-3.5 w-3.5 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setDeletingImage(img)}
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

                            <Separator className="mt-6" />
                        </div>
                    ))}
                </div>
            )}

            {/* Banner Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingBanner ? "Edit Banner" : "New Banner"}</DialogTitle>
                        <DialogDescription>
                            {editingBanner ? "Update banner details" : "Create a new banner section"}
                        </DialogDescription>
                    </DialogHeader>
                    <BannerForm
                        banner={editingBanner}
                        onSubmit={(data) => upsertBannerMutation.mutate(data)}
                        isPending={upsertBannerMutation.isPending}
                        onCancel={() => setIsDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Image Dialog */}
            <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                <DialogContent className="max-w-lg sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingImage ? "Edit Image" : "Add Image"}</DialogTitle>
                        <DialogDescription>
                            {editingImage ? "Update image details" : "Add a new image to the carousel"}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedBannerId && (
                        <ImageForm
                            image={editingImage}
                            bannerId={selectedBannerId}
                            onSubmit={(data) => upsertImageMutation.mutate(data)}
                            isPending={upsertImageMutation.isPending}
                            onCancel={() => setIsImageDialogOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Banner Confirmation */}
            <AlertDialog open={!!deletingBanner} onOpenChange={() => setDeletingBanner(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete "{deletingBanner?.title}" and all its images.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deletingBanner && deleteBannerMutation.mutate(deletingBanner.id)}
                            className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteBannerMutation.isPending ? <Loader className="h-4 w-4 animate-spin" /> : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Image Confirmation */}
            <AlertDialog open={!!deletingImage} onOpenChange={() => setDeletingImage(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Image</AlertDialogTitle>
                        <AlertDialogDescription>
                            This image will be removed from the carousel.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deletingImage && deleteImageMutation.mutate(deletingImage.id)}
                            className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteImageMutation.isPending ? <Loader className="h-4 w-4 animate-spin" /> : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

// Banner Form
interface BannerFormProps {
    banner: BannerWithImages | null
    onSubmit: (data: { id?: number; title: string; isActive?: boolean }) => void
    isPending: boolean
    onCancel: () => void
}

function BannerForm({ banner, onSubmit, isPending, onCancel }: BannerFormProps) {
    const form = useForm({
        defaultValues: {
            title: banner?.title || "",
            isActive: banner?.isActive ?? true,
        },
        onSubmit: async ({ value }) => {
            onSubmit({ id: banner?.id, title: value.title, isActive: value.isActive })
        },
    })

    return (
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-6">
            <form.Field name="title">
                {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.value
                    return (
                        <Field data-invalid={isInvalid}>
                            <FieldLabel>Title *</FieldLabel>
                            <Input
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="Enter banner title"
                            />
                            {isInvalid && <FieldError errors={[{ message: "Title is required" }]} />}
                        </Field>
                    )
                }}
            </form.Field>

            <form.Field name="isActive">
                {(field) => (
                    <Field orientation="horizontal">
                        <FieldContent>
                            <FieldLabel>Active</FieldLabel>
                            <FieldDescription>Display on homepage</FieldDescription>
                        </FieldContent>
                        <Switch checked={field.state.value} onCheckedChange={field.handleChange} />
                    </Field>
                )}
            </form.Field>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                    {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    {banner ? "Save Changes" : "Create Banner"}
                </Button>
            </div>
        </form>
    )
}

// Image Form
interface ImageFormProps {
    image: BannerImage | null
    bannerId: number
    onSubmit: (data: {
        id?: number
        bannerId: number
        image: string
        link?: string
        displayOrder?: number
        isActive?: boolean
    }) => void
    isPending: boolean
    onCancel: () => void
}

function ImageForm({ image, bannerId, onSubmit, isPending, onCancel }: ImageFormProps) {
    const form = useForm({
        defaultValues: {
            image: image?.image || "",
            link: image?.link || "",
            displayOrder: image?.displayOrder ?? 0,
            isActive: image?.isActive ?? true,
        },
        onSubmit: async ({ value }) => {
            onSubmit({
                id: image?.id,
                bannerId,
                image: value.image,
                link: value.link,
                displayOrder: value.displayOrder,
                isActive: value.isActive,
            })
        },
    })

    return (
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-6">
            <form.Field name="image">
                {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.value
                    return (
                        <Field data-invalid={isInvalid}>
                            <FieldLabel>Image *</FieldLabel>
                            <ImageUploader
                                value={field.state.value}
                                onChange={field.handleChange}
                                folder="banners"
                                maxSizeMB={5}
                            />
                            <FieldDescription>Recommended size: 1200×400px</FieldDescription>
                            {isInvalid && <FieldError errors={[{ message: "Image is required" }]} />}
                        </Field>
                    )
                }}
            </form.Field>

            <form.Field name="link">
                {(field) => (
                    <Field>
                        <FieldLabel>Link URL</FieldLabel>
                        <Input
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="https://..."
                        />
                        <FieldDescription>Optional. Opens when image is clicked.</FieldDescription>
                    </Field>
                )}
            </form.Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <form.Field name="displayOrder">
                    {(field) => (
                        <Field>
                            <FieldLabel>Order</FieldLabel>
                            <Input
                                type="number"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)}
                            />
                        </Field>
                    )}
                </form.Field>

                <form.Field name="isActive">
                    {(field) => (
                        <Field>
                            <FieldLabel>Status</FieldLabel>
                            <div className="flex items-center gap-2 h-9">
                                <Switch checked={field.state.value} onCheckedChange={field.handleChange} />
                                <span className="text-sm text-muted-foreground">
                                    {field.state.value ? "Active" : "Hidden"}
                                </span>
                            </div>
                        </Field>
                    )}
                </form.Field>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                    {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    {image ? "Save Changes" : "Add Image"}
                </Button>
            </div>
        </form>
    )
}
