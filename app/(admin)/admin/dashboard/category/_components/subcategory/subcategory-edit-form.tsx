"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { ArrowLeft, Loader, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TiptapEditor } from "@/components/tiptap-editor"
import { Switch } from "@/components/ui/switch"
import ImageUploader from "@/components/ImageUploader"
import { generateSlug } from "@/utils/generate-slug"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import updateSubcategory from "@/app/(admin)/admin/dashboard/category/actions/subcategory/update-subcategory"
import CarouselManager from "./carousel-manager"

interface SubcategoryEditFormProps {
    subcategory: {
        id: number
        name: string
        header: string | null
        description: string | null
        slug: string
        categoryId: number
        image: string
        logo: string
        isActive: boolean
        displayOrder: number
    }
    categoryName: string
}

export default function SubcategoryEditForm({ subcategory, categoryName }: SubcategoryEditFormProps) {
    const router = useRouter()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: updateSubcategory,
        onSuccess: (result) => {
            if (!result.success) {
                toast.error(result.error || "Something went wrong.")
                return
            }
            queryClient.invalidateQueries({ queryKey: ['admin-subcategories'] })
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
            toast.success(result.message)
            router.push("/admin/dashboard/category")
        },
        onError: () => {
            toast.error("An unexpected error occurred.")
        },
    })

    const form = useForm({
        defaultValues: {
            id: subcategory.id,
            name: subcategory.name,
            header: subcategory.header ?? "",
            description: subcategory.description ?? "",
            slug: subcategory.slug,
            categoryId: subcategory.categoryId,
            image: subcategory.image,
            logo: subcategory.logo ?? "",
            isActive: subcategory.isActive,
            displayOrder: subcategory.displayOrder,
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
                <div className="flex h-14 items-center justify-between px-2 sm:px-4 lg:px-6 gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <Link href={`/admin/dashboard/category/${subcategory.categoryId}`}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div className="min-w-0">
                            <h1 className="text-sm sm:text-base font-semibold truncate">
                                {subcategory.name}
                            </h1>
                            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                                {categoryName}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/dashboard/category/${subcategory.categoryId}`)}
                            disabled={mutation.isPending}
                            className="hidden sm:inline-flex"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            form="subcategory-form"
                            size="sm"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                            <span className="hidden sm:inline">Save Changes</span>
                            <span className="sm:hidden">Save</span>
                        </Button>
                    </div>
                </div>
            </header>

            <form
                id="subcategory-form"
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
            >
                <div className="flex flex-col lg:flex-row">
                    {/* Main Content Area */}
                    <main className="flex-1 p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 order-2 lg:order-1">
                        {/* Two Column Layout: Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Left Column: Name, Header, Slug */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>

                                {/* Name Field */}
                                <form.Field name="name">
                                    {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <Label htmlFor={field.name}>Name *</Label>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => {
                                                        field.handleChange(e.target.value)
                                                        autoGenerateSlugFromName(e.target.value)
                                                    }}
                                                    placeholder="Subcategory name"
                                                />
                                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                            </Field>
                                        )
                                    }}
                                </form.Field>

                                {/* Header Field */}
                                <form.Field name="header">
                                    {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <Label htmlFor={field.name}>Header / Title</Label>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    placeholder="Display title for the page"
                                                />
                                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                            </Field>
                                        )
                                    }}
                                </form.Field>

                                {/* Slug Field */}
                                <form.Field name="slug">
                                    {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <Label htmlFor={field.name}>Slug *</Label>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    placeholder="subcategory-slug"
                                                />
                                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                            </Field>
                                        )
                                    }}
                                </form.Field>
                            </div>

                            {/* Right Column: Settings */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Settings</h3>

                                {/* Display Order */}
                                <form.Field name="displayOrder">
                                    {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <Label htmlFor={field.name}>Display Order</Label>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    type="number"
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(Number(e.target.value))}
                                                    min={0}
                                                />
                                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                            </Field>
                                        )
                                    }}
                                </form.Field>

                                {/* Active Status */}
                                <form.Field name="isActive">
                                    {(field) => (
                                        <div className="flex items-center justify-between p-3 border rounded-md">
                                            <div className="flex items-center gap-2">
                                                {field.state.value ? (
                                                    <Eye className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                )}
                                                <Label htmlFor={field.name} className="cursor-pointer">
                                                    Active Status
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
                        </div>

                        <Separator />

                        {/* Description - Rich Text Editor */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                            <form.Field name="description">
                                {(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <TiptapEditor
                                                value={field.state.value}
                                                onChange={field.handleChange}
                                                placeholder="Write subcategory description..."
                                                className="min-h-[300px]"
                                            />
                                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                        </Field>
                                    )
                                }}
                            </form.Field>
                        </div>

                        <Separator />

                        {/* Carousels Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Carousels</h3>
                            <CarouselManager subCategoryId={subcategory.id} />
                        </div>
                    </main>

                    {/* Sidebar */}
                    <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-l bg-muted/30 p-3 sm:p-4 lg:p-6 space-y-4 lg:space-y-6 order-1 lg:order-2">
                        {/* Banner Image */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Banner Image</Label>
                            <form.Field name="image">
                                {(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <ImageUploader
                                                value={field.state.value}
                                                onChange={field.handleChange}
                                                folder="subcategories/banners"
                                                maxSizeMB={5}
                                            />
                                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                        </Field>
                                    )
                                }}
                            </form.Field>
                        </div>

                        <Separator />

                        {/* Logo */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Logo</Label>
                            <form.Field name="logo">
                                {(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <ImageUploader
                                                value={field.state.value}
                                                onChange={field.handleChange}
                                                folder="subcategories/logos"
                                                maxSizeMB={2}
                                                compact
                                            />
                                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                        </Field>
                                    )
                                }}
                            </form.Field>
                        </div>
                    </aside>
                </div>
            </form>
        </div>
    )
}
