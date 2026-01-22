import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Use NEXT_PUBLIC_ prefix for client-side environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // Generic CRUD methods
    async get<T>(endpoint: string): Promise<T> {
        const response: AxiosResponse<T> = await this.client.get(endpoint);
        return response.data;
    }

    async getById<T>(endpoint: string, id: number): Promise<T> {
        const response: AxiosResponse<T> = await this.client.get(`${endpoint}/${id}`);
        return response.data;
    }

    async post<T>(endpoint: string, data: unknown): Promise<T> {
        const response: AxiosResponse<T> = await this.client.post(endpoint, data);
        return response.data;
    }

    async put<T>(endpoint: string, id: number, data: unknown): Promise<T> {
        const response: AxiosResponse<T> = await this.client.put(`${endpoint}/${id}`, data);
        return response.data;
    }

    async delete(endpoint: string, id: number): Promise<void> {
        await this.client.delete(`${endpoint}/${id}`);
    }
}

import { mockApiClient } from './factory';

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Export the appropriate client based on environment or create a new real client
export const apiClient = USE_MOCK_API ? mockApiClient : new ApiClient();
