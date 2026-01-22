// api/mockClient.ts
import {
    Group, Field, Service, Form, FormField, Submission, FormAnswer,
    CreateGroup, CreateField, CreateService, CreateForm, CreateFormField, CreateSubmission, CreateFormAnswer,
    DataType, Collection, CollectionItem, User,
    CreateDataType, CreateCollection, CreateCollectionItem, CreateUser
} from '../types';

// In-memory mock database
class MockDatabase {
    private groups: Group[] = [];
    private dataTypes: DataType[] = [];
    private fields: Field[] = [];
    private services: Service[] = [];
    private forms: Form[] = [];
    private formFields: FormField[] = [];
    private users: User[] = [];
    private submissions: Submission[] = [];
    private formAnswers: FormAnswer[] = [];
    private collections: Collection[] = [];
    private collectionItems: CollectionItem[] = [];

    private idCounters = {
        groups: 1,
        dataTypes: 1,
        fields: 1,
        services: 1,
        forms: 1,
        formFields: 1,
        users: 1,
        submissions: 1,
        formAnswers: 1,
        collections: 1,
        collectionItems: 1
    };

    // Initialize with mock data
    async initialize() {
        console.log('🔄 Initializing mock database...');

        this.groups = [
            { id: 1, group_name: 'Person' },
            { id: 2, group_name: 'Address' },
            { id: 3, group_name: 'Entity' }
        ];

        this.dataTypes = [
            { id: 1, data_type: 'Text' },
            { id: 2, data_type: 'Number' },
            { id: 3, data_type: 'Date' },
            { id: 4, data_type: 'CheckBox' },
            { id: 5, data_type: 'Dropdown' },
            { id: 6, data_type: 'Table' }
        ];

        this.fields = [
            { id: 1, label: 'First Name', data_type_id: 1, group_id: 1, status: true },
            { id: 2, label: 'Middle Name', data_type_id: 1, group_id: 1, status: true },
            { id: 3, label: 'Last Name', data_type_id: 1, group_id: 1, status: true },
            { id: 4, label: 'Gender', data_type_id: 5, group_id: 1, status: true },
            { id: 5, label: 'Date of Birth', data_type_id: 3, group_id: 1, status: true },
            { id: 6, label: 'Nationality', data_type_id: 5, group_id: 1, status: true },
            { id: 7, label: 'Identity Type', data_type_id: 5, group_id: 1, status: true },
            { id: 8, label: 'Identity Number', data_type_id: 1, group_id: 1, status: true },
            { id: 9, label: 'Entity Name', data_type_id: 1, group_id: 3, status: true },
            { id: 10, label: 'Body Corporate Type', data_type_id: 5, group_id: null, status: true },
            { id: 11, label: 'Registration Number', data_type_id: 2, group_id: 3, status: true },
            { id: 12, label: 'Country of Incorporation', data_type_id: 5, group_id: null, status: true },
            { id: 13, label: 'Registration Date', data_type_id: 3, group_id: 3, status: true },
            { id: 14, label: 'Phone Number', data_type_id: 1, group_id: 1, status: true },
            { id: 15, label: 'Email Address', data_type_id: 1, group_id: 1, status: true },
            { id: 16, label: 'Country', data_type_id: 5, group_id: 2, status: true },
            { id: 17, label: 'Province', data_type_id: 5, group_id: 2, status: true },
            { id: 18, label: 'Town', data_type_id: 5, group_id: 2, status: true },
            { id: 19, label: 'Area', data_type_id: 5, group_id: 2, status: true },
            { id: 20, label: 'Street', data_type_id: 1, group_id: 2, status: true },
            { id: 21, label: 'Plot House Village', data_type_id: 1, group_id: 2, status: true },
            { id: 22, label: 'Entity Type', data_type_id: 5, group_id: 3, status: true },
            { id: 23, label: 'Entity Limit', data_type_id: 5, group_id: 3, status: true },
            { id: 24, label: 'Entity Category', data_type_id: 5, group_id: 3, status: true },
            { id: 25, label: 'Justification', data_type_id: 1, group_id: null, status: true },
            { id: 26, label: 'Proposed Name', data_type_id: 1, group_id: null, status: true },
            { id: 27, label: 'Business Activity', data_type_id: 6, group_id: null, status: true },
            { id: 28, label: 'Promoter Name', data_type_id: 1, group_id: null, status: true },
            { id: 29, label: 'Application Date', data_type_id: 3, group_id: null, status: true }
        ];

        this.services = [
            { id: 1, service_name: 'Name Clearance' },
            { id: 2, service_name: 'Name Reservation' },
            { id: 3, service_name: 'Entity Registration' }
        ];

        this.forms = [
            { id: 1, form_name: 'Name Clearance Form', description: 'Form that renders Name Clearance Service', service_id: 1, status: true },
            { id: 2, form_name: 'Name Reservation Form', description: 'Form that renders the Name Reservation Service', service_id: 2, status: true },
            { id: 3, form_name: 'Entity Registration', description: 'Form that renders the Entity Registration Service', service_id: 3, status: true }
        ];

        this.formFields = [
            { id: 1, form_id: 1, field_id: 1, field_name: 'Applicant First Name', validation: null },
            { id: 2, form_id: 1, field_id: 2, field_name: 'Applicant Middle Name', validation: null },
            { id: 3, form_id: 1, field_id: 3, field_name: 'Applicant Last Name', validation: null },
            { id: 4, form_id: 1, field_id: 4, field_name: 'Applicant Gender', validation: null },
            { id: 5, form_id: 1, field_id: 5, field_name: 'Applicant Date of Birth', validation: null },
            { id: 6, form_id: 1, field_id: 6, field_name: 'Applicant Nationality', validation: null },
            { id: 7, form_id: 1, field_id: 7, field_name: 'Applicant Identity Type', validation: null },
            { id: 8, form_id: 1, field_id: 8, field_name: 'Applicant Identity Number', validation: null },
            { id: 9, form_id: 1, field_id: 9, field_name: 'BC Name', validation: null },
            { id: 10, form_id: 1, field_id: 10, field_name: 'BC Type', validation: null },
            { id: 11, form_id: 1, field_id: 11, field_name: 'BC Registration Number', validation: null },
            { id: 12, form_id: 1, field_id: 12, field_name: 'BC Country of Incorporation', validation: null },
            { id: 13, form_id: 1, field_id: 13, field_name: 'BC Registration Date', validation: null },
            { id: 14, form_id: 1, field_id: 14, field_name: 'Applicant Phone Number', validation: null },
            { id: 15, form_id: 1, field_id: 15, field_name: 'Applicant Email Address', validation: null },
            { id: 16, form_id: 1, field_id: 16, field_name: 'Applicant Country', validation: null },
            { id: 17, form_id: 1, field_id: 17, field_name: 'Applicant Province', validation: null },
            { id: 18, form_id: 1, field_id: 18, field_name: 'Applicant Town', validation: null },
            { id: 19, form_id: 1, field_id: 19, field_name: 'Applicant Area', validation: null },
            { id: 20, form_id: 1, field_id: 20, field_name: 'Applicant Street', validation: null },
            { id: 21, form_id: 1, field_id: 21, field_name: 'Applicant Plot House Village', validation: null },
            { id: 22, form_id: 1, field_id: 22, field_name: null, validation: null },
            { id: 23, form_id: 1, field_id: 23, field_name: null, validation: null },
            { id: 24, form_id: 1, field_id: 24, field_name: null, validation: null },
            { id: 25, form_id: 1, field_id: 25, field_name: 'Justification', validation: null },
            { id: 26, form_id: 1, field_id: 26, field_name: 'Proposed Name 1', validation: null },
            { id: 27, form_id: 1, field_id: 26, field_name: 'Proposed Name 2', validation: null },
            { id: 28, form_id: 1, field_id: 26, field_name: 'Proposed Name 3', validation: null },
            { id: 29, form_id: 1, field_id: 27, field_name: 'Business Activity', validation: null },
            { id: 30, form_id: 1, field_id: 28, field_name: 'Promoter Name', validation: null },
            { id: 31, form_id: 1, field_id: 29, field_name: 'Application Date', validation: null },
            { id: 32, form_id: 1, field_id: 1, field_name: 'PL First Name', validation: null },
            { id: 33, form_id: 1, field_id: 2, field_name: 'PL Middle Name', validation: null },
            { id: 34, form_id: 1, field_id: 3, field_name: 'PL Last Name', validation: null },
            { id: 35, form_id: 1, field_id: 4, field_name: 'PL Gender', validation: null },
            { id: 36, form_id: 1, field_id: 5, field_name: 'PL Date of Birth', validation: null },
            { id: 37, form_id: 1, field_id: 6, field_name: 'PL Nationality', validation: null },
            { id: 38, form_id: 1, field_id: 7, field_name: 'PL Identity Type', validation: null },
            { id: 39, form_id: 1, field_id: 8, field_name: 'PL Identity Number', validation: null },
            { id: 40, form_id: 1, field_id: 14, field_name: 'PL Phone Number', validation: null },
            { id: 41, form_id: 1, field_id: 15, field_name: 'PL Email Address', validation: null },
            { id: 42, form_id: 1, field_id: 16, field_name: 'PL Country', validation: null },
            { id: 43, form_id: 1, field_id: 17, field_name: 'PL Province', validation: null },
            { id: 44, form_id: 1, field_id: 18, field_name: 'PL Town', validation: null },
            { id: 45, form_id: 1, field_id: 19, field_name: 'PL Area', validation: null },
            { id: 46, form_id: 1, field_id: 20, field_name: 'PL Street', validation: null },
            { id: 47, form_id: 1, field_id: 21, field_name: 'PL Plot House Village', validation: null }
        ];

        this.users = [
            { id: 1, first_name: 'John', middle_name: 'Michael', surname: 'Phiri', dob: '1988-04-12', email: 'john.phiri@example.com', password: 'hashed_password_1' },
            { id: 2, first_name: 'Mary', middle_name: 'Elizabeth', surname: 'Banda', dob: '1992-09-23', email: 'mary.banda@example.com', password: 'hashed_password_2' },
            { id: 3, first_name: 'Peter', middle_name: null, surname: 'Mwansa', dob: '1985-01-17', email: 'peter.mwansa@example.com', password: 'hashed_password_3' },
            { id: 4, first_name: 'Agnes', middle_name: 'Chileshe', surname: 'Zulu', dob: '1990-06-05', email: 'agnes.zulu@example.com', password: 'hashed_password_4' },
            { id: 5, first_name: 'Daniel', middle_name: 'K.', surname: 'Mwanza', dob: '1995-11-30', email: 'daniel.mwanza@example.com', password: 'hashed_password_5' }
        ];

        this.submissions = [
            { id: 1, services_id: 1, created_by: 1, created_on: '2026-01-21 15:12:23' },
            { id: 2, services_id: 1, created_by: 2, created_on: '2026-01-22 11:55:34' }
        ];

        this.collections = [
            { id: 1, collection_name: 'Gender' },
            { id: 2, collection_name: 'EntityType' },
            { id: 3, collection_name: 'Identity Type' },
            { id: 4, collection_name: 'Country' },
            { id: 5, collection_name: 'Province' }
        ];

        this.collectionItems = [
            { id: 1, collection_id: 1, collection_item: 'Male', relation_collection_items_id: null },
            { id: 2, collection_id: 1, collection_item: 'Female', relation_collection_items_id: null },
            { id: 3, collection_id: 2, collection_item: 'Business Name', relation_collection_items_id: null },
            { id: 4, collection_id: 2, collection_item: 'Local Company', relation_collection_items_id: null },
            { id: 5, collection_id: 2, collection_item: 'Foreign Company', relation_collection_items_id: null },
            { id: 6, collection_id: 3, collection_item: 'NRC', relation_collection_items_id: null },
            { id: 7, collection_id: 3, collection_item: 'Passport', relation_collection_items_id: null },
            { id: 8, collection_id: 4, collection_item: 'Zambia', relation_collection_items_id: null },
            { id: 9, collection_id: 4, collection_item: 'South Africa', relation_collection_items_id: null },
            { id: 10, collection_id: 4, collection_item: 'Germany', relation_collection_items_id: null },
            { id: 11, collection_id: 4, collection_item: 'United Kingdom', relation_collection_items_id: null },
            { id: 12, collection_id: 4, collection_item: 'Kenya', relation_collection_items_id: null },
            { id: 13, collection_id: 4, collection_item: 'Nigeria', relation_collection_items_id: null },
            { id: 14, collection_id: 5, collection_item: 'Lusaka', relation_collection_items_id: 8 },
            { id: 15, collection_id: 5, collection_item: 'Copperbelt', relation_collection_items_id: 8 },
            { id: 16, collection_id: 5, collection_item: 'Livingstone', relation_collection_items_id: 8 },
            { id: 17, collection_id: 5, collection_item: 'Cape Town', relation_collection_items_id: 9 },
            { id: 18, collection_id: null, collection_item: 'Berlin', relation_collection_items_id: 10 },
            { id: 19, collection_id: null, collection_item: 'London', relation_collection_items_id: 11 },
            { id: 20, collection_id: null, collection_item: 'Nairobi', relation_collection_items_id: 12 },
            { id: 21, collection_id: null, collection_item: 'Abujah', relation_collection_items_id: 13 }
        ];

        // Insert initial empty answers for submission 1 as per SQL
        const submission1FormFields = this.formFields.filter(ff => ff.form_id === 1);
        submission1FormFields.forEach((ff, index) => {
            this.formAnswers.push({
                id: this.idCounters.formAnswers++,
                form_field_id: ff.id,
                answer: '',
                submission_id: 1
            });
        });

        // Initialize counters based on max ids
        this.idCounters.groups = Math.max(...this.groups.map(g => g.id), 0) + 1;
        this.idCounters.dataTypes = Math.max(...this.dataTypes.map(d => d.id), 0) + 1;
        this.idCounters.fields = Math.max(...this.fields.map(f => f.id), 0) + 1;
        this.idCounters.services = Math.max(...this.services.map(s => s.id), 0) + 1;
        this.idCounters.forms = Math.max(...this.forms.map(f => f.id), 0) + 1;
        this.idCounters.formFields = Math.max(...this.formFields.map(ff => ff.id), 0) + 1;
        this.idCounters.users = Math.max(...this.users.map(u => u.id), 0) + 1;
        this.idCounters.submissions = Math.max(...this.submissions.map(s => s.id), 0) + 1;
        this.idCounters.formAnswers = Math.max(...this.formAnswers.map(fa => fa.id), 0) + 1;
        this.idCounters.collections = Math.max(...this.collections.map(c => c.id), 0) + 1;
        this.idCounters.collectionItems = Math.max(...this.collectionItems.map(ci => ci.id), 0) + 1;

        console.log('✅ Mock database initialized with sample data');
    }

