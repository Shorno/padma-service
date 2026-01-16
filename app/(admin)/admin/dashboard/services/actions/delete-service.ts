"use server"

import { db } from "@/db/config";
import { service } from "@/db/schema/service";
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

export default async function deleteService(
    id: number
): Promise<ActionResult<{ id: number }>> {
    const session = await checkAuth()

    if (!session?.user || session?.user.role !== "admin") {
        return {
            success: false,
            status: 401,
            error: "Unauthorized",
        }
    }

    try {
        const deletedService = await db
            .delete(service)
            .where(eq(service.id, id))
            .returning()

        if (!deletedService.length) {
            return {
                success: false,
                status: 404,
                error: "Service not found",
            }
        }

        // Revalidate only client-facing routes (not admin dashboard)
        revalidatePath("/services")
        revalidatePath("/")

        return {
            success: true,
            status: 200,
            data: { id },
            message: "Service deleted successfully",
        }
    } catch (error) {
        console.error("Error deleting service:", error)

        return {
            success: false,
            status: 500,
            error: "An unexpected error occurred",
        }
    }
}
