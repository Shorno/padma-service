import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/app/(client)/actions/get-services";

interface ServicesParams {
    category?: string;
    subcategory?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sort?: string;
    search?: string;
}

export function useServices(params: ServicesParams) {
    return useQuery({
        queryKey: ['services', params],
        queryFn: async () => {
            return await getServices(params);
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    });
}

// Hook for featured services on homepage
export function useFeaturedServices() {
    return useQuery({
        queryKey: ['services', 'featured'],
        queryFn: async () => {
            return await getServices({ sort: 'featured' });
        },
        staleTime: 1000 * 60 * 10, // Cache for 10 minutes (featured services change less)
        gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    });
}
