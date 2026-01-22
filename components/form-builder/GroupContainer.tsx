'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableField } from './SortableField';
import { FormField } from './types';
import { cn } from '@/lib/utils';

interface GroupContainerProps {
    field: FormField;
    selectedFieldId: string | null;
    onSelect: (id: string) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
}

export function GroupContainer({ field, selectedFieldId, onSelect, onDelete }: GroupContainerProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: `${field.id}-dropzone`,
        data: {
            isGroup: true,
            parentId: field.id,
            field: field,
        }
    });

    const children = field.children || [];

    return (
        <div 
            ref={setNodeRef} 
            className={cn(
                "min-h-[80px] p-3 rounded-md border-2 border-dashed transition-colors",
                "bg-stone-50/50 dark:bg-stone-900/50",
                isOver ? "border-[#B4813F] bg-[#B4813F]/5" : "border-stone-200 dark:border-stone-700"
            )}
        >
            <SortableContext 
                items={children.map(f => f.id)} 
                strategy={verticalListSortingStrategy}
            >
                <div className="grid grid-cols-12 gap-4">
                    {children.length === 0 && (
                        <div className="col-span-12 text-center text-sm text-gray-500 py-8">
                            Drop fields here
                        </div>
                    )}
                    
                    {children.map((child) => {
                         const columnSpan = child.columnSpan || 12;
                         // Map column spans to Tailwind classes (same as in FormBuilder)
                         const colSpanClass = {
                           12: "col-span-12",
                           6: "col-span-12 md:col-span-6",
                           4: "col-span-12 md:col-span-4",
                           3: "col-span-12 md:col-span-3",
                         }[columnSpan] || "col-span-12";

                        return (
                            <div key={child.id} className={colSpanClass}>
                                <SortableField
                                    field={child}
                                    isSelected={selectedFieldId === child.id}
                                    selectedFieldId={selectedFieldId} // Pass down for nested groups
                                    onSelect={onSelect}
                                    onDelete={onDelete}
                                />
                            </div>
                        );
                    })}
                </div>
            </SortableContext>
        </div>
    );
}
