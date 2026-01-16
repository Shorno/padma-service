"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Loader, Image as ImageIcon } from "lucide-react"
import { getBanner } from "./actions/get-banner"
import { upsertBanner } from "./actions/upsert-banner"

export default function BannerPage() {
    const queryClient = useQueryClient()

    const { data: banner, isLoading } = useQuery({
        queryKey: ["admin-banner"],
        queryFn: getBanner,
    })

    const mutation = useMutation({
        mutationFn: upsertBanner,
        onSuccess: (result) => {
            if (!result.success) {
                toast.error(result.error || "Failed to save banner")
                return
            }
            queryClient.invalidateQueries({ queryKey: ["admin-banner"] })
            toast.success("Banner saved successfully!")
        },
        onError: () => {
            toast.error("An unexpected error occurred")
        },
    })

    const form = useForm({
        defaultValues: {
            id: banner?.id,
            title: banner?.title || "",
            image: banner?.image || "",
            link: banner?.link || "",
            isActive: banner?.isActive ?? true,
        },
        onSubmit: async ({ value }) => {
            mutation.mutate({
                id: banner?.id,
                title: value.title,
                image: value.image,
                link: value.link,
                isActive: value.isActive,
            })
        },
    })

    // Update form when banner data loads
    React.useEffect(() => {
        if (banner) {
            form.setFieldValue("title", banner.title)
            form.setFieldValue("image", banner.image)
            form.setFieldValue("link", banner.link || "")
            form.setFieldValue("isActive", banner.isActive)
        }
    }, [banner, form])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Banner Management
                    </CardTitle>
                    <CardDescription>
                        Manage the promotional banner displayed on the home page
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            form.handleSubmit()
                        }}
                        className="space-y-6"
                    >
                        {/* Banner Title */}
                        <form.Field name="title">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.value
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Banner Title *</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="নিরাপত্তার জন্য - পদ্মা সার্ভিস নিন"
                                            autoComplete="off"
                                        />
                                        <FieldDescription>
                                            Title displayed above the banner image
                                        </FieldDescription>
                                        {isInvalid && (
                                            <FieldError errors={[{ message: "Title is required" }]} />
                                        )}
                                    </Field>
                                )
                            }}
                        </form.Field>

                        {/* Banner Image */}
                        <form.Field name="image">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.value
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Banner Image *</FieldLabel>
                                        <ImageUploader
                                            value={field.state.value}
                                            onChange={field.handleChange}
                                            folder="banners"
                                            maxSizeMB={5}
                                        />
                                        <FieldDescription>
                                            Upload a banner image (recommended: 1200x300px)
                                        </FieldDescription>
                                        {isInvalid && (
                                            <FieldError errors={[{ message: "Image is required" }]} />
                                        )}
                                    </Field>
                                )
                            }}
                        </form.Field>

                        {/* Banner Link */}
                        <form.Field name="link">
                            {(field) => (
                                <Field>
                                    <FieldLabel htmlFor={field.name}>Link URL (Optional)</FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="https://example.com/promo"
                                        autoComplete="off"
                                    />
                                    <FieldDescription>
                                        Where users go when they click the banner
                                    </FieldDescription>
                                </Field>
                            )}
                        </form.Field>

                        {/* Active Status */}
                        <form.Field name="isActive">
                            {(field) => (
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldLabel htmlFor={field.name}>Active Status</FieldLabel>
                                        <FieldDescription>
                                            Show this banner on the home page
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

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending && (
                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save Banner
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
