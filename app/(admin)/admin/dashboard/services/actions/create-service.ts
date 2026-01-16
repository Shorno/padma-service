"use server"

import { CreateServiceFormValues, createServiceSchema } from "@/lib/schemas/service.schema";
import { z } from "zod";
import { db } from "@/db/config";
import { service, serviceImage } from "@/db/schema/service";
import { revalidatePath } from "next/cache";
import { checkAuth } from "@/app/actions/auth/checkAuth";

export type ActionResult<TData = unknown> =
    | {
        success: true
        status: number
        data: TData
        message?: string
    }
    | {
        success: false
        status: number
        error: string
        details?: unknown
    }

export default async function createService(
    formData: CreateServiceFormValues
): Promise<ActionResult<CreateServiceFormValues>> {
    const session = await checkAuth()

    if (!session?.user || session?.user.role !== "admin") {
        return {
            success: false,
            status: 401,
            error: "Unauthorized",
        }
    }

    try {
        const result = createServiceSchema.safeParse(formData)

        if (!result.success) {
            return {
                success: false,
                status: 400,
                error: "Validation failed",
                details: z.treeifyError(result.error),
            }
        }

        const validData = result.data
        const { additionalImages, ...serviceData } = validData

        const newService = await db.insert(service).values({
            ...serviceData,
            subCategoryId: serviceData.subCategoryId || null,
        }).returning()

        // Insert additional images if provided
        if (additionalImages && additionalImages.length > 0) {
            await db.insert(serviceImage).values(
                additionalImages.map((imageUrl) => ({
                    serviceId: newService[0].id,
                    imageUrl: imageUrl,
                }))
            )
        }

        revalidatePath("/services")
        revalidatePath("/")

        return {
            success: true,
            status: 201,
            data: {
                ...newService[0],
                additionalImages,
                description: newService[0].description ?? undefined,
                subCategoryId: newService[0].subCategoryId ?? undefined,
            },
            message: "Service created successfully",
        }
    } catch (error) {
        console.error("Error creating service:", error)

        return {
            success: false,
            status: 500,
            error: "An unexpected error occurred",
        }
    }
}
