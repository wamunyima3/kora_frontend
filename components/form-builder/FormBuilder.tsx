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
import { FormField, FIELD_TYPES, FieldType, transformFieldsToToolboxItems, DATA_TYPE_TO_FIELD_TYPE } from "./types";
import { ToolboxItem, ToolboxItemOverlay } from "./ToolboxItem";
import { SortableField } from "./SortableField";
import PropertiesPanel from "./PropertiesPanel";
import { FormPreview } from "./FormPreview";
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
  Loader2,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import {
  selectCurrentForm,
  selectAllForms,
  addForm,
  updateForm,
  setCurrentForm,
} from "@/lib/features/formBuilder/formSlice";
import { 
  useFields, 
  useCreateField, 
  useGroups, 
  useDataTypes, 
  useServices, 
  useCreateService,
  useCollections,
  useCreateCollection,
  useCollectionItems,
  useCreateCollectionItem,
  useDeleteCollectionItem,
  useCreateFormGroup,
  useCreateFormField,
  useCreateForm,
  useUpdateForm,
  useForm as useDbForm,
  useFormFieldsByForm,
} from "@/hooks";

interface FormBuilderProps {
  formId?: string;
}

export default function FormBuilder({ formId }: FormBuilderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const existingForm = useAppSelector(selectCurrentForm);
  const allForms = useAppSelector(selectAllForms);

  const { data: dbFields, isLoading: isLoadingFields, error: fieldsError } = useFields();
  const { data: dbGroups, isLoading: isLoadingGroups } = useGroups();
  const { data: dbDataTypes, isLoading: isLoadingDataTypes } = useDataTypes();

  // Fetch form from database if formId is provided (numeric)
  const dbFormId = formId ? Number(formId) : undefined;
  const { data: dbForm, isLoading: isLoadingDbForm } = useDbForm(dbFormId || 0);
  const { data: dbFormFields, isLoading: isLoadingDbFormFields } = useFormFieldsByForm(dbFormId);
  const [isDbFormLoaded, setIsDbFormLoaded] = useState(false);

  // Transform database fields to toolbox items, with fallback to hardcoded types
  const availableFieldTypes = useMemo(() => {
    let items: { type: FieldType; label: string; id?: string; groupId?: string }[] = [];
    
    if (dbFields && dbFields.length > 0 && dbDataTypes) {
      items = transformFieldsToToolboxItems(dbFields, dbDataTypes);
    }
    
    // If no fields could be transformed or DB is empty, use default types
    if (items.length === 0) {
        items = [...FIELD_TYPES];
    }
    
    // Always ensure Group is present if it's not in the list
    // This allows creating an empty ad-hoc group
    if (!items.some(item => item.type === 'group' && !item.id)) {
        items.push({ type: 'group', label: 'Group' });
    }
    
    return items;
  }, [dbFields, dbDataTypes]);

  // Separate fields into groups and individual fields
  // "Groups" here refers to pre-defined groups from the DB + the generic Group tool
  const toolboxGroups = useMemo(() => {
      const groups: { type: FieldType; label: string; id?: string; isGroupEntity?: boolean }[] = [];
      
      // Add the generic Group tool
      groups.push({ type: 'group', label: 'Empty Group' });

      // Add pre-defined groups from DB
      if (dbGroups) {
          dbGroups.forEach(g => {
              groups.push({
                  type: 'group',
                  label: g.group_name,
                  id: g.id.toString(),
                  isGroupEntity: true
              });
          });
      }
      return groups;
  }, [dbGroups]);

  /* -------------------------------------------------------------------------- */
  /*                             Recursive Helpers                              */
  /* -------------------------------------------------------------------------- */
  
  const findFieldAndParent = (
    items: FormField[],
    id: string
  ): { field: FormField | null; parent: FormField | null; index: number } => {
    for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
            return { field: items[i], parent: null, index: i };
        }
        if (items[i].children) {
            const result = findFieldAndParent(items[i].children!, id);
            if (result.field) {
                return { ...result, parent: result.parent || items[i] };
            }
        }
    }
    return { field: null, parent: null, index: -1 };
  };

  const addFieldToParent = (
    items: FormField[],
    parentId: string | null,
    newField: FormField,
    insertIndex?: number
  ): FormField[] => {
    if (!parentId) {
        const newItems = [...items];
        if (typeof insertIndex === 'number' && insertIndex >= 0) {
            newItems.splice(insertIndex, 0, newField);
        } else {
            newItems.push(newField);
        }
        return newItems;
    }

    return items.map((item) => {
        if (item.id === parentId) {
            const currentChildren = item.children || [];
            const newChildren = [...currentChildren];
            if (typeof insertIndex === 'number' && insertIndex >= 0) {
                newChildren.splice(insertIndex, 0, newField);
            } else {
                newChildren.push(newField);
            }
            return { ...item, children: newChildren };
        }
        if (item.children) {
            return {
                ...item,
                children: addFieldToParent(item.children, parentId, newField, insertIndex),
            };
        }
        return item;
    });
  };

  const removeFieldFromList = (items: FormField[], id: string): FormField[] => {
      return items
          .filter(item => item.id !== id)
          .map(item => ({
              ...item,
              children: item.children ? removeFieldFromList(item.children, id) : undefined
          }));
  };

  /* -------------------------------------------------------------------------- */
  /*                               Main Logic                                   */
  /* -------------------------------------------------------------------------- */
  
  const [fields, setFields] = useState<FormField[]>([]);
  const [formName, setFormName] = useState("Untitled Form");
  const [formDescription, setFormDescription] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isHoveringName, setIsHoveringName] = useState(false);
  const [isHoveringDescription, setIsHoveringDescription] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeToolboxItem, setActiveToolboxItem] = useState<{ type: FieldType; label: string; id?: string } | null>(null);
  const [showMobileToolbox, setShowMobileToolbox] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  
  // Field creation state
  const [isCreatingField, setIsCreatingField] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldDataType, setNewFieldDataType] = useState<string>("text");
  

  
  // Service state
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [serviceError, setServiceError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  useEffect(() => {
    if (formName.trim() && formName !== "Untitled Form") setNameError(false);
  }, [formName]);

  useEffect(() => {
    if (formDescription.trim()) setDescriptionError(false);
  }, [formDescription]);

  const createFieldMutation = useCreateField();
  const createServiceMutation = useCreateService();

  // Helper to normalize strings for comparison (removes spaces, underscores, non-alphanumeric, lowercase)
  const normalizeString = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

  const handleCreateField = async () => {
    if (!newFieldLabel.trim()) {
      toast.error("Please enter a field label");
      return;
    }

    // Check for duplicates in existing database fields
    if (dbFields) {
        const normalizedNew = normalizeString(newFieldLabel);
        
        const existingField = dbFields.find(
            field => normalizeString(field.label) === normalizedNew
        );
        
        if (existingField) {
            toast.error(`Field "${existingField.label}" already exists (matches "${newFieldLabel}").`);
            return;
        }
    }

    try {
      // Find the ID for the selected data type
      const selectedDataType = dbDataTypes?.find(
        dt => dt.data_type.toLowerCase() === newFieldDataType.toLowerCase()
      );

      if (!selectedDataType) {
        toast.error("Invalid data type selected");
        return;
      }

      await createFieldMutation.mutateAsync({
        label: newFieldLabel.trim(),
        data_type_id: selectedDataType.id,
        group_id: null,
      });
      
      toast.success("Field created successfully");
      setIsCreatingField(false);
      setNewFieldLabel("");
      setNewFieldDataType("text");
    } catch (error) {
      console.error("Failed to create field:", error);
      toast.error("Failed to create field");
    }
  };





  /* -------------------------------------------------------------------------- */
  /*                            Collection Logic                                */
  /* -------------------------------------------------------------------------- */
  // Pending State
  const [pendingCollections, setPendingCollections] = useState<{ id: number; name: string }[]>([]);
  const [pendingCollectionItems, setPendingCollectionItems] = useState<{ id: number; collection_id: number; item: string }[]>([]);
  const [pendingService, setPendingService] = useState<{ id: number; name: string } | null>(null);

  // Real Data
  const { data: dbCollections } = useCollections();
  const { data: dbCollectionItems } = useCollectionItems();
  const { data: services, isLoading: isLoadingServices } = useServices();

  // Mutations (only used in handleSave)
  const createCollectionMutation = useCreateCollection();
  const createCollectionItemMutation = useCreateCollectionItem();
  const deleteCollectionItemMutation = useDeleteCollectionItem();

  // Combined Data for UI
  const collections = useMemo(() => {
    const real = dbCollections?.map(c => ({ id: c.id, collection_name: c.collection_name })) || [];
    const pending = pendingCollections.map(c => ({ id: c.id, collection_name: c.name }));
    return [...real, ...pending];
  }, [dbCollections, pendingCollections]);

  const allCollectionItems = useMemo(() => {
    const real = dbCollectionItems?.map(i => ({ id: i.id, collection_item: i.collection_item, collection_id: i.collection_id })) || [];
    const pending = pendingCollectionItems.map(i => ({ id: i.id, collection_item: i.item, collection_id: i.collection_id }));
    return [...real, ...pending];
  }, [dbCollectionItems, pendingCollectionItems]);

  const uiServices = useMemo(() => {
      const real = services || [];
      if (pendingService) {
          return [...real, { id: pendingService.id, service_name: pendingService.name }];
      }
      return real;
  }, [services, pendingService]);

  const handleCreateCollection = (name: string) => {
      // Create a temporary negative ID
      const tempId = -1 * (Date.now() + Math.floor(Math.random() * 1000));
      setPendingCollections(prev => [...prev, { id: tempId, name }]);
      
      toast.success("Collection created (Review on Save)");
      
      // Auto-select
      if (selectedFieldId) {
          handleFieldUpdate(selectedFieldId, { collectionId: tempId });
      }
  };

  const handleAddCollectionItem = (collectionId: number, itemValue: string) => {
      const tempId = -1 * (Date.now() + Math.floor(Math.random() * 1000));
      setPendingCollectionItems(prev => [...prev, { id: tempId, collection_id: collectionId, item: itemValue }]);
      toast.success("Option added (Review on Save)");
  };

  const handleDeleteCollectionItem = (itemId: number) => {
      // If it's pending, just remove it from state
      if (itemId < 0) {
          setPendingCollectionItems(prev => prev.filter(i => i.id !== itemId));
          toast.success("Option removed");
          return;
      }
      
      // If real, we can't delete transactionally easily without soft deletes or complex diffing.
      // For now, we might restrict deleting real items or allow immediate delete?
      // User request implies strict transaction on "creation". Deletion often needs immediate feedback or deferred too.
      // Let's defer "Delete" by tracking "itemsToDelete"?
      // For simplicity/safety per user request "create fields... if they wait cancel it means we added unnecessary data",
      // so primary concern is creation. Immediate delete of *existing* might be acceptable or we should block it.
      // Let's implement immediate delete for REAL items for now to keep it working, or blocking it?
      // Since the request emphasizes "creation transaction", I will allow immediate delete for DB items 
      // BUT for safety let's block it or warn.
      // Actually, let's just do immediate delete for now as per previous logic, but strictly for DB items.
      
       try {
          deleteCollectionItemMutation.mutate(itemId); // Use mutate non-async to simpler UI
          toast.success("Option deleted");
      } catch (error) {
           console.error("Failed to delete option", error);
      }
  };

  const handleCreateService = () => {
    if (!newServiceName.trim()) {
      toast.error("Please enter a service name");
      return;
    }
    
    // Check pending conflict
    if (pendingService && pendingService.name === newServiceName.trim()) {
        toast.error("Service already pending");
        return;
    }

    const tempId = -1 * (Date.now());
    setPendingService({ id: tempId, name: newServiceName.trim() });
    
    toast.success("Service created (Review on Save)");
    setNewServiceName("");
    setIsCreatingService(false);
    setSelectedServiceId(tempId);
  };

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
    // If we have a formId, try to load from database first
    if (formId && dbFormId) {
      // Wait for database loading to complete
      if (isLoadingDbForm || isLoadingDbFormFields || isLoadingFields) {
        return;
      }

      // If form loaded from database
      if (dbForm && !isDbFormLoaded) {
        setFormName(dbForm.form_name);
        setFormDescription(dbForm.description || "");
        setSelectedServiceId(dbForm.service_id || null);

        // Transform dbFormFields to internal FormField[] format
        if (dbFormFields && dbFields && dbDataTypes) {
          const transformedFields: FormField[] = dbFormFields.map((ff) => {
            const field = dbFields.find(f => f.id === ff.field_id);
            const dataType = field ? dbDataTypes.find(dt => dt.id === field.data_type_id) : null;
            const typeStr = dataType?.data_type?.toLowerCase() || 'text';
            
            return {
              id: `db-${ff.id}`, // Prefix to distinguish from new fields
              type: DATA_TYPE_TO_FIELD_TYPE[typeStr] || 'text',
              label: ff.field_name || field?.label || 'Unknown Field',
              required: false,
              placeholder: '',
              columnSpan: ff.field_span || 12,
              dbFormFieldId: ff.id, // Keep reference to DB record
              dbFieldId: ff.field_id,
            };
          });
          setFields(transformedFields);
        } else {
          setFields([]);
        }
        
        setIsDbFormLoaded(true);
        dispatch(setCurrentForm(null)); // Not using Redux for DB forms
        return;
      }

      // Fall back to Redux if no database form found
      if (!dbForm && !isLoadingDbForm) {
        const form = allForms.find((f) => f.id === formId);
        if (form) {
          dispatch(setCurrentForm(formId));
          setFormName(form.name);
          setFormDescription(form.description || "");
          setFields(form.fields);
          setSelectedServiceId(form.serviceId || null);
        } else {
          toast.error("Form not found");
          router.push("/");
        }
      }
    } else {
      // No formId - new form
      dispatch(setCurrentForm(null));
      setFormName("Untitled Form");
      setFormDescription("");
      setFields([]);
      setSelectedServiceId(null);
      setIsDbFormLoaded(false);
    }
  }, [formId, dbFormId, dbForm, dbFormFields, dbFields, dbDataTypes, isLoadingDbForm, isLoadingDbFormFields, isLoadingFields, allForms, dispatch, router, isDbFormLoaded]);

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
      setActiveToolboxItem(active.data.current as { type: FieldType; label: string; id?: string });
      setSelectedFieldId(null);
    }
  };

  const createNewField = (template: { type: FieldType; label?: string; id?: string; isGroupEntity?: boolean }, targetId?: string, position?: 'after' | 'inside') => {
    const type = template.type;
    
    // If it's a pre-defined group, we need to populate children
    let children: FormField[] = [];
    if (template.isGroupEntity && template.id && dbFields) {
        const groupId = template.id;
        // Find fields belonging to this group
        const groupFields = dbFields.filter(f => f.group_id?.toString() === groupId);
        
        children = groupFields.map(gf => {
            const dt = dbDataTypes?.find(t => t.id === gf.data_type_id);
            const typeStr = dt?.data_type || 'text';
            return {
                id: nanoid(),
                type: DATA_TYPE_TO_FIELD_TYPE[typeStr.toLowerCase()] || 'text',
                label: gf.label,
                required: false,
                placeholder: "",
                columnSpan: 12
            };
        });
    } else if (type === 'group') {
        children = [];
    }

    const newField: FormField = {
      id: nanoid(),
      type,
      // Use the template label if provided, otherwise default fallback
      label: template.label || `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
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
      children: type === 'group' ? children : undefined,
    };

    if (targetId) {
        // If 'inside', we are dropping into a group
        if (position === 'inside') {
             setFields(prev => addFieldToParent(prev, targetId, newField));
             setSelectedFieldId(newField.id);
             return newField;
        }

        // If 'after', insert after the target field
        const { parent, index } = findFieldAndParent(fields, targetId);
        if (index !== -1) {
             setFields(prev => addFieldToParent(prev, parent ? parent.id : null, newField, index + 1));
             setSelectedFieldId(newField.id);
             return newField;
        }
    }
    
    // Default: Add to root
    setFields((prev) => [...prev, newField]);
    setSelectedFieldId(newField.id);
    return newField;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveToolboxItem(null);

    // If no valid drop target, cancel the drag
    if (!over) {
      return;
    }

    // Dropping a toolbox item
    if (active.data.current?.isToolboxItem) {
      const toolboxItem = active.data.current as { type: FieldType; label: string; id?: string };
      const template = { 
        type: toolboxItem.type, 
        label: toolboxItem.label,
        id: toolboxItem.id,
        isGroupEntity: (toolboxItem as any).isGroupEntity 
      };

      if (over.id === "canvas-droppable") {
        // Dropped on main canvas
        createNewField(template);
      } else {
         // Dropped on a field or a group
         const overId = over.id as string;
         let targetId = overId;
         let isInsideGroupDrop = false;

         // Check if we are dropping on a group's specialized dropzone
         if (over.data.current?.isGroup && over.data.current?.parentId) {
             targetId = over.data.current.parentId;
             isInsideGroupDrop = true;
         }

         const { field: overField } = findFieldAndParent(fields, targetId);

         if (overField) {
             if (isInsideGroupDrop) {
                 // Dropped inside a group
                 createNewField(template, targetId, 'inside');
             } else {
                 // Dropped on a field (regular or group acting as item) -> insert after
                 createNewField(template, targetId, 'after');
             }
         }
      }
      return;
    }

    // Reordering existing fields
    const activeId = active.id as string;
    const overId = over.id as string;
    
    if (activeId === overId) return;
    
    // We rely on handleDragOver to have moved the item.
    // However, dnd-kit sometimes needs final "dragEnd" sort if within same container.
    // Our handleDragOver handles both.
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    let overId = over.id as string;
    
    // Resolve overId if it's a dropzone
    if (over.data.current?.isGroup && over.data.current?.parentId) {
        overId = over.data.current.parentId;
    }

    if (activeId === overId) return;

    // Only handle reordering of existing fields, not toolbox items
    if (active.data.current?.isToolboxItem) return;

    // Find active field and its container
    const activeData = findFieldAndParent(fields, activeId);
    const overData = findFieldAndParent(fields, overId);

    if (!activeData.field || !overData.field) {
        // Try looking for canvas or group drop zones
        if (overId === 'canvas-droppable') {
            // Dragging item to root empty space?
            // If active parent is not null, move to root?
            // TODO: Logic for moving to root via dragOver on empty canvas is tricky with dnd-kit
            // usually you drop on *something*. 'canvas-droppable' is the "SortableContext" container?
            // If SortableContext items are full, you drop on an item.
            return;
        }
        
        // Check if over is a group container (receiving drop)
        const possibleGroup = findFieldAndParent(fields, overId).field;
        if (possibleGroup && possibleGroup.type === 'group') {
            // Moving into a group
            // Remove from old, add to new
            setFields(prev => {
                const withoutActive = removeFieldFromList(prev, activeId);
                return addFieldToParent(withoutActive, overId, activeData.field!);
            });
            return;
        }
        
        return;
    }

    const startParentId = activeData.parent ? activeData.parent.id : 'root';
    const endParentId = overData.parent ? overData.parent.id : 'root';

    if (startParentId === endParentId) {
        // Reorder within same list
        setFields(prev => {
             // We need to act on the specific list
             const newFields = [...prev];
             
             // Define helper to swap in path
             const swapInList = (items: FormField[], parentId: string | null): FormField[] => {
                if (parentId === 'root' && items === prev) {
                   // This is root
                   const oldIndex = items.findIndex(i => i.id === activeId);
                   const newIndex = items.findIndex(i => i.id === overId);
                   if (oldIndex !== -1 && newIndex !== -1) {
                       return arrayMove(items, oldIndex, newIndex);
                   }
                   return items;
                }
                
                return items.map(item => {
                   if (item.id === parentId) {
                       // This is the parent
                       const children = item.children || [];
                       const oldIndex = children.findIndex(i => i.id === activeId);
                       const newIndex = children.findIndex(i => i.id === overId);
                       if (oldIndex !== -1 && newIndex !== -1) {
                           return { ...item, children: arrayMove(children, oldIndex, newIndex) };
                       }
                   }
                   if (item.children) {
                       return { ...item, children: swapInList(item.children, parentId) };
                   }
                   return item;
                });
             };
             
             return swapInList(newFields, endParentId === 'root' ? 'root' : endParentId);
        });
    } else {
        // Moving between lists (e.g. root to group or group to group)
        setFields(prev => {
            const fieldToMove = activeData.field!;
            const withoutActive = removeFieldFromList(prev, activeId);
            // Insert into new parent at specific index
            const targetParentId = overData.parent ? overData.parent.id : null;
            // "Over" is the item we are hovering over. We want to place relative to it.
            // Usually we insert matching the index of 'over'.
            
            // Find index of over in the NEW list (which is currently in 'withoutActive' tree?)
            // Wait, 'over' is in 'prev'.
            // In 'withoutActive', 'over' should still exist (unless over was active, which is impossible).
            
            const overInNew = findFieldAndParent(withoutActive, overId);
            if (overInNew.index !== -1) {
                 return addFieldToParent(withoutActive, targetParentId, fieldToMove, overInNew.index);
            }
            return withoutActive;
        });
    }
  };

  const handleFieldSelect = (id: string) => {
    setSelectedFieldId(id);
  };

  const updateFieldRecursive = (items: FormField[], id: string, updates: Partial<FormField>): FormField[] => {
      return items.map(item => {
          if (item.id === id) {
              return { ...item, ...updates };
          }
          if (item.children) {
              return { ...item, children: updateFieldRecursive(item.children, id, updates) };
          }
          return item;
      });
  };

  const handleFieldUpdate = (id: string, updates: Partial<FormField>) => {
    setFields((prev) => updateFieldRecursive(prev, id, updates));
  };

  const handleFieldDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFields((prev) => removeFieldFromList(prev, id));
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

  const createFormGroupMutation = useCreateFormGroup();
  const createFormFieldMutation = useCreateFormField();
  const createFormMutation = useCreateForm();
  const updateFormMutation = useUpdateForm();

  const handleSave = async () => {
    // Validate Name
    if (!formName.trim() || formName === "Untitled Form") {
      toast.error("Please provide a valid form name");
      setNameError(true);
      return;
    }

    // Validate Description
    if (!formDescription.trim()) {
      toast.error("Please provide a form description");
      setDescriptionError(true);
      return;
    }

    if (!selectedServiceId) {
      toast.error("Please select a service");
      setServiceError(true);
      return;
    }
    
    setServiceError(false);
    setNameError(false);
    setDescriptionError(false);
    
    const toastId = toast.loading("Saving form...");

    try {
        // --- 1. Collections Creation (if pending) ---
        // Map tempCollectionId -> realCollectionId
        const collectionIdMap = new Map<number, number>();

        for (const col of pendingCollections) {
            const newCol = await createCollectionMutation.mutateAsync({ collection_name: col.name });
            if (newCol) {
                collectionIdMap.set(col.id, newCol.id);
            }
        }

        // --- 2. Collection Items Creation (if pending) ---
        // Handle pending items for NEW collections
        for (const col of pendingCollections) {
            const realColId = collectionIdMap.get(col.id);
            if (realColId) {
                const itemsForCol = pendingCollectionItems.filter(i => i.collection_id === col.id);
                for (const item of itemsForCol) {
                    await createCollectionItemMutation.mutateAsync({
                        collection_id: realColId,
                        collection_item: item.item,
                        relation_collection_items_id: null
                    });
                }
            }
        }
        
        // Handle pending items for EXISTING/REAL collections
        const itemsForRealCols = pendingCollectionItems.filter(i => i.collection_id > 0);
        for (const item of itemsForRealCols) {
             await createCollectionItemMutation.mutateAsync({
                collection_id: item.collection_id,
                collection_item: item.item,
                relation_collection_items_id: null
            });
        }

        // --- 3. Fields Creation / Deduplication ---
        // Map CanvasFieldID -> RealDBFieldID
        const fieldIdMap = new Map<string, number>();
        
        // Flatten fields to process all (including nested in groups)
        const allCanvasFields: FormField[] = [];
        const traverse = (nodes: FormField[]) => {
            nodes.forEach(node => {
                allCanvasFields.push(node);
                if (node.children) traverse(node.children);
            });
        };
        traverse(fields);

        for (const field of allCanvasFields) {
            // resolve collection ID 
            let finalCollectionId = field.collectionId;
            if (finalCollectionId && finalCollectionId < 0) {
                finalCollectionId = collectionIdMap.get(finalCollectionId);
            }

            // Check if field already exists in DB (by label & type)
            const normalizedLabel = normalizeString(field.label);
            const existingDbField = dbFields?.find(
                f => normalizeString(f.label) === normalizedLabel && 
                     DATA_TYPE_TO_FIELD_TYPE[dbDataTypes?.find(dt => dt.id === f.data_type_id)?.data_type.toLowerCase() || ''] === field.type
            );

            if (existingDbField) {
                // Use existing
                fieldIdMap.set(field.id, existingDbField.id);
            } else {
                // Create new
                const dtId = dbDataTypes?.find(dt => DATA_TYPE_TO_FIELD_TYPE[dt.data_type.toLowerCase()] === field.type)?.id;
                
                if (dtId) {
                    const newDbField = await createFieldMutation.mutateAsync({
                        label: field.label,
                        data_type_id: dtId,
                        group_id: null,
                    });
                    
                    if (newDbField) {
                         fieldIdMap.set(field.id, newDbField.id);
                    }
                }
            }
        }
        
        // --- 4. Service Creation (if pending) ---
        let realServiceId = selectedServiceId;
        if (realServiceId && realServiceId < 0 && pendingService && pendingService.id === realServiceId) {
            const svc = await createServiceMutation.mutateAsync({ service_name: pendingService.name });
            if (svc) realServiceId = svc.id;
        }

        // --- 5. Form Creation/Update ---
        let finalFormId = Number(formId);
        
        // Check if we're updating an existing form (either from Redux or from database)
        const isUpdating = formId && (existingForm || dbForm);
        
        if (isUpdating) {
             // Update existing form
             await updateFormMutation.mutateAsync({
                 id: Number(formId),
                 form_name: formName.trim(),
                 description: formDescription.trim() || null,
                 service_id: realServiceId || null
             });
        } else {
            // Create new form
            const newForm = await createFormMutation.mutateAsync({
                form_name: formName.trim(),
                description: formDescription.trim() || undefined,
                service_id: realServiceId || null
            });
            finalFormId = newForm.id;
        }

        // --- 6. Groups Creation ---
        // We iterate through root items. If group, create group.
        
        let rowCounter = 1;

        for (const item of fields) {
            if (item.type === 'group') {
                // Create Group
                const group = await createFormGroupMutation.mutateAsync({
                    group_name: item.label,
                    group_row: rowCounter++, // Is this "row" in the visual sense?
                    group_span: item.columnSpan || 12
                });
                
                // --- 7. Form Fields (Nested in Group) ---
                if (item.children) {
                    let childRow = 1; 
                    for (const child of item.children) {
                        const realFieldId = fieldIdMap.get(child.id);
                        if (realFieldId) {
                            await createFormFieldMutation.mutateAsync({
                                form_id: finalFormId,
                                field_id: realFieldId,
                                form_group_id: group.id,
                                field_row: childRow++, 
                                field_span: child.columnSpan || 12
                            });
                        }
                    }
                }
            } else {
                // --- 7. Form Fields (Root) ---
                const realFieldId = fieldIdMap.get(item.id);
                if (realFieldId) {
                    await createFormFieldMutation.mutateAsync({
                        form_id: finalFormId,
                        field_id: realFieldId,
                        form_group_id: null,
                        field_row: rowCounter++, 
                        field_span: item.columnSpan || 12
                    });
                }
            }
        }

        // Sync and Cleanup
        toast.dismiss(toastId);
        toast.success("Form saved successfully!");
        
        setPendingCollections([]);
        setPendingCollectionItems([]);
        setPendingService(null);
        
        if (!formId) {
             router.push("/services");
        }
        
    } catch (error) {
        console.error("Save failed", error);
        toast.dismiss(toastId);
        toast.error("Failed to save form");
    }
  };

  const selectedFieldData = selectedFieldId ? findFieldAndParent(fields, selectedFieldId).field : null;
  const selectedField = selectedFieldData || null;
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

            <div className="mb-4">
              <Dialog open={isCreatingField} onOpenChange={setIsCreatingField}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full bg-[#B4813F] hover:bg-[#9A6E35] text-white"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Field
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Field</DialogTitle>
                    <DialogDescription>
                      Add a new field type to your collection.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="label">Label</Label>
                      <Input
                        id="label"
                        placeholder="e.g., Email Address"
                        value={newFieldLabel}
                        onChange={(e) => setNewFieldLabel(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dataType">Data Type</Label>
                      <select
                        id="dataType"
                        value={newFieldDataType}
                        onChange={(e) => setNewFieldDataType(e.target.value)}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-800 dark:bg-stone-950 dark:ring-offset-stone-950 dark:placeholder:text-stone-400 dark:focus:ring-stone-300"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="select">Dropdown</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreatingField(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateField}
                      disabled={createFieldMutation.isPending}
                      className="bg-[#B4813F] hover:bg-[#9A6E35] text-white"
                    >
                      {createFieldMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Create Field
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-6">
              {/* Groups Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Groups</h3>
                {toolboxGroups.map((group) => (
                   <ToolboxItem
                     key={group.id ? `group-${group.id}` : 'group-generic'}
                     type="group"
                     label={group.label}
                     id={group.id}
                     isGroupEntity={group.isGroupEntity}
                     onClick={() => createNewField({ type: 'group', label: group.label, id: group.id, isGroupEntity: group.isGroupEntity })}
                   />
                ))}
              </div>

              {/* Individual Fields Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Fields</h3>
                {filteredFieldTypes.length === 0 ? (
                    <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                    No fields found
                    </div>
                ) : (
                    filteredFieldTypes.filter(t => t.type !== 'group').map((type) => (
                    <ToolboxItem
                        key={type.id || type.type}
                        type={type.type}
                        label={type.label}
                        id={type.id}
                        onClick={() => createNewField({ type: type.type, label: type.label })}
                    />
                    ))
                )}
              </div>
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
                  <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase">Add Element</p>
                </div>
                
                {/* Mobile Groups */}
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Groups</p>
                {toolboxGroups.map((group) => (
                  <button
                    key={group.id ? `group-${group.id}` : 'group-generic'}
                    onClick={() => {
                      createNewField({ type: 'group', label: group.label, id: group.id, isGroupEntity: group.isGroupEntity });
                      setShowMobileToolbox(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 border border-stone-200 dark:border-stone-700 rounded-md bg-white dark:bg-stone-800 hover:bg-[#FEF3E2] dark:hover:bg-[#FEF3E2]/20 hover:border-[#B4813F] transition-colors text-sm font-medium text-left text-gray-900 dark:text-gray-100"
                  >
                     <span>{group.label}</span>
                  </button>
                ))}

                {/* Mobile Fields */}
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-3 mb-1">Fields</p>
                {availableFieldTypes.filter(t => t.type !== 'group').map((type) => (
                  <button
                    key={type.id || type.type}
                    onClick={() => {
                      createNewField({ type: type.type, label: type.label });
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
                      {fields.length === 0 && !activeToolboxItem && (
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
                                selectedFieldId={selectedFieldId}
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
            onPreview={() => setIsPreviewOpen(true)}
            services={uiServices}
            selectedServiceId={selectedServiceId}
            onServiceChange={setSelectedServiceId}
            serviceError={serviceError}
            onCreateService={() => setIsCreatingService(true)}
            collections={collections}
            collectionItems={allCollectionItems}
            onCreateCollection={handleCreateCollection}
            onAddCollectionItem={handleAddCollectionItem}
            onDeleteCollectionItem={handleDeleteCollectionItem}
          />
        </main>

        <Dialog open={isCreatingService} onOpenChange={setIsCreatingService}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Service</DialogTitle>
                    <DialogDescription>
                        Enter a name for the new service to categorize your forms.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="service-name">Service Name</Label>
                        <Input
                            id="service-name"
                            value={newServiceName}
                            onChange={(e) => setNewServiceName(e.target.value)}
                            placeholder="e.g., HR Requests, IT Support"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreatingService(false)}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleCreateService}
                        disabled={createServiceMutation.isPending}
                        className="bg-[#B4813F] hover:bg-[#9A6E35] text-white"
                    >
                        {createServiceMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Create Service
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <FormPreview
            fields={fields}
            title={formName}
            description={formDescription}
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
        />

        <DragOverlay>
          {activeId ? (
            activeToolboxItem ? (
              <ToolboxItemOverlay
                label={activeToolboxItem.label}
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
