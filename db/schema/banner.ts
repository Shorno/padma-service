import { pgTable, serial, varchar, boolean, text, integer } from "drizzle-orm/pg-core";
import { timestamps } from "@/db/schema/columns.helpers";
import { relations } from "drizzle-orm";

// Main banner (single title, active status)
export const banner = pgTable("banner", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    ...timestamps
});

// Banner images (multiple images with individual links)
export const bannerImage = pgTable("banner_image", {
    id: serial("id").primaryKey(),
    bannerId: integer("banner_id").notNull().references(() => banner.id, { onDelete: "cascade" }),
    image: varchar("image", { length: 500 }).notNull(),
    link: text("link"),
    displayOrder: integer("display_order").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    ...timestamps
});

// Relations
export const bannerRelations = relations(banner, ({ many }) => ({
    images: many(bannerImage)
}));

export const bannerImageRelations = relations(bannerImage, ({ one }) => ({
    banner: one(banner, {
        fields: [bannerImage.bannerId],
        references: [banner.id]
    })
}));

export type Banner = typeof banner.$inferSelect;
export type NewBanner = typeof banner.$inferInsert;
export type BannerImage = typeof bannerImage.$inferSelect;
export type NewBannerImage = typeof bannerImage.$inferInsert;
