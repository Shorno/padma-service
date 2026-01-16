"use client";

import getServices from "@/app/(admin)/admin/dashboard/services/actions/get-services";
import ServiceTable from "@/app/(admin)/admin/dashboard/services/_components/service-table";
import { useServiceColumns } from "@/app/(admin)/admin/dashboard/services/_components/service-columns";
import { useQuery } from "@tanstack/react-query";
import ServiceTableSkeleton from "@/app/(admin)/admin/dashboard/services/_components/service-table-skeleton";

export default function ServiceList() {
    const columns = useServiceColumns();

    const { data: services = [], isLoading } = useQuery({
        queryKey: ["admin-services"],
        queryFn: getServices,
    });

    if (isLoading) {
        return <ServiceTableSkeleton />;
    }

    return <ServiceTable columns={columns} data={services} />;
}
