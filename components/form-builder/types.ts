
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
