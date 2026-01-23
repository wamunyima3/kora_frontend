import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { CreateReservedName, ReservedName, UpdateReservedName } from '../types';

const ENDPOINT = '/reserved-names';

export const useReservedNames = () => {
    return useQuery<ReservedName[]>({
        queryKey: ['reservedNames'],
        queryFn: () => apiClient.get<ReservedName[]>(ENDPOINT),
    });
};

export const useReservedName = (id: number) => {
    return useQuery<ReservedName>({
        queryKey: ['reservedNames', id],
        queryFn: () => apiClient.getById<ReservedName>(ENDPOINT, id),
        enabled: !!id,
    });
};

export const useCreateReservedName = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateReservedName) => apiClient.post<ReservedName>(ENDPOINT, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservedNames'] });
        },
    });
};

export const useUpdateReservedName = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: UpdateReservedName) => apiClient.put<ReservedName>(ENDPOINT, id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['reservedNames'] });
            queryClient.invalidateQueries({ queryKey: ['reservedNames', variables.id] });
        },
    });
};

export const useDeleteReservedName = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiClient.delete(ENDPOINT, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservedNames'] });
        },
    });
};

export const useCheckReservedName = () => {
    return useMutation({
        mutationFn: (data: { name: string }) => apiClient.post<ReservedName[]>(`${ENDPOINT}/check`, data),
    });
};

// Server-side functions
export async function getReservedNamesSSR(): Promise<ReservedName[]> {
    try {
        return await apiClient.get<ReservedName[]>(ENDPOINT);
    } catch (error) {
        console.error('Failed to fetch reserved names:', error);
        return [];
    }
}

export async function getReservedNameSSR(id: number): Promise<ReservedName | null> {
    try {
        return await apiClient.getById<ReservedName>(ENDPOINT, id);
    } catch (error) {
        console.error(`Failed to fetch reserved name ${id}:`, error);
        return null;
    }
}
