// Import mock client directly for testing
import { mockApiClient as client } from '../api/factory';
import { mockDb } from '../api/mockClient';
import { CreateGroup } from '../types';

async function runTests() {
    // Initialize the mock database
    await mockDb.initialize();

    console.log('🚀 Starting Mock API Tests...');

    try {
        // 1. Test Groups
        console.log('\n--- Testing Groups ---');
        const groups = await client.get<any[]>('/groups');
        console.log(`✅ Fetched ${groups.length} groups`);

        const newGroupData: CreateGroup = { group_name: 'Test Group' };
        const newGroup = await client.post<any>('/groups', newGroupData);
        console.log(`✅ Created group with ID: ${newGroup.id}`);

        const fetchedGroup = await client.getById<any>('/groups', newGroup.id);
        console.log(`✅ Fetched group by ID: ${fetchedGroup.id}`);

        // Clean up
        await client.delete('/groups', newGroup.id);
        console.log(`✅ Deleted group ${newGroup.id}`);


        // 2. Test Services
        console.log('\n--- Testing Services ---');
        const services = await client.get<any[]>('/services');
        console.log(`✅ Fetched ${services.length} services`);

        const newService = await client.post<any>('/services', { service_name: 'Test Service' });
        console.log(`✅ Created service with ID: ${newService.id}`);

        await client.delete('/services', newService.id);
        console.log(`✅ Deleted service ${newService.id}`);

        // 3. Test Forms
        console.log('\n--- Testing Forms ---');
        const forms = await client.get<any[]>('/forms');
        console.log(`✅ Fetched ${forms.length} forms`);

        // 4. Test Forms by Service
        console.log('\n--- Testing Forms by Service ---');
        if (services.length > 0) {
            const serviceId = services[0].id;
            const formsByService = await client.get<any[]>(`/forms/service/${serviceId}`);
            console.log(`✅ Fetched ${formsByService.length} forms for service ${serviceId}`);
        }

        // 5. Test Form Fields by Form
        console.log('\n--- Testing Form Fields by Form ---');
        if (forms.length > 0) {
            const formId = forms[0].id;
            const formFields = await client.get<any[]>(`/form-fields/form/${formId}`);
            console.log(`✅ Fetched ${formFields.length} form fields for form ${formId}`);
        }

        console.log('\n✨ All tests passed successfully!');

    } catch (error) {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    }
}

runTests();
