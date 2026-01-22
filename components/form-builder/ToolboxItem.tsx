
'use client'

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { GripVertical, Plus } from 'lucide-react';
import { FieldType } from './types';

interface ToolboxItemProps {
    type: FieldType;
    label: string;
    id?: string;
    onClick?: () => void;
}

export function ToolboxItem({ type, label, id, onClick }: ToolboxItemProps) {
    const draggableId = id ? `toolbox-${id}` : `toolbox-${type}`;
    
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: draggableId,
        data: {
            type,
            label,
            id,
            isToolboxItem: true,
        },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClick) {
            onClick();
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={isDragging ? undefined : style}
            {...attributes}
            className={cn(
                "flex items-center gap-2 p-3 border border-stone-200 dark:border-stone-700 rounded-md bg-white dark:bg-stone-800 shadow-sm cursor-grab hover:border-[#B4813F] hover:bg-[#FEF3E2] dark:hover:bg-[#FEF3E2]/20 transition-all text-sm font-medium text-gray-900 dark:text-gray-100 group",
                isDragging && "opacity-0 pointer-events-none"
            )}
        >
            <div {...listeners} className="flex items-center gap-2 flex-1">
                <GripVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span>{label}</span>
            </div>
            {onClick && (
                <button
                    onClick={handleClick}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#B4813F]/10 rounded-md transition-all"
                    style={{ color: '#B4813F' }}
                    title={`Click to add ${label}`}
                    aria-label={`Add ${label}`}
                >
                    <Plus className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

export function ToolboxItemOverlay({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-2 p-3 border border-stone-200 dark:border-stone-700 rounded-md bg-white dark:bg-stone-800 shadow-xl cursor-grabbing w-[200px] text-gray-900 dark:text-gray-100">
            <GripVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            {label}
        </div>
    )
}
