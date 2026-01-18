import { integer, pgTable, serial, varchar, boolean } from "drizzle-orm/pg-core";
import { timestamps } from "@/db/schema/columns.helpers";
import { relations } from "drizzle-orm";
import { subCategory } from "./category";
import { service } from "./service";

// Homepage sections - curated service collections for the homepage
export const homepageSection = pgTable("homepage_section", {
    id: serial("id").primaryKey(),
    subCategoryId: integer("sub_category_id")
        .notNull()
        .references(() => subCategory.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 150 }), // Optional custom title (uses subcategory name if null)
    displayOrder: integer("display_order").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    ...timestamps
});

// Services within each homepage section
export const homepageSectionItem = pgTable("homepage_section_item", {
    id: serial("id").primaryKey(),
    sectionId: integer("section_id")
        .notNull()
        .references(() => homepageSection.id, { onDelete: "cascade" }),
    serviceId: integer("service_id")
        .notNull()
        .references(() => service.id, { onDelete: "cascade" }),
    displayOrder: integer("display_order").default(0).notNull(),
    ...timestamps
});

// Relations
export const homepageSectionRelations = relations(homepageSection, ({ one, many }) => ({
    subCategory: one(subCategory, {
        fields: [homepageSection.subCategoryId],
        references: [subCategory.id]
    }),
    items: many(homepageSectionItem)
}));

export const homepageSectionItemRelations = relations(homepageSectionItem, ({ one }) => ({
    section: one(homepageSection, {
        fields: [homepageSectionItem.sectionId],
        references: [homepageSection.id]
    }),
    service: one(service, {
        fields: [homepageSectionItem.serviceId],
        references: [service.id]
    })
}));

// Types
export type HomepageSection = typeof homepageSection.$inferSelect;
export type HomepageSectionItem = typeof homepageSectionItem.$inferSelect;
export type NewHomepageSection = typeof homepageSection.$inferInsert;
export type NewHomepageSectionItem = typeof homepageSectionItem.$inferInsert;

export interface HomepageSectionWithRelations extends HomepageSection {
    subCategory: {
        id: number;
        name: string;
        slug: string;
    };
    items: (HomepageSectionItem & {
        service: {
            id: number;
            name: string;
            slug: string;
            image: string;
        };
    })[];
}
