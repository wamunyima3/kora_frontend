
import { mockApiClient } from './api/factory'; // Adjust path if needed, assuming running from root with ts-node or similar
import { mockDb } from './api/mockClient';

async function verify() {
    console.log('Running Verification...');

    await mockDb.initialize();

    const groups = await mockApiClient.get<any[]>('/groups');
    console.log(`Groups: ${groups.length}`);
    if (groups.length === 0) throw new Error('No groups found');

    const forms = await mockApiClient.get<any[]>('/forms');
    console.log(`Forms: ${forms.length}`);
    forms.forEach(f => {
        if (!f.form_name) throw new Error(`Form ${f.id} missing form_name`);
    });

    const reservedNames = await mockApiClient.get<any[]>('/reserved-names');
    console.log(`ReservedNames: ${reservedNames.length}`);
    if (reservedNames.length === 0) throw new Error('No reserved names found');

    const submissions = await mockApiClient.get<any[]>('/submissions');
    console.log(`Submissions: ${submissions.length}`);
    submissions.forEach(s => {
        console.log(`Submission ${s.id}: FormID derived=${s.form_id}, ServicesID=${s.services_id}`);
        // s.form_id might be undefined if no answers, but for mock data we expect hydration
    });

    console.log('Verification Complete.');
}

if (require.main === module) {
    verify().catch(console.error);
}