    // Generic helper for creating standard CRUD
    private getLocal<T>(repo: T[]): T[] { return [...repo]; }
    private getLocalById<T extends { id: number }>(repo: T[], id: number): T | undefined { return repo.find(item => item.id === id); }
    private createLocal<T extends { id: number }>(repo: T[], data: any, idCounter: number): T {
        const newItem = { id: idCounter, ...data };
        repo.push(newItem);
        return newItem;
    }
    private updateLocal<T extends { id: number }>(repo: T[], id: number, data: Partial<T>): T | null {
        const index = repo.findIndex(item => item.id === id);
        if (index === -1) return null;
        repo[index] = { ...repo[index], ...data };
        return repo[index];
    }
    private deleteLocal<T extends { id: number }>(repo: T[], id: number): boolean {
        const index = repo.findIndex(item => item.id === id);
        if (index === -1) return false;
        repo.splice(index, 1);
        return true;
    }

    // Groups
    getGroups() { return this.getLocal(this.groups); }
    getGroup(id: number) { return this.getLocalById(this.groups, id); }
    createGroup(data: CreateGroup) { return this.createLocal(this.groups, data, this.idCounters.groups++); }
    updateGroup(id: number, data: Partial<Group>) { return this.updateLocal(this.groups, id, data); }
    deleteGroup(id: number) { return this.deleteLocal(this.groups, id); }

