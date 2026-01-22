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
    closestCenter,
    useDroppable
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
import { CanvasDropZone } from './CanvasDropZone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, ArrowLeft, Pencil, Check, X, Plus, ChevronDown } from 'lucide-react';
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
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [isHoveringName, setIsHoveringName] = useState(false);
    const [isHoveringDescription, setIsHoveringDescription] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLInputElement>(null);
    
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const [activeDragType, setActiveDragType] = useState<FieldType | null>(null);
    const [showMobileToolbox, setShowMobileToolbox] = useState(false);

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

    useEffect(() => {
        if (isEditingDescription && descriptionInputRef.current) {
            descriptionInputRef.current.focus();
            descriptionInputRef.current.select();
        }
    }, [isEditingDescription]);

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

    const createNewField = (type: FieldType, insertAfterId?: string) => {
        const newField: FormField = {
            id: nanoid(),
            type,
            label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
            required: false,
            placeholder: type === 'text' ? 'Enter text...' : type === 'number' ? '0' : type === 'date' ? 'Select date' : '',
            columnSpan: 12, // Default full width
        };

        if (insertAfterId) {
            const insertIndex = fields.findIndex((f) => f.id === insertAfterId);
            if (insertIndex !== -1) {
                setFields((prev) => {
                    const newFields = [...prev];
                    newFields.splice(insertIndex + 1, 0, newField);
                    return newFields;
                });
            } else {
                setFields((prev) => [...prev, newField]);
            }
        } else {
            setFields((prev) => [...prev, newField]);
        }
        
        setSelectedFieldId(newField.id);
        return newField;
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        setActiveDragType(null);

        if (!over) return;

        // Dropping a toolbox item
        if (active.data.current?.isToolboxItem) {
            const type = active.data.current.type as FieldType;
            
            // Check if dropping on canvas
            if (over.id === 'canvas-droppable') {
                createNewField(type);
            } else {
                // Dropping on another field - insert after it
                const overFieldId = over.id as string;
                // Only insert if it's actually a field, otherwise append
                if (fields.find(f => f.id === overFieldId)) {
                    createNewField(type, overFieldId);
                } else {
                    createNewField(type);
                }
            }
            return;
        }

        // Reordering existing fields
        if (active.id !== over.id) {
            setFields((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                if (oldIndex !== -1 && newIndex !== -1) {
                    return arrayMove(items, oldIndex, newIndex);
                }
                return items;
            });
        }
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

    const handleDescriptionEdit = () => {
        setIsEditingDescription(true);
    };

    const handleDescriptionSave = () => {
        setIsEditingDescription(false);
    };

    const handleDescriptionCancel = () => {
        if (formId && existingForm) {
            setFormDescription(existingForm.description || '');
        } else {
            setFormDescription('');
        }
        setIsEditingDescription(false);
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
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="flex flex-col h-screen bg-background">
                <div className="flex items-center justify-center flex-1">
                    <div className="text-muted-foreground">Loading form builder...</div>
                </div>
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
        >
            <div className="flex flex-col h-screen bg-background">
                <Toaster />
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 md:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 shadow-sm">
                    <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/')}
                            className="h-8 w-8 md:h-9 md:w-9 flex-shrink-0"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className="bg-primary/10 p-1.5 md:p-2 rounded-lg flex-shrink-0">
                                <span className="text-lg md:text-xl font-bold text-primary">S</span>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <h1 className="text-xs md:text-sm font-semibold truncate">Service Configuration</h1>
                                <span className="text-xs text-muted-foreground truncate">{formName}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-shrink-0 w-full sm:w-auto">
                        <Button onClick={handleSave} className="gap-2 w-full sm:w-auto">
                            <Save className="h-4 w-4" />
                            <span className="text-sm md:text-base">Save Form</span>
                        </Button>
                    </div>
                </header>

                <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Toolbox Sidebar */}
                    <aside className="w-full md:w-64 border-r bg-background p-4 overflow-y-auto hidden md:block md:flex-shrink-0">
                        <h2 className="font-semibold mb-4 text-sm uppercase text-muted-foreground">Toolbox</h2>
                        <div className="space-y-3">
                            {FIELD_TYPES.map((type) => (
                                <ToolboxItem 
                                    key={type.type} 
                                    type={type.type} 
                                    label={type.label}
                                    onClick={() => createNewField(type.type)}
                                />
                            ))}
                        </div>

                        <div className="mt-8 p-4 bg-muted/20 rounded-lg border border-dashed">
                            <p className="text-xs text-muted-foreground text-center">
                                Click or drag fields to add them to your form.
                            </p>
                        </div>
                    </aside>

                    {/* Mobile Toolbox Dropdown */}
                    <div className="md:hidden fixed bottom-4 right-4 z-40">
                        {showMobileToolbox && (
                            <div className="absolute bottom-16 right-0 mb-2 w-48 bg-card border rounded-lg shadow-lg p-2 space-y-2">
                                {FIELD_TYPES.map((type) => (
                                    <button
                                        key={type.type}
                                        onClick={() => {
                                            createNewField(type.type);
                                            setShowMobileToolbox(false);
                                        }}
                                        className="w-full flex items-center gap-2 p-3 border rounded-md bg-background hover:bg-accent hover:border-primary transition-colors text-sm font-medium text-left"
                                    >
                                        <span>{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                        <Button
                            onClick={() => setShowMobileToolbox(!showMobileToolbox)}
                            size="lg"
                            className="rounded-full shadow-lg h-14 w-14"
                        >
                            {showMobileToolbox ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Plus className="h-5 w-5" />
                            )}
                        </Button>
                    </div>

                    {/* Canvas Area */}
                    <div
                        className="flex-1 p-4 md:p-8 overflow-y-auto bg-muted/10 relative"
                        onClick={() => {
                            setSelectedFieldId(null);
                            setShowMobileToolbox(false);
                        }}
                    >
                        <CanvasDropZone isEmpty={fields.length === 0}>
                            <div
                                className="max-w-3xl mx-auto bg-background min-h-[600px] md:min-h-[900px] border shadow-sm rounded-lg p-4 md:p-12 transition-colors relative"
                            >
                                {/* Form Header Preview - Editable */}
                                <div className="mb-4 md:mb-8 pb-4 md:pb-6 border-b space-y-2">
                                    {/* Editable Title */}
                                    <div
                                        className="group relative"
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
                                                    className="text-xl md:text-3xl font-bold h-auto py-2 border-primary focus-visible:ring-2"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={handleNameSave}
                                                    >
                                                        <Check className="h-4 w-4 text-green-600" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={handleNameCancel}
                                                    >
                                                        <X className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 group/title">
                                                <h2 className="text-xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">
                                                    {formName}
                                                </h2>
                                                {isHoveringName && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 opacity-70 hover:opacity-100"
                                                        onClick={handleNameEdit}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Editable Description */}
                                    <div
                                        className="group relative"
                                        onMouseEnter={() => setIsHoveringDescription(true)}
                                        onMouseLeave={() => setIsHoveringDescription(false)}
                                    >
                                        {isEditingDescription ? (
                                            <div className="flex items-start gap-2">
                                                <Input
                                                    ref={descriptionInputRef}
                                                    value={formDescription}
                                                    onChange={(e) => setFormDescription(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleDescriptionSave();
                                                        } else if (e.key === 'Escape') {
                                                            handleDescriptionCancel();
                                                        }
                                                    }}
                                                    placeholder="Please fill out the details below."
                                                    className="text-slate-500 dark:text-slate-400 text-sm md:text-base h-auto py-2 border-primary focus-visible:ring-2"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <div className="flex items-center gap-1 pt-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={handleDescriptionSave}
                                                    >
                                                        <Check className="h-4 w-4 text-green-600" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={handleDescriptionCancel}
                                                    >
                                                        <X className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 group/description">
                                                <p className="text-slate-500 dark:text-slate-400 mt-1 md:mt-2 text-sm md:text-base">
                                                    {formDescription || 'Please fill out the details below.'}
                                                </p>
                                                {isHoveringDescription && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-5 w-5 opacity-70 hover:opacity-100"
                                                        onClick={handleDescriptionEdit}
                                                    >
                                                        <Pencil className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                            </div>

                            <SortableContext
                                items={fields.map(f => f.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="min-h-[200px]">
                                    {fields.length === 0 && !activeDragType && (
                                        <div className="text-center text-muted-foreground py-20 border-2 border-dashed rounded-lg bg-muted/30">
                                            <p className="font-medium">Form is empty</p>
                                            <p className="text-sm mt-1">Click or drag fields from the toolbox to start building.</p>
                                        </div>
                                    )}

                                    {/* Grid layout for fields */}
                                    <div className="grid grid-cols-12 gap-4">
                                        {fields.map((field) => {
                                            const columnSpan = field.columnSpan || 12;
                                            // Map column spans to Tailwind classes
                                            const colSpanClass = {
                                                12: 'col-span-12',
                                                6: 'col-span-12 md:col-span-6',
                                                4: 'col-span-12 md:col-span-4',
                                                3: 'col-span-12 md:col-span-3',
                                            }[columnSpan] || 'col-span-12';
                                            
                                            return (
                                                <div
                                                    key={field.id}
                                                    className={colSpanClass}
                                                >
                                        <SortableField
                                            field={field}
                                            isSelected={selectedFieldId === field.id}
                                            onSelect={(id) => {
                                                setTimeout(() => handleFieldSelect(id), 0);
                                            }}
                                            onDelete={handleFieldDelete}
                                        />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </SortableContext>
                        </div>
                        </CanvasDropZone>
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
