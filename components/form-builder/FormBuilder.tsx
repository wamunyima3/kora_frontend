"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
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
  useDroppable,
  pointerWithin,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { nanoid } from "nanoid";
import { FormField, FIELD_TYPES, FieldType, transformFieldsToToolboxItems } from "./types";
import { ToolboxItem, ToolboxItemOverlay } from "./ToolboxItem";
import { SortableField } from "./SortableField";
import PropertiesPanel from "./PropertiesPanel";
import { CanvasDropZone } from "./CanvasDropZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Save,
  Pencil,
  Check,
  X,
  Plus,
  Search,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import {
  selectCurrentForm,
  selectAllForms,
  addForm,
  updateForm,
  setCurrentForm,
} from "@/lib/features/formBuilder/formSlice";
import { useFields } from "@/hooks/Fields";

interface FormBuilderProps {
  formId?: string;
}

export default function FormBuilder({ formId }: FormBuilderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const existingForm = useAppSelector(selectCurrentForm);
  const allForms = useAppSelector(selectAllForms);

  // Fetch available field types from database
  const { data: dbFields, isLoading: isLoadingFields, error: fieldsError } = useFields();

  // Transform database fields to toolbox items, with fallback to hardcoded types
  const availableFieldTypes = useMemo(() => {
    if (dbFields && dbFields.length > 0) {
      const transformed = transformFieldsToToolboxItems(dbFields);
      // If no fields could be transformed, fall back to default types
      return transformed.length > 0 ? transformed : FIELD_TYPES;
    }
    // Fallback to hardcoded types while loading or if error
    return FIELD_TYPES;
  }, [dbFields]);

  const [fields, setFields] = useState<FormField[]>([]);
  const [formName, setFormName] = useState("Untitled Form");
  const [formDescription, setFormDescription] = useState("");
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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFieldTypes = useMemo(() => {
    if (!searchQuery.trim()) return availableFieldTypes;
    return availableFieldTypes.filter((type) =>
      type.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableFieldTypes, searchQuery]);

  // Show error toast if fields failed to load
  useEffect(() => {
    if (fieldsError) {
      console.error('Failed to load field types:', fieldsError);
      toast.error('Failed to load field types from database. Using default types.');
    }
  }, [fieldsError]);

  // Load form if formId is provided
  useEffect(() => {
    if (formId) {
      const form = allForms.find((f) => f.id === formId);
      if (form) {
        dispatch(setCurrentForm(formId));
        setFormName(form.name);
        setFormDescription(form.description || "");
        setFields(form.fields);
      } else {
        toast.error("Form not found");
        router.push("/");
      }
    } else {
      dispatch(setCurrentForm(null));
      setFormName("Untitled Form");
      setFormDescription("");
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
      },
    }),
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
      placeholder:
        type === "text"
          ? "Enter text..."
          : type === "number"
            ? "0"
            : type === "date"
              ? "Select date"
              : "",
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

    // If no valid drop target, cancel the drag
    if (!over) {
      return;
    }

    // Dropping a toolbox item
    if (active.data.current?.isToolboxItem) {
      const type = active.data.current.type as FieldType;

      // STRICT: Only create field if dropping EXACTLY on canvas-droppable or an existing field
      // Reject all other drop targets (like the outer canvas area, toolbox, etc.)
      if (over.id === "canvas-droppable") {
        // Dropped directly on the form container
        createNewField(type);
      } else {
        // Check if dropping on an existing field
        const overFieldId = over.id as string;
        const overField = fields.find((f) => f.id === overFieldId);
        if (overField) {
          // Dropped on an existing field - insert after it
          createNewField(type, overFieldId);
        }
        // If neither canvas-droppable nor a field, do nothing (cancel)
      }
      return;
    }

    // Reordering existing fields
    // Only reorder if both active and over are existing fields
    const activeField = fields.find((f) => f.id === active.id);
    const overField = fields.find((f) => f.id === over.id);

    if (activeField && overField && active.id !== over.id) {
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

    // Only handle reordering of existing fields, not toolbox items
    const isActiveAField = !active.data.current?.isToolboxItem;
    const isOverAField = fields.find((f) => f.id === overId) !== undefined;

    // Only reorder if both are existing fields (not toolbox items)
    if (isActiveAField && isOverAField) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === activeId);
        const newIndex = items.findIndex((item) => item.id === overId);

        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }
    // Do nothing for toolbox items during drag over - only handle on drag end
  };

  const handleFieldSelect = (id: string) => {
    setSelectedFieldId(id);
  };

  const handleFieldUpdate = (id: string, updates: Partial<FormField>) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    );
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
      toast.error("Form name cannot be empty");
    }
  };

  const handleNameCancel = () => {
    if (formId && existingForm) {
      setFormName(existingForm.name);
    } else {
      setFormName("Untitled Form");
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
      setFormDescription(existingForm.description || "");
    } else {
      setFormDescription("");
    }
    setIsEditingDescription(false);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error("Please provide a form name");
      return;
    }

    if (formId && existingForm) {
      // Update existing form
      dispatch(
        updateForm({
          id: formId,
          updates: {
            name: formName.trim(),
            description: formDescription.trim() || undefined,
            fields,
          },
        }),
      );
      toast.success("Form updated successfully!");
    } else {
      // Create new form
      dispatch(
        addForm({
          name: formName.trim(),
          description: formDescription.trim() || undefined,
          fields,
        }),
      );
      toast.success("Form created successfully!");
      router.push("/");
    }
  };

  const selectedField = fields.find((f) => f.id === selectedFieldId) || null;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || isLoadingFields) {
    return (
      <div className="flex flex-col h-full w-full">
        <div className="flex items-center justify-center flex-1">
          <div className="text-muted-foreground">
            {isLoadingFields ? 'Loading available field types...' : 'Loading form builder...'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="flex h-full w-full bg-stone-100 dark:bg-stone-950">
        <Toaster />

        <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Toolbox Sidebar */}
          <aside className="w-full md:w-64 border-r border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 p-4 lg:p-6 overflow-y-auto hidden md:block shrink-0 min-w-[16rem] max-w-[16rem] rounded-r-lg">
            <div className="mb-6">
              <h2 className="font-semibold mb-1 text-lg text-gray-900 dark:text-gray-100">Form Fields</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                Drag or click to add fields
              </p>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder="Search fields..."
                  className="pl-9 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 focus-visible:ring-[#B4813F]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              {filteredFieldTypes.length === 0 ? (
                <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                  No fields found
                </div>
              ) : (
                filteredFieldTypes.map((type) => (
                  <ToolboxItem
                    key={type.type}
                    type={type.type}
                    label={type.label}
                    onClick={() => createNewField(type.type)}
                  />
                ))
              )}
            </div>

            <div className="mt-6 p-4 bg-[#FEF3E2] dark:bg-[#FEF3E2]/20 rounded-lg border border-stone-200 dark:border-stone-700">
              <p className="text-xs text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                Click or drag fields to add them to your form.
              </p>
            </div>
          </aside>

          {/* Mobile Toolbox Dropdown */}
          <div className="md:hidden fixed bottom-4 right-4 z-40">
            {showMobileToolbox && (
              <div className="absolute bottom-16 right-0 mb-2 w-56 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg shadow-xl p-3 space-y-2 max-h-[400px] overflow-y-auto">
                <div className="mb-2 pb-2 border-b border-stone-200 dark:border-stone-700">
                  <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase">Add Field</p>
                </div>
                {availableFieldTypes.map((type) => (
                  <button
                    key={type.type}
                    onClick={() => {
                      createNewField(type.type);
                      setShowMobileToolbox(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 border border-stone-200 dark:border-stone-700 rounded-md bg-white dark:bg-stone-800 hover:bg-[#FEF3E2] dark:hover:bg-[#FEF3E2]/20 hover:border-[#B4813F] transition-colors text-sm font-medium text-left text-gray-900 dark:text-gray-100"
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
              style={{ backgroundColor: '#B4813F' }}
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
            className="flex-1 px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 pt-0 overflow-y-auto bg-stone-100 dark:bg-stone-950 relative"
            onClick={() => {
              setSelectedFieldId(null);
              setShowMobileToolbox(false);
            }}
          >
            <div className="max-w-4xl mx-auto">
              <CanvasDropZone isEmpty={fields.length === 0}>
                <div className="bg-white dark:bg-stone-900 min-h-[600px] md:min-h-[800px] shadow-sm border border-stone-200 dark:border-stone-700 rounded-lg p-6 md:p-8 lg:p-12 transition-colors relative">
                  {/* Form Header Preview - Editable */}
                  <div className="mb-6 md:mb-8 pb-4 md:pb-6 border-b border-stone-200 dark:border-stone-700 space-y-3">
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
                              if (e.key === "Enter") {
                                handleNameSave();
                              } else if (e.key === "Escape") {
                                handleNameCancel();
                              }
                            }}
                            className="text-xl md:text-3xl font-bold h-auto py-2 border-[#B4813F] focus-visible:ring-2 focus-visible:ring-[#B4813F] rounded-md"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-green-50 dark:hover:bg-green-900/20"
                              onClick={handleNameSave}
                            >
                              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={handleNameCancel}
                            >
                              <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group/title">
                          <h2 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {formName}
                          </h2>
                          {isHoveringName && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-70 hover:opacity-100 text-gray-600 dark:text-gray-400"
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
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleDescriptionSave();
                              } else if (e.key === "Escape") {
                                handleDescriptionCancel();
                              }
                            }}
                            placeholder="Please fill out the details below."
                            className="text-gray-600 dark:text-gray-400 text-sm md:text-base h-auto py-2 border-[#B4813F] focus-visible:ring-2 focus-visible:ring-[#B4813F] rounded-md"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex items-center gap-1 pt-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-green-50 dark:hover:bg-green-900/20"
                              onClick={handleDescriptionSave}
                            >
                              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={handleDescriptionCancel}
                            >
                              <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group/description">
                          <p className="text-gray-600 dark:text-gray-400 mt-1 md:mt-2 text-sm md:text-base">
                            {formDescription || "Please fill out the details below."}
                          </p>
                          {isHoveringDescription && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 opacity-70 hover:opacity-100 text-gray-600 dark:text-gray-400"
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
                    items={fields.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="min-h-[200px]">
                      {fields.length === 0 && !activeDragType && (
                        <div className="text-center text-muted-foreground py-20 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800/30">
                          <p className="font-medium text-gray-700 dark:text-gray-300">Form is empty</p>
                          <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">Click or drag fields from the toolbox to start building.</p>
                        </div>
                      )}

                      {/* Grid layout for fields */}
                      <div className="grid grid-cols-12 gap-4">
                        {fields.map((field) => {
                          const columnSpan = field.columnSpan || 12;
                          // Map column spans to Tailwind classes
                          const colSpanClass = {
                            12: "col-span-12",
                            6: "col-span-12 md:col-span-6",
                            4: "col-span-12 md:col-span-4",
                            3: "col-span-12 md:col-span-3",
                          }[columnSpan] || "col-span-12";

                          return (
                            <div key={field.id} className={colSpanClass}>
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
          </div>

          {/* Properties Sidebar */}
          <PropertiesPanel
            field={selectedField}
            onChange={handleFieldUpdate}
            onDelete={handleFieldDelete}
            onSave={handleSave}
          />
        </main>

        <DragOverlay>
          {activeId ? (
            activeDragType ? (
              <ToolboxItemOverlay
                label={
                  availableFieldTypes.find((t) => t.type === activeDragType)?.label ||
                  "Field"
                }
              />
            ) : (
              <div className="opacity-80 p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-xl w-[400px] text-gray-900 dark:text-gray-100">
                Moving Field...
              </div>
            )
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
