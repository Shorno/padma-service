import { notFound } from "next/navigation";
import getCategoryById from "@/app/(admin)/admin/dashboard/category/actions/category/get-category-by-id";
import SubcategoryNewForm from "@/app/(admin)/admin/dashboard/category/_components/subcategory/subcategory-new-form";

interface NewSubcategoryPageProps {
    params: Promise<{ categoryId: string }>;
}

export default async function NewSubcategoryPage({ params }: NewSubcategoryPageProps) {
    const { categoryId } = await params;

    const category = await getCategoryById(Number(categoryId));

    if (!category) {
        notFound();
    }

    return (
        <SubcategoryNewForm
            categoryId={category.id}
            categoryName={category.name}
        />
    );
}
