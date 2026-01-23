
'use client'
import React, { useState } from 'react';
import { FormField } from './types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Trash2, Save, Eye, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
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

function AddCollectionDialog({ onCreate }: { onCreate?: (name: string) => void }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');

    const handleCreate = () => {
        if (name.trim()) {
            onCreate?.(name);
            setName('');
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                 <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full h-8 text-xs border-dashed"
                >
                    + Create New Collection
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Collection</DialogTitle>
                    <DialogDescription>
                        Create a new collection to store options for this field.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Collection Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Genders, Colors"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreate} disabled={!name.trim()} className="bg-[#B4813F] text-white">Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function AddItemInput({ onAdd }: { onAdd: (val: string) => void }) {
    const [val, setVal] = useState('');
    return (
        <div className="flex gap-2">
            <Input 
                value={val} 
                onChange={e => setVal(e.target.value)} 
                placeholder="Add option..." 
                className="h-8 text-xs bg-white dark:bg-stone-800"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault(); 
                        if (val.trim()) {
                            onAdd(val);
                            setVal('');
                        }
                    }
                }}
            />
            <Button 
                size="icon" 
                variant="outline" 
                className="h-8 w-8 shrink-0"
                onClick={() => {
                    if (val.trim()) {
                        onAdd(val);
                        setVal('');
                    }
                }}
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
}

interface PropertiesPanelProps {
    field: FormField | null;
    onChange: (fieldId: string, updates: Partial<FormField>) => void;
    onDelete: (fieldId: string) => void;
    onSave: () => void;
    onPreview: () => void;
    // Service Selection Props
    services?: { id: number; service_name: string }[];
    selectedServiceId?: number | null;
    onServiceChange?: (serviceId: number) => void;
    serviceError?: boolean;
    onCreateService?: () => void;
    
    // Collection Props
    collections?: { id: number; collection_name: string | null }[];
    collectionItems?: { id: number; collection_item: string | null; collection_id: number | null }[];
    onCreateCollection?: (name: string) => void;
    onAddCollectionItem?: (collectionId: number, itemValue: string) => void;
    onDeleteCollectionItem?: (itemId: number) => void;
}

export default function PropertiesPanel({ 
    field, 
    onChange, 
    onDelete, 
    onSave, 
    onPreview,
    services,
    selectedServiceId,
    onServiceChange,
    serviceError,
    onCreateService,
    collections,
    collectionItems,
    onCreateCollection,
    onAddCollectionItem,
    onDeleteCollectionItem
}: PropertiesPanelProps) {
    const serviceSelectRef = React.useRef<HTMLSelectElement>(null);

    React.useEffect(() => {
        if (serviceError && serviceSelectRef.current) {
            serviceSelectRef.current.focus();
        }
    }, [serviceError]);

    if (!field) {
        return (
            <aside className="hidden lg:block w-80 border-l border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 p-4 lg:p-6 overflow-y-auto flex flex-col rounded-l-lg">
                <div className="mb-6 space-y-2">
                    <Button 
                        onClick={onSave} 
                        className="w-full gap-2 text-white hover:bg-[#9A6E35]"
                        style={{ backgroundColor: '#B4813F' }}
                    >
                        <Save className="h-4 w-4" />
                        <span>Save Form</span>
                    </Button>
                    <Button 
                        onClick={onPreview} 
                        variant="outline"
                        className="w-full gap-2 border-[#B4813F] text-[#B4813F] hover:bg-[#B4813F]/10"
                    >
                        <Eye className="h-4 w-4" />
                        <span>Preview Form</span>
                    </Button>
                </div>

                <div className="mb-6 pb-6 border-b border-stone-200 dark:border-stone-700">
                    <h2 className="font-semibold mb-1 text-lg text-gray-900 dark:text-gray-100">Form Settings</h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                        General configuration for this form
                    </p>

                    <div className="space-y-3">
                        <Label htmlFor="service" className={cn("text-sm font-medium", serviceError ? "text-red-500" : "text-gray-900 dark:text-gray-100")}>
                           Form Service {serviceError && "(Required)"}
                        </Label>
                        <div className="space-y-2">
                            <select
                                id="service"
                                ref={serviceSelectRef}
                                value={selectedServiceId || ''}
                                onChange={(e) => onServiceChange?.(Number(e.target.value))}
                                className={cn(
                                    "flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-950 dark:ring-offset-stone-950 dark:placeholder:text-stone-400",
                                    serviceError 
                                        ? "border-red-500 focus:ring-red-500 text-red-900 dark:text-red-100" 
                                        : "border-stone-200 dark:border-stone-800 focus:ring-stone-950 dark:focus:ring-stone-300"
                                )}
                            >
                                <option value="">Select a Service...</option>
                                {services?.map(service => (
                                    <option key={service.id} value={service.id}>
                                        {service.service_name}
                                    </option>
                                ))}
                            </select>
                            
                            <Button 
                                onClick={onCreateService}
                                variant="outline" 
                                size="sm" 
                                className="w-full h-8 text-xs border-dashed"
                            >
                                + Create New Service
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <h2 className="font-semibold mb-1 text-lg text-gray-900 dark:text-gray-100">Properties</h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Field configuration
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center h-48 text-center text-gray-600 dark:text-gray-400 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-dashed border-stone-300 dark:border-stone-700">
                    <p className="text-sm">Select a field to configure its properties.</p>
                </div>
            </aside>
        );
    }

    return (
        <aside className="hidden lg:flex w-80 border-l border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 p-4 lg:p-6 overflow-y-auto h-full flex-col rounded-l-lg">
            <div className="mb-6 space-y-2">
                <Button 
                    onClick={onSave} 
                    className="w-full gap-2 text-white hover:bg-[#9A6E35]"
                    style={{ backgroundColor: '#B4813F' }}
                >
                    <Save className="h-4 w-4" />
                    <span>Save Form</span>
                </Button>
                <Button 
                    onClick={onPreview} 
                    variant="outline"
                    className="w-full gap-2 border-[#B4813F] text-[#B4813F] hover:bg-[#B4813F]/10"
                >
                    <Eye className="h-4 w-4" />
                    <span>Preview Form</span>
                </Button>
            </div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200 dark:border-stone-700">
                <div>
                    <h2 className="font-semibold mb-1 text-lg text-gray-900 dark:text-gray-100">Properties</h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Field configuration
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                    onClick={() => onDelete(field.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="space-y-6 flex-1">
                <div className="space-y-2">
                    <Label htmlFor="label" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {field.type === 'group' ? 'Group Name' : 'Field Label'}
                    </Label>
                    <Input
                        id="label"
                        value={field.label}
                        onChange={(e) => onChange(field.id, { label: e.target.value })}
                        placeholder={field.type === 'group' ? "Enter group name" : "Enter field label"}
                        className="bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 rounded-md"
                    />
                </div>

                {field.type !== 'checkbox' && field.type !== 'group' && (
                    <div className="space-y-2">
                        <Label htmlFor="placeholder" className="text-sm font-medium text-gray-900 dark:text-gray-100">Placeholder</Label>
                        <Input
                            id="placeholder"
                            value={field.placeholder || ''}
                            onChange={(e) => onChange(field.id, { placeholder: e.target.value })}
                            placeholder="Enter placeholder text"
                            className="bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 rounded-md"
                        />
                    </div>
                )}

                {field.type !== 'group' && (
                    <div className="flex items-center justify-between p-4 border border-stone-200 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800/50">
                        <Label htmlFor="required" className="cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-100">Required Field</Label>
                        <Switch
                            id="required"
                            checked={field.required}
                            onCheckedChange={(checked) => onChange(field.id, { required: checked })}
                        />
                    </div>
                )}

                {(field.type === 'text' || field.type === 'number') && (
                    <div className="space-y-2">
                        <Label htmlFor="regex" className="text-sm font-medium text-gray-900 dark:text-gray-100">Regex Pattern</Label>
                        <Input
                            id="regex"
                            value={field.regex || ''}
                            onChange={(e) => onChange(field.id, { regex: e.target.value })}
                            placeholder="e.g. ^[A-Za-z]+$"
                            className="bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 rounded-md font-mono text-xs"
                        />
                        <p className="text-[10px] text-gray-500">Regular expression for validation</p>
                    </div>
                )}

                {(field.type === 'select' || field.type === 'checkbox') && (
                    <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-700">
                        <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            FIELD OPTIONS (COLLECTION)
                        </Label>
                        <div className="space-y-2">
                            <Label htmlFor="collection" className="text-xs text-gray-500">Source Collection</Label>
                            <select
                                id="collection"
                                value={field.collectionId || ''}
                                onChange={(e) => onChange(field.id, { collectionId: Number(e.target.value) || undefined })}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-800 dark:bg-stone-950 dark:ring-offset-stone-950 dark:placeholder:text-stone-400 dark:focus:ring-stone-300"
                            >
                                <option value="">Select a Collection...</option>
                                {collections?.map(col => (
                                    <option key={col.id} value={col.id}>
                                        {col.collection_name}
                                    </option>
                                ))}
                            </select>
                            
                           <AddCollectionDialog onCreate={onCreateCollection} />
                        </div>

                        {field.collectionId && (
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500">Collection Items</Label>
                                <div className="space-y-2">
                                    {collectionItems?.filter(item => item.collection_id === field.collectionId).map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-2 bg-stone-50 dark:bg-stone-800/50 rounded-md border border-stone-200 dark:border-stone-700">
                                            <span className="text-sm">{item.collection_item}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-red-500 hover:text-red-700"
                                                onClick={() => onDeleteCollectionItem?.(item.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                    
                                    <AddItemInput 
                                        onAdd={(value) => onAddCollectionItem?.(field.collectionId!, value)} 
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )} 

                {/* Column Width Control */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Field Width</Label>
                    <div className="grid grid-cols-4 gap-2">
                        <TooltipProvider>
                        {[12, 6, 4, 3].map((span) => {
                            const percentage = Math.round((span / 12) * 100);
                            const isSelected = (field.columnSpan || 12) === span;
                            const label = span === 12 ? "Full width" : span === 6 ? "Half width" : span === 4 ? "One third" : "One quarter";
                            return (
                                <Tooltip key={span}>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={() => onChange(field.id, { columnSpan: span })}
                                            className={cn(
                                                "p-2.5 text-xs font-medium border rounded-md transition-all",
                                                isSelected
                                                    ? "text-white border-[#B4813F] font-semibold"
                                                    : "bg-white dark:bg-stone-800 text-gray-700 dark:text-gray-300 hover:bg-stone-100 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700"
                                            )}
                                            style={isSelected ? { backgroundColor: '#B4813F' } : undefined}
                                        >
                                            {percentage}%
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{label} ({12/span} columns)</p>
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                        </TooltipProvider>
                    </div>
                </div>

                {/* Type-specific settings could go here */}
                <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">Field ID</p>
                    <code className="text-xs bg-stone-100 dark:bg-stone-800 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md block w-full overflow-hidden text-ellipsis border border-stone-200 dark:border-stone-700">
                        {field.id}
                    </code>
                </div>
            </div>
        </aside>
    );
}
