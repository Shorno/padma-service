import { pgTable, serial, varchar, boolean, text } from "drizzle-orm/pg-core";
import { timestamps } from "@/db/schema/columns.helpers";

export const banner = pgTable("banner", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    image: varchar("image", { length: 500 }).notNull(),
    link: text("link"),
    isActive: boolean("is_active").default(true).notNull(),
    ...timestamps
});

export type Banner = typeof banner.$inferSelect;
export type NewBanner = typeof banner.$inferInsert;
