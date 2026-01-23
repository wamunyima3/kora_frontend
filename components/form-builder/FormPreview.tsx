
import React from 'react';
import { FormField } from './types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useCollectionItemsByCollection } from '@/hooks';

interface FormPreviewProps {
    fields: FormField[];
    title?: string;
    description?: string;
    isOpen: boolean;
    onClose: () => void;
}

export function FormPreview({ fields, title, description, isOpen, onClose }: FormPreviewProps) {
    
// Helper component to render individual fields with data fetching
function FieldRenderer({ field }: { field: FormField }) {
    const { data: options } = useCollectionItemsByCollection(field.collectionId || null);
    
    const columnSpan = field.columnSpan || 12;
    const colSpanClass = {
        12: "col-span-12",
        6: "col-span-12 md:col-span-6",
        4: "col-span-12 md:col-span-4",
        3: "col-span-12 md:col-span-3",
    }[columnSpan] || "col-span-12";

    if (field.type === 'group') {
        return (
            <div key={field.id} className={cn(colSpanClass, "space-y-4 p-4 border rounded-lg bg-stone-50/50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800")}>
                {field.label && (
                    <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-2">{field.label}</h3>
                )}
                <div className="grid grid-cols-12 gap-4">
                    {field.children?.map(child => <FieldRenderer key={child.id} field={child} />)}
                </div>
            </div>
        );
    }

    return (
        <div key={field.id} className={colSpanClass}>
            <div className="space-y-2">
                <Label className="text-stone-700 dark:text-stone-300">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>
                
                {field.type === 'text' && (
                    <Input placeholder={field.placeholder} />
                )}
                
                {field.type === 'number' && (
                    <Input type="number" placeholder={field.placeholder || "0"} />
                )}
                
                {field.type === 'date' && (
                    <Input type="date" />
                )}
                
                {field.type === 'checkbox' && (
                    <div className="space-y-2">
                        {options && options.length > 0 ? (
                            options.map(opt => (
                                <div key={opt.id} className="flex items-center space-x-2">
                                     <input 
                                        type="checkbox" 
                                        id={`opt-${opt.id}`}
                                        className="h-4 w-4 rounded border-stone-300 text-[#B4813F] focus:ring-[#B4813F]"
                                     />
                                     <label htmlFor={`opt-${opt.id}`} className="text-sm text-stone-600 dark:text-stone-400 cursor-pointer">
                                         {opt.collection_item}
                                     </label>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center space-x-2">
                                 <input 
                                    type="checkbox" 
                                    className="h-4 w-4 rounded border-stone-300 text-[#B4813F] focus:ring-[#B4813F]"
                                 />
                                 <span className="text-sm text-stone-600 dark:text-stone-400">
                                     {field.placeholder || "Checkbox option"}
                                 </span>
                            </div>
                        )}
                    </div>
                )}
                
                {field.type === 'select' && (
                    <select className="flex h-10 w-full items-center justify-between rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-800 dark:bg-stone-950 dark:ring-offset-stone-950 dark:placeholder:text-stone-400 dark:focus:ring-stone-300">
                        <option value="">Select an option</option>
                        {options?.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.collection_item}</option>
                        ))}
                    </select>
                )}
            </div>
        </div>
    );
}

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title || "Form Preview"}</DialogTitle>
                    {description && (
                        <DialogDescription>{description}</DialogDescription>
                    )}
                </DialogHeader>
                
                <div className="mt-6 space-y-8">
                    <div className="grid grid-cols-12 gap-6">
                        {fields.length === 0 ? (
                            <div className="col-span-12 py-12 text-center text-stone-500">
                                This form is empty. Add fields to preview them here.
                            </div>
                        ) : (
                            fields.map(field => <FieldRenderer key={field.id} field={field} />)
                        )}
                    </div>
                    
                    <div className="flex justify-end pt-6 border-t border-stone-100 dark:border-stone-800">
                        <Button className="bg-[#B4813F] hover:bg-[#9A6E35] text-white">
                            Submit Form
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
