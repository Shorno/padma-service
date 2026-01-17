"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { ArrowLeft, Loader, Eye, EyeOff, Images, Settings, FileText } from "lucide-react"
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
import createSubcategory from "@/app/(admin)/admin/dashboard/category/actions/subcategory/create-subcategory"

interface SubcategoryNewFormProps {
    categoryId: number
    categoryName: string
}

export default function SubcategoryNewForm({ categoryId, categoryName }: SubcategoryNewFormProps) {
    const router = useRouter()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: createSubcategory,
        onSuccess: (result) => {
            if (!result.success) {
                toast.error(result.error || "Something went wrong.")
                return
            }
            queryClient.invalidateQueries({ queryKey: ['admin-subcategories'] })
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
            toast.success(result.message)
            router.push(`/admin/dashboard/category/${categoryId}`)
        },
        onError: () => {
            toast.error("An unexpected error occurred.")
        },
    })

    const form = useForm({
        defaultValues: {
            name: "",
            header: "",
            buttonLabel: "",
            description: "",
            slug: "",
            categoryId: categoryId,
            image: "",
            logo: "",
            isActive: true,
            displayOrder: 0,
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
                            <Link href={`/admin/dashboard/category/${categoryId}`}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div className="min-w-0">
                            <h1 className="text-sm sm:text-base font-semibold truncate">
                                New Subcategory
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
                            onClick={() => router.push(`/admin/dashboard/category/${categoryId}`)}
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
                            Create
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
                <div className="flex flex-col xl:flex-row">
                    {/* Main Content Area */}
                    <main className="flex-1 p-3 sm:p-4 xl:p-6 space-y-4 sm:space-y-6 order-2 xl:order-1">
                        {/* Two Column Layout: Basic Info & Settings */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                            {/* Left Column: Basic Information */}
                            <div className="rounded-lg border bg-card p-4 space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <h3 className="text-sm font-semibold">Basic Information</h3>
                                </div>

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
                            <div className="rounded-lg border bg-card p-4 space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b">
                                    <Settings className="h-4 w-4 text-primary" />
                                    <h3 className="text-sm font-semibold">Settings</h3>
                                </div>

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

                                {/* Button Label */}
                                <form.Field name="buttonLabel">
                                    {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <Label htmlFor={field.name}>Button Label</Label>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    placeholder="e.g., Book Now, Order Here"
                                                />
                                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                            </Field>
                                        )
                                    }}
                                </form.Field>

                                {/* Active Status */}
                                <form.Field name="isActive">
                                    {(field) => (
                                        <div
                                            className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors cursor-pointer ${field.state.value
                                                ? 'border-green-500/50 bg-green-50 dark:bg-green-950/20'
                                                : 'border-muted bg-muted/30'
                                                }`}
                                            onClick={() => field.handleChange(!field.state.value)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${field.state.value ? 'bg-green-500/20' : 'bg-muted'}`}>
                                                    {field.state.value ? (
                                                        <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                    ) : (
                                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div>
                                                    <Label htmlFor={field.name} className="cursor-pointer font-medium">
                                                        {field.state.value ? 'Active' : 'Inactive'}
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground">
                                                        {field.state.value ? 'Visible to customers' : 'Hidden from customers'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <Switch
                                                    id={field.name}
                                                    checked={field.state.value}
                                                    onCheckedChange={field.handleChange}
                                                />
                                            </div>
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

                        {/* Carousels Section - Show after creation */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Carousels</h3>
                            <div className="flex items-center gap-3 p-4 rounded-lg border border-dashed bg-muted/20">
                                <Images className="h-5 w-5 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    Save the subcategory first, then you can manage carousel images from the edit page.
                                </p>
                            </div>
                        </div>
                    </main>

                    {/* Sidebar */}
                    <aside className="w-full xl:w-72 border-b xl:border-b-0 xl:border-l bg-muted/30 p-3 sm:p-4 xl:p-6 space-y-4 xl:space-y-6 order-1 xl:order-2">
                        {/* Banner Image */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Banner Image *</Label>
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
