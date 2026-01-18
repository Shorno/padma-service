"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader, ChevronRight, Save } from "lucide-react"
import Image from "next/image"

import {
    getAllSubcategories,
    getServicesBySubcategory,
    upsertHomepageSection,
    updateHomepageSectionItems,
} from "@/app/actions/homepage-sections"

interface SubcategoryOption {
    id: number
    name: string
    slug: string
    categoryId: number
    category: { id: number; name: string; slug: string }
}

interface SectionData {
    id?: number
    title: string | null
    displayOrder: number
    isActive: boolean
    subCategory?: {
        id: number
        name: string
    }
    items?: {
        service: {
            id: number
            name: string
            slug: string
            image: string
        }
    }[]
}

interface SectionFormProps {
    initialData?: SectionData | null
    mode: "create" | "edit"
}

export function SectionForm({ initialData, mode }: SectionFormProps) {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [selectedSubcategoryId, setSelectedSubcategoryId] = React.useState<number | null>(
        initialData?.subCategory?.id || null
    )
    const [selectedServiceIds, setSelectedServiceIds] = React.useState<number[]>(
        initialData?.items?.map(item => item.service.id) || []
    )

    // Fetch subcategories
    const { data: subcategories, isLoading: isLoadingSubcategories } = useQuery({
        queryKey: ["admin-all-subcategories"],
        queryFn: getAllSubcategories,
    })

    // Fetch services when subcategory changes
    const { data: availableServices, isLoading: isLoadingServices } = useQuery({
        queryKey: ["subcategory-services", selectedSubcategoryId],
        queryFn: () => selectedSubcategoryId ? getServicesBySubcategory(selectedSubcategoryId) : Promise.resolve([]),
        enabled: !!selectedSubcategoryId,
    })

    const upsertMutation = useMutation({
        mutationFn: upsertHomepageSection,
        onSuccess: async (result) => {
            if (!result.success || !result.data) {
                toast.error(result.error || "Failed to save section")
                return
            }

            // Now update the items
            const itemsResult = await updateHomepageSectionItems({
                sectionId: result.data.id,
                serviceIds: selectedServiceIds,
            })

            if (!itemsResult.success) {
                toast.error(itemsResult.error || "Failed to update services")
                return
            }

            toast.success(mode === "edit" ? "Section updated!" : "Section created!")
            // Invalidate the query cache so the list page shows fresh data
            await queryClient.invalidateQueries({ queryKey: ["admin-homepage-sections"] })
            router.push("/admin/dashboard/homepage-sections")
        },
        onError: () => toast.error("An unexpected error occurred"),
    })

    const form = useForm({
        defaultValues: {
            title: initialData?.title || "",
            displayOrder: initialData?.displayOrder ?? 0,
            isActive: initialData?.isActive ?? true,
        },
        onSubmit: async ({ value }) => {
            if (!selectedSubcategoryId) {
                toast.error("Please select a subcategory")
                return
            }

            upsertMutation.mutate({
                id: initialData?.id,
                subCategoryId: selectedSubcategoryId,
                title: value.title || null,
                displayOrder: value.displayOrder,
                isActive: value.isActive,
            })
        },
    })

    const toggleService = (serviceId: number) => {
        setSelectedServiceIds(prev =>
            prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        )
    }

    // Group subcategories by category for better UX
    const groupedSubcategories = React.useMemo(() => {
        const groups: Record<string, SubcategoryOption[]> = {}
        subcategories?.forEach(sub => {
            const catName = sub.category.name
            if (!groups[catName]) groups[catName] = []
            groups[catName].push(sub)
        })
        return groups
    }, [subcategories])

    if (isLoadingSubcategories) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Column - Section Details */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Section Details</CardTitle>
                            <CardDescription>Configure the section appearance</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Subcategory Selection */}
                            <Field>
                                <FieldLabel>Subcategory *</FieldLabel>
                                <Select
                                    value={selectedSubcategoryId?.toString() || ""}
                                    onValueChange={(val) => {
                                        setSelectedSubcategoryId(Number(val))
                                        setSelectedServiceIds([]) // Reset services
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a subcategory" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(groupedSubcategories).map(([categoryName, subs]) => (
                                            <React.Fragment key={categoryName}>
                                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                                                    {categoryName}
                                                </div>
                                                {subs.map(sub => (
                                                    <SelectItem key={sub.id} value={sub.id.toString()}>
                                                        <div className="flex items-center gap-2">
                                                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                                            {sub.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldDescription>Services will be loaded from this subcategory</FieldDescription>
                            </Field>

                            {/* Custom Title */}
                            <form.Field name="title">
                                {(field) => (
                                    <Field>
                                        <FieldLabel>Custom Title</FieldLabel>
                                        <Input
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="Leave empty to use subcategory name"
                                        />
                                        <FieldDescription>Optional. Overrides the subcategory name on homepage.</FieldDescription>
                                    </Field>
                                )}
                            </form.Field>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Display Order */}
                                <form.Field name="displayOrder">
                                    {(field) => (
                                        <Field>
                                            <FieldLabel>Display Order</FieldLabel>
                                            <Input
                                                type="number"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)}
                                            />
                                        </Field>
                                    )}
                                </form.Field>

                                {/* Active Toggle */}
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
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Service Selection */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Services</CardTitle>
                            <CardDescription>
                                {selectedServiceIds.length} service(s) selected
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!selectedSubcategoryId ? (
                                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                                    Select a subcategory first
                                </div>
                            ) : isLoadingServices ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : availableServices && availableServices.length > 0 ? (
                                <ScrollArea className="h-[400px]">
                                    <div className="space-y-2 pr-4">
                                        {availableServices.map((service) => (
                                            <label
                                                key={service.id}
                                                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                                            >
                                                <Checkbox
                                                    checked={selectedServiceIds.includes(service.id)}
                                                    onCheckedChange={() => toggleService(service.id)}
                                                />
                                                <div className="relative w-14 h-14 rounded overflow-hidden bg-muted shrink-0">
                                                    <Image
                                                        src={service.image}
                                                        alt={service.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <span className="font-medium">{service.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </ScrollArea>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                                    No services found in this subcategory
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/dashboard/homepage-sections")}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={upsertMutation.isPending}>
                    {upsertMutation.isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    {mode === "edit" ? "Save Changes" : "Create Section"}
                </Button>
            </div>
        </form>
    )
}
