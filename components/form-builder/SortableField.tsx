
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
                "relative group flex items-start gap-3 p-4 border rounded-lg bg-white dark:bg-stone-800 cursor-pointer transition-all w-full",
                isSelected ? "ring-2 ring-[#B4813F] border-[#B4813F]" : "border-stone-200 dark:border-stone-700 hover:border-[#B4813F]/50",
                isDragging && "opacity-30"
            )}
        >
            <div
                {...attributes}
                {...listeners}
                className="mt-1 cursor-grab active:cursor-grabbing p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded transition-colors"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <GripVertical className="hidden group-hover:block h-4 w-4 text-gray-500 dark:text-gray-400" />
                <div className="group-hover:hidden h-4 w-4" /> {/* Spacer */}
            </div>

            <div className="flex-1 space-y-2 pointer-events-none">
                <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {field.label} {field.required && <span className="text-red-600 dark:text-red-400">*</span>}
                </label>

                {/* Render dummy input based on type */}
                <div className="pointer-events-none">
                    {field.type === 'text' && (
                        <div className="h-10 w-full rounded-md border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                            {field.placeholder || "Text input"}
                        </div>
                    )}
                    {field.type === 'number' && (
                        <div className="h-10 w-full rounded-md border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                            0
                        </div>
                    )}
                    {field.type === 'date' && (
                        <div className="h-10 w-full rounded-md border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                            Pick a date
                        </div>
                    )}
                    {field.type === 'checkbox' && (
                        <div className="flex items-center space-x-2">
                            <div className="h-4 w-4 rounded border border-[#B4813F]" style={{ borderColor: '#B4813F' }} />
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Checkbox option</span>
                        </div>
                    )}
                    {field.type === 'select' && (
                        <div className="h-10 w-full rounded-md border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between">
                            <span>Select an option</span>
                            <span className="h-4 w-4 opacity-50">▼</span>
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={(e) => onDelete(field.id, e)}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );
}
