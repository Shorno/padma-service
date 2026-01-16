import { integer, pgTable, serial, varchar, boolean, text } from "drizzle-orm/pg-core";
import { timestamps } from "@/db/schema/columns.helpers";
import { relations } from "drizzle-orm";
import { category, subCategory } from "./category";

export const service = pgTable("service", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 150 }).notNull(),
    slug: varchar("slug", { length: 150 }).notNull().unique(),
    description: text("description"),
    categoryId: integer("category_id")
        .notNull()
        .references(() => category.id, { onDelete: "cascade" }),
    subCategoryId: integer("sub_category_id")
        .references(() => subCategory.id, { onDelete: "set null" }),

    image: varchar("image", { length: 255 }).notNull(),

    isPublished: boolean("is_published").default(true).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),

    ...timestamps
});

export const serviceImage = pgTable("service_image", {
    id: serial("id").primaryKey(),
    serviceId: integer("service_id")
        .notNull()
        .references(() => service.id, { onDelete: "cascade" }),
    imageUrl: varchar("image_url", { length: 255 }).notNull(),
    ...timestamps
});

export const serviceRelations = relations(service, ({ one, many }) => ({
    category: one(category, {
        fields: [service.categoryId],
        references: [category.id]
    }),
    subCategory: one(subCategory, {
        fields: [service.subCategoryId],
        references: [subCategory.id]
    }),
    images: many(serviceImage)
}));

export const serviceImageRelations = relations(serviceImage, ({ one }) => ({
    service: one(service, {
        fields: [serviceImage.serviceId],
        references: [service.id]
    })
}));

export type Service = typeof service.$inferSelect;
export type ServiceImage = typeof serviceImage.$inferSelect;
export type NewService = typeof service.$inferInsert;
export type NewServiceImage = typeof serviceImage.$inferInsert;

export interface ServiceWithRelations extends Service {
    category: {
        name: string;
        slug: string;
    };
    subCategory?: {
        name: string;
    } | null;
    images?: ServiceImage[];
}
