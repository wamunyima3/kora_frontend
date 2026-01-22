// api/factory.ts
import { CreateGroup, CreateField, CreateService, CreateForm, CreateFormField, CreateSubmission, CreateFormAnswer, Group, Service, Form, FormField, Submission, FormAnswer, Field } from '@/types';
import { mockDb } from './mockClient';

// Use NEXT_PUBLIC_ prefix
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Mock implementation
const mockApiClient = {
    async get<T>(endpoint: string): Promise<T> {
        // Check if we're in browser environment for console logs
        if (typeof window !== 'undefined') {
            console.log(`📨 [MOCK GET] ${endpoint}`);
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // Rest of the mock implementation remains the same...
        switch (endpoint) {
            case '/groups':
                return mockDb.getGroups() as T;
            case '/fields':
                return mockDb.getFields() as T;
            case '/services':
                return mockDb.getServices() as T;
            case '/forms':
                return mockDb.getForms() as T;
            case '/form-fields':
                return mockDb.getFormFields() as T;
            case '/submissions':
                return mockDb.getSubmissions() as T;
            case '/form-answers':
                return mockDb.getFormAnswers() as T;
            default:
                // Handle dynamic routes
                if (endpoint.startsWith('/groups/')) {
                    const id = parseInt(endpoint.split('/')[2]);
                    const group = mockDb.getGroup(id);
                    if (group) return group as T;
                }
                if (endpoint.startsWith('/fields/')) {
                    const id = parseInt(endpoint.split('/')[2]);
                    const field = mockDb.getField(id);
                    if (field) return field as T;
                }
                if (endpoint.startsWith('/fields/group/')) {
                    const groupId = parseInt(endpoint.split('/')[3]);
                    return mockDb.getFieldsByGroup(groupId) as T;
                }
                if (endpoint.startsWith('/forms/service/')) {
                    const serviceId = parseInt(endpoint.split('/')[3]);
                    return mockDb.getFormsByService(serviceId) as T;
                }
                if (endpoint.startsWith('/form-fields/form/')) {
                    const formId = parseInt(endpoint.split('/')[3]);
                    return mockDb.getFormFieldsByForm(formId) as T;
                }
                if (endpoint.startsWith('/submissions/form/')) {
                    const formId = parseInt(endpoint.split('/')[3]);
                    return mockDb.getSubmissionsByForm(formId) as T;
                }
                if (endpoint.startsWith('/form-answers/submission/')) {
                    const submissionId = parseInt(endpoint.split('/')[3]);
                    return mockDb.getFormAnswersBySubmission(submissionId) as T;
                }
                throw new Error(`Mock endpoint not implemented: ${endpoint}`);
        }
    },

    async getById<T>(endpoint: string, id: number): Promise<T> {
        if (typeof window !== 'undefined') {
            console.log(`📨 [MOCK GET BY ID] ${endpoint}/${id}`);
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        switch (endpoint) {
            case '/groups': {
                const group = mockDb.getGroup(id);
                if (group) return group as T;
                throw new Error(`Group with id ${id} not found`);
            }
            case '/fields': {
                const field = mockDb.getField(id);
                if (field) return field as T;
                throw new Error(`Field with id ${id} not found`);
            }
            case '/services': {
                const service = mockDb.getService(id);
                if (service) return service as T;
                throw new Error(`Service with id ${id} not found`);
            }
            case '/forms': {
                const form = mockDb.getForm(id);
                if (form) return form as T;
                throw new Error(`Form with id ${id} not found`);
            }
            case '/form-fields': {
                const formField = mockDb.getFormField(id);
                if (formField) return formField as T;
                throw new Error(`Form Field with id ${id} not found`);
            }
            case '/submissions': {
                const submission = mockDb.getSubmission(id);
                if (submission) return submission as T;
                throw new Error(`Submission with id ${id} not found`);
            }
            case '/form-answers': {
                const formAnswer = mockDb.getFormAnswer(id);
                if (formAnswer) return formAnswer as T;
                throw new Error(`Form Answer with id ${id} not found`);
            }
            default:
                throw new Error(`Mock GET BY ID endpoint not implemented: ${endpoint}`);
        }
    },

    async post<T>(endpoint: string, data: unknown): Promise<T> {
        if (typeof window !== 'undefined') {
            console.log(`📨 [MOCK POST] ${endpoint}`, data);
        }

        await new Promise(resolve => setTimeout(resolve, 300));

        switch (endpoint) {
            case '/groups':
                return mockDb.createGroup(data as CreateGroup) as T;
            case '/fields':
                return mockDb.createField(data as CreateField) as T;
            case '/services':
                return mockDb.createService(data as CreateService) as T;
            case '/forms':
                return mockDb.createForm(data as CreateForm) as T;
            case '/form-fields':
                return mockDb.createFormField(data as CreateFormField) as T;
            case '/submissions':
                return mockDb.createSubmission(data as CreateSubmission) as T;
            case '/form-answers':
                return mockDb.createFormAnswer(data as CreateFormAnswer) as T;
            default:
                throw new Error(`Mock POST endpoint not implemented: ${endpoint}`);
        }
    },

    async put<T>(endpoint: string, id: number, data: unknown): Promise<T> {
        if (typeof window !== 'undefined') {
            console.log(`📨 [MOCK PUT] ${endpoint}/${id}`, data);
        }

        await new Promise(resolve => setTimeout(resolve, 300));

        switch (endpoint) {
            case '/groups': {
                const result = mockDb.updateGroup(id, data as Partial<Group>);
                if (result) return result as T;
                throw new Error('Group not found');
            }
            case '/fields': {
                const result = mockDb.updateField(id, data as Partial<Field>);
                if (result) return result as T;
                throw new Error('Field not found');
            }
            case '/services': {
                const result = mockDb.updateService(id, data as Partial<Service>);
                if (result) return result as T;
                throw new Error('Service not found');
            }
            case '/forms': {
                const result = mockDb.updateForm(id, data as Partial<Form>);
                if (result) return result as T;
                throw new Error('Form not found');
            }
            case '/form-fields': {
                const result = mockDb.updateFormField(id, data as Partial<FormField>);
                if (result) return result as T;
                throw new Error('Form Field not found');
            }
            case '/submissions': {
                const result = mockDb.updateSubmission(id, data as Partial<Submission>);
                if (result) return result as T;
                throw new Error('Submission not found');
            }
            case '/form-answers': {
                const result = mockDb.updateFormAnswer(id, data as Partial<FormAnswer>);
                if (result) return result as T;
                throw new Error('Form Answer not found');
            }
            default:
                throw new Error(`Mock PUT endpoint not implemented: ${endpoint}`);
        }
    },

    async delete(endpoint: string, id: number): Promise<void> {
        if (typeof window !== 'undefined') {
            console.log(`📨 [MOCK DELETE] ${endpoint}/${id}`);
        }

        await new Promise(resolve => setTimeout(resolve, 300));

        switch (endpoint) {
            case '/groups': {
                const success = mockDb.deleteGroup(id);
                if (!success) throw new Error('Group not found');
                return;
            }
            case '/fields': {
                const success = mockDb.deleteField(id);
                if (!success) throw new Error('Field not found');
                return;
            }
            case '/services': {
                const success = mockDb.deleteService(id);
                if (!success) throw new Error('Service not found');
                return;
            }
            case '/forms': {
                const success = mockDb.deleteForm(id);
                if (!success) throw new Error('Form not found');
                return;
            }
            case '/form-fields': {
                const success = mockDb.deleteFormField(id);
                if (!success) throw new Error('Form Field not found');
                return;
            }
            case '/submissions': {
                const success = mockDb.deleteSubmission(id);
                if (!success) throw new Error('Submission not found');
                return;
            }
            case '/form-answers': {
                const success = mockDb.deleteFormAnswer(id);
                if (!success) throw new Error('Form Answer not found');
                return;
            }
            default:
                throw new Error(`Mock DELETE endpoint not implemented: ${endpoint}`);
        }
    }
};

// Initialize mock database when using mock API
if (USE_MOCK_API) {
    mockDb.initialize();
}

export { mockApiClient };
