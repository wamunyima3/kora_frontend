// api/mockClient.ts
import {
    Group, Field, Service, Form, FormField, Submission, FormAnswer,
    CreateGroup, CreateField, CreateService, CreateForm, CreateFormField, CreateSubmission, CreateFormAnswer
} from '../types';

// In-memory mock database
class MockDatabase {
    private groups: Group[] = [];
    private fields: Field[] = [];
    private services: Service[] = [];
    private forms: Form[] = [];
    private formFields: FormField[] = [];
    private submissions: Submission[] = [];
    private formAnswers: FormAnswer[] = [];

    private idCounters = {
        groups: 1,
        fields: 1,
        services: 1,
        forms: 1,
        formFields: 1,
        submissions: 1,
        formAnswers: 1
    };

    // Initialize with mock data
    async initialize() {
        console.log('🔄 Initializing mock database...');

        // Generate mock data
        const mockGroups = [
            { id: this.idCounters.groups++, group_name: 'Personal Information' },
            { id: this.idCounters.groups++, group_name: 'Contact Details' },
            { id: this.idCounters.groups++, group_name: 'Employment History' },
            { id: this.idCounters.groups++, group_name: 'Medical Information' },
        ];
        this.groups = mockGroups;

        const mockServices = [
            { id: this.idCounters.services++, service_name: 'User Registration' },
            { id: this.idCounters.services++, service_name: 'Support Ticket System' },
            { id: this.idCounters.services++, service_name: 'Feedback Collection' },
        ];
        this.services = mockServices;

        const mockFields = [
            { id: this.idCounters.fields++, label: 'First Name', data_type: 'text', group_id: mockGroups[0].id },
            { id: this.idCounters.fields++, label: 'Last Name', data_type: 'text', group_id: mockGroups[0].id },
            { id: this.idCounters.fields++, label: 'Email Address', data_type: 'email', group_id: mockGroups[1].id },
            { id: this.idCounters.fields++, label: 'Phone Number', data_type: 'tel', group_id: mockGroups[1].id },
            { id: this.idCounters.fields++, label: 'Date of Birth', data_type: 'date', group_id: mockGroups[0].id },
            { id: this.idCounters.fields++, label: 'Company Name', data_type: 'text', group_id: mockGroups[0].id },
            { id: this.idCounters.fields++, label: 'Subject', data_type: 'text', group_id: mockGroups[2].id },
            { id: this.idCounters.fields++, label: 'Message', data_type: 'text', group_id: mockGroups[2].id },
            { id: this.idCounters.fields++, label: 'Priority', data_type: 'text', group_id: mockGroups[2].id },
        ];
        this.fields = mockFields;

        const mockForms = [
            { id: this.idCounters.forms++, title: 'User Registration', description: 'New user signup form', service_id: mockServices[0].id },
            { id: this.idCounters.forms++, title: 'Support Request', description: 'Technical support form', service_id: mockServices[1].id },
        ];
        this.forms = mockForms;

        const mockFormFields = [
            // Form 1 (User Registration) fields
            { id: this.idCounters.formFields++, form_id: mockForms[0].id, field_id: mockFields[0].id, validation: 'required' },
            { id: this.idCounters.formFields++, form_id: mockForms[0].id, field_id: mockFields[1].id, validation: 'required' },
            { id: this.idCounters.formFields++, form_id: mockForms[0].id, field_id: mockFields[2].id, validation: 'required|email' },
            { id: this.idCounters.formFields++, form_id: mockForms[0].id, field_id: mockFields[3].id, validation: 'required' },
            { id: this.idCounters.formFields++, form_id: mockForms[0].id, field_id: mockFields[4].id, validation: 'required' },
            { id: this.idCounters.formFields++, form_id: mockForms[0].id, field_id: mockFields[5].id, validation: null },
            // Form 2 (Support Request) fields
            { id: this.idCounters.formFields++, form_id: mockForms[1].id, field_id: mockFields[2].id, validation: 'required|email' },
            { id: this.idCounters.formFields++, form_id: mockForms[1].id, field_id: mockFields[6].id, validation: 'required' },
            { id: this.idCounters.formFields++, form_id: mockForms[1].id, field_id: mockFields[7].id, validation: 'required' },
            { id: this.idCounters.formFields++, form_id: mockForms[1].id, field_id: mockFields[8].id, validation: null },
        ];
        this.formFields = mockFormFields;

        const mockSubmissions = [
            { id: this.idCounters.submissions++, form_id: mockForms[0].id },
            { id: this.idCounters.submissions++, form_id: mockForms[0].id },
            { id: this.idCounters.submissions++, form_id: mockForms[1].id },
        ];
        this.submissions = mockSubmissions;

        const mockFormAnswers = [
            // Submission 1 - User Registration (complete)
            { id: this.idCounters.formAnswers++, form_id: mockForms[0].id, field_id: mockFields[0].id, answer: 'John', submission_id: mockSubmissions[0].id },
            { id: this.idCounters.formAnswers++, form_id: mockForms[0].id, field_id: mockFields[1].id, answer: 'Doe', submission_id: mockSubmissions[0].id },
            { id: this.idCounters.formAnswers++, form_id: mockForms[0].id, field_id: mockFields[2].id, answer: 'john.doe@example.com', submission_id: mockSubmissions[0].id },
            { id: this.idCounters.formAnswers++, form_id: mockForms[0].id, field_id: mockFields[3].id, answer: '+1-555-0123', submission_id: mockSubmissions[0].id },
            { id: this.idCounters.formAnswers++, form_id: mockForms[0].id, field_id: mockFields[4].id, answer: '1990-05-15', submission_id: mockSubmissions[0].id },
            { id: this.idCounters.formAnswers++, form_id: mockForms[0].id, field_id: mockFields[5].id, answer: 'Acme Corporation', submission_id: mockSubmissions[0].id },
            // Submission 2 - User Registration (partial)
            { id: this.idCounters.formAnswers++, form_id: mockForms[0].id, field_id: mockFields[0].id, answer: 'Jane', submission_id: mockSubmissions[1].id },
            { id: this.idCounters.formAnswers++, form_id: mockForms[0].id, field_id: mockFields[1].id, answer: 'Smith', submission_id: mockSubmissions[1].id },
            { id: this.idCounters.formAnswers++, form_id: mockForms[0].id, field_id: mockFields[2].id, answer: 'jane.smith@example.com', submission_id: mockSubmissions[1].id },
            { id: this.idCounters.formAnswers++, form_id: mockForms[0].id, field_id: mockFields[3].id, answer: '+1-555-0456', submission_id: mockSubmissions[1].id },
            // Submission 3 - Support Request (complete)
            { id: this.idCounters.formAnswers++, form_id: mockForms[1].id, field_id: mockFields[2].id, answer: 'support@example.com', submission_id: mockSubmissions[2].id },
            { id: this.idCounters.formAnswers++, form_id: mockForms[1].id, field_id: mockFields[6].id, answer: 'Unable to login to my account', submission_id: mockSubmissions[2].id },
            { id: this.idCounters.formAnswers++, form_id: mockForms[1].id, field_id: mockFields[7].id, answer: 'I have been trying to login for the past hour but keep getting an error message. Please help me resolve this issue.', submission_id: mockSubmissions[2].id },
            { id: this.idCounters.formAnswers++, form_id: mockForms[1].id, field_id: mockFields[8].id, answer: 'High', submission_id: mockSubmissions[2].id },
        ];
        this.formAnswers = mockFormAnswers;

        console.log('✅ Mock database initialized with sample data');
        console.log(`📊 Statistics:
      Groups: ${this.groups.length}
      Services: ${this.services.length}
      Fields: ${this.fields.length}
      Forms: ${this.forms.length}
      FormFields: ${this.formFields.length}
      Submissions: ${this.submissions.length}
      FormAnswers: ${this.formAnswers.length}
    `);
    }

