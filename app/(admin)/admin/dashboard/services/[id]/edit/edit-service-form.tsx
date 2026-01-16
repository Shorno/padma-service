"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { ArrowLeft, Loader, Eye, EyeOff, Star } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
    Field,
    FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TiptapEditor } from "@/components/tiptap-editor"
import { updateServiceSchema } from "@/lib/schemas/service.schema"
import { Switch } from "@/components/ui/switch"
import ImageUploader from "@/components/ImageUploader"
import { generateSlug } from "@/utils/generate-slug"
import { useState } from "react"
import updateService from "@/app/(admin)/admin/dashboard/services/actions/update-service"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCategories, useSubCategories } from "@/hooks/use-categories"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { ServiceWithRelations } from "../../_components/service-columns"

interface EditServiceFormProps {
    service: ServiceWithRelations
}

export default function EditServiceForm({ service }: EditServiceFormProps) {
    const router = useRouter()
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
            router.push("/admin/dashboard/services")
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
        <div className="min-h-screen bg-background">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center justify-between px-3 sm:px-4 lg:px-6">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                            <Link href="/admin/dashboard/services">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-sm sm:text-lg font-semibold truncate max-w-[150px] sm:max-w-none">Edit Service</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => router.push("/admin/dashboard/services")}
                            disabled={mutation.isPending}
                            className="hidden sm:inline-flex"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            form="edit-service-form"
                            size="sm"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                            Update
                        </Button>
                    </div>
                </div>
            </header>

            <form
                id="edit-service-form"
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
            >
                <div className="flex flex-col lg:flex-row">
                    {/* Main Content Area */}
                    <main className="flex-1 p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 order-2 lg:order-1">
                        {/* Title Field */}
                        <form.Field name="name">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
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
                                            placeholder="Enter service title..."
                                            autoComplete="off"
                                            className="text-2xl font-semibold h-auto py-3 border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary px-2"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        </form.Field>

                        {/* Slug Field */}
                        <form.Field name="slug">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>Permalink:</span>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="service-slug"
                                                autoComplete="off"
                                                className="flex-1 h-8 text-sm"
                                            />
                                        </div>
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        </form.Field>

                        {/* Content Editor */}
                        <form.Field name="description">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid} className="flex-1">
                                        <TiptapEditor
                                            value={field.state.value}
                                            onChange={field.handleChange}
                                            placeholder="Write your service description..."
                                            className="min-h-[500px]"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        </form.Field>
                    </main>

                    {/* Sidebar - On mobile, show at top */}
                    <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-l bg-muted/30 p-3 sm:p-4 lg:p-6 space-y-4 lg:space-y-6 order-1 lg:order-2">
                        {/* Featured Image */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Featured Image</Label>
                            <form.Field name="image">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <ImageUploader
                                                value={field.state.value}
                                                onChange={field.handleChange}
                                                folder="services"
                                                maxSizeMB={5}
                                                compact
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    )
                                }}
                            </form.Field>
                        </div>

                        <Separator />

                        {/* Category */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Organization</Label>
                            <form.Field name="categoryId">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <Label className="text-xs text-muted-foreground">Category</Label>
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

                            <form.Field name="subCategoryId">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <Label className="text-xs text-muted-foreground">Subcategory</Label>
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

                        <Separator />

                        {/* Settings */}
                        <div className="space-y-4">
                            <Label className="text-sm font-medium">Settings</Label>

                            <form.Field name="isPublished">
                                {(field) => (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {field.state.value ? (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <Label htmlFor={field.name} className="text-sm cursor-pointer">
                                                Published
                                            </Label>
                                        </div>
                                        <Switch
                                            id={field.name}
                                            checked={field.state.value}
                                            onCheckedChange={field.handleChange}
                                        />
                                    </div>
                                )}
                            </form.Field>

                            <form.Field name="isFeatured">
                                {(field) => (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Star className={`h-4 w-4 ${field.state.value ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                                            <Label htmlFor={field.name} className="text-sm cursor-pointer">
                                                Featured
                                            </Label>
                                        </div>
                                        <Switch
                                            id={field.name}
                                            checked={field.state.value}
                                            onCheckedChange={field.handleChange}
                                        />
                                    </div>
                                )}
                            </form.Field>
                        </div>
                    </aside>
                </div>
            </form>
        </div>
    )
}
