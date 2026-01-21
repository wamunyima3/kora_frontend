
'use client'

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { FormField } from './types';
import { GripVertical, Trash2 } from 'lucide-react';

interface SortableFieldProps {
    field: FormField;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
}

export function SortableField({ field, isSelected, onSelect, onDelete }: SortableFieldProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: field.id, data: { ...field } });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={() => onSelect(field.id)}
            className={cn(
                "relative group flex items-start gap-3 p-4 border rounded-lg bg-card cursor-pointer transition-all w-full",
                isSelected ? "ring-2 ring-primary border-primary" : "hover:border-primary/50",
                isDragging && "opacity-30"
            )}
        >
            <div
                {...attributes}
                {...listeners}
                className="mt-1 cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded transition-colors"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <GripVertical className="hidden group-hover:block h-4 w-4 text-muted-foreground" />
                <div className="group-hover:hidden h-4 w-4" /> {/* Spacer */}
            </div>

            <div className="flex-1 space-y-2 pointer-events-none">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {field.label} {field.required && <span className="text-destructive">*</span>}
                </label>

                {/* Render dummy input based on type */}
                <div className="pointer-events-none">
                    {field.type === 'text' && (
                        <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                            {field.placeholder || "Text input"}
                        </div>
                    )}
                    {field.type === 'number' && (
                        <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                            0
                        </div>
                    )}
                    {field.type === 'date' && (
                        <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                            Pick a date
                        </div>
                    )}
                    {field.type === 'checkbox' && (
                        <div className="flex items-center space-x-2">
                            <div className="h-4 w-4 rounded border border-primary" />
                            <span className="text-sm font-medium">Checkbox option</span>
                        </div>
                    )}
                    {field.type === 'select' && (
                        <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground flex items-center justify-between">
                            <span>Select an option</span>
                            <span className="h-4 w-4 opacity-50">▼</span>
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={(e) => onDelete(field.id, e)}
                className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );
}
