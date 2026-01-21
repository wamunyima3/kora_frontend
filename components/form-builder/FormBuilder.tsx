'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent,
    UniqueIdentifier,
    closestCenter
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { nanoid } from 'nanoid';
import { FormField, FIELD_TYPES, FieldType } from './types';
import { ToolboxItem, ToolboxItemOverlay } from './ToolboxItem';
import { SortableField } from './SortableField';
import PropertiesPanel from './PropertiesPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, ArrowLeft, Pencil, Check, X } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import {
    selectCurrentForm,
    selectAllForms,
    addForm,
    updateForm,
    setCurrentForm,
} from '@/lib/features/formBuilder/formSlice';

interface FormBuilderProps {
    formId?: string;
}

export default function FormBuilder({ formId }: FormBuilderProps) {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const existingForm = useAppSelector(selectCurrentForm)
    const allForms = useAppSelector(selectAllForms)
    
    const [fields, setFields] = useState<FormField[]>([]);
    const [formName, setFormName] = useState('Untitled Form');
    const [formDescription, setFormDescription] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isHoveringName, setIsHoveringName] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);
    
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const [activeDragType, setActiveDragType] = useState<FieldType | null>(null);

    // Load form if formId is provided
    useEffect(() => {
        if (formId) {
            const form = allForms.find(f => f.id === formId);
            if (form) {
                dispatch(setCurrentForm(formId));
                setFormName(form.name);
                setFormDescription(form.description || '');
                setFields(form.fields);
            } else {
                toast.error('Form not found');
                router.push('/');
            }
        } else {
            dispatch(setCurrentForm(null));
            setFormName('Untitled Form');
            setFormDescription('');
            setFields([]);
        }
    }, [formId, allForms, dispatch, router]);

    // Focus input when editing starts
    useEffect(() => {
        if (isEditingName && nameInputRef.current) {
            nameInputRef.current.focus();
            nameInputRef.current.select();
        }
    }, [isEditingName]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            }
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id);

        if (active.data.current?.isToolboxItem) {
            setActiveDragType(active.data.current.type as FieldType);
            setSelectedFieldId(null);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        setActiveDragType(null);

        if (!over) return;

        // Dropping a toolbox item
        if (active.data.current?.isToolboxItem) {
            const type = active.data.current.type as FieldType;
            const newField: FormField = {
                id: nanoid(),
                type,
                label: `New ${type} field`,
                required: false,
                placeholder: '',
            };

            if (over.id === 'canvas-droppable') {
                setFields((prev) => [...prev, newField]);
            } else {
                const overIndex = fields.findIndex((f) => f.id === over.id);
                if (overIndex !== -1) {
                    setFields((prev) => {
                        const newFields = [...prev];
                        newFields.splice(overIndex + 1, 0, newField);
                        return newFields;
                    });
                } else {
                    setFields((prev) => [...prev, newField]);
                }
            }
            setSelectedFieldId(newField.id);
            return;
        }

        // Reordering is handled in handleDragOver for smoother UX
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveAField = !active.data.current?.isToolboxItem;

        if (isActiveAField) {
            setFields((items) => {
                const oldIndex = items.findIndex((item) => item.id === activeId);
                const newIndex = items.findIndex((item) => item.id === overId);

                if (oldIndex !== -1 && newIndex !== -1) {
                    return arrayMove(items, oldIndex, newIndex);
                }
                return items;
            });
        }
    };

    const handleFieldSelect = (id: string) => {
        setSelectedFieldId(id);
    };

    const handleFieldUpdate = (id: string, updates: Partial<FormField>) => {
        setFields((prev) => prev.map((f) => f.id === id ? { ...f, ...updates } : f));
    };

    const handleFieldDelete = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setFields((prev) => prev.filter((f) => f.id !== id));
        if (selectedFieldId === id) setSelectedFieldId(null);
    };

    const handleNameEdit = () => {
        setIsEditingName(true);
    };

    const handleNameSave = () => {
        if (formName.trim()) {
            setIsEditingName(false);
        } else {
            toast.error('Form name cannot be empty');
        }
    };

    const handleNameCancel = () => {
        if (formId && existingForm) {
            setFormName(existingForm.name);
        } else {
            setFormName('Untitled Form');
        }
        setIsEditingName(false);
    };

    const handleSave = () => {
        if (!formName.trim()) {
            toast.error('Please provide a form name');
            return;
        }

        if (formId && existingForm) {
            // Update existing form
            dispatch(updateForm({
                id: formId,
                updates: {
                    name: formName.trim(),
                    description: formDescription.trim() || undefined,
                    fields,
                }
            }));
            toast.success('Form updated successfully!');
        } else {
            // Create new form
            dispatch(addForm({
                name: formName.trim(),
                description: formDescription.trim() || undefined,
                fields,
            }));
            toast.success('Form created successfully!');
            router.push('/');
        }
    };

    const selectedField = fields.find(f => f.id === selectedFieldId) || null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
        >
            <div className="flex flex-col h-screen bg-muted/20">
                <Toaster />
                <header className="border-b bg-background p-4 flex justify-between items-center shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/')}
                            className="h-9 w-9"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <span className="text-xl font-bold text-primary">S</span>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-sm font-semibold">Service Configuration</h1>
                                <div
                                    className="flex items-center gap-2 group"
                                    onMouseEnter={() => setIsHoveringName(true)}
                                    onMouseLeave={() => setIsHoveringName(false)}
                                >
                                    {isEditingName ? (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                ref={nameInputRef}
                                                value={formName}
                                                onChange={(e) => setFormName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleNameSave();
                                                    } else if (e.key === 'Escape') {
                                                        handleNameCancel();
                                                    }
                                                }}
                                                className="h-6 text-xs font-medium border-primary focus-visible:ring-1"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={handleNameSave}
                                            >
                                                <Check className="h-3 w-3 text-green-600" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={handleNameCancel}
                                            >
                                                <X className="h-3 w-3 text-red-600" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">{formName}</span>
                                            {isHoveringName && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5 opacity-70 hover:opacity-100"
                                                    onClick={handleNameEdit}
                                                >
                                                    <Pencil className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-x-2">
                        <Button onClick={handleSave} className="gap-2">
                            <Save className="h-4 w-4" />
                            Save Form
                        </Button>
                    </div>
                </header>

                <main className="flex-1 flex overflow-hidden">
                    {/* Toolbox Sidebar */}
                    <aside className="w-64 border-r bg-background p-4 overflow-y-auto hidden md:block">
                        <h2 className="font-semibold mb-4 text-sm uppercase text-muted-foreground">Toolbox</h2>
                        <div className="space-y-3">
                            {FIELD_TYPES.map((type) => (
                                <ToolboxItem key={type.type} type={type.type} label={type.label} />
                            ))}
                        </div>

                        <div className="mt-8 p-4 bg-muted/20 rounded-lg border border-dashed">
                            <p className="text-xs text-muted-foreground text-center">
                                Drag these fields onto the canvas on the right to build your form.
                            </p>
                        </div>
                    </aside>

                    {/* Canvas Area */}
                    <div
                        className="flex-1 p-8 overflow-y-auto bg-muted/10 relative"
                        onClick={() => setSelectedFieldId(null)}
                    >
                        <div
                            id="canvas-droppable"
                            className="max-w-3xl mx-auto bg-background min-h-[900px] border shadow-sm rounded-lg p-12 transition-colors relative"
                        >
                            {/* Form Header Preview */}
                            <div className="mb-8 pb-6 border-b">
                                <h2 className="text-3xl font-bold text-slate-800">{formName}</h2>
                                <p className="text-slate-500 mt-2">
                                    {formDescription || 'Please fill out the details below.'}
                                </p>
                            </div>

                            <SortableContext
                                items={fields.map(f => f.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2 min-h-[200px]">
                                    {fields.length === 0 && !activeDragType && (
                                        <div className="text-center text-muted-foreground py-20 border-2 border-dashed rounded-lg bg-slate-50">
                                            <p className="font-medium">Form is empty</p>
                                            <p className="text-sm mt-1">Drag fields from the toolbox to start building.</p>
                                        </div>
                                    )}

                                    {fields.map((field) => (
                                        <SortableField
                                            key={field.id}
                                            field={field}
                                            isSelected={selectedFieldId === field.id}
                                            onSelect={(id) => {
                                                setTimeout(() => handleFieldSelect(id), 0);
                                            }}
                                            onDelete={handleFieldDelete}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </div>
                    </div>

                    {/* Properties Sidebar */}
                    <PropertiesPanel
                        field={selectedField}
                        onChange={handleFieldUpdate}
                        onDelete={handleFieldDelete}
                    />
                </main>

                <DragOverlay>
                    {activeId ? (
                        activeDragType ? (
                            <ToolboxItemOverlay label={FIELD_TYPES.find(t => t.type === activeDragType)?.label || 'Field'} />
                        ) : (
                            <div className="opacity-80 p-4 bg-background border rounded shadow-lg w-[400px]">
                                Moving Field...
                            </div>
                        )
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    )
}
