import { SectionForm } from "../_components/section-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewHomepageSectionPage() {
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
                <h1 className="text-2xl font-bold tracking-tight">New Homepage Section</h1>
                <p className="text-muted-foreground">
                    Create a new curated service collection for the homepage
                </p>
            </div>

            {/* Form */}
            <SectionForm mode="create" />
        </div>
    )
}
