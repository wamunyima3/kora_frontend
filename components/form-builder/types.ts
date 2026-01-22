import { Field } from '@/types';

export type FieldType = 'text' | 'number' | 'date' | 'checkbox' | 'select' | 'group';

export interface FormField {
    id: string;
    type: FieldType;
    label: string;
    required: boolean;
    placeholder?: string;
    options?: string[]; // For select type
    columnSpan?: number; // 1-12 for grid layout (default: 12 = full width)
    children?: FormField[]; // For group type
}

export const FIELD_TYPES: { type: FieldType; label: string; icon?: React.ReactNode }[] = [
    { type: 'text', label: 'Text Field' },
    { type: 'number', label: 'Number' },
    { type: 'date', label: 'Date' },
    { type: 'checkbox', label: 'Checkbox' },
    { type: 'select', label: 'Dropdown' },
    { type: 'group', label: 'Group' },
];

/**
 * Maps database data_type to component FieldType
 */
const DATA_TYPE_TO_FIELD_TYPE: Record<string, FieldType> = {
    'text': 'text',
    'string': 'text',
    'varchar': 'text',
    'number': 'number',
    'integer': 'number',
    'int': 'number',
    'decimal': 'number',
    'float': 'number',
    'date': 'date',
    'datetime': 'date',
    'timestamp': 'date',
    'checkbox': 'checkbox',
    'boolean': 'checkbox',
    'bool': 'checkbox',
    'select': 'select',
    'dropdown': 'select',
    'enum': 'select',
};

/**
 * Transforms a database Field to the toolbox item format
 * Returns null if the field type is not supported
 */
export function transformFieldToToolboxItem(field: Field): { type: FieldType; label: string; id?: string } | null {
    const fieldType = DATA_TYPE_TO_FIELD_TYPE[field.data_type.toLowerCase()];
    
    if (!fieldType) {
        console.warn(`Unsupported field data_type: ${field.data_type}`);
        return null;
    }
    
    return {
        type: fieldType,
        label: field.label,
        id: field.id.toString(), // Include the original database field ID
    };
}

/**
 * Transforms an array of database Fields to toolbox items
 * Returns all valid fields without deduplication, so specific fields (e.g., "First Name", "Last Name") are available.
 */
export function transformFieldsToToolboxItems(fields: Field[]): { type: FieldType; label: string; id?: string }[] {
    return fields
        .map(transformFieldToToolboxItem)
        .filter((item): item is { type: FieldType; label: string; id?: string } => item !== null);
}
