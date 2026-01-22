'use client'

import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'

interface CanvasDropZoneProps {
    children: React.ReactNode
    isEmpty: boolean
}

export function CanvasDropZone({ children, isEmpty }: CanvasDropZoneProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas-droppable',
    })

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "w-full h-full transition-all duration-200 rounded-lg",
                isOver && "ring-2 ring-primary ring-offset-2 bg-primary/5 border-primary"
            )}
        >
            {children}
        </div>
    )
}
