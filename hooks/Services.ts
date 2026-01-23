import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Service, CreateService, UpdateService } from '../types';

const ENDPOINT = '/services';

export const useServices = () => {
    return useQuery<Service[]>({
        queryKey: ['services'],
        queryFn: () => apiClient.get<Service[]>(ENDPOINT),
    });
};

export const useService = (id: number | undefined) => {
    return useQuery<Service>({
        queryKey: ['services', id],
        queryFn: () => apiClient.getById<Service>(ENDPOINT, id!),
        enabled: !!id,
    });
};

export const useCreateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateService) => apiClient.post<Service>(ENDPOINT, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
    });
};

export const useUpdateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: UpdateService) => apiClient.put<Service>(ENDPOINT, id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            queryClient.invalidateQueries({ queryKey: ['services', variables.id] });
        },
    });
};

export const useDeleteService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiClient.delete(ENDPOINT, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
    });
};

// Server-side functions
export async function getServicesSSR(): Promise<Service[]> {
    try {
        return await apiClient.get<Service[]>(ENDPOINT);
    } catch (error) {
        console.error('Failed to fetch services:', error);
        return [];
    }
}

export async function getServiceSSR(id: number): Promise<Service | null> {
    try {
        return await apiClient.getById<Service>(ENDPOINT, id);
    } catch (error) {
        console.error(`Failed to fetch service ${id}:`, error);
        return null;
    }
}
