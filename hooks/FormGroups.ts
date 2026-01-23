import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { CreateFormGroup, FormGroup, UpdateFormGroup } from '../types';

const ENDPOINT = '/form-groups';

export const useFormGroups = () => {
    return useQuery<FormGroup[]>({
        queryKey: ['form-groups'],
        queryFn: () => apiClient.get<FormGroup[]>(ENDPOINT),
    });
};

export const useFormGroup = (id: number) => {
    return useQuery<FormGroup>({
        queryKey: ['form-groups', id],
        queryFn: () => apiClient.getById<FormGroup>(ENDPOINT, id),
        enabled: !!id,
    });
};

export const useCreateFormGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateFormGroup) => apiClient.post<FormGroup>(ENDPOINT, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['form-groups'] });
        },
    });
};

export const useUpdateFormGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: UpdateFormGroup) => apiClient.put<FormGroup>(ENDPOINT, id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['form-groups'] });
            queryClient.invalidateQueries({ queryKey: ['form-groups', variables.id] });
        },
    });
};

export const useDeleteFormGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiClient.delete(ENDPOINT, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['form-groups'] });
        },
    });
};

// Server-side functions
export async function getFormGroupsSSR(): Promise<FormGroup[]> {
    try {
        return await apiClient.get<FormGroup[]>(ENDPOINT);
    } catch (error) {
        console.error('Failed to fetch form-groups:', error);
        return [];
    }
}

export async function getFormGroupSSR(id: number): Promise<FormGroup | null> {
    try {
        return await apiClient.getById<FormGroup>(ENDPOINT, id);
    } catch (error) {
        console.error(`Failed to fetch form-group ${id}:`, error);
        return null;
    }
}