    // CRUD operations for Groups
    getGroups(): Group[] {
        return [...this.groups];
    }

    getGroup(id: number): Group | undefined {
        return this.groups.find(g => g.id === id);
    }

    createGroup(data: CreateGroup): Group {
        const newGroup: Group = {
            id: this.idCounters.groups++,
            ...data
        };
        this.groups.push(newGroup);
        return newGroup;
    }

    updateGroup(id: number, data: Partial<Group>): Group | null {
        const index = this.groups.findIndex(g => g.id === id);
        if (index === -1) return null;

        this.groups[index] = { ...this.groups[index], ...data };
        return this.groups[index];
    }

    deleteGroup(id: number): boolean {
        const index = this.groups.findIndex(g => g.id === id);
        if (index === -1) return false;

        this.groups.splice(index, 1);
        return true;
    }

    // Similar methods for other entities...
    getFields(): Field[] {
        return [...this.fields];
    }

    getField(id: number): Field | undefined {
        return this.fields.find(f => f.id === id);
    }

    createField(data: CreateField): Field {
        const newField: Field = {
            id: this.idCounters.fields++,
            ...data
        };
        this.fields.push(newField);
        return newField;
    }

    getFieldsByGroup(groupId: number): Field[] {
        return this.fields.filter(f => f.group_id === groupId);
    }

