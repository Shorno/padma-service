"use server"

import { UpdateServiceFormValues, updateServiceSchema } from "@/lib/schemas/service.schema";
import { z } from "zod";
import { db } from "@/db/config";
import { service, serviceImage } from "@/db/schema/service";
import { eq } from "drizzle-orm";
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

export default async function updateService(
    formData: UpdateServiceFormValues
): Promise<ActionResult<UpdateServiceFormValues>> {
    const session = await checkAuth()

    if (!session?.user || session?.user.role !== "admin") {
        return {
            success: false,
            status: 401,
            error: "Unauthorized",
        }
    }

    try {
        const result = updateServiceSchema.safeParse(formData)

        if (!result.success) {
            return {
                success: false,
                status: 400,
                error: "Validation failed",
                details: z.treeifyError(result.error),
            }
        }

        const validData = result.data
        const { id, additionalImages, ...updateData } = validData

        const updatedService = await db
            .update(service)
            .set({
                ...updateData,
                subCategoryId: updateData.subCategoryId || null,
            })
            .where(eq(service.id, id))
            .returning()

        if (!updatedService.length) {
            return {
                success: false,
                status: 404,
                error: "Service not found",
            }
        }

        // Update additional images: delete existing and insert new ones
        if (additionalImages !== undefined) {
            // Delete existing additional images
            await db.delete(serviceImage).where(eq(serviceImage.serviceId, id))

            // Insert new additional images if provided
            if (additionalImages.length > 0) {
                await db.insert(serviceImage).values(
                    additionalImages.map((imageUrl) => ({
                        serviceId: id,
                        imageUrl: imageUrl,
                    }))
                )
            }
        }

        revalidatePath("/services")
        revalidatePath("/")

        return {
            success: true,
            status: 200,
            data: {
                ...updatedService[0],
                additionalImages,
                description: updatedService[0].description ?? undefined,
                subCategoryId: updatedService[0].subCategoryId ?? undefined,
            },
            message: "Service updated successfully",
        }
    } catch (error) {
        console.error("Error updating service:", error)

        return {
            success: false,
            status: 500,
            error: "An unexpected error occurred",
        }
    }
}
