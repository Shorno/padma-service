import { notFound } from "next/navigation"
import { SectionForm } from "../../_components/section-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getHomepageSectionById } from "@/app/actions/homepage-sections"

interface EditSectionPageProps {
    params: Promise<{ id: string }>
}

export default async function EditHomepageSectionPage({ params }: EditSectionPageProps) {
    const { id } = await params
    const section = await getHomepageSectionById(Number(id))

    if (!section) {
        notFound()
    }

    // Transform data for form
    const initialData = {
        id: section.id,
        title: section.title,
        displayOrder: section.displayOrder,
        isActive: section.isActive,
        subCategory: {
            id: section.subCategory.id,
            name: section.subCategory.name,
        },
        items: section.items.map(item => ({
            service: {
                id: item.service.id,
                name: item.service.name,
                slug: item.service.slug,
                image: item.service.image,
            }
        })),
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <Button asChild variant="ghost" size="sm">
                    <Link href="/admin/dashboard/homepage-sections">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Sections
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">
                    Edit Section: {section.title || section.subCategory.name}
                </h1>
                <p className="text-muted-foreground">
                    Update the section details and selected services
                </p>
            </div>

            {/* Form */}
            <SectionForm initialData={initialData} mode="edit" />
        </div>
    )
}
