
'use client'

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { GripVertical, Plus } from 'lucide-react';
import { FieldType } from './types';

interface ToolboxItemProps {
    type: FieldType;
    label: string;
    onClick?: () => void;
}

export function ToolboxItem({ type, label, onClick }: ToolboxItemProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `toolbox-${type}`,
        data: {
            type,
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
            style={style}
            {...attributes}
            className={cn(
                "flex items-center gap-2 p-3 border rounded-md bg-card shadow-sm cursor-grab hover:border-primary hover:bg-accent/50 transition-all text-sm font-medium group",
                isDragging && "opacity-50 ring-2 ring-primary cursor-grabbing"
            )}
        >
            <div {...listeners} className="flex items-center gap-2 flex-1">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span>{label}</span>
            </div>
            {onClick && (
                <button
                    onClick={handleClick}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-primary/10 rounded-md transition-all text-primary"
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
        <div className="flex items-center gap-2 p-3 border rounded-md bg-card shadow-lg cursor-grabbing w-[200px]">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            {label}
        </div>
    )
}
