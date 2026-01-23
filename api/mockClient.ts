// api/mockClient.ts
import {
    Group, Field, Service, Form, FormField, Submission, FormAnswer,
    CreateGroup, CreateField, CreateService, CreateForm, CreateFormField, CreateSubmission, CreateFormAnswer,
    DataType, Collection, CollectionItem, User, ReservedName, FormGroup,
    CreateDataType, CreateCollection, CreateCollectionItem, CreateUser, CreateReservedName, CreateFormGroup
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
    private reservedNames: ReservedName[] = [];
    private formGroups: FormGroup[] = [];

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
        collectionItems: 1,
        reservedNames: 1,
        formGroups: 1
    };

    // Initialize with mock data
    async initialize() {
        console.log('🔄 Initializing mock database...');

        this.groups = [
            { id: 1, group_name: 'Person' },
            { id: 2, group_name: 'Address' },
            { id: 3, group_name: 'Entity' }
        ];

        this.reservedNames = [
            { id: 1, reserved_name: 'PACRA' },
            { id: 2, reserved_name: 'Patents and Companies Registration Agency' },
            { id: 3, reserved_name: 'Test Reserved Name' },
            { id: 4, reserved_name: 'Zambia Revenue Authority' },
            { id: 5, reserved_name: 'ZRA' }
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
            { id: 1, label: 'First Name', data_type_id: 1, group_id: 1, status: true, collection_id: null },
            { id: 2, label: 'Middle Name', data_type_id: 1, group_id: 1, status: true, collection_id: null },
            { id: 3, label: 'Last Name', data_type_id: 1, group_id: 1, status: true, collection_id: null },
            { id: 4, label: 'Gender', data_type_id: 5, group_id: 1, status: true, collection_id: 1 },
            { id: 5, label: 'Date of Birth', data_type_id: 3, group_id: 1, status: true, collection_id: null },
            { id: 6, label: 'Nationality', data_type_id: 5, group_id: 1, status: true, collection_id: 4 },
            { id: 7, label: 'Identity Type', data_type_id: 5, group_id: 1, status: true, collection_id: 3 },
            { id: 8, label: 'Identity Number', data_type_id: 1, group_id: 1, status: true, collection_id: null },
            { id: 9, label: 'Entity Name', data_type_id: 1, group_id: 3, status: true, collection_id: null },
            { id: 10, label: 'Body Corporate Type', data_type_id: 5, group_id: null, status: true, collection_id: 2 },
            { id: 11, label: 'Registration Number', data_type_id: 2, group_id: 3, status: true, collection_id: null },
            { id: 12, label: 'Country of Incorporation', data_type_id: 5, group_id: null, status: true, collection_id: 4 },
            { id: 13, label: 'Registration Date', data_type_id: 3, group_id: 3, status: true, collection_id: null },
            { id: 14, label: 'Phone Number', data_type_id: 1, group_id: 1, status: true, collection_id: null },
            { id: 15, label: 'Email Address', data_type_id: 1, group_id: 1, status: true, collection_id: null },
            { id: 16, label: 'Country', data_type_id: 5, group_id: 2, status: true, collection_id: 4 },
            { id: 17, label: 'Province', data_type_id: 5, group_id: 2, status: true, collection_id: 5 },
            { id: 18, label: 'Town', data_type_id: 5, group_id: 2, status: true, collection_id: null },
            { id: 19, label: 'Area', data_type_id: 5, group_id: 2, status: true, collection_id: null },
            { id: 20, label: 'Street', data_type_id: 1, group_id: 2, status: true, collection_id: null },
            { id: 21, label: 'Plot House Village', data_type_id: 1, group_id: 2, status: true, collection_id: null },
            { id: 22, label: 'Entity Type', data_type_id: 5, group_id: 3, status: true, collection_id: 2 },
            { id: 23, label: 'Entity Limit', data_type_id: 5, group_id: 3, status: true, collection_id: null },
            { id: 24, label: 'Entity Category', data_type_id: 5, group_id: 3, status: true, collection_id: 2 },
            { id: 25, label: 'Justification', data_type_id: 1, group_id: null, status: true, collection_id: null },
            { id: 26, label: 'Proposed Name', data_type_id: 1, group_id: null, status: true, collection_id: null },
            { id: 27, label: 'Business Activity', data_type_id: 6, group_id: null, status: true, collection_id: null },
            { id: 28, label: 'Promoter Name', data_type_id: 1, group_id: null, status: true, collection_id: null },
            { id: 29, label: 'Application Date', data_type_id: 3, group_id: null, status: true, collection_id: null }
        ];

        this.services = [
            { id: 1, service_name: 'Name Clearance', description: 'Clear business names for registration' },
            { id: 2, service_name: 'Name Reservation', description: 'Reserve approved business names' },
            { id: 3, service_name: 'Entity Registration', description: 'Register new business entities' }
        ];

        this.forms = [
            { id: 1, form_name: 'Form 1', description: 'Name Clearance Application Form', service_id: 1, status: true },
            { id: 2, form_name: 'Name Reservation Form', description: 'Form that renders the Name Reservation Service', service_id: 2, status: true },
            { id: 3, form_name: 'Form 3', description: 'Application for Incorporation', service_id: 3, status: true }
        ];

        this.formFields = [
            { id: 1, form_id: 1, field_id: 1, field_name: 'Applicant First Name', validation: null, field_span: 4, field_row: 1, form_group_id: 1 },
            { id: 2, form_id: 1, field_id: 2, field_name: 'Applicant Middle Name', validation: null, field_span: 4, field_row: 1, form_group_id: 1 },
            { id: 3, form_id: 1, field_id: 3, field_name: 'Applicant Last Name', validation: null, field_span: 4, field_row: 1, form_group_id: 1 },
            { id: 4, form_id: 1, field_id: 4, field_name: 'Applicant Gender', validation: null, field_span: 6, field_row: 2, form_group_id: 1 },
            { id: 5, form_id: 1, field_id: 5, field_name: 'Applicant Date of Birth', validation: null, field_span: 6, field_row: 2, form_group_id: 1 },
            { id: 6, form_id: 1, field_id: 6, field_name: 'Applicant Nationality', validation: null, field_span: 6, field_row: 3, form_group_id: 1 },
            { id: 7, form_id: 1, field_id: 7, field_name: 'Applicant Identity Type', validation: null, field_span: 6, field_row: 3, form_group_id: 1 },
            { id: 8, form_id: 1, field_id: 8, field_name: 'Applicant Identity Number', validation: null, field_span: 12, field_row: 4, form_group_id: 1 },
            { id: 9, form_id: 1, field_id: 9, field_name: 'BC Name', validation: null, field_span: 12, field_row: 5, form_group_id: 2 },
            { id: 10, form_id: 1, field_id: 10, field_name: 'BC Type', validation: null, field_span: 6, field_row: 6, form_group_id: 2 },
            { id: 11, form_id: 1, field_id: 11, field_name: 'BC Registration Number', validation: null, field_span: 6, field_row: 6, form_group_id: 2 },
            { id: 12, form_id: 1, field_id: 12, field_name: 'BC Country of Incorporation', validation: null, field_span: 6, field_row: 7, form_group_id: 2 },
            { id: 13, form_id: 1, field_id: 13, field_name: 'BC Registration Date', validation: null, field_span: 6, field_row: 7, form_group_id: 2 },
            { id: 14, form_id: 1, field_id: 14, field_name: 'Applicant Phone Number', validation: null, field_span: 6, field_row: 8, form_group_id: 3 },
            { id: 15, form_id: 1, field_id: 15, field_name: 'Applicant Email Address', validation: null, field_span: 6, field_row: 8, form_group_id: 3 },
            { id: 16, form_id: 1, field_id: 16, field_name: 'Applicant Country', validation: null, field_span: 6, field_row: 9, form_group_id: 4 },
            { id: 17, form_id: 1, field_id: 17, field_name: 'Applicant Province', validation: null, field_span: 6, field_row: 9, form_group_id: 4 },
            { id: 18, form_id: 1, field_id: 18, field_name: 'Applicant Town', validation: null, field_span: 6, field_row: 10, form_group_id: 4 },
            { id: 19, form_id: 1, field_id: 19, field_name: 'Applicant Area', validation: null, field_span: 6, field_row: 10, form_group_id: 4 },
            { id: 20, form_id: 1, field_id: 20, field_name: 'Applicant Street', validation: null, field_span: 6, field_row: 11, form_group_id: 4 },
            { id: 21, form_id: 1, field_id: 21, field_name: 'Applicant Plot House Village', validation: null, field_span: 6, field_row: 11, form_group_id: 4 },
            { id: 22, form_id: 1, field_id: 22, field_name: null, validation: null, form_group_id: 2 },
            { id: 23, form_id: 1, field_id: 23, field_name: null, validation: null, form_group_id: 2 },
            { id: 24, form_id: 1, field_id: 24, field_name: null, validation: null, form_group_id: 2 },
            { id: 25, form_id: 1, field_id: 25, field_name: 'Justification', validation: null, field_span: 12, field_row: 12, form_group_id: 5 },
            { id: 26, form_id: 1, field_id: 26, field_name: 'Proposed Name 1', validation: 'validate_reserved_name', field_span: 12, field_row: 13, form_group_id: 6 },
            { id: 27, form_id: 1, field_id: 26, field_name: 'Proposed Name 2', validation: 'validate_reserved_name', field_span: 12, field_row: 14, form_group_id: 6 },
            { id: 28, form_id: 1, field_id: 26, field_name: 'Proposed Name 3', validation: 'validate_reserved_name', field_span: 12, field_row: 15, form_group_id: 6 },
            { id: 29, form_id: 1, field_id: 27, field_name: 'Business Activity', validation: null, field_span: 12, field_row: 16, form_group_id: 7 },
            { id: 30, form_id: 1, field_id: 28, field_name: 'Promoter Name', validation: null, field_span: 6, field_row: 17, form_group_id: 8 },
            { id: 31, form_id: 1, field_id: 29, field_name: 'Application Date', validation: null, field_span: 6, field_row: 17, form_group_id: 8 },
            { id: 32, form_id: 1, field_id: 1, field_name: 'PL First Name', validation: null, form_group_id: 8 },
            { id: 33, form_id: 1, field_id: 2, field_name: 'PL Middle Name', validation: null, form_group_id: 8 },
            { id: 34, form_id: 1, field_id: 3, field_name: 'PL Last Name', validation: null, form_group_id: 8 },
            { id: 35, form_id: 1, field_id: 4, field_name: 'PL Gender', validation: null, form_group_id: 8 },
            { id: 36, form_id: 1, field_id: 5, field_name: 'PL Date of Birth', validation: null, form_group_id: 8 },
            { id: 37, form_id: 1, field_id: 6, field_name: 'PL Nationality', validation: null, form_group_id: 8 },
            { id: 38, form_id: 1, field_id: 7, field_name: 'PL Identity Type', validation: null, form_group_id: 8 },
            { id: 39, form_id: 1, field_id: 8, field_name: 'PL Identity Number', validation: null, form_group_id: 8 },
            { id: 40, form_id: 1, field_id: 14, field_name: 'PL Phone Number', validation: null, form_group_id: 8 },
            { id: 41, form_id: 1, field_id: 15, field_name: 'PL Email Address', validation: null, form_group_id: 8 },
            { id: 42, form_id: 1, field_id: 16, field_name: 'PL Country', validation: null, form_group_id: 8 },
            { id: 43, form_id: 1, field_id: 17, field_name: 'PL Province', validation: null, form_group_id: 8 },
            { id: 44, form_id: 1, field_id: 18, field_name: 'PL Town', validation: null, form_group_id: 8 },
            { id: 45, form_id: 1, field_id: 19, field_name: 'PL Area', validation: null, form_group_id: 8 },
            { id: 46, form_id: 1, field_id: 20, field_name: 'PL Street', validation: null, form_group_id: 8 },
            { id: 47, form_id: 1, field_id: 21, field_name: 'PL Plot House Village', validation: null, form_group_id: 8 }
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
            { id: 5, collection_name: 'Province' },
            { id: 6, collection_name: 'Business Type' },
            { id: 7, collection_name: 'Business Category' },
            { id: 8, collection_name: 'Business Class' },
            { id: 9, collection_name: 'Nature Level 1' },
            { id: 10, collection_name: 'Nature Level 2' },
            { id: 11, collection_name: 'Nature Level 3' },
            { id: 12, collection_name: 'Nature Level 4' }
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
            { id: 21, collection_id: null, collection_item: 'Abujah', relation_collection_items_id: 13 },
            // Business Types
            { id: 22, collection_id: 6, collection_item: 'Business Name', relation_collection_items_id: null },
            { id: 23, collection_id: 6, collection_item: 'Local Company', relation_collection_items_id: null },
            { id: 24, collection_id: 6, collection_item: 'Foreign Company', relation_collection_items_id: null },
            // Business Categories for Business Name
            { id: 25, collection_id: 7, collection_item: 'By Individual / Firm', relation_collection_items_id: 22 },
            { id: 26, collection_id: 7, collection_item: 'By Corporation / Other', relation_collection_items_id: 22 },
            // Business Categories for Local Company
            { id: 27, collection_id: 7, collection_item: 'Limited by Shares', relation_collection_items_id: 23 },
            { id: 28, collection_id: 7, collection_item: 'Limited by Guarantee', relation_collection_items_id: 23 },
            { id: 29, collection_id: 7, collection_item: 'Guarantee without the word limited', relation_collection_items_id: 23 },
            { id: 30, collection_id: 7, collection_item: 'Public', relation_collection_items_id: 23 },
            { id: 31, collection_id: 7, collection_item: 'Unlimited', relation_collection_items_id: 23 },
            // Business Categories for Foreign Company
            { id: 32, collection_id: 7, collection_item: 'Foreign Limited by Shares', relation_collection_items_id: 24 },
            { id: 33, collection_id: 7, collection_item: 'Foreign Limited by Guarantee', relation_collection_items_id: 24 },
            { id: 34, collection_id: 7, collection_item: 'Foreign Unlimited', relation_collection_items_id: 24 },
            // Business Classes for Business Name
            { id: 35, collection_id: 8, collection_item: 'N/A', relation_collection_items_id: 22 },
            // Business Classes for Local Company
            { id: 36, collection_id: 8, collection_item: 'Ordinary Company', relation_collection_items_id: 23 },
            { id: 37, collection_id: 8, collection_item: 'Local Bank', relation_collection_items_id: 23 },
            { id: 38, collection_id: 8, collection_item: 'Bureau de change', relation_collection_items_id: 23 },
            { id: 39, collection_id: 8, collection_item: 'Insurance Company', relation_collection_items_id: 23 },
            { id: 40, collection_id: 8, collection_item: 'Insurance Broker', relation_collection_items_id: 23 },
            { id: 41, collection_id: 8, collection_item: 'Re-Insurance Company', relation_collection_items_id: 23 },
            { id: 42, collection_id: 8, collection_item: 'Other Financial Institution', relation_collection_items_id: 23 },
            // Business Classes for Foreign Company
            { id: 43, collection_id: 8, collection_item: 'Ordinary Company', relation_collection_items_id: 24 },
            { id: 44, collection_id: 8, collection_item: 'Foreign Bank', relation_collection_items_id: 24 },
            { id: 45, collection_id: 8, collection_item: 'Bureau de change', relation_collection_items_id: 24 },
            { id: 46, collection_id: 8, collection_item: 'Insurance Company', relation_collection_items_id: 24 },
            { id: 47, collection_id: 8, collection_item: 'Insurance Broker', relation_collection_items_id: 24 },
            { id: 48, collection_id: 8, collection_item: 'Re-Insurance Company', relation_collection_items_id: 24 },
            { id: 49, collection_id: 8, collection_item: 'Other Financial Institution', relation_collection_items_id: 24 },
            // Nature of Business Level 1
            { id: 50, collection_id: 9, collection_item: 'Agriculture', relation_collection_items_id: null },
            { id: 51, collection_id: 9, collection_item: 'Manufacturing', relation_collection_items_id: null },
            { id: 52, collection_id: 9, collection_item: 'Services', relation_collection_items_id: null },
            { id: 53, collection_id: 9, collection_item: 'Technology', relation_collection_items_id: null },
            // Nature Level 2 for Agriculture
            { id: 54, collection_id: 10, collection_item: 'Crop Production', relation_collection_items_id: 50 },
            { id: 55, collection_id: 10, collection_item: 'Livestock', relation_collection_items_id: 50 },
            // Nature Level 2 for Manufacturing
            { id: 56, collection_id: 10, collection_item: 'Food Processing', relation_collection_items_id: 51 },
            { id: 57, collection_id: 10, collection_item: 'Textiles', relation_collection_items_id: 51 },
            // Nature Level 2 for Services
            { id: 58, collection_id: 10, collection_item: 'Financial Services', relation_collection_items_id: 52 },
            { id: 59, collection_id: 10, collection_item: 'Consulting', relation_collection_items_id: 52 },
            // Nature Level 2 for Technology
            { id: 60, collection_id: 10, collection_item: 'Software Development', relation_collection_items_id: 53 },
            { id: 61, collection_id: 10, collection_item: 'IT Services', relation_collection_items_id: 53 },
            // Nature Level 3 examples
            { id: 62, collection_id: 11, collection_item: 'Maize', relation_collection_items_id: 54 },
            { id: 63, collection_id: 11, collection_item: 'Wheat', relation_collection_items_id: 54 },
            { id: 64, collection_id: 11, collection_item: 'Cattle', relation_collection_items_id: 55 },
            { id: 65, collection_id: 11, collection_item: 'Poultry', relation_collection_items_id: 55 },
            // Nature Level 4 examples
            { id: 66, collection_id: 12, collection_item: 'Hybrid Maize', relation_collection_items_id: 62 },
            { id: 67, collection_id: 12, collection_item: 'Organic Maize', relation_collection_items_id: 62 }
        ];

        this.formGroups = [
            { id: 1, group_name: 'Applicant Details', group_span: 12, group_row: 1 },
            { id: 2, group_name: 'Body Corporate Details', group_span: 12, group_row: 2 },
            { id: 3, group_name: 'Contact Information', group_span: 12, group_row: 3 },
            { id: 4, group_name: 'Address Details', group_span: 12, group_row: 4 },
            { id: 5, group_name: 'Justification', group_span: 12, group_row: 5 },
            { id: 6, group_name: 'Proposed Names', group_span: 12, group_row: 6 },
            { id: 7, group_name: 'Business Activity', group_span: 12, group_row: 7 },
            { id: 8, group_name: 'Promoter Details', group_span: 12, group_row: 8 }
        ];

        // Insert initial empty answers for submission 1 as per SQL
        const submission1FormFields = this.formFields.filter(ff => ff.form_id === 1);
        submission1FormFields.forEach((ff, index) => {
            let answer = '';
            if (ff.id === 26) answer = 'Test Reserved Name'; // Should fail
            if (ff.id === 27) answer = 'My Valid Company Name'; // Should pass
            if (ff.id === 28) answer = 'PACRA Ltd'; // Should fail

            this.formAnswers.push({
                id: this.idCounters.formAnswers++,
                form_field_id: ff.id,
                answer: answer,
                submission_id: 1
            });
        });

        // Add more submissions with comprehensive data
        this.submissions = [
            { id: 1, services_id: 1, created_by: 1, created_on: '2026-01-21 15:12:23' },
            { id: 2, services_id: 1, created_by: 2, created_on: '2026-01-22 11:55:34' },
            { id: 3, services_id: 1, created_by: 3, created_on: '2026-01-23 09:30:15' },
            { id: 4, services_id: 1, created_by: 4, created_on: '2026-01-24 14:20:45' },
            { id: 5, services_id: 2, created_by: 5, created_on: '2026-01-25 10:10:30' } // Name Reservation service
        ];

        // Create comprehensive answers for Submission 1 (John Phiri)
        const submission1Answers = [
            // Applicant Personal Details
            { form_field_id: 1, answer: 'John' }, // Applicant First Name
            { form_field_id: 2, answer: 'Michael' }, // Applicant Middle Name
            { form_field_id: 3, answer: 'Phiri' }, // Applicant Last Name
            { form_field_id: 4, answer: 'Male' }, // Applicant Gender
            { form_field_id: 5, answer: '1988-04-12' }, // Applicant Date of Birth
            { form_field_id: 6, answer: 'Zambia' }, // Applicant Nationality
            { form_field_id: 7, answer: 'NRC' }, // Applicant Identity Type
            { form_field_id: 8, answer: '123456/78/9' }, // Applicant Identity Number

            // Body Corporate Information
            { form_field_id: 9, answer: 'Zambia Investments Ltd' }, // BC Name
            { form_field_id: 10, answer: 'Local Company' }, // BC Type
            { form_field_id: 11, answer: '123456789' }, // BC Registration Number
            { form_field_id: 12, answer: 'Zambia' }, // BC Country of Incorporation
            { form_field_id: 13, answer: '2020-05-15' }, // BC Registration Date

            // Applicant Contact Information
            { form_field_id: 14, answer: '+260 97 1234567' }, // Applicant Phone Number
            { form_field_id: 15, answer: 'john.phiri@example.com' }, // Applicant Email Address

            // Applicant Address
            { form_field_id: 16, answer: 'Zambia' }, // Applicant Country
            { form_field_id: 17, answer: 'Lusaka' }, // Applicant Province
            { form_field_id: 18, answer: 'Lusaka' }, // Applicant Town
            { form_field_id: 19, answer: 'Kabulonga' }, // Applicant Area
            { form_field_id: 20, answer: 'Great East Road' }, // Applicant Street
            { form_field_id: 21, answer: 'Plot No. 1234' }, // Applicant Plot House Village

            // Entity Information (fields 22-24 currently null)
            { form_field_id: 25, answer: 'Seeking to establish a new technology solutions company focusing on financial services.' }, // Justification

            // Proposed Names with validation string
            { form_field_id: 26, answer: 'Test Reserved Name' }, // Proposed Name 1 - Should trigger reserved name
            { form_field_id: 27, answer: 'My Valid Company Name' }, // Proposed Name 2 - Should pass
            { form_field_id: 28, answer: 'PACRA Ltd' }, // Proposed Name 3 - Should trigger reserved name

            // Business Activity
            { form_field_id: 29, answer: '[{"activity": "Software Development", "sic_code": "62010"}, {"activity": "Financial Consultancy", "sic_code": "66220"}]' }, // Business Activity (JSON string for table)

            { form_field_id: 30, answer: 'James Banda' }, // Promoter Name
            { form_field_id: 31, answer: '2026-01-21' }, // Application Date

            // Promoter/Legal Representative Details
            { form_field_id: 32, answer: 'James' }, // PL First Name
            { form_field_id: 33, answer: 'Chanda' }, // PL Middle Name
            { form_field_id: 34, answer: 'Banda' }, // PL Last Name
            { form_field_id: 35, answer: 'Male' }, // PL Gender
            { form_field_id: 36, answer: '1975-08-22' }, // PL Date of Birth
            { form_field_id: 37, answer: 'Zambia' }, // PL Nationality
            { form_field_id: 38, answer: 'Passport' }, // PL Identity Type
            { form_field_id: 39, answer: 'ZB1234567' }, // PL Identity Number
            { form_field_id: 40, answer: '+260 96 7654321' }, // PL Phone Number
            { form_field_id: 41, answer: 'james.banda@example.com' }, // PL Email Address
            { form_field_id: 42, answer: 'Zambia' }, // PL Country
            { form_field_id: 43, answer: 'Copperbelt' }, // PL Province
            { form_field_id: 44, answer: 'Ndola' }, // PL Town
            { form_field_id: 45, answer: 'Mukuba' }, // PL Area
            { form_field_id: 46, answer: 'Freedom Way' }, // PL Street
            { form_field_id: 47, answer: 'House No. 567' } // PL Plot House Village
        ];

        submission1Answers.forEach(answer => {
            this.formAnswers.push({
                id: this.idCounters.formAnswers++,
                form_field_id: answer.form_field_id,
                answer: answer.answer,
                submission_id: 1
            });
        });

        // Create answers for Submission 2 (Mary Banda)
        const submission2Answers = [
            // Applicant Personal Details
            { form_field_id: 1, answer: 'Mary' },
            { form_field_id: 2, answer: 'Elizabeth' },
            { form_field_id: 3, answer: 'Banda' },
            { form_field_id: 4, answer: 'Female' },
            { form_field_id: 5, answer: '1992-09-23' },
            { form_field_id: 6, answer: 'Zambia' },
            { form_field_id: 7, answer: 'NRC' },
            { form_field_id: 8, answer: '987654/32/1' },

            // Body Corporate Information
            { form_field_id: 9, answer: 'African Crafts Collective' },
            { form_field_id: 10, answer: 'Business Name' },
            { form_field_id: 11, answer: '' },
            { form_field_id: 12, answer: 'Zambia' },
            { form_field_id: 13, answer: '' },

            // Applicant Contact Information
            { form_field_id: 14, answer: '+260 95 1122334' },
            { form_field_id: 15, answer: 'mary.banda@example.com' },

            // Applicant Address
            { form_field_id: 16, answer: 'Zambia' },
            { form_field_id: 17, answer: 'Southern' },
            { form_field_id: 18, answer: 'Livingstone' },
            { form_field_id: 19, answer: 'Town Area' },
            { form_field_id: 20, answer: 'Mosi-oa-Tunya Road' },
            { form_field_id: 21, answer: 'Shop No. 5, Victoria Falls Mall' },

            // Justification
            { form_field_id: 25, answer: 'Promoting Zambian traditional crafts and providing market access to local artisans.' },

            // Proposed Names
            { form_field_id: 26, answer: 'Zambia Revenue Authority Crafts' }, // Should trigger reserved name
            { form_field_id: 27, answer: 'ZRA Crafts Ltd' }, // Should trigger reserved name (contains ZRA)
            { form_field_id: 28, answer: 'Livingstone Artisans Collective' }, // Should pass

            // Business Activity
            { form_field_id: 29, answer: '[{"activity": "Handicraft Retail", "sic_code": "47791"}, {"activity": "Tourism Services", "sic_code": "79120"}]' },

            { form_field_id: 30, answer: 'Mary Banda' }, // Self as promoter
            { form_field_id: 31, answer: '2026-01-22' },

            // Promoter/Legal Representative Details (same as applicant)
            { form_field_id: 32, answer: 'Mary' },
            { form_field_id: 33, answer: 'Elizabeth' },
            { form_field_id: 34, answer: 'Banda' },
            { form_field_id: 35, answer: 'Female' },
            { form_field_id: 36, answer: '1992-09-23' },
            { form_field_id: 37, answer: 'Zambia' },
            { form_field_id: 38, answer: 'NRC' },
            { form_field_id: 39, answer: '987654/32/1' },
            { form_field_id: 40, answer: '+260 95 1122334' },
            { form_field_id: 41, answer: 'mary.banda@example.com' },
            { form_field_id: 42, answer: 'Zambia' },
            { form_field_id: 43, answer: 'Southern' },
            { form_field_id: 44, answer: 'Livingstone' },
            { form_field_id: 45, answer: 'Town Area' },
            { form_field_id: 46, answer: 'Mosi-oa-Tunya Road' },
            { form_field_id: 47, answer: 'Shop No. 5, Victoria Falls Mall' }
        ];

        submission2Answers.forEach(answer => {
            this.formAnswers.push({
                id: this.idCounters.formAnswers++,
                form_field_id: answer.form_field_id,
                answer: answer.answer,
                submission_id: 2
            });
        });

        // Create answers for Submission 3 (Peter Mwansa)
        const submission3Answers = [
            // Applicant Personal Details
            { form_field_id: 1, answer: 'Peter' },
            { form_field_id: 2, answer: '' },
            { form_field_id: 3, answer: 'Mwansa' },
            { form_field_id: 4, answer: 'Male' },
            { form_field_id: 5, answer: '1985-01-17' },
            { form_field_id: 6, answer: 'Zambia' },
            { form_field_id: 7, answer: 'NRC' },
            { form_field_id: 8, answer: '456789/01/2' },

            // Body Corporate Information
            { form_field_id: 9, answer: 'Global Tech Partners Inc.' },
            { form_field_id: 10, answer: 'Foreign Company' },
            { form_field_id: 11, answer: 'F7890123' },
            { form_field_id: 12, answer: 'United Kingdom' },
            { form_field_id: 13, answer: '2018-03-10' },

            // Applicant Contact Information
            { form_field_id: 14, answer: '+260 96 4455667' },
            { form_field_id: 15, answer: 'peter.mwansa@example.com' },

            // Applicant Address
            { form_field_id: 16, answer: 'Zambia' },
            { form_field_id: 17, answer: 'Copperbelt' },
            { form_field_id: 18, answer: 'Kitwe' },
            { form_field_id: 19, answer: 'Riverside' },
            { form_field_id: 20, answer: 'Kafue Road' },
            { form_field_id: 21, answer: 'Plot 89, Riverside Park' },

            // Justification
            { form_field_id: 25, answer: 'Expanding our technology consulting services to the Zambian market with focus on digital transformation.' },

            // Proposed Names - All should pass validation
            { form_field_id: 26, answer: 'Innovate Zambia Solutions' },
            { form_field_id: 27, answer: 'Digital Futures Zambia' },
            { form_field_id: 28, answer: 'TechBridge Africa' },

            // Business Activity
            { form_field_id: 29, answer: '[{"activity": "IT Consulting", "sic_code": "62020"}, {"activity": "Digital Transformation", "sic_code": "62012"}, {"activity": "Cloud Services", "sic_code": "63110"}]' },

            { form_field_id: 30, answer: 'Sarah Johnson' },
            { form_field_id: 31, answer: '2026-01-23' },

            // Promoter/Legal Representative Details
            { form_field_id: 32, answer: 'Sarah' },
            { form_field_id: 33, answer: 'L.' },
            { form_field_id: 34, answer: 'Johnson' },
            { form_field_id: 35, answer: 'Female' },
            { form_field_id: 36, answer: '1980-11-05' },
            { form_field_id: 37, answer: 'United Kingdom' },
            { form_field_id: 38, answer: 'Passport' },
            { form_field_id: 39, answer: 'UK7890123' },
            { form_field_id: 40, answer: '+44 20 7123 4567' },
            { form_field_id: 41, answer: 'sarah.johnson@example.com' },
            { form_field_id: 42, answer: 'United Kingdom' },
            { form_field_id: 43, answer: 'London' },
            { form_field_id: 44, answer: 'London' },
            { form_field_id: 45, answer: 'Canary Wharf' },
            { form_field_id: 46, answer: 'Canada Square' },
            { form_field_id: 47, answer: 'Level 25, One Canada Square' }
        ];

        submission3Answers.forEach(answer => {
            this.formAnswers.push({
                id: this.idCounters.formAnswers++,
                form_field_id: answer.form_field_id,
                answer: answer.answer,
                submission_id: 3
            });
        });

        // Create answers for Submission 4 (Agnes Zulu)
        const submission4Answers = [
            // Applicant Personal Details
            { form_field_id: 1, answer: 'Agnes' },
            { form_field_id: 2, answer: 'Chileshe' },
            { form_field_id: 3, answer: 'Zulu' },
            { form_field_id: 4, answer: 'Female' },
            { form_field_id: 5, answer: '1990-06-05' },
            { form_field_id: 6, answer: 'Zambia' },
            { form_field_id: 7, answer: 'NRC' },
            { form_field_id: 8, answer: '135792/46/8' },

            // No Body Corporate (sole proprietorship)
            { form_field_id: 9, answer: '' },
            { form_field_id: 10, answer: 'Business Name' },
            { form_field_id: 11, answer: '' },
            { form_field_id: 12, answer: '' },
            { form_field_id: 13, answer: '' },

            // Applicant Contact Information
            { form_field_id: 14, answer: '+260 97 8899001' },
            { form_field_id: 15, answer: 'agnes.zulu@example.com' },

            // Applicant Address
            { form_field_id: 16, answer: 'Zambia' },
            { form_field_id: 17, answer: 'Luapula' },
            { form_field_id: 18, answer: 'Mansa' },
            { form_field_id: 19, answer: 'Central Business District' },
            { form_field_id: 20, answer: 'Independence Avenue' },
            { form_field_id: 21, answer: 'Shop No. 12, Mansa Market' },

            // Justification
            { form_field_id: 25, answer: 'Providing catering services for corporate events and traditional Zambian cuisine experiences.' },

            // Proposed Names - Mixed validation results
            { form_field_id: 26, answer: 'Patents and Companies Registration Agency Catering' }, // Should trigger reserved name (full match)
            { form_field_id: 27, answer: 'Zulu Delicacies' }, // Should pass
            { form_field_id: 28, answer: 'PACRA Events' }, // Should trigger reserved name (contains PACRA)

            // Business Activity
            { form_field_id: 29, answer: '[{"activity": "Catering Services", "sic_code": "56210"}, {"activity": "Event Planning", "sic_code": "82301"}]' },

            { form_field_id: 30, answer: 'Agnes Zulu' },
            { form_field_id: 31, answer: '2026-01-24' },

            // Promoter/Legal Representative Details (same as applicant)
            { form_field_id: 32, answer: 'Agnes' },
            { form_field_id: 33, answer: 'Chileshe' },
            { form_field_id: 34, answer: 'Zulu' },
            { form_field_id: 35, answer: 'Female' },
            { form_field_id: 36, answer: '1990-06-05' },
            { form_field_id: 37, answer: 'Zambia' },
            { form_field_id: 38, answer: 'NRC' },
            { form_field_id: 39, answer: '135792/46/8' },
            { form_field_id: 40, answer: '+260 97 8899001' },
            { form_field_id: 41, answer: 'agnes.zulu@example.com' },
            { form_field_id: 42, answer: 'Zambia' },
            { form_field_id: 43, answer: 'Luapula' },
            { form_field_id: 44, answer: 'Mansa' },
            { form_field_id: 45, answer: 'Central Business District' },
            { form_field_id: 46, answer: 'Independence Avenue' },
            { form_field_id: 47, answer: 'Shop No. 12, Mansa Market' }
        ];

        submission4Answers.forEach(answer => {
            this.formAnswers.push({
                id: this.idCounters.formAnswers++,
                form_field_id: answer.form_field_id,
                answer: answer.answer,
                submission_id: 4
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
        this.idCounters.reservedNames = Math.max(...this.reservedNames.map(rn => rn.id), 0) + 1;

        console.log(`✅ Mock database initialized with:
    • ${this.groups.length} groups
    • ${this.reservedNames.length} reserved names
    • ${this.fields.length} fields
    • ${this.formFields.length} form fields
    • ${this.formAnswers.length} form answers
    • ${this.submissions.length} submissions (${this.submissions.filter(s => s.services_id === 1).length} Name Clearance)
    • ${this.submissions.length} submissions (${this.submissions.filter(s => s.services_id === 1).length} Name Clearance)
    • ${this.users.length} users
    • ${this.formGroups.length} form groups`);

        // Test the validation
        console.log('\n🔍 Testing reserved name validation:');
        const testNames = ['Test Reserved Name', 'PACRA Ltd', 'My Valid Company Name', 'ZRA Crafts Ltd'];
        testNames.forEach(name => {
            const matches = this.checkReservedName(name);
            console.log(`  "${name}": ${matches.length > 0 ? `❌ Matches reserved names: ${matches.map(rn => rn.reserved_name).join(', ')}` : '✅ No matches'}`);
        });
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

    // ReservedNames
    getReservedNames() { return this.getLocal(this.reservedNames); }
    getReservedName(id: number) { return this.getLocalById(this.reservedNames, id); }
    createReservedName(data: CreateReservedName) { return this.createLocal(this.reservedNames, data, this.idCounters.reservedNames++); }
    updateReservedName(id: number, data: Partial<ReservedName>) { return this.updateLocal(this.reservedNames, id, data); }
    deleteReservedName(id: number) { return this.deleteLocal(this.reservedNames, id); }

    checkReservedName(name: string): ReservedName[] {
        if (!name) return [];
        const lowerName = name.toLowerCase();
        return this.reservedNames.filter(rn =>
            rn.reserved_name?.toLowerCase().includes(lowerName) ||
            lowerName.includes(rn.reserved_name?.toLowerCase() || '')
        );
    }

    // FormGroups
    getFormGroups() { return this.getLocal(this.formGroups); }
    getFormGroup(id: number) { return this.getLocalById(this.formGroups, id); }
    createFormGroup(data: CreateFormGroup) { return this.createLocal(this.formGroups, data, this.idCounters.formGroups++); }
    updateFormGroup(id: number, data: Partial<FormGroup>) { return this.updateLocal(this.formGroups, id, data); }
    deleteFormGroup(id: number) { return this.deleteLocal(this.formGroups, id); }

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
    // Update the hydrateSubmission method to include formFields
    private hydrateSubmission(submission: Submission): Submission {
        const answers = this.formAnswers.filter(fa => fa.submission_id === submission.id);

        let derivedFormId: number | undefined;
        if (answers.length > 0 && answers[0].form_field_id) {
            const ff = this.formFields.find(f => f.id === answers[0].form_field_id);
            if (ff) derivedFormId = ff.form_id;
        }

        // Get form fields based on derived form ID or find form fields for the answers
        let formFieldsForSubmission: FormField[] = [];
        if (derivedFormId) {
            formFieldsForSubmission = this.formFields.filter(ff => ff.form_id === derivedFormId);
        } else {
            // Fallback: get form fields from the answers' form_field_ids
            const formFieldIds = [...new Set(answers.map(a => a.form_field_id))];
            formFieldsForSubmission = this.formFields.filter(ff =>
                formFieldIds.includes(ff.id)
            );
        }

        return {
            ...submission,
            formAnswers: answers,
            formFields: formFieldsForSubmission,
            form_id: derivedFormId
        };
    }

    // Also update the createSubmission method to properly hydrate with formFields
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

    // Update updateSubmission method to maintain formFields
    updateSubmission(id: number, data: Partial<Submission>): Submission | null {
        const index = this.submissions.findIndex(s => s.id === id);
        if (index === -1) return null;

        const { formAnswers, formFields, ...updateData } = data;
        this.submissions[index] = { ...this.submissions[index], ...updateData };

        // If formAnswers are provided, update them
        if (formAnswers) {
            // Remove existing answers for this submission
            this.formAnswers = this.formAnswers.filter(fa => fa.submission_id !== id);

            // Add new answers
            formAnswers.forEach(ans => {
                this.createFormAnswer({ ...ans, submission_id: id });
            });
        }

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
