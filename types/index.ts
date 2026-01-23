// types/schema.ts
import { z } from 'zod';

// Group Schema
export const GroupSchema = z.object({
    id: z.number().int(),
    group_name: z.string().max(50),
});

export type Group = z.infer<typeof GroupSchema>;

// DataType Schema
export const DataTypeSchema = z.object({
    id: z.number().int(),
    data_type: z.string().max(50)
});

export type DataType = z.infer<typeof DataTypeSchema>;

// Field Schema
export const FieldSchema = z.object({
    id: z.number().int(),
    label: z.string().max(50),
    data_type_id: z.number().int(),
    group_id: z.number().int().nullable(),
    status: z.boolean().nullable().optional()
});

export type Field = z.infer<typeof FieldSchema>;

// Service Schema
export const ServiceSchema = z.object({
    id: z.number().int(),
    service_name: z.string().max(100),
    description: z.string().max(250).optional().nullable()
});

export type Service = z.infer<typeof ServiceSchema>;

// Form Schema
export const FormSchema = z.object({
    id: z.number().int(),
    form_name: z.string().max(50),
    description: z.string().max(250).optional().nullable(),
    service_id: z.number().int().nullable(),
    status: z.boolean().nullable().optional()
});

export type Form = z.infer<typeof FormSchema>;

// FormField Schema
export const FormFieldSchema = z.object({
    id: z.number().int(),
    form_id: z.number().int(),
    field_id: z.number().int(),
    field_name: z.string().max(50).nullable().optional(),
    validation: z.string().max(250).nullable().optional(),
    field_span: z.number().int().nullable().optional(),
    field_row: z.number().int().nullable().optional(),
});

export type FormField = z.infer<typeof FormFieldSchema>;

// User Schema
export const UserSchema = z.object({
    id: z.number().int(),
    first_name: z.string().max(100).nullable(),
    middle_name: z.string().max(100).nullable(),
    surname: z.string().max(100).nullable(),
    dob: z.string().nullable(), // Date string
    email: z.string().max(250).nullable(),
    password: z.string().max(250).nullable()
});

export type User = z.infer<typeof UserSchema>;

// Submission Schema
export const SubmissionSchema = z.object({
    id: z.number().int(),
    services_id: z.number().int().nullable(),
    created_by: z.number().int().nullable(),
    created_on: z.string().nullable(), // Timestamp string
    form_id: z.number().int().optional(), // Derived for UI
    // Augmented properties for UI
    formAnswers: z.lazy(() => FormAnswerSchema.array().optional()),
    formFields: z.lazy(() => FormFieldSchema.array().optional())
});

export type Submission = z.infer<typeof SubmissionSchema>;

// FormAnswer Schema
export const FormAnswerSchema = z.object({
    id: z.number().int(),
    form_field_id: z.number().int().nullable(),
    answer: z.string().max(250).nullable(),
    submission_id: z.number().int().nullable()
});

export type FormAnswer = z.infer<typeof FormAnswerSchema>;

// ReservedName Schema
export const ReservedNameSchema = z.object({
    id: z.number().int(),
    reserved_name: z.string().max(50).nullable()
});

export type ReservedName = z.infer<typeof ReservedNameSchema>;

// Collection Schema
export const CollectionSchema = z.object({
    id: z.number().int(),
    collection_name: z.string().max(50).nullable()
});

export type Collection = z.infer<typeof CollectionSchema>;

// CollectionItem Schema
export const CollectionItemSchema = z.object({
    id: z.number().int(),
    collection_id: z.number().int().nullable(),
    collection_item: z.string().max(50).nullable(),
    relation_collection_items_id: z.number().int().nullable()
});

export type CollectionItem = z.infer<typeof CollectionItemSchema>;


// Create/Update schemas (Omitted ID for creation)

export const CreateGroupSchema = GroupSchema.omit({ id: true });
export type CreateGroup = z.infer<typeof CreateGroupSchema>;

