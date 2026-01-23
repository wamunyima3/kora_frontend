import { Field, DataType } from '@/types';

export type FieldType = 'text' | 'number' | 'date' | 'checkbox' | 'select' | 'group';

export interface FormField {
    id: string;
    type: FieldType;
    label: string;
    required: boolean;
    placeholder?: string;
    options?: string[]; // For select type
    collectionId?: number; // Link to options collection
    regex?: string; // Validation regex pattern
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
export const DATA_TYPE_TO_FIELD_TYPE: Record<string, FieldType> = {
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
export function transformFieldToToolboxItem(field: Field, dataTypes: DataType[] = []): { type: FieldType; label: string; id?: string; groupId?: string } | null {
    // Find the data type object that matches the field's data_type_id
    const dataTypeObj = dataTypes.find(dt => dt.id === field.data_type_id);
    
    if (!dataTypeObj || !dataTypeObj.data_type) {
        // Fallback or warning if type not found
        console.warn(`Field ${field.id} has unknown data_type_id: ${field.data_type_id}`);
        return null; // Or handle as default text?
    }

    const fieldType = DATA_TYPE_TO_FIELD_TYPE[dataTypeObj.data_type.toLowerCase()];
    
    if (!fieldType) {
        console.warn(`Unsupported field data_type: ${dataTypeObj.data_type}`);
        return null;
    }
    
    return {
        type: fieldType,
        label: field.label,
        id: field.id.toString(), // Include the original database field ID
        groupId: field.group_id?.toString(),
    };
}

/**
 * Transforms an array of database Fields to toolbox items
 * Returns all valid fields without deduplication, so specific fields (e.g., "First Name", "Last Name") are available.
 */
export function transformFieldsToToolboxItems(fields: Field[], dataTypes: DataType[] = []): { type: FieldType; label: string; id?: string; groupId?: string }[] {
    return fields
        .map(f => transformFieldToToolboxItem(f, dataTypes))
        .filter((item): item is { type: FieldType; label: string; id?: string; groupId?: string } => item !== null);
}