    // DataTypes
    getDataTypes() { return this.getLocal(this.dataTypes); }
    getDataType(id: number) { return this.getLocalById(this.dataTypes, id); }
    createDataType(data: CreateDataType) { return this.createLocal(this.dataTypes, data, this.idCounters.dataTypes++); }
    updateDataType(id: number, data: Partial<DataType>) { return this.updateLocal(this.dataTypes, id, data); }
    deleteDataType(id: number) { return this.deleteLocal(this.dataTypes, id); }

    // Fields
    getFields() { return this.getLocal(this.fields); }
    getField(id: number) { return this.getLocalById(this.fields, id); }
    createField(data: CreateField) { return this.createLocal(this.fields, data, this.idCounters.fields++); }
    updateField(id: number, data: Partial<Field>) { return this.updateLocal(this.fields, id, data); }
    deleteField(id: number) { return this.deleteLocal(this.fields, id); }
    getFieldsByGroup(groupId: number) { return this.fields.filter(f => f.group_id === groupId); }

    // Services
    getServices() { return this.getLocal(this.services); }
    getService(id: number) { return this.getLocalById(this.services, id); }
    createService(data: CreateService) { return this.createLocal(this.services, data, this.idCounters.services++); }
    updateService(id: number, data: Partial<Service>) { return this.updateLocal(this.services, id, data); }
    deleteService(id: number) { return this.deleteLocal(this.services, id); }

