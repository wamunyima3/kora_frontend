// api/mockClient.ts
import {
  Group,
  Field,
  Service,
  Form,
  FormField,
  Submission,
  FormAnswer,
  CreateGroup,
  CreateField,
  CreateService,
  CreateForm,
  CreateFormField,
  CreateSubmission,
  CreateFormAnswer,
  DataType,
  Collection,
  CollectionItem,
  User,
  ReservedName,
  FormGroup,
  CreateDataType,
  CreateCollection,
  CreateCollectionItem,
  CreateUser,
  CreateReservedName,
  CreateFormGroup,
} from "../types";

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
    formGroups: 1,
  };

  // Initialize with mock data
  async initialize() {
    console.log("🔄 Initializing mock database with SQL data...");

    // Groups from SQL
    this.groups = [
      { id: 1, group_name: "Person" },
      { id: 2, group_name: "Address" },
      { id: 3, group_name: "Entity" },
    ];

    // Data Types from SQL
    this.dataTypes = [
      { id: 1, data_type: "Text" },
      { id: 2, data_type: "Number" },
      { id: 3, data_type: "Date" },
      { id: 4, data_type: "CheckBox" },
      { id: 5, data_type: "Dropdown" },
      { id: 6, data_type: "Radio" },
    ];

    // Collections from SQL
    this.collections = [
      { id: 1, collection_name: "Gender" },
      { id: 2, collection_name: "EntityType" },
      { id: 3, collection_name: "Identity Type" },
      { id: 4, collection_name: "Country" },
      { id: 5, collection_name: "Province" },
      { id: 6, collection_name: "District" },
      { id: 7, collection_name: "Entity Limit" },
      { id: 8, collection_name: "Entity Category" },
      { id: 9, collection_name: "Business Activity" },
    ];

    // Collection Items from SQL
    this.collectionItems = [
      // Gender (1)
      {
        id: 1,
        collection_id: 1,
        collection_item: "Male",
        relation_collection_items_id: null,
      },
      {
        id: 2,
        collection_id: 1,
        collection_item: "Female",
        relation_collection_items_id: null,
      },

      // EntityType (2)
      {
        id: 3,
        collection_id: 2,
        collection_item: "Business Name",
        relation_collection_items_id: null,
      },
      {
        id: 4,
        collection_id: 2,
        collection_item: "Local Company",
        relation_collection_items_id: null,
      },
      {
        id: 5,
        collection_id: 2,
        collection_item: "Foreign Company",
        relation_collection_items_id: null,
      },

      // Identity Type (3)
      {
        id: 6,
        collection_id: 3,
        collection_item: "NRC",
        relation_collection_items_id: null,
      },
      {
        id: 7,
        collection_id: 3,
        collection_item: "Passport",
        relation_collection_items_id: null,
      },

      // Country (4)
      {
        id: 8,
        collection_id: 4,
        collection_item: "Zambia",
        relation_collection_items_id: null,
      },
      {
        id: 9,
        collection_id: 4,
        collection_item: "South Africa",
        relation_collection_items_id: null,
      },
      {
        id: 10,
        collection_id: 4,
        collection_item: "Germany",
        relation_collection_items_id: null,
      },
      {
        id: 11,
        collection_id: 4,
        collection_item: "United Kingdom",
        relation_collection_items_id: null,
      },
      {
        id: 12,
        collection_id: 4,
        collection_item: "Kenya",
        relation_collection_items_id: null,
      },
      {
        id: 13,
        collection_id: 4,
        collection_item: "Nigeria",
        relation_collection_items_id: null,
      },

      // Province (5) - relation to Country
      {
        id: 14,
        collection_id: 5,
        collection_item: "Lusaka",
        relation_collection_items_id: 8,
      },
      {
        id: 15,
        collection_id: 5,
        collection_item: "Copperbelt",
        relation_collection_items_id: 8,
      },
      {
        id: 16,
        collection_id: 5,
        collection_item: "Livingstone",
        relation_collection_items_id: 8,
      },
      {
        id: 17,
        collection_id: 5,
        collection_item: "Cape Town",
        relation_collection_items_id: 9,
      },
      {
        id: 18,
        collection_id: 5,
        collection_item: "Berlin",
        relation_collection_items_id: 10,
      },
      {
        id: 19,
        collection_id: 5,
        collection_item: "London",
        relation_collection_items_id: 11,
      },
      {
        id: 20,
        collection_id: 5,
        collection_item: "Nairobi",
        relation_collection_items_id: 12,
      },
      {
        id: 21,
        collection_id: 5,
        collection_item: "Abujah",
        relation_collection_items_id: 13,
      },

      // District (6) - relation to Province
      {
        id: 22,
        collection_id: 6,
        collection_item: "Lusaka",
        relation_collection_items_id: 14,
      },

      // Entity Limit (7)
      {
        id: 23,
        collection_id: 7,
        collection_item: "Private Company Limited by Shares",
        relation_collection_items_id: null,
      },
      {
        id: 24,
        collection_id: 7,
        collection_item:
          'Private Company Limited by Guarantee with the word "Limited"',
        relation_collection_items_id: null,
      },
      {
        id: 25,
        collection_id: 7,
        collection_item:
          'Private Company Limited By Guarantee without the word "Limited"',
        relation_collection_items_id: null,
      },
      {
        id: 26,
        collection_id: 7,
        collection_item: "Foreign Company",
        relation_collection_items_id: null,
      },
      {
        id: 27,
        collection_id: 7,
        collection_item: "Public Limited Company",
        relation_collection_items_id: null,
      },
      {
        id: 28,
        collection_id: 7,
        collection_item: "Unlimited Private Company",
        relation_collection_items_id: null,
      },

      // Entity Category (8)
      {
        id: 29,
        collection_id: 8,
        collection_item: "Local Bank",
        relation_collection_items_id: null,
      },
      {
        id: 30,
        collection_id: 8,
        collection_item: "Foreign Bank",
        relation_collection_items_id: null,
      },
      {
        id: 31,
        collection_id: 8,
        collection_item: "Insurance Company",
        relation_collection_items_id: null,
      },
      {
        id: 32,
        collection_id: 8,
        collection_item: "Re-Insurance Company",
        relation_collection_items_id: null,
      },
      {
        id: 33,
        collection_id: 8,
        collection_item: "Bureau De Change",
        relation_collection_items_id: null,
      },
      {
        id: 34,
        collection_id: 8,
        collection_item: "Financial Institution",
        relation_collection_items_id: null,
      },
      {
        id: 35,
        collection_id: 8,
        collection_item: "Ordinary Company",
        relation_collection_items_id: null,
      },

      // Business Activity (9)
      {
        id: 36,
        collection_id: 9,
        collection_item: "Mining of iron ores",
        relation_collection_items_id: null,
      },
      {
        id: 37,
        collection_id: 9,
        collection_item: "Wholesale Trade",
        relation_collection_items_id: null,
      },
      {
        id: 38,
        collection_id: 9,
        collection_item: "Retail Trade",
        relation_collection_items_id: null,
      },
      {
        id: 39,
        collection_id: 9,
        collection_item:
          "Electric power generation, transmission and distribution",
        relation_collection_items_id: null,
      },
      {
        id: 40,
        collection_id: 9,
        collection_item: "Other specialized construction activities",
        relation_collection_items_id: null,
      },
      {
        id: 41,
        collection_id: 9,
        collection_item: "Software publishing",
        relation_collection_items_id: null,
      },
    ];

    // Fields from SQL
    this.fields = [
      {
        id: 1,
        label: "First Name",
        data_type_id: 1,
        group_id: 1,
        status: true,
        collection_id: null,
      },
      {
        id: 2,
        label: "Middle Name",
        data_type_id: 1,
        group_id: 1,
        status: false,
        collection_id: null,
      },
      {
        id: 3,
        label: "Last Name",
        data_type_id: 1,
        group_id: 1,
        status: true,
        collection_id: null,
      },
      {
        id: 4,
        label: "Gender",
        data_type_id: 5,
        group_id: 1,
        status: true,
        collection_id: 1,
      },
      {
        id: 5,
        label: "Date of Birth",
        data_type_id: 3,
        group_id: 1,
        status: true,
        collection_id: null,
      },
      {
        id: 6,
        label: "Nationality",
        data_type_id: 5,
        group_id: 1,
        status: true,
        collection_id: 4,
      },
      {
        id: 7,
        label: "Identity Type",
        data_type_id: 5,
        group_id: 1,
        status: true,
        collection_id: 3,
      },
      {
        id: 8,
        label: "Identity Number",
        data_type_id: 1,
        group_id: 1,
        status: true,
        collection_id: null,
      },
      {
        id: 9,
        label: "Entity Name",
        data_type_id: 1,
        group_id: 3,
        status: false,
        collection_id: null,
      },
      {
        id: 10,
        label: "Body Corporate Type",
        data_type_id: 5,
        group_id: null,
        status: false,
        collection_id: 2,
      },
      {
        id: 11,
        label: "Registration Number",
        data_type_id: 2,
        group_id: 3,
        status: false,
        collection_id: null,
      },
      {
        id: 12,
        label: "Country of Incorporation",
        data_type_id: 5,
        group_id: null,
        status: false,
        collection_id: 4,
      },
      {
        id: 13,
        label: "Registration Date",
        data_type_id: 3,
        group_id: 3,
        status: false,
        collection_id: null,
      },
      {
        id: 14,
        label: "Phone Number",
        data_type_id: 1,
        group_id: 1,
        status: true,
        collection_id: null,
      },
      {
        id: 15,
        label: "Email Address",
        data_type_id: 1,
        group_id: 1,
        status: true,
        collection_id: null,
      },
      {
        id: 16,
        label: "Country",
        data_type_id: 5,
        group_id: 2,
        status: true,
        collection_id: 4,
      },
      {
        id: 17,
        label: "Province",
        data_type_id: 5,
        group_id: 2,
        status: true,
        collection_id: 5,
      },
      {
        id: 18,
        label: "Town",
        data_type_id: 5,
        group_id: 2,
        status: true,
        collection_id: null,
      },
      {
        id: 19,
        label: "Area",
        data_type_id: 5,
        group_id: 2,
        status: true,
        collection_id: null,
      },
      {
        id: 20,
        label: "Street",
        data_type_id: 1,
        group_id: 2,
        status: true,
        collection_id: null,
      },
      {
        id: 21,
        label: "Plot House Village",
        data_type_id: 1,
        group_id: 2,
        status: true,
        collection_id: null,
      },
      {
        id: 22,
        label: "Entity Type",
        data_type_id: 5,
        group_id: 3,
        status: true,
        collection_id: 2,
      },
      {
        id: 23,
        label: "Entity Limit",
        data_type_id: 5,
        group_id: 3,
        status: true,
        collection_id: 7,
      },
      {
        id: 24,
        label: "Entity Category",
        data_type_id: 5,
        group_id: 3,
        status: true,
        collection_id: 8,
      },
      {
        id: 25,
        label: "Justification",
        data_type_id: 1,
        group_id: null,
        status: true,
        collection_id: null,
      },
      {
        id: 26,
        label: "Proposed Name",
        data_type_id: 1,
        group_id: null,
        status: true,
        collection_id: null,
      },
      {
        id: 27,
        label: "Business Activity",
        data_type_id: 6,
        group_id: null,
        status: true,
        collection_id: 9,
      },
      {
        id: 28,
        label: "Promoter Name",
        data_type_id: 1,
        group_id: null,
        status: true,
        collection_id: null,
      },
      {
        id: 29,
        label: "Application Date",
        data_type_id: 3,
        group_id: null,
        status: true,
        collection_id: null,
      },
    ];

    // Services from SQL
    this.services = [
      { id: 1, service_name: "Name Clearance" },
      // { id: 2, service_name: 'Name Reservation' },
      // { id: 3, service_name: 'Entity Registration' }
    ];

    // Forms from SQL
    this.forms = [
      {
        id: 1,
        form_name: "Name Clearance Form",
        description: "Form that renders Name Clearance Service",
        service_id: 1,
        status: true,
      },
      {
        id: 2,
        form_name: "Name Reservation Form",
        description: "Form that renders the Name Reservation Service",
        service_id: 2,
        status: true,
      },
      {
        id: 3,
        form_name: "Entity Registration",
        description: "Form that renders the Entity Registration Service",
        service_id: 3,
        status: true,
      },
    ];

    // Form Groups from SQL
    this.formGroups = [
      { id: 1, group_name: "Applicant", group_span: 0, group_row: 0 },
      { id: 2, group_name: "Person Lodging", group_span: 0, group_row: 0 },
      { id: 3, group_name: "Application Details", group_span: 0, group_row: 0 },
      { id: 4, group_name: "Proposed Names", group_span: 0, group_row: 0 },
    ];

    // Form Fields from SQL with validation updates for Proposed Names
    this.formFields = [
      // Applicant group (group 1)
      {
        id: 1,
        form_id: 1,
        field_id: 1,
        field_name: "Applicant First Name",
        validation: ",1",
        field_span: 0,
        field_row: 0,
        form_group_id: 1,
      },
      {
        id: 2,
        form_id: 1,
        field_id: 2,
        field_name: "Applicant Middle Name",
        validation: ",1",
        field_span: 0,
        field_row: 0,
        form_group_id: 1,
      },
      {
        id: 3,
        form_id: 1,
        field_id: 3,
        field_name: "Applicant Last Name",
        validation: ",1",
        field_span: 0,
        field_row: 0,
        form_group_id: 1,
      },
      {
        id: 4,
        form_id: 1,
        field_id: 4,
        field_name: "Applicant Gender",
        validation: ",1",
        field_span: 0,
        field_row: 0,
        form_group_id: 1,
      },
      {
        id: 5,
        form_id: 1,
        field_id: 5,
        field_name: "Applicant Date of Birth",
        validation: ",1",
        field_span: 0,
        field_row: 0,
        form_group_id: 1,
      },
      {
        id: 6,
        form_id: 1,
        field_id: 6,
        field_name: "Applicant Nationality",
        validation: ",1",
        field_span: 0,
        field_row: 0,
        form_group_id: 1,
      },
      {
        id: 7,
        form_id: 1,
        field_id: 7,
        field_name: "Applicant Identity Type",
        validation: ",1",
        field_span: 0,
        field_row: 0,
        form_group_id: 1,
      },
      {
        id: 8,
        form_id: 1,
        field_id: 8,
        field_name: "Applicant Identity Number",
        validation: ",1",
        field_span: 0,
        field_row: 0,
        form_group_id: 1,
      },

      // Body corporate fields
      {
        id: 9,
        form_id: 1,
        field_id: 9,
        field_name: "Body Corporate Name",
        validation: ",1",
        field_span: 0,
        field_row: 0,
        form_group_id: null,
      },
      {
        id: 10,
        form_id: 1,
        field_id: 10,
        field_name: "Body Corporate Type",
        validation: ",1",
        field_span: 0,
        field_row: 0,
        form_group_id: null,
      },
      {
        id: 11,
        form_id: 1,
        field_id: 11,
        field_name: "Body Corporate Registration Number",
        validation: ",1",
        field_span: 0,
        field_row: 0,
        form_group_id: null,
      },
      {
        id: 12,
        form_id: 1,
        field_id: 12,
        field_name: "Body Corporate Country of Incorporation",
        validation: ",1",
        field_span: 0,
        field_row: 0,
        form_group_id: null,
      },
      {
        id: 13,
        form_id: 1,
        field_id: 13,
        field_name: "Body Corporate Registration Date",
        validation: ",1",
        field_span: 0,
        field_row: 0,
        form_group_id: null,
      },

      // Contact info
      {
        id: 14,
        form_id: 1,
        field_id: 14,
        field_name: "Applicant Phone Number",
        validation: ",1",
        field_span: 0,
        field_row: 0,
        form_group_id: 1,
      },
      {
        id: 15,
        form_id: 1,
        field_id: 15,
        field_name: "Applicant Email Address",
        validation: ",1",
        field_span: 0,
        field_row: 0,
        form_group_id: 1,
      },

      // Address fields
      {
        id: 16,
        form_id: 1,
        field_id: 16,
        field_name: "Applicant Country",
        validation: ",1",
        field_span: 0,
        field_row: 0,
        form_group_id: 1,
      },
      {
        id: 17,
        form_id: 1,
        field_id: 17,
        field_name: "Applicant Province",
        validation: ",1",
        field_span: 0,
        field_row: 0,
        form_group_id: 1,
      },
      {
        id: 18,
        form_id: 1,
        field_id: 18,
        field_name: "Applicant Town",
        validation: ",1",
        field_span: 0,
        field_row: 0,
        form_group_id: 1,
      },
      {
        id: 19,
        form_id: 1,
        field_id: 19,
        field_name: "Applicant Area",
        validation: ",1",
        field_span: 0,
        field_row: 0,
        form_group_id: 1,
      },
      {
        id: 20,
        form_id: 1,
        field_id: 20,
        field_name: "Applicant Street",
        validation: ",1",
        field_span: 0,
        field_row: 0,
        form_group_id: 1,
      },
      {
        id: 21,
        form_id: 1,
        field_id: 21,
        field_name: "Applicant Plot House Village",
        validation: ",1",
        field_span: 0,
        field_row: 0,
        form_group_id: 1,
      },

      // Entity fields
      {
        id: 22,
        form_id: 1,
        field_id: 22,
        field_name: "",
        validation: ",3",
        field_span: 0,
        field_row: 0,
        form_group_id: null,
      },
      {
        id: 23,
        form_id: 1,
        field_id: 23,
        field_name: "",
        validation: ",3",
        field_span: 0,
        field_row: 0,
        form_group_id: null,
      },
      {
        id: 24,
        form_id: 1,
        field_id: 24,
        field_name: "",
        validation: ",3",
        field_span: 0,
        field_row: 0,
        form_group_id: null,
      },

      // Application details (group 3)
      {
        id: 25,
        form_id: 1,
        field_id: 25,
        field_name: "Justification",
        validation: ",3",
        field_span: 0,
        field_row: 0,
        form_group_id: 3,
      },
      {
        id: 31,
        form_id: 1,
        field_id: 29,
        field_name: "Application Date",
        validation: ",3",
        field_span: 0,
        field_row: 0,
        form_group_id: 3,
      },

      // Proposed names (group 4) - ADDED validate_reserved_name validation
      {
        id: 26,
        form_id: 1,
        field_id: 26,
        field_name: "Proposed Name 1",
        validation: "validate_reserved_name",
        field_span: 0,
        field_row: 0,
        form_group_id: 4,
      },
      {
        id: 27,
        form_id: 1,
        field_id: 26,
        field_name: "Proposed Name 2",
        validation: "validate_reserved_name",
        field_span: 0,
        field_row: 0,
        form_group_id: 4,
      },
      {
        id: 28,
        form_id: 1,
        field_id: 26,
        field_name: "Proposed Name 3",
        validation: "validate_reserved_name",
        field_span: 0,
        field_row: 0,
        form_group_id: 4,
      },

      // Business activities (group 4)
      {
        id: 29,
        form_id: 1,
        field_id: 27,
        field_name: "Business Activity 1",
        validation: ",4",
        field_span: 0,
        field_row: 0,
        form_group_id: 4,
      },
      {
        id: 48,
        form_id: 1,
        field_id: 27,
        field_name: "Business Activity 2",
        validation: ",4",
        field_span: 0,
        field_row: 0,
        form_group_id: 4,
      },
      {
        id: 49,
        form_id: 1,
        field_id: 27,
        field_name: "Business Activity 3",
        validation: ",4",
        field_span: 0,
        field_row: 0,
        form_group_id: 4,
      },

      // Promoter (group 4)
      {
        id: 30,
        form_id: 1,
        field_id: 28,
        field_name: "Promoter Name",
        validation: ",4",
        field_span: 0,
        field_row: 0,
        form_group_id: 4,
      },

      // Person Lodging group (group 2)
      {
        id: 32,
        form_id: 1,
        field_id: 1,
        field_name: "Person Lodging First Name",
        validation: ",2",
        field_span: 0,
        field_row: 0,
        form_group_id: 2,
      },
      {
        id: 33,
        form_id: 1,
        field_id: 2,
        field_name: "Person Lodging Middle Name",
        validation: ",2",
        field_span: 0,
        field_row: 0,
        form_group_id: 2,
      },
      {
        id: 34,
        form_id: 1,
        field_id: 3,
        field_name: "Person Lodging Last Name",
        validation: ",2",
        field_span: 0,
        field_row: 0,
        form_group_id: 2,
      },
      {
        id: 35,
        form_id: 1,
        field_id: 4,
        field_name: "Person Lodging Gender",
        validation: ",2",
        field_span: 0,
        field_row: 0,
        form_group_id: 2,
      },
      {
        id: 36,
        form_id: 1,
        field_id: 5,
        field_name: "Person Lodging Date of Birth",
        validation: ",2",
        field_span: 0,
        field_row: 0,
        form_group_id: 2,
      },
      {
        id: 37,
        form_id: 1,
        field_id: 6,
        field_name: "Person Lodging Nationality",
        validation: ",2",
        field_span: 0,
        field_row: 0,
        form_group_id: 2,
      },
      {
        id: 38,
        form_id: 1,
        field_id: 7,
        field_name: "Person Lodging Identity Type",
        validation: ",2",
        field_span: 0,
        field_row: 0,
        form_group_id: 2,
      },
      {
        id: 39,
        form_id: 1,
        field_id: 8,
        field_name: "Person Lodging Identity Number",
        validation: ",2",
        field_span: 0,
        field_row: 0,
        form_group_id: 2,
      },
      {
        id: 40,
        form_id: 1,
        field_id: 14,
        field_name: "Person Lodging Phone Number",
        validation: ",2",
        field_span: 0,
        field_row: 0,
        form_group_id: 2,
      },
      {
        id: 41,
        form_id: 1,
        field_id: 15,
        field_name: "Person Lodging Email Address",
        validation: ",2",
        field_span: 0,
        field_row: 0,
        form_group_id: 2,
      },
      {
        id: 42,
        form_id: 1,
        field_id: 16,
        field_name: "Person Lodging Country",
        validation: ",2",
        field_span: 0,
        field_row: 0,
        form_group_id: 2,
      },
      {
        id: 43,
        form_id: 1,
        field_id: 17,
        field_name: "Person Lodging Province",
        validation: ",2",
        field_span: 0,
        field_row: 0,
        form_group_id: 2,
      },
      {
        id: 44,
        form_id: 1,
        field_id: 18,
        field_name: "Person Lodging Town",
        validation: ",2",
        field_span: 0,
        field_row: 0,
        form_group_id: 2,
      },
      {
        id: 45,
        form_id: 1,
        field_id: 19,
        field_name: "Person Lodging Area",
        validation: ",2",
        field_span: 0,
        field_row: 0,
        form_group_id: 2,
      },
      {
        id: 46,
        form_id: 1,
        field_id: 20,
        field_name: "Person Lodging Street",
        validation: ",2",
        field_span: 0,
        field_row: 0,
        form_group_id: 2,
      },
      {
        id: 47,
        form_id: 1,
        field_id: 21,
        field_name: "Person Lodging Person Plot House Village",
        validation: ",2",
        field_span: 0,
        field_row: 0,
        form_group_id: 2,
      },
    ];

    // Users from SQL
    this.users = [
      {
        id: 1,
        first_name: "John",
        middle_name: "Michael",
        surname: "Phiri",
        dob: "1988-04-12",
        email: "john.phiri@example.com",
        password: "hashed_password_1",
      },
      {
        id: 2,
        first_name: "Mary",
        middle_name: "Elizabeth",
        surname: "Banda",
        dob: "1992-09-23",
        email: "mary.banda@example.com",
        password: "hashed_password_2",
      },
      {
        id: 3,
        first_name: "Peter",
        middle_name: null,
        surname: "Mwansa",
        dob: "1985-01-17",
        email: "peter.mwansa@example.com",
        password: "hashed_password_3",
      },
      {
        id: 4,
        first_name: "Agnes",
        middle_name: "Chileshe",
        surname: "Zulu",
        dob: "1990-06-05",
        email: "agnes.zulu@example.com",
        password: "hashed_password_4",
      },
      {
        id: 5,
        first_name: "Daniel",
        middle_name: "K.",
        surname: "Mwanza",
        dob: "1995-11-30",
        email: "daniel.mwanza@example.com",
        password: "hashed_password_5",
      },
    ];

    // Submissions from SQL
    this.submissions = [
      {
        id: 1,
        services_id: 1,
        case_number: "E-20260121-000001",
        created_by: 1,
        created_on: "2026-01-21 15:12:23",
      },
      {
        id: 2,
        services_id: 1,
        case_number: "E-20260121-000002",
        created_by: 2,
        created_on: "2026-01-22 11:55:34",
      },
    ];

    // Form Answers from SQL
    this.formAnswers = [
      // Submission 1 answers (Mutale Mwale)
      { id: 1, form_field_id: 1, answer: "Mutale", submission_id: 1 },
      { id: 2, form_field_id: 2, answer: "", submission_id: 1 },
      { id: 3, form_field_id: 3, answer: "Mwale", submission_id: 1 },
      { id: 4, form_field_id: 4, answer: "1", submission_id: 1 },
      { id: 5, form_field_id: 5, answer: "1990-12-24", submission_id: 1 },
      { id: 6, form_field_id: 6, answer: "8", submission_id: 1 },
      { id: 7, form_field_id: 7, answer: "6", submission_id: 1 },
      { id: 8, form_field_id: 8, answer: "123456/10/1", submission_id: 1 },
      { id: 9, form_field_id: 9, answer: "", submission_id: 1 },
      { id: 10, form_field_id: 10, answer: "", submission_id: 1 },
      { id: 11, form_field_id: 11, answer: "", submission_id: 1 },
      { id: 12, form_field_id: 12, answer: "", submission_id: 1 },
      { id: 13, form_field_id: 13, answer: "", submission_id: 1 },
      { id: 14, form_field_id: 14, answer: "+260955112233", submission_id: 1 },
      { id: 15, form_field_id: 15, answer: "M.M@mail.com", submission_id: 1 },
      { id: 16, form_field_id: 16, answer: "8", submission_id: 1 },
      { id: 17, form_field_id: 17, answer: "14", submission_id: 1 },
      { id: 18, form_field_id: 18, answer: "22", submission_id: 1 },
      { id: 19, form_field_id: 19, answer: "Long Acres", submission_id: 1 },
      {
        id: 20,
        form_field_id: 20,
        answer: "Hailie Selasie Avenue",
        submission_id: 1,
      },
      { id: 21, form_field_id: 21, answer: "PACRA House", submission_id: 1 },
      { id: 22, form_field_id: 22, answer: "4", submission_id: 1 },
      { id: 23, form_field_id: 23, answer: "23", submission_id: 1 },
      { id: 24, form_field_id: 24, answer: "35", submission_id: 1 },
      { id: 25, form_field_id: 25, answer: "", submission_id: 1 },
      {
        id: 26,
        form_field_id: 26,
        answer: "Kora Business Limited",
        submission_id: 1,
      },
      {
        id: 27,
        form_field_id: 27,
        answer: "A Team Developers Limited",
        submission_id: 1,
      },
      {
        id: 28,
        form_field_id: 28,
        answer: "Ezra Business Ventures Limited",
        submission_id: 1,
      },
      { id: 29, form_field_id: 29, answer: "41", submission_id: 1 },
      { id: 30, form_field_id: 30, answer: "", submission_id: 1 },
      {
        id: 31,
        form_field_id: 31,
        answer: "2026-01-21 15:12:23",
        submission_id: 1,
      },
      { id: 32, form_field_id: 32, answer: "Mutale", submission_id: 1 },
      { id: 33, form_field_id: 33, answer: "", submission_id: 1 },
      { id: 34, form_field_id: 34, answer: "Mwale", submission_id: 1 },
      { id: 35, form_field_id: 35, answer: "1", submission_id: 1 },
      { id: 36, form_field_id: 36, answer: "1990-12-24", submission_id: 1 },
      { id: 37, form_field_id: 37, answer: "8", submission_id: 1 },
      { id: 38, form_field_id: 38, answer: "6", submission_id: 1 },
      { id: 39, form_field_id: 39, answer: "123456/10/1", submission_id: 1 },
      { id: 40, form_field_id: 40, answer: "+260955112233", submission_id: 1 },
      { id: 41, form_field_id: 41, answer: "M.M@mail.com", submission_id: 1 },
      { id: 42, form_field_id: 42, answer: "8", submission_id: 1 },
      { id: 43, form_field_id: 43, answer: "14", submission_id: 1 },
      { id: 44, form_field_id: 44, answer: "22", submission_id: 1 },
      { id: 45, form_field_id: 45, answer: "Long Acres", submission_id: 1 },
      {
        id: 46,
        form_field_id: 46,
        answer: "Hailie Selasie Avenue",
        submission_id: 1,
      },
      { id: 47, form_field_id: 47, answer: "PACRA House", submission_id: 1 },
      { id: 48, form_field_id: 48, answer: "37", submission_id: 1 },
      { id: 49, form_field_id: 49, answer: "38", submission_id: 1 },

      // Submission 2 answers (John Chimfwembe)
      { id: 50, form_field_id: 1, answer: "John", submission_id: 2 },
      { id: 51, form_field_id: 2, answer: "", submission_id: 2 },
      { id: 52, form_field_id: 3, answer: "Chimfwembe", submission_id: 2 },
      { id: 53, form_field_id: 4, answer: "2", submission_id: 2 },
      { id: 54, form_field_id: 5, answer: "1991-03-11", submission_id: 2 },
      { id: 55, form_field_id: 6, answer: "8", submission_id: 2 },
      { id: 56, form_field_id: 7, answer: "6", submission_id: 2 },
      { id: 57, form_field_id: 8, answer: "238843/11/1", submission_id: 2 },
      { id: 58, form_field_id: 9, answer: "", submission_id: 2 },
      { id: 59, form_field_id: 10, answer: "", submission_id: 2 },
      { id: 60, form_field_id: 11, answer: "", submission_id: 2 },
      { id: 61, form_field_id: 12, answer: "", submission_id: 2 },
      { id: 62, form_field_id: 13, answer: "", submission_id: 2 },
      { id: 63, form_field_id: 14, answer: "+260955234199", submission_id: 2 },
      {
        id: 64,
        form_field_id: 15,
        answer: "J.chi@somemail.com",
        submission_id: 2,
      },
      { id: 65, form_field_id: 16, answer: "8", submission_id: 2 },
      { id: 66, form_field_id: 17, answer: "14", submission_id: 2 },
      { id: 67, form_field_id: 18, answer: "22", submission_id: 2 },
      { id: 68, form_field_id: 19, answer: "Kabulonga", submission_id: 2 },
      { id: 69, form_field_id: 20, answer: "K Street", submission_id: 2 },
      { id: 70, form_field_id: 21, answer: "House No. 24", submission_id: 2 },
      { id: 71, form_field_id: 22, answer: "4", submission_id: 2 },
      { id: 72, form_field_id: 23, answer: "23", submission_id: 2 },
      { id: 73, form_field_id: 24, answer: "35", submission_id: 2 },
      { id: 74, form_field_id: 25, answer: "", submission_id: 2 },
      {
        id: 75,
        form_field_id: 26,
        answer: "King K Investments Limited",
        submission_id: 2,
      },
      {
        id: 76,
        form_field_id: 27,
        answer: "Runny Enterprise Limited",
        submission_id: 2,
      },
      {
        id: 77,
        form_field_id: 28,
        answer: "Pressure Pressed Mining Limited",
        submission_id: 2,
      },
      { id: 78, form_field_id: 29, answer: "36", submission_id: 2 },
      { id: 79, form_field_id: 30, answer: "", submission_id: 2 },
      {
        id: 80,
        form_field_id: 31,
        answer: "2026-01-21 15:12:23",
        submission_id: 2,
      },
      { id: 81, form_field_id: 32, answer: "Mutale", submission_id: 2 },
      { id: 82, form_field_id: 33, answer: "", submission_id: 2 },
      { id: 83, form_field_id: 34, answer: "Mwale", submission_id: 2 },
      { id: 84, form_field_id: 35, answer: "1", submission_id: 2 },
      { id: 85, form_field_id: 36, answer: "1991-03-11", submission_id: 2 },
      { id: 86, form_field_id: 37, answer: "8", submission_id: 2 },
      { id: 87, form_field_id: 38, answer: "6", submission_id: 2 },
      { id: 88, form_field_id: 39, answer: "238843/11/1", submission_id: 2 },
      { id: 89, form_field_id: 40, answer: "+260955234199", submission_id: 2 },
      {
        id: 90,
        form_field_id: 41,
        answer: "J.chi@somemail.com",
        submission_id: 2,
      },
      { id: 91, form_field_id: 42, answer: "8", submission_id: 2 },
      { id: 92, form_field_id: 43, answer: "14", submission_id: 2 },
      { id: 93, form_field_id: 44, answer: "22", submission_id: 2 },
      { id: 94, form_field_id: 45, answer: "Kabulonga", submission_id: 2 },
      { id: 95, form_field_id: 46, answer: "K Street", submission_id: 2 },
      { id: 96, form_field_id: 47, answer: "House No. 24", submission_id: 2 },
      { id: 97, form_field_id: 48, answer: "37", submission_id: 2 },
      { id: 98, form_field_id: 49, answer: "38", submission_id: 2 },
    ];

    // Note: Reserved names are not in the SQL, so we'll leave them empty or with basic data
    this.reservedNames = [
      // These would come from a reserved_names table in SQL, but not provided
      // Keeping minimal data for validation testing
      { id: 1, reserved_name: "PACRA" },
      { id: 2, reserved_name: "Patents and Companies Registration Agency" },
    ];

    // Initialize counters based on max ids
    this.idCounters.groups = Math.max(...this.groups.map((g) => g.id), 0) + 1;
    this.idCounters.dataTypes =
      Math.max(...this.dataTypes.map((d) => d.id), 0) + 1;
    this.idCounters.fields = Math.max(...this.fields.map((f) => f.id), 0) + 1;
    this.idCounters.services =
      Math.max(...this.services.map((s) => s.id), 0) + 1;
    this.idCounters.forms = Math.max(...this.forms.map((f) => f.id), 0) + 1;
    this.idCounters.formFields =
      Math.max(...this.formFields.map((ff) => ff.id), 0) + 1;
    this.idCounters.users = Math.max(...this.users.map((u) => u.id), 0) + 1;
    this.idCounters.submissions =
      Math.max(...this.submissions.map((s) => s.id), 0) + 1;
    this.idCounters.formAnswers =
      Math.max(...this.formAnswers.map((fa) => fa.id), 0) + 1;
    this.idCounters.collections =
      Math.max(...this.collections.map((c) => c.id), 0) + 1;
    this.idCounters.collectionItems =
      Math.max(...this.collectionItems.map((ci) => ci.id), 0) + 1;
    this.idCounters.reservedNames =
      Math.max(...this.reservedNames.map((rn) => rn.id), 0) + 1;
    this.idCounters.formGroups =
      Math.max(...this.formGroups.map((fg) => fg.id), 0) + 1;

    console.log(`✅ Mock database initialized with SQL data only:
    • ${this.groups.length} groups
    • ${this.dataTypes.length} data types
    • ${this.fields.length} fields
    • ${this.collections.length} collections
    • ${this.collectionItems.length} collection items
    • ${this.services.length} services
    • ${this.forms.length} forms
    • ${this.formGroups.length} form groups
    • ${this.formFields.length} form fields
    • ${this.users.length} users
    • ${this.submissions.length} submissions
    • ${this.formAnswers.length} form answers
    • ${this.reservedNames.length} reserved names`);

    // Test the validation with names from SQL submissions
    console.log("\n🔍 Testing validate_reserved_name on Proposed Names:");
    const testNames = [
      "Kora Business Limited",
      "PACRA House",
      "King K Investments Limited",
    ];
    testNames.forEach((name) => {
      const matches = this.checkReservedName(name);
      console.log(
        `  "${name}": ${matches.length > 0 ? `❌ Matches reserved names: ${matches.map((rn) => rn.reserved_name).join(", ")}` : "✅ No matches"}`,
      );
    });

    console.log(
      "\n✅ validate_reserved_name validation added to Proposed Name fields (IDs 26, 27, 28)",
    );
  }

  // Generic helper for creating standard CRUD
  private getLocal<T>(repo: T[]): T[] {
    return [...repo];
  }
  private getLocalById<T extends { id: number }>(
    repo: T[],
    id: number,
  ): T | undefined {
    return repo.find((item) => item.id === id);
  }
  private createLocal<T extends { id: number }>(
    repo: T[],
    data: any,
    idCounter: number,
  ): T {
    const newItem = { id: idCounter, ...data };
    repo.push(newItem);
    return newItem;
  }
  private updateLocal<T extends { id: number }>(
    repo: T[],
    id: number,
    data: Partial<T>,
  ): T | null {
    const index = repo.findIndex((item) => item.id === id);
    if (index === -1) return null;
    repo[index] = { ...repo[index], ...data };
    return repo[index];
  }
  private deleteLocal<T extends { id: number }>(
    repo: T[],
    id: number,
  ): boolean {
    const index = repo.findIndex((item) => item.id === id);
    if (index === -1) return false;
    repo.splice(index, 1);
    return true;
  }

  // Groups
  getGroups() {
    return this.getLocal(this.groups);
  }
  getGroup(id: number) {
    return this.getLocalById(this.groups, id);
  }
  createGroup(data: CreateGroup) {
    return this.createLocal(this.groups, data, this.idCounters.groups++);
  }
  updateGroup(id: number, data: Partial<Group>) {
    return this.updateLocal(this.groups, id, data);
  }
  deleteGroup(id: number) {
    return this.deleteLocal(this.groups, id);
  }

  // FormGroups
  getFormGroups() {
    return this.getLocal(this.formGroups);
  }
  getFormGroup(id: number) {
    return this.getLocalById(this.formGroups, id);
  }
  createFormGroup(data: CreateFormGroup) {
    return this.createLocal(
      this.formGroups,
      data,
      this.idCounters.formGroups++,
    );
  }
  updateFormGroup(id: number, data: Partial<FormGroup>) {
    return this.updateLocal(this.formGroups, id, data);
  }
  deleteFormGroup(id: number) {
    return this.deleteLocal(this.formGroups, id);
  }

  // DataTypes
  getDataTypes() {
    return this.getLocal(this.dataTypes);
  }
  getDataType(id: number) {
    return this.getLocalById(this.dataTypes, id);
  }
  createDataType(data: CreateDataType) {
    return this.createLocal(this.dataTypes, data, this.idCounters.dataTypes++);
  }
  updateDataType(id: number, data: Partial<DataType>) {
    return this.updateLocal(this.dataTypes, id, data);
  }
  deleteDataType(id: number) {
    return this.deleteLocal(this.dataTypes, id);
  }

  // Fields
  getFields() {
    return this.getLocal(this.fields);
  }
  getField(id: number) {
    return this.getLocalById(this.fields, id);
  }
  createField(data: CreateField) {
    return this.createLocal(this.fields, data, this.idCounters.fields++);
  }
  updateField(id: number, data: Partial<Field>) {
    return this.updateLocal(this.fields, id, data);
  }
  deleteField(id: number) {
    return this.deleteLocal(this.fields, id);
  }
  getFieldsByGroup(groupId: number) {
    return this.fields.filter((f) => f.group_id === groupId);
  }

  // Collections
  getCollections() {
    return this.getLocal(this.collections);
  }
  getCollection(id: number) {
    return this.getLocalById(this.collections, id);
  }
  createCollection(data: CreateCollection) {
    return this.createLocal(
      this.collections,
      data,
      this.idCounters.collections++,
    );
  }
  updateCollection(id: number, data: Partial<Collection>) {
    return this.updateLocal(this.collections, id, data);
  }
  deleteCollection(id: number) {
    return this.deleteLocal(this.collections, id);
  }

  // CollectionItems
  getCollectionItems() {
    return this.getLocal(this.collectionItems);
  }
  getCollectionItem(id: number) {
    return this.getLocalById(this.collectionItems, id);
  }
  createCollectionItem(data: CreateCollectionItem) {
    return this.createLocal(
      this.collectionItems,
      data,
      this.idCounters.collectionItems++,
    );
  }
  updateCollectionItem(id: number, data: Partial<CollectionItem>) {
    return this.updateLocal(this.collectionItems, id, data);
  }
  deleteCollectionItem(id: number) {
    return this.deleteLocal(this.collectionItems, id);
  }
  getCollectionItemsByCollection(collectionId: number) {
    return this.collectionItems.filter(
      (ci) => ci.collection_id === collectionId,
    );
  }

  // Services
  getServices() {
    return this.getLocal(this.services);
  }
  getService(id: number) {
    return this.getLocalById(this.services, id);
  }
  createService(data: CreateService) {
    return this.createLocal(this.services, data, this.idCounters.services++);
  }
  updateService(id: number, data: Partial<Service>) {
    return this.updateLocal(this.services, id, data);
  }
  deleteService(id: number) {
    return this.deleteLocal(this.services, id);
  }

  // Forms
  getForms() {
    return this.getLocal(this.forms);
  }
  getForm(id: number) {
    return this.getLocalById(this.forms, id);
  }
  createForm(data: CreateForm) {
    return this.createLocal(this.forms, data, this.idCounters.forms++);
  }
  updateForm(id: number, data: Partial<Form>) {
    return this.updateLocal(this.forms, id, data);
  }
  deleteForm(id: number) {
    return this.deleteLocal(this.forms, id);
  }
  getFormsByService(serviceId: number) {
    return this.forms.filter((f) => f.service_id === serviceId);
  }

  // FormFields
  getFormFields() {
    return this.getLocal(this.formFields);
  }
  getFormField(id: number) {
    return this.getLocalById(this.formFields, id);
  }
  createFormField(data: CreateFormField) {
    return this.createLocal(
      this.formFields,
      data,
      this.idCounters.formFields++,
    );
  }
  updateFormField(id: number, data: Partial<FormField>) {
    return this.updateLocal(this.formFields, id, data);
  }
  deleteFormField(id: number) {
    return this.deleteLocal(this.formFields, id);
  }
  getFormFieldsByForm(formId: number) {
    return this.formFields.filter((ff) => ff.form_id === formId);
  }
  getFormFieldsByField(fieldId: number) {
    return this.formFields.filter((ff) => ff.field_id === fieldId);
  }

  // Users
  getUsers() {
    return this.getLocal(this.users);
  }
  getUser(id: number) {
    return this.getLocalById(this.users, id);
  }
  createUser(data: CreateUser) {
    return this.createLocal(this.users, data, this.idCounters.users++);
  }
  updateUser(id: number, data: Partial<User>) {
    return this.updateLocal(this.users, id, data);
  }
  deleteUser(id: number) {
    return this.deleteLocal(this.users, id);
  }

  // ReservedNames
  getReservedNames() {
    return this.getLocal(this.reservedNames);
  }
  getReservedName(id: number) {
    return this.getLocalById(this.reservedNames, id);
  }
  createReservedName(data: CreateReservedName) {
    return this.createLocal(
      this.reservedNames,
      data,
      this.idCounters.reservedNames++,
    );
  }
  updateReservedName(id: number, data: Partial<ReservedName>) {
    return this.updateLocal(this.reservedNames, id, data);
  }
  deleteReservedName(id: number) {
    return this.deleteLocal(this.reservedNames, id);
  }

  checkReservedName(name: string): ReservedName[] {
    if (!name) return [];
    const lowerName = name.toLowerCase();
    return this.reservedNames.filter(
      (rn) =>
        rn.reserved_name?.toLowerCase().includes(lowerName) ||
        lowerName.includes(rn.reserved_name?.toLowerCase() || ""),
    );
  }

  // Submissions (augmented with details)
  getSubmissions(): Submission[] {
    return this.submissions.map((submission) =>
      this.hydrateSubmission(submission),
    );
  }

  getSubmission(id: number): Submission | undefined {
    const submission = this.submissions.find((s) => s.id === id);
    return submission ? this.hydrateSubmission(submission) : undefined;
  }

  // Helper to join answers and form fields to submission
  private hydrateSubmission(submission: Submission): Submission {
    const answers = this.formAnswers.filter(
      (fa) => fa.submission_id === submission.id,
    );

    let derivedFormId: number | undefined;
    if (answers.length > 0 && answers[0].form_field_id) {
      const ff = this.formFields.find((f) => f.id === answers[0].form_field_id);
      if (ff) derivedFormId = ff.form_id;
    }

    // Get form fields based on derived form ID or find form fields for the answers
    let formFieldsForSubmission: FormField[] = [];
    if (derivedFormId) {
      formFieldsForSubmission = this.formFields.filter(
        (ff) => ff.form_id === derivedFormId,
      );
    } else {
      // Fallback: get form fields from the answers' form_field_ids
      const formFieldIds = [...new Set(answers.map((a) => a.form_field_id))];
      formFieldsForSubmission = this.formFields.filter((ff) =>
        formFieldIds.includes(ff.id),
      );
    }

    return {
      ...submission,
      formAnswers: answers,
      formFields: formFieldsForSubmission,
      form_id: derivedFormId,
    };
  }

  // Also update the createSubmission method to properly hydrate with formFields
  createSubmission(data: CreateSubmission): Submission {
    const { formAnswers, ...submissionData } = data;
    const id = this.idCounters.submissions++;
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const case_number = `E-${dateStr}-${String(id).padStart(6, "0")}`;

    const newSubmission = {
      id,
      case_number,
      ...submissionData,
      created_on: new Date().toISOString(),
    };
    this.submissions.push(newSubmission);

    if (formAnswers && formAnswers.length > 0) {
      formAnswers.forEach((ans) => {
        this.createFormAnswer({ ...ans, submission_id: newSubmission.id });
      });
    }
    return this.hydrateSubmission(newSubmission);
  }

  // Update updateSubmission method to maintain formFields
  updateSubmission(id: number, data: Partial<Submission>): Submission | null {
    const index = this.submissions.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const { formAnswers, formFields, ...updateData } = data;
    this.submissions[index] = { ...this.submissions[index], ...updateData };

    // If formAnswers are provided, update them
    if (formAnswers) {
      // Remove existing answers for this submission
      this.formAnswers = this.formAnswers.filter(
        (fa) => fa.submission_id !== id,
      );

      // Add new answers
      formAnswers.forEach((ans) => {
        this.createFormAnswer({ ...ans, submission_id: id });
      });
    }

    return this.hydrateSubmission(this.submissions[index]);
  }

  deleteSubmission(id: number) {
    return this.deleteLocal(this.submissions, id);
  }
  getSubmissionsByService(serviceId: number) {
    return this.submissions
      .filter((s) => s.services_id === serviceId)
      .map((s) => this.hydrateSubmission(s));
  }

  // FormAnswers
  getFormAnswers() {
    return this.getLocal(this.formAnswers);
  }
  getFormAnswer(id: number) {
    return this.getLocalById(this.formAnswers, id);
  }
  createFormAnswer(data: CreateFormAnswer) {
    return this.createLocal(
      this.formAnswers,
      data,
      this.idCounters.formAnswers++,
    );
  }
  updateFormAnswer(id: number, data: Partial<FormAnswer>) {
    return this.updateLocal(this.formAnswers, id, data);
  }
  deleteFormAnswer(id: number) {
    return this.deleteLocal(this.formAnswers, id);
  }
  getFormAnswersBySubmission(submissionId: number) {
    return this.formAnswers.filter((fa) => fa.submission_id === submissionId);
  }
  getFormAnswersByForm(formId: number) {
    return this.formAnswers.filter(
      (fa) =>
        fa.form_field_id &&
        this.formFields.find((ff) => ff.id === fa.form_field_id)?.form_id ===
          formId,
    );
  }
  getFormAnswersByField(fieldId: number) {
    return this.formAnswers.filter(
      (fa) =>
        fa.form_field_id &&
        this.formFields.find((ff) => ff.id === fa.form_field_id)?.field_id ===
          fieldId,
    );
  }
}

export const mockDb = new MockDatabase();
