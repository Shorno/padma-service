import { integer, pgTable, serial, varchar, boolean, text } from "drizzle-orm/pg-core";
import { timestamps } from "@/db/schema/columns.helpers";
import { relations } from "drizzle-orm";
import { subCategory } from "./category";

// Subcategory carousel - 3 positions (left, middle, right)
export const subCategoryCarousel = pgTable("sub_category_carousel", {
    id: serial("id").primaryKey(),
    subCategoryId: integer("sub_category_id")
        .notNull()
        .references(() => subCategory.id, { onDelete: "cascade" }),
    position: varchar("position", { length: 20 }).notNull(), // 'left' | 'middle' | 'right'
    ...timestamps
});

// Carousel images with links
export const subCategoryCarouselImage = pgTable("sub_category_carousel_image", {
    id: serial("id").primaryKey(),
    carouselId: integer("carousel_id")
        .notNull()
        .references(() => subCategoryCarousel.id, { onDelete: "cascade" }),
    image: varchar("image", { length: 500 }).notNull(),
    link: text("link"),
    displayOrder: integer("display_order").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    ...timestamps
});

// Relations
export const subCategoryCarouselRelations = relations(subCategoryCarousel, ({ one, many }) => ({
    subCategory: one(subCategory, {
        fields: [subCategoryCarousel.subCategoryId],
        references: [subCategory.id]
    }),
    images: many(subCategoryCarouselImage)
}));

export const subCategoryCarouselImageRelations = relations(subCategoryCarouselImage, ({ one }) => ({
    carousel: one(subCategoryCarousel, {
        fields: [subCategoryCarouselImage.carouselId],
        references: [subCategoryCarousel.id]
    })
}));

// Types
export type SubCategoryCarousel = typeof subCategoryCarousel.$inferSelect;
export type SubCategoryCarouselImage = typeof subCategoryCarouselImage.$inferSelect;