    updateField(id: number, data: Partial<Field>): Field | null {
        const index = this.fields.findIndex(f => f.id === id);
        if (index === -1) return null;

        this.fields[index] = { ...this.fields[index], ...data };
        return this.fields[index];
    }

    deleteField(id: number): boolean {
        const index = this.fields.findIndex(f => f.id === id);
        if (index === -1) return false;

        this.fields.splice(index, 1);
        return true;
    }

    // Add similar CRUD methods for other tables...
    // Services
    getServices(): Service[] { return [...this.services]; }
    getService(id: number): Service | undefined { return this.services.find(s => s.id === id); }
    createService(data: CreateService): Service {
        const newService: Service = {
            id: this.idCounters.services++,
            ...data
        };
        this.services.push(newService);
        return newService;
    }
    updateService(id: number, data: Partial<Service>): Service | null {
        const index = this.services.findIndex(s => s.id === id);
        if (index === -1) return null;
        this.services[index] = { ...this.services[index], ...data };
        return this.services[index];
    }
    deleteService(id: number): boolean {
        const index = this.services.findIndex(s => s.id === id);
        if (index === -1) return false;
        this.services.splice(index, 1);
        return true;
    }

    // Forms
    getForms(): Form[] { return [...this.forms]; }
    getForm(id: number): Form | undefined { return this.forms.find(f => f.id === id); }
    createForm(data: CreateForm): Form {
        const newForm: Form = {
            id: this.idCounters.forms++,
            ...data
        };
        this.forms.push(newForm);
        return newForm;
    }
    updateForm(id: number, data: Partial<Form>): Form | null {
        const index = this.forms.findIndex(f => f.id === id);
        if (index === -1) return null;
        this.forms[index] = { ...this.forms[index], ...data };
        return this.forms[index];
    }
    deleteForm(id: number): boolean {
        const index = this.forms.findIndex(f => f.id === id);
        if (index === -1) return false;
        this.forms.splice(index, 1);
        return true;
    }
    getFormsByService(serviceId: number): Form[] {
        return this.forms.filter(f => f.service_id === serviceId);
    }

    // FormFields
    getFormFields(): FormField[] { return [...this.formFields]; }
    getFormField(id: number): FormField | undefined { return this.formFields.find(ff => ff.id === id); }
    createFormField(data: CreateFormField): FormField {
        const newFormField: FormField = {
            id: this.idCounters.formFields++,
            ...data
        };
        this.formFields.push(newFormField);
        return newFormField;
    }
    updateFormField(id: number, data: Partial<FormField>): FormField | null {
        const index = this.formFields.findIndex(ff => ff.id === id);
        if (index === -1) return null;
        this.formFields[index] = { ...this.formFields[index], ...data };
        return this.formFields[index];
    }
    deleteFormField(id: number): boolean {
        const index = this.formFields.findIndex(ff => ff.id === id);
        if (index === -1) return false;
        this.formFields.splice(index, 1);
        return true;
    }
    getFormFieldsByForm(formId: number): FormField[] {
        return this.formFields.filter(ff => ff.form_id === formId);
    }
    getFormFieldsByField(fieldId: number): FormField[] {
        return this.formFields.filter(ff => ff.field_id === fieldId);
    }