export const CreateDataTypeSchema = DataTypeSchema.omit({ id: true });
export type CreateDataType = z.infer<typeof CreateDataTypeSchema>;

export const CreateFieldSchema = FieldSchema.omit({ id: true });
export type CreateField = z.infer<typeof CreateFieldSchema>;

export const CreateServiceSchema = ServiceSchema.omit({ id: true });
export type CreateService = z.infer<typeof CreateServiceSchema>;

export const CreateFormSchema = FormSchema.omit({ id: true });
export type CreateForm = z.infer<typeof CreateFormSchema>;

export const CreateFormFieldSchema = FormFieldSchema.omit({ id: true });
export type CreateFormField = z.infer<typeof CreateFormFieldSchema>;

export const CreateUserSchema = UserSchema.omit({ id: true });
export type CreateUser = z.infer<typeof CreateUserSchema>;

export const CreateSubmissionSchema = SubmissionSchema.omit({ id: true, created_on: true }).extend({
    // Optional extensions for creating answers alongside submission
    formAnswers: FormAnswerSchema.omit({ id: true, submission_id: true }).array().optional()
});
export type CreateSubmission = z.infer<typeof CreateSubmissionSchema>;

export const CreateFormAnswerSchema = FormAnswerSchema.omit({ id: true });
export type CreateFormAnswer = z.infer<typeof CreateFormAnswerSchema>;

export const CreateCollectionSchema = CollectionSchema.omit({ id: true });
export type CreateCollection = z.infer<typeof CreateCollectionSchema>;

export const CreateCollectionItemSchema = CollectionItemSchema.omit({ id: true });
export type CreateCollectionItem = z.infer<typeof CreateCollectionItemSchema>;

// Update schemas (Partial)

export const UpdateGroupSchema = GroupSchema.partial().extend({ id: z.number().int() });
export type UpdateGroup = z.infer<typeof UpdateGroupSchema>;

export const UpdateDataTypeSchema = DataTypeSchema.partial().extend({ id: z.number().int() });
export type UpdateDataType = z.infer<typeof UpdateDataTypeSchema>;

export const UpdateFieldSchema = FieldSchema.partial().extend({ id: z.number().int() });
export type UpdateField = z.infer<typeof UpdateFieldSchema>;

export const UpdateServiceSchema = ServiceSchema.partial().extend({ id: z.number().int() });
export type UpdateService = z.infer<typeof UpdateServiceSchema>;

export const UpdateFormSchema = FormSchema.partial().extend({ id: z.number().int() });
export type UpdateForm = z.infer<typeof UpdateFormSchema>;

export const UpdateFormFieldSchema = FormFieldSchema.partial().extend({ id: z.number().int() });
export type UpdateFormField = z.infer<typeof UpdateFormFieldSchema>;

export const UpdateUserSchema = UserSchema.partial().extend({ id: z.number().int() });
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export const UpdateSubmissionSchema = SubmissionSchema.partial().extend({ id: z.number().int() });
export type UpdateSubmission = z.infer<typeof UpdateSubmissionSchema>;

export const UpdateFormAnswerSchema = FormAnswerSchema.partial().extend({ id: z.number().int() });
export type UpdateFormAnswer = z.infer<typeof UpdateFormAnswerSchema>;

export const UpdateCollectionSchema = CollectionSchema.partial().extend({ id: z.number().int() });
export type UpdateCollection = z.infer<typeof UpdateCollectionSchema>;

export const UpdateCollectionItemSchema = CollectionItemSchema.partial().extend({ id: z.number().int() });
export type UpdateCollectionItem = z.infer<typeof UpdateCollectionItemSchema>;

export const CreateReservedNameSchema = ReservedNameSchema.omit({ id: true });
export type CreateReservedName = z.infer<typeof CreateReservedNameSchema>;

export const UpdateReservedNameSchema = ReservedNameSchema.partial().extend({ id: z.number().int() });
export type UpdateReservedName = z.infer<typeof UpdateReservedNameSchema>;
