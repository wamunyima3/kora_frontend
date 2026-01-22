import { Field } from '@/types';

export type FieldType = 'text' | 'number' | 'date' | 'checkbox' | 'select';

export interface FormField {
    id: string;
    type: FieldType;
    label: string;
    required: boolean;
    placeholder?: string;
    options?: string[]; // For select type
    columnSpan?: number; // 1-12 for grid layout (default: 12 = full width)
}

export const FIELD_TYPES: { type: FieldType; label: string; icon?: React.ReactNode }[] = [
    { type: 'text', label: 'Text Field' },
    { type: 'number', label: 'Number' },
    { type: 'date', label: 'Date' },
    { type: 'checkbox', label: 'Checkbox' },
    { type: 'select', label: 'Dropdown' },
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
export function transformFieldToToolboxItem(field: Field): { type: FieldType; label: string } | null {
    const fieldType = DATA_TYPE_TO_FIELD_TYPE[field.data_type.toLowerCase()];
    
    if (!fieldType) {
        console.warn(`Unsupported field data_type: ${field.data_type}`);
        return null;
    }
    
    return {
        type: fieldType,
        label: field.label,
    };
}

/**
 * Transforms an array of database Fields to toolbox items
 * Filters out unsupported field types and deduplicates by type
 */
export function transformFieldsToToolboxItems(fields: Field[]): { type: FieldType; label: string }[] {
    const transformed = fields
        .map(transformFieldToToolboxItem)
        .filter((item): item is { type: FieldType; label: string } => item !== null);
    
    // Deduplicate by type, keeping the first occurrence
    const seen = new Set<FieldType>();
    return transformed.filter(item => {
        if (seen.has(item.type)) {
            return false;
        }
        seen.add(item.type);
        return true;
    });
}
