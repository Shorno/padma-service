"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { updateServiceSchema } from "@/lib/schemas/service.schema"
import { Switch } from "@/components/ui/switch"
import ImageUploader from "@/components/ImageUploader"
import AdditionalImagesUploader from "@/components/AdditionalImagesUploader"
import { generateSlug } from "@/utils/generate-slug"
import { useState } from "react"
import updateService from "@/app/(admin)/admin/dashboard/services/actions/update-service"
import { Loader } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCategories, useSubCategories } from "@/hooks/use-categories"
import { ServiceWithRelations } from "./service-columns"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface EditServiceDialogProps {
    service: ServiceWithRelations
}

export default function EditServiceDialog({ service }: EditServiceDialogProps) {
    const [open, setOpen] = React.useState(false)
    const [selectedCategory, setSelectedCategory] = useState<number>(service.categoryId)
    const queryClient = useQueryClient()

    const { data: categories = [] } = useCategories()
    const subCategories = useSubCategories(selectedCategory)

    const mutation = useMutation({
        mutationFn: updateService,
        onSuccess: (result) => {
            if (!result.success) {
                switch (result.status) {
                    case 400:
                        toast.error("Invalid service data.", {
                            description: "Please check your form inputs.",
                        })
                        break
                    case 401:
                        toast.error("You are not authorized to perform this action.")
                        break
                    case 404:
                        toast.error("Service not found.")
                        break
                    default:
                        toast.error(result.error || "Something went wrong.")
                }
                return
            }
            queryClient.invalidateQueries({ queryKey: ['admin-services'] })
            toast.success(result.message)
            setOpen(false)
        },
        onError: () => {
            toast.error("An unexpected error occurred while updating the service.")
        },
    })

    const form = useForm({
        defaultValues: {
            id: service.id,
            name: service.name,
            slug: service.slug,
            description: service.description ?? "",
            categoryId: service.categoryId,
            subCategoryId: service.subCategoryId ?? undefined as number | undefined,
            image: service.image,
            additionalImages: service.images?.map(img => img.imageUrl) || [] as string[],
            isPublished: service.isPublished,
            isFeatured: service.isFeatured,
        },
        validators: {
            //@ts-ignore
            onSubmit: updateServiceSchema,
        },
        onSubmit: async ({ value }) => {
            mutation.mutate(value)
        },
    })

    const autoGenerateSlugFromName = (value: string) => {
        const generatedSlug = generateSlug(value)
        form.setFieldValue("slug", generatedSlug)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Service</DialogTitle>
                    <DialogDescription>
                        Update the details of {service.name}.
                    </DialogDescription>
                </DialogHeader>
                <form
                    id="edit-service-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                    className="space-y-4"
                >
                    {/* Image Uploader */}
                    <form.Field name="image">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>Service Image *</FieldLabel>
                                    <ImageUploader
                                        value={field.state.value}
                                        onChange={field.handleChange}
                                        folder="services"
                                        maxSizeMB={5}
                                    />
                                    <FieldDescription>
                                        Upload a cover image for your service (max 5MB)
                                    </FieldDescription>
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    </form.Field>

                    {/* Additional Images Uploader */}
                    <form.Field name="additionalImages">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Gallery Images (Optional)
                                    </FieldLabel>
                                    <AdditionalImagesUploader
                                        value={field.state.value}
                                        onChange={field.handleChange}
                                        folder="services/gallery"
                                        maxSizeMB={5}
                                    />
                                    <FieldDescription>
                                        Upload additional images for the service gallery (max 5MB each)
                                    </FieldDescription>
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    </form.Field>

                    {/* Service Name */}
                    <form.Field name="name">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Service Title *
                                    </FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => {
                                            field.handleChange(e.target.value)
                                            autoGenerateSlugFromName(e.target.value)
                                        }}
                                        aria-invalid={isInvalid}
                                        placeholder="Web Development Services"
                                        autoComplete="off"
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    </form.Field>

                    {/* Slug */}
                    <form.Field name="slug">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>Slug *</FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="web-development-services"
                                        autoComplete="off"
                                    />
                                    <FieldDescription>
                                        URL-friendly version of the title.
                                    </FieldDescription>
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    </form.Field>

                    {/* Description */}
                    <form.Field name="description">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                                    <Textarea
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="Describe your service in detail..."
                                        rows={6}
                                        autoComplete="off"
                                    />
                                    <FieldDescription>
                                        Detailed description of the service (optional, max 5000 characters)
                                    </FieldDescription>
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    </form.Field>

                    {/* Category and Subcategory Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Category */}
                        <form.Field name="categoryId">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Category *</FieldLabel>
                                        <Select
                                            value={field.state.value?.toString()}
                                            onValueChange={(value) => {
                                                const numValue = parseInt(value)
                                                field.handleChange(numValue)
                                                setSelectedCategory(numValue)
                                                form.setFieldValue("subCategoryId", undefined)
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        </form.Field>

                        {/* Subcategory */}
                        <form.Field name="subCategoryId">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Subcategory (Optional)
                                        </FieldLabel>
                                        <Select
                                            value={field.state.value?.toString() || "none"}
                                            onValueChange={(value) => {
                                                field.handleChange(value === "none" ? undefined : parseInt(value))
                                            }}
                                            disabled={!selectedCategory || subCategories.length === 0}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select subcategory" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                {subCategories.map((subCat) => (
                                                    <SelectItem key={subCat.id} value={subCat.id.toString()}>
                                                        {subCat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        </form.Field>
                    </div>

                    {/* Published Switch */}
                    <form.Field name="isPublished">
                        {(field) => (
                            <Field>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <FieldLabel htmlFor={field.name}>Publish</FieldLabel>
                                        <FieldDescription>
                                            Make this service visible to the public
                                        </FieldDescription>
                                    </div>
                                    <Switch
                                        id={field.name}
                                        checked={field.state.value}
                                        onCheckedChange={field.handleChange}
                                    />
                                </div>
                            </Field>
                        )}
                    </form.Field>

                    {/* Is Featured Switch */}
                    <form.Field name="isFeatured">
                        {(field) => (
                            <Field>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <FieldLabel htmlFor={field.name}>Featured Service</FieldLabel>
                                        <FieldDescription>
                                            Display this service in featured sections
                                        </FieldDescription>
                                    </div>
                                    <Switch
                                        id={field.name}
                                        checked={field.state.value}
                                        onCheckedChange={field.handleChange}
                                    />
                                </div>
                            </Field>
                        )}
                    </form.Field>
                </form>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={mutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="edit-service-form"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                        Update Service
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
