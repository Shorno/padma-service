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
    FieldContent,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import ImageUploader from "@/components/ImageUploader"
import { generateSlug } from "@/utils/generate-slug"
import { Loader } from "lucide-react"
import { updateSubcategorySchema } from "@/lib/schemas/category.scheam"
import { SubCategory } from "@/db/schema"
import updateSubcategory from "@/app/(admin)/admin/dashboard/category/actions/subcategory/update-subcategory"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface EditSubcategoryDialogProps {
    subcategory: SubCategory
    trigger?: React.ReactNode
}

export default function EditSubcategoryDialog({ subcategory, trigger }: EditSubcategoryDialogProps) {
    const [open, setOpen] = React.useState(false)
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: updateSubcategory,
        onSuccess: (result) => {
            if (!result.success) {
                switch (result.status) {
                    case 400:
                        toast.error("Invalid subcategory data.", {
                            description: "Please check your form inputs.",
                        })
                        break
                    case 401:
                        toast.error("You are not authorized to perform this action.")
                        break
                    case 404:
                        toast.error("Subcategory not found.")
                        break
                    default:
                        toast.error(result.error || "Something went wrong.")
                }
                return
            }
            queryClient.invalidateQueries({ queryKey: ['admin-subcategories', subcategory.categoryId] })
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
            toast.success(result.message)
            setOpen(false)
        },
        onError: () => {
            toast.error("An unexpected error occurred while updating the subcategory.")
        },
    })

    const form = useForm({
        defaultValues: {
            id: subcategory.id,
            name: subcategory.name,
            slug: subcategory.slug,
            image: subcategory.image,
            logo: subcategory.logo ?? "",
            isActive: subcategory.isActive,
            displayOrder: subcategory.displayOrder,
            categoryId: subcategory.categoryId,
        },

        validators: {
            onSubmit: updateSubcategorySchema,
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
                {trigger || (
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Subcategory</DialogTitle>
                    <DialogDescription>
                        Update the details of {subcategory.name} subcategory.
                    </DialogDescription>
                </DialogHeader>
                <form
                    id="edit-subcategory-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                    className="space-y-4"
                >
                    {/* Banner Image Uploader */}
                    <form.Field name="image">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>Subcategory Banner *</FieldLabel>
                                    <ImageUploader
                                        value={field.state.value}
                                        onChange={field.handleChange}
                                        folder="subcategories/banners"
                                        maxSizeMB={5}
                                    />
                                    <FieldDescription>
                                        Upload a banner image (max 5MB)
                                    </FieldDescription>
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    </form.Field>

                    {/* Two Column Layout: Logo + Name/Slug */}
                    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 items-start">
                        {/* Logo Uploader */}
                        <form.Field name="logo">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Logo</FieldLabel>
                                        <div className="w-32">
                                            <ImageUploader
                                                value={field.state.value ?? ""}
                                                onChange={field.handleChange}
                                                folder="subcategories/logos"
                                                maxSizeMB={2}
                                                compact={true}
                                            />
                                        </div>
                                        <FieldDescription>
                                            Optional
                                        </FieldDescription>
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        </form.Field>

                        {/* Name and Slug Fields */}
                        <div className="flex flex-col justify-between gap-2 self-stretch">
                            {/* Subcategory Name */}
                            <form.Field name="name">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>
                                                Subcategory Name *
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
                                                placeholder="Smartphones"
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
                                                placeholder="smartphones"
                                                autoComplete="off"
                                            />
                                            <FieldDescription>
                                                URL-friendly version of the name.
                                            </FieldDescription>
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    )
                                }}
                            </form.Field>
                        </div>
                    </div>

                    {/* Display Order */}
                    <form.Field name="displayOrder">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>Display Order</FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="number"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(Number(e.target.value))
                                        }
                                        aria-invalid={isInvalid}
                                        placeholder="0"
                                        min={0}
                                        autoComplete="off"
                                    />
                                    <FieldDescription>
                                        Lower numbers appear first
                                    </FieldDescription>
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    </form.Field>

                    {/* Active Status */}
                    <form.Field name="isActive">
                        {(field) => (
                            <Field orientation="horizontal">
                                <FieldContent>
                                    <FieldLabel htmlFor={field.name}>Active Status</FieldLabel>
                                    <FieldDescription>
                                        Inactive subcategories won&#39;t be visible
                                    </FieldDescription>
                                </FieldContent>
                                <Switch
                                    id="isActive"
                                    checked={field.state.value}
                                    onCheckedChange={field.handleChange}
                                />
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
                        form="edit-subcategory-form"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                        Update Subcategory
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
