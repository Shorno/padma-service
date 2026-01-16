import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrders } from "@/app/(admin)/admin/dashboard/orders/actions/get-orders";
import getServices from "@/app/(admin)/admin/dashboard/services/actions/get-services";

// Hook for admin orders with automatic refetching
export function useAdminOrders() {
    return useQuery({
        queryKey: ['admin-orders'],
        queryFn: async () => {
            return await getOrders();
        },
        staleTime: 1000 * 30, // Refresh every 30 seconds
        refetchInterval: 1000 * 60, // Poll every minute for new orders
    });
}

// Hook for admin services
export function useAdminServices() {
    return useQuery({
        queryKey: ['admin-services'],
        queryFn: async () => {
            return await getServices();
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
}

// Hook to invalidate related queries after mutations
export function useInvalidateQueries() {
    const queryClient = useQueryClient();

    return {
        invalidateServices: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            queryClient.invalidateQueries({ queryKey: ['admin-services'] });
        },
        invalidateOrders: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
            queryClient.invalidateQueries({ queryKey: ['order-status'] });
        },
        invalidateCategories: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['categories-with-subs'] });
        },
    };
}