    // Submissions
    getSubmissions(): Submission[] { 
        return this.submissions.map(submission => ({
            ...submission,
            formAnswers: this.formAnswers.filter(fa => fa.submission_id === submission.id),
            formFields: this.formFields.filter(ff => ff.form_id === submission.form_id)
        }));
    }
    getSubmission(id: number): Submission | undefined { 
        const submission = this.submissions.find(s => s.id === id);
        if (!submission) return undefined;
        
        return {
            ...submission,
            formAnswers: this.formAnswers.filter(fa => fa.submission_id === submission.id),
            formFields: this.formFields.filter(ff => ff.form_id === submission.form_id)
        };
    }
    createSubmission(data: CreateSubmission): Submission {
        // Extract formAnswers if provided (they should be created separately, but handle if included)
        const { formAnswers: providedFormAnswers, formFields: _, ...submissionData } = data;
        
        const baseSubmission = {
            id: this.idCounters.submissions++,
            form_id: submissionData.form_id
        };
        this.submissions.push(baseSubmission);
        
        // If formAnswers are provided in the creation data, create them
        if (providedFormAnswers && providedFormAnswers.length > 0) {
            providedFormAnswers.forEach(answerData => {
                this.createFormAnswer({
                    ...answerData,
                    submission_id: baseSubmission.id
                });
            });
        }
        
        // Return full Submission with formAnswers and formFields
        return {
            ...baseSubmission,
            formAnswers: this.formAnswers.filter(fa => fa.submission_id === baseSubmission.id),
            formFields: this.formFields.filter(ff => ff.form_id === baseSubmission.form_id)
        };
    }
    updateSubmission(id: number, data: Partial<Submission>): Submission | null {
        const index = this.submissions.findIndex(s => s.id === id);
        if (index === -1) return null;
        
        // Update only the base submission fields (form_id), ignore formAnswers and formFields in update
        const { formAnswers: _, formFields: __, ...updateData } = data;
        this.submissions[index] = { ...this.submissions[index], ...updateData };
        
        // Return full Submission with formAnswers and formFields
        return {
            ...this.submissions[index],
            formAnswers: this.formAnswers.filter(fa => fa.submission_id === id),
            formFields: this.formFields.filter(ff => ff.form_id === this.submissions[index].form_id)
        };
    }
    deleteSubmission(id: number): boolean {
        const index = this.submissions.findIndex(s => s.id === id);
        if (index === -1) return false;
        this.submissions.splice(index, 1);
        return true;
    }
    getSubmissionsByForm(formId: number): Submission[] {
        return this.submissions
            .filter(s => s.form_id === formId)
            .map(submission => ({
                ...submission,
                formAnswers: this.formAnswers.filter(fa => fa.submission_id === submission.id),
                formFields: this.formFields.filter(ff => ff.form_id === submission.form_id)
            }));
    }

    // FormAnswers
    getFormAnswers(): FormAnswer[] { return [...this.formAnswers]; }
    getFormAnswer(id: number): FormAnswer | undefined { return this.formAnswers.find(fa => fa.id === id); }
    createFormAnswer(data: CreateFormAnswer): FormAnswer {
        const newFormAnswer: FormAnswer = {
            id: this.idCounters.formAnswers++,
            ...data
        };
        this.formAnswers.push(newFormAnswer);
        return newFormAnswer;
    }
    updateFormAnswer(id: number, data: Partial<FormAnswer>): FormAnswer | null {
        const index = this.formAnswers.findIndex(fa => fa.id === id);
        if (index === -1) return null;
        this.formAnswers[index] = { ...this.formAnswers[index], ...data };
        return this.formAnswers[index];
    }
    deleteFormAnswer(id: number): boolean {
        const index = this.formAnswers.findIndex(fa => fa.id === id);
        if (index === -1) return false;
        this.formAnswers.splice(index, 1);
        return true;
    }
    getFormAnswersBySubmission(submissionId: number): FormAnswer[] {
        return this.formAnswers.filter(fa => fa.submission_id === submissionId);
    }
    getFormAnswersByForm(formId: number): FormAnswer[] {
        return this.formAnswers.filter(fa => fa.form_id === formId);
    }
    getFormAnswersByField(fieldId: number): FormAnswer[] {
        return this.formAnswers.filter(fa => fa.field_id === fieldId);
    }
}

export const mockDb = new MockDatabase();