    // Forms
    getForms() { return this.getLocal(this.forms); }
    getForm(id: number) { return this.getLocalById(this.forms, id); }
    createForm(data: CreateForm) { return this.createLocal(this.forms, data, this.idCounters.forms++); }
    updateForm(id: number, data: Partial<Form>) { return this.updateLocal(this.forms, id, data); }
    deleteForm(id: number) { return this.deleteLocal(this.forms, id); }
    getFormsByService(serviceId: number) { return this.forms.filter(f => f.service_id === serviceId); }

    // FormFields
    getFormFields() { return this.getLocal(this.formFields); }
    getFormField(id: number) { return this.getLocalById(this.formFields, id); }
    createFormField(data: CreateFormField) { return this.createLocal(this.formFields, data, this.idCounters.formFields++); }
    updateFormField(id: number, data: Partial<FormField>) { return this.updateLocal(this.formFields, id, data); }
    deleteFormField(id: number) { return this.deleteLocal(this.formFields, id); }
    getFormFieldsByForm(formId: number) { return this.formFields.filter(ff => ff.form_id === formId); }
    getFormFieldsByField(fieldId: number) { return this.formFields.filter(ff => ff.field_id === fieldId); }

    // Users
    getUsers() { return this.getLocal(this.users); }
    getUser(id: number) { return this.getLocalById(this.users, id); }
    createUser(data: CreateUser) { return this.createLocal(this.users, data, this.idCounters.users++); }
    updateUser(id: number, data: Partial<User>) { return this.updateLocal(this.users, id, data); }
    deleteUser(id: number) { return this.deleteLocal(this.users, id); }

