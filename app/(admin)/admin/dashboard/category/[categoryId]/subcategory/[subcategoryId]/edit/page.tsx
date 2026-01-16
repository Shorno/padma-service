import { notFound } from "next/navigation";
import { getSubcategoryById } from "@/app/(admin)/admin/dashboard/category/actions/subcategory/get-subcategory-by-id";
import SubcategoryEditForm from "@/app/(admin)/admin/dashboard/category/_components/subcategory/subcategory-edit-form";

interface EditSubcategoryPageProps {
    params: Promise<{ categoryId: string; subcategoryId: string }>;
}

export default async function EditSubcategoryPage({ params }: EditSubcategoryPageProps) {
    const { categoryId, subcategoryId } = await params;

    const subcategory = await getSubcategoryById(Number(subcategoryId));

    if (!subcategory) {
        notFound();
    }

    return (
        <SubcategoryEditForm
            subcategory={{
                id: subcategory.id,
                name: subcategory.name,
                header: subcategory.header,
                description: subcategory.description,
                slug: subcategory.slug,
                categoryId: subcategory.categoryId,
                image: subcategory.image,
                logo: subcategory.logo,
                isActive: subcategory.isActive,
                displayOrder: subcategory.displayOrder,
            }}
            categoryName={subcategory.categoryName ?? "Unknown Category"}
        />
    );
}
