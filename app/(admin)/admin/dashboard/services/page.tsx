import ServiceList from "@/app/(admin)/admin/dashboard/services/_components/service-list";
import { getTranslations } from 'next-intl/server';


export default async function ServicesPage() {
    const t = await getTranslations('services');

    return (
        <div className={"container mx-auto"}>
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
            <ServiceList />
        </div>
    )
}
