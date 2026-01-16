"use server"

import {db} from "@/db/config";

export async function getBanner() {
    return await db.query.banner.findFirst({
        where: (banner, {eq}) => eq(banner.isActive, true)
    });
}
