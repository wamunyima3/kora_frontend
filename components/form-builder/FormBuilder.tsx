"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { FormField, FIELD_TYPES, FieldType } from "./types";
import { ToolboxItem, ToolboxItemOverlay } from "./ToolboxItem";
import { SortableField } from "./SortableField";
import PropertiesPanel from "./PropertiesPanel";
import { CanvasDropZone } from "./CanvasDropZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Save,
  ArrowLeft,
  Pencil,
  Check,
  X,
  Plus,
  ChevronDown,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import {
  selectCurrentForm,
  selectAllForms,
  addForm,
  updateForm,
  setCurrentForm,
} from "@/lib/features/formBuilder/formSlice";

interface FormBuilderProps {
  formId?: string;
}

export default function FormBuilder({ formId }: FormBuilderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const existingForm = useAppSelector(selectCurrentForm);
  const allForms = useAppSelector(selectAllForms);

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

  if (!isMounted) {
    return (
      <div className="flex flex-col h-full w-full">
        <div className="flex items-center justify-center flex-1">
          <div className="text-muted-foreground">Loading form builder...</div>
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
      <div className="flex h-full w-full">
        <Toaster />

        <aside className="w-64 border-r p-6 overflow-y-auto flex-shrink-0">
          <h2 className="font-bold mb-6 text-lg">Tool Box</h2>
          <div className="grid grid-cols-2 gap-3">
            {FIELD_TYPES.map((type) => (
              <ToolboxItem
                key={type.type}
                type={type.type}
                label={type.label}
                onClick={() => createNewField(type.type)}
              />
            ))}
          </div>
        </aside>

        <div
          className="flex-1 p-8 overflow-y-auto bg-white dark:bg-stone-900 relative"
          onClick={() => setSelectedFieldId(null)}
        >
          <CanvasDropZone isEmpty={fields.length === 0}>
            <div className="w-full mx-auto h-full border shadow-sm rounded-lg p-12 transition-colors relative">
              <div className="mb-8 pb-6 text-center space-y-2">
                <div
                  className="group relative"
                  onMouseEnter={() => setIsHoveringName(true)}
                  onMouseLeave={() => setIsHoveringName(false)}
                >
                  {isEditingName ? (
                    <div className="flex items-center justify-center gap-2">
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
                        className="text-center text-sm font-semibold h-auto py-2 border-primary focus-visible:ring-2"
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
                    <div className="flex items-center justify-center gap-2 group/title">
                      <h2 className="text-sm font-semibold uppercase tracking-wide">
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
              </div>

              <SortableContext
                items={fields.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="min-h-[200px]">
                  <div className="space-y-4">
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

                  <div className="mt-8 flex justify-center">
                    <Button
                      onClick={() => createNewField("text")}
                      className="bg-[#D4B896] hover:bg-[#C4A886] text-foreground px-8"
                    >
                      Add New Field
                    </Button>
                  </div>
                </div>
              </SortableContext>
            </div>
          </CanvasDropZone>
        </div>

        <aside className="w-80 border-l p-6 overflow-y-auto flex-shrink-0">
          <h2 className="font-bold mb-6 text-lg">Properties & Styling</h2>
          {selectedField ? (
            <PropertiesPanel
              field={selectedField}
              onChange={handleFieldUpdate}
              onDelete={handleFieldDelete}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a field to edit its properties
            </p>
          )}
        </aside>
      </div>

      <DragOverlay>
        {activeId ? (
          activeDragType ? (
            <ToolboxItemOverlay
              label={
                FIELD_TYPES.find((t) => t.type === activeDragType)?.label ||
                "Field"
              }
            />
          ) : (
            <div className="opacity-80 p-4 bg-background border rounded shadow-lg w-[400px]">
              Moving Field...
            </div>
          )
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
