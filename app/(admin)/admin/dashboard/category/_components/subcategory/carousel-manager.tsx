"use client"

import * as React from "react"
import Image from "next/image"
import { Plus, X, Link as LinkIcon, GripVertical, Loader2 } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ImageUploader from "@/components/ImageUploader"
import {
    getSubcategoryCarousels,
    addCarouselImage,
    deleteCarouselImage,
    updateCarouselImage,
    CarouselPosition,
    CarouselImageData,
} from "@/app/(admin)/admin/dashboard/category/actions/subcategory/carousel-actions"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface CarouselManagerProps {
    subCategoryId: number
}

interface CarouselSectionProps {
    position: CarouselPosition
    label: string
    subCategoryId: number
    images: CarouselImageData[]
    onRefresh: () => void
}

function CarouselSection({ position, label, subCategoryId, images, onRefresh }: CarouselSectionProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
    const [newImageUrl, setNewImageUrl] = React.useState("")
    const [newImageLink, setNewImageLink] = React.useState("")

    const addMutation = useMutation({
        mutationFn: () => addCarouselImage(subCategoryId, position, newImageUrl, newImageLink),
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Image added")
                setNewImageUrl("")
                setNewImageLink("")
                setIsAddDialogOpen(false)
                onRefresh()
            } else {
                toast.error(result.error || "Failed to add image")
            }
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteCarouselImage,
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Image removed")
                onRefresh()
            } else {
                toast.error(result.error || "Failed to remove image")
            }
        },
    })

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {label}
                </Label>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add Image to {label}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Image</Label>
                                <ImageUploader
                                    value={newImageUrl}
                                    onChange={setNewImageUrl}
                                    folder="subcategories/carousels"
                                    maxSizeMB={5}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Link URL (optional)</Label>
                                <Input
                                    value={newImageLink}
                                    onChange={(e) => setNewImageLink(e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsAddDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => addMutation.mutate()}
                                    disabled={!newImageUrl || addMutation.isPending}
                                >
                                    {addMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    Add Image
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Images Grid */}
            {images.length === 0 ? (
                <div
                    className="h-24 flex items-center justify-center border border-dashed rounded-lg bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    <span className="text-xs text-muted-foreground">Click to add image</span>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-2">
                    {images.map((img) => (
                        <div
                            key={img.id}
                            className="group relative aspect-video rounded-lg overflow-hidden bg-muted"
                        >
                            <Image
                                src={img.image}
                                alt=""
                                fill
                                className="object-cover"
                            />
                            {/* Overlay with actions */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                {img.link && (
                                    <div className="absolute bottom-1 left-1">
                                        <LinkIcon className="h-3 w-3 text-white/70" />
                                    </div>
                                )}
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => deleteMutation.mutate(img.id)}
                                    disabled={deleteMutation.isPending}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function CarouselManager({ subCategoryId }: CarouselManagerProps) {
    const queryClient = useQueryClient()

    const { data: carousels = [], isLoading, refetch } = useQuery({
        queryKey: ["subcategory-carousels", subCategoryId],
        queryFn: () => getSubcategoryCarousels(subCategoryId),
    })

    const getImagesForPosition = (position: CarouselPosition): CarouselImageData[] => {
        const carousel = carousels.find((c) => c.position === position)
        return carousel?.images || []
    }

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ["subcategory-carousels", subCategoryId] })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-32">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CarouselSection
                position="left"
                label="Left Carousel"
                subCategoryId={subCategoryId}
                images={getImagesForPosition("left")}
                onRefresh={handleRefresh}
            />
            <CarouselSection
                position="middle"
                label="Middle Carousel"
                subCategoryId={subCategoryId}
                images={getImagesForPosition("middle")}
                onRefresh={handleRefresh}
            />
            <CarouselSection
                position="right"
                label="Right Carousel"
                subCategoryId={subCategoryId}
                images={getImagesForPosition("right")}
                onRefresh={handleRefresh}
            />
        </div>
    )
}
