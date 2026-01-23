import { NextResponse } from 'next/server';
import { mockApiClient } from '@/api/factory';

export async function GET() {
    try {
        const groups = await mockApiClient.get('/form-groups');
        const fields = await mockApiClient.get('/fields');
        const formFields = await mockApiClient.get('/form-fields');

        return NextResponse.json({
            success: true,
            counts: {
                formGroups: (groups as any[]).length,
                fields: (fields as any[]).length,
                formFields: (formFields as any[]).length
            },
            sampleGroup: (groups as any[])[0],
            sampleField: (fields as any[]).find((f: any) => f.collection_id !== null),
            sampleFormField: (formFields as any[]).find((ff: any) => ff.form_group_id !== undefined)
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
