import * as z from "zod"

export const createServiceSchema = z.object({
    name: z
        .string()
        .min(2, "Service name must be at least 2 characters.")
        .max(150, "Service name must be at most 150 characters.")
        .trim(),
    slug: z
        .string()
        .min(2, "Slug must be at least 2 characters.")
        .max(150, "Slug must be at most 150 characters.")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must contain only lowercase letters, numbers, and hyphens (e.g., 'my-service')"
        )
        .trim(),
    description: z
        .string()
        .max(5000, "Description must be at most 5000 characters.")
        .optional(),
    categoryId: z
        .number({ error: "Category is required." })
        .int()
        .positive("Please select a valid category."),
    subCategoryId: z
        .union([z.number().int().positive(), z.undefined()])
        .optional(),
    image: z
        .url("Please enter a valid image URL.")
        .max(255, "Image URL must be at most 255 characters."),
    additionalImages: z
        .array(z.url("Please enter a valid image URL."))
        .max(6, "You can upload a maximum of 6 additional images.")
        .default([]),
    isPublished: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
})

export const updateServiceSchema = createServiceSchema.extend({
    id: z.number({ error: "Service ID is required." }).int().positive(),
})

export type CreateServiceFormValues = z.infer<typeof createServiceSchema>
export type UpdateServiceFormValues = z.infer<typeof updateServiceSchema>
