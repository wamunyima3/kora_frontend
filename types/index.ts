// types/schema.ts
import { z } from 'zod';

// Group Schema
export const GroupSchema = z.object({
    id: z.number().int(),
    group_name: z.string().max(50)
});

export type Group = z.infer<typeof GroupSchema>;

// Field Schema
export const FieldSchema = z.object({
    id: z.number().int(),
    label: z.string().max(50),
    data_type: z.string().max(50),
    group_id: z.number().int().nullable()
});

export type Field = z.infer<typeof FieldSchema>;

// Service Schema
export const ServiceSchema = z.object({
    id: z.number().int(),
    service_name: z.string().max(100)
});

export type Service = z.infer<typeof ServiceSchema>;

// Form Schema
export const FormSchema = z.object({
    id: z.number().int(),
    title: z.string().max(50),
    description: z.string().max(250).optional(),
    service_id: z.number().int().nullable()
});

export type Form = z.infer<typeof FormSchema>;

// FormField Schema
export const FormFieldSchema = z.object({
    id: z.number().int(),
    field_id: z.number().int(),
    form_id: z.number().int(),
    validation: z.string().max(250).nullable()
});

export type FormField = z.infer<typeof FormFieldSchema>;

// FormAnswer Schema
export const FormAnswerSchema = z.object({
    id: z.number().int(),
    form_id: z.number().int(),
    field_id: z.number().int(),
    answer: z.string().max(250).nullable(),
    submission_id: z.number().int()
});

export type FormAnswer = z.infer<typeof FormAnswerSchema>;

// Submission Schema
export const SubmissionSchema = z.object({
    id: z.number().int(),
    form_id: z.number().int(),
    formAnswers: FormAnswerSchema.array(),
    formFields: FormFieldSchema.array()
});

export type Submission = z.infer<typeof SubmissionSchema>;

// Create/Update schemas (without id for creation)
export const CreateGroupSchema = GroupSchema.omit({ id: true });
export type CreateGroup = z.infer<typeof CreateGroupSchema>;

export const CreateFieldSchema = FieldSchema.omit({ id: true });
export type CreateField = z.infer<typeof CreateFieldSchema>;

export const CreateServiceSchema = ServiceSchema.omit({ id: true });
export type CreateService = z.infer<typeof CreateServiceSchema>;

export const CreateFormSchema = FormSchema.omit({ id: true });
export type CreateForm = z.infer<typeof CreateFormSchema>;

export const CreateFormFieldSchema = FormFieldSchema.omit({ id: true });
export type CreateFormField = z.infer<typeof CreateFormFieldSchema>;

export const CreateSubmissionSchema = SubmissionSchema.omit({ id: true });
export type CreateSubmission = z.infer<typeof CreateSubmissionSchema>;

export const CreateFormAnswerSchema = FormAnswerSchema.omit({ id: true });
export type CreateFormAnswer = z.infer<typeof CreateFormAnswerSchema>;

// Update schemas (all fields optional except id)
export const UpdateGroupSchema = GroupSchema.partial().extend({ id: z.number().int() });
export type UpdateGroup = z.infer<typeof UpdateGroupSchema>;

export const UpdateFieldSchema = FieldSchema.partial().extend({ id: z.number().int() });
export type UpdateField = z.infer<typeof UpdateFieldSchema>;

export const UpdateServiceSchema = ServiceSchema.partial().extend({ id: z.number().int() });
export type UpdateService = z.infer<typeof UpdateServiceSchema>;

export const UpdateFormSchema = FormSchema.partial().extend({ id: z.number().int() });
export type UpdateForm = z.infer<typeof UpdateFormSchema>;

export const UpdateFormFieldSchema = FormFieldSchema.partial().extend({ id: z.number().int() });
export type UpdateFormField = z.infer<typeof UpdateFormFieldSchema>;

export const UpdateSubmissionSchema = SubmissionSchema.partial().extend({ id: z.number().int() });
export type UpdateSubmission = z.infer<typeof UpdateSubmissionSchema>;

export const UpdateFormAnswerSchema = FormAnswerSchema.partial().extend({ id: z.number().int() });
export type UpdateFormAnswer = z.infer<typeof UpdateFormAnswerSchema>;