    // Collections
    getCollections() { return this.getLocal(this.collections); }
    getCollection(id: number) { return this.getLocalById(this.collections, id); }
    createCollection(data: CreateCollection) { return this.createLocal(this.collections, data, this.idCounters.collections++); }
    updateCollection(id: number, data: Partial<Collection>) { return this.updateLocal(this.collections, id, data); }
    deleteCollection(id: number) { return this.deleteLocal(this.collections, id); }

    // CollectionItems
    getCollectionItems() { return this.getLocal(this.collectionItems); }
    getCollectionItem(id: number) { return this.getLocalById(this.collectionItems, id); }
    createCollectionItem(data: CreateCollectionItem) { return this.createLocal(this.collectionItems, data, this.idCounters.collectionItems++); }
    updateCollectionItem(id: number, data: Partial<CollectionItem>) { return this.updateLocal(this.collectionItems, id, data); }
    deleteCollectionItem(id: number) { return this.deleteLocal(this.collectionItems, id); }
    getCollectionItemsByCollection(collectionId: number) { return this.collectionItems.filter(ci => ci.collection_id === collectionId); }

    // Submissions (augmented with details)
    getSubmissions(): Submission[] {
        return this.submissions.map(submission => this.hydrateSubmission(submission));
    }

    getSubmission(id: number): Submission | undefined {
        const submission = this.submissions.find(s => s.id === id);
        return submission ? this.hydrateSubmission(submission) : undefined;
    }

    // Helper to join answers and form fields to submission
    private hydrateSubmission(submission: Submission): Submission {
        const answers = this.formAnswers.filter(fa => fa.submission_id === submission.id);

        let derivedFormId: number | undefined;
        if (answers.length > 0 && answers[0].form_field_id) {
            const ff = this.formFields.find(f => f.id === answers[0].form_field_id);
            if (ff) derivedFormId = ff.form_id;
        }

        return {
            ...submission,
            formAnswers: answers,
            form_id: derivedFormId
        };
    }

    createSubmission(data: CreateSubmission): Submission {
        const { formAnswers, ...submissionData } = data;
        const newSubmission = {
            id: this.idCounters.submissions++,
            ...submissionData,
            created_on: new Date().toISOString()
        };
        this.submissions.push(newSubmission);

        if (formAnswers && formAnswers.length > 0) {
            formAnswers.forEach(ans => {
                this.createFormAnswer({ ...ans, submission_id: newSubmission.id });
            });
        }
        return this.hydrateSubmission(newSubmission);
    }

    updateSubmission(id: number, data: Partial<Submission>): Submission | null {
        const index = this.submissions.findIndex(s => s.id === id);
        if (index === -1) return null;

        const { formAnswers, formFields, ...updateData } = data;
        this.submissions[index] = { ...this.submissions[index], ...updateData };
        return this.hydrateSubmission(this.submissions[index]);
    }

    deleteSubmission(id: number) { return this.deleteLocal(this.submissions, id); }
    getSubmissionsByService(serviceId: number) {
        return this.submissions
            .filter(s => s.services_id === serviceId)
            .map(s => this.hydrateSubmission(s));
    }

    // FormAnswers
    getFormAnswers() { return this.getLocal(this.formAnswers); }
    getFormAnswer(id: number) { return this.getLocalById(this.formAnswers, id); }
    createFormAnswer(data: CreateFormAnswer) { return this.createLocal(this.formAnswers, data, this.idCounters.formAnswers++); }
    updateFormAnswer(id: number, data: Partial<FormAnswer>) { return this.updateLocal(this.formAnswers, id, data); }
    deleteFormAnswer(id: number) { return this.deleteLocal(this.formAnswers, id); }
    getFormAnswersBySubmission(submissionId: number) { return this.formAnswers.filter(fa => fa.submission_id === submissionId); }
    getFormAnswersByForm(formId: number) { return this.formAnswers.filter(fa => fa.form_field_id && this.formFields.find(ff => ff.id === fa.form_field_id)?.form_id === formId); }
    getFormAnswersByField(fieldId: number) { return this.formAnswers.filter(fa => fa.form_field_id && this.formFields.find(ff => ff.id === fa.form_field_id)?.field_id === fieldId); }
}

export const mockDb = new MockDatabase();
