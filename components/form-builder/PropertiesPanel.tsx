
'use client'

import React from 'react';
import { FormField } from './types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Trash2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertiesPanelProps {
    field: FormField | null;
    onChange: (fieldId: string, updates: Partial<FormField>) => void;
    onDelete: (fieldId: string) => void;
    onSave: () => void;
}

export default function PropertiesPanel({ field, onChange, onDelete, onSave }: PropertiesPanelProps) {
    if (!field) {
        return (
            <aside className="hidden lg:block w-80 border-l border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 p-4 lg:p-6 overflow-y-auto flex flex-col rounded-l-lg">
                <div className="mb-6">
                    <Button 
                        onClick={onSave} 
                        className="w-full gap-2"
                        style={{ backgroundColor: '#B4813F' }}
                    >
                        <Save className="h-4 w-4" />
                        <span>Save Form</span>
                    </Button>
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
            <div className="mb-6">
                <Button 
                    onClick={onSave} 
                    className="w-full gap-2"
                    style={{ backgroundColor: '#B4813F' }}
                >
                    <Save className="h-4 w-4" />
                    <span>Save Form</span>
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
                    <Label htmlFor="label" className="text-sm font-medium text-gray-900 dark:text-gray-100">Field Label</Label>
                    <Input
                        id="label"
                        value={field.label}
                        onChange={(e) => onChange(field.id, { label: e.target.value })}
                        placeholder="Enter field label"
                        className="bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 rounded-md"
                    />
                </div>

                {field.type !== 'checkbox' && (
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

                <div className="flex items-center justify-between p-4 border border-stone-200 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800/50">
                    <Label htmlFor="required" className="cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-100">Required Field</Label>
                    <Switch
                        id="required"
                        checked={field.required}
                        onCheckedChange={(checked) => onChange(field.id, { required: checked })}
                    />
                </div>

                {/* Column Width Control */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Field Width</Label>
                    <div className="grid grid-cols-4 gap-2">
                        {[12, 6, 4, 3].map((span) => {
                            const percentage = Math.round((span / 12) * 100);
                            const isSelected = (field.columnSpan || 12) === span;
                            return (
                                <button
                                    key={span}
                                    onClick={() => onChange(field.id, { columnSpan: span })}
                                    className={cn(
                                        "p-2.5 text-xs font-medium border rounded-md transition-all",
                                        isSelected
                                            ? "text-white border-[#B4813F] font-semibold"
                                            : "bg-white dark:bg-stone-800 text-gray-700 dark:text-gray-300 hover:bg-stone-100 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700"
                                    )}
                                    style={isSelected ? { backgroundColor: '#B4813F' } : undefined}
                                    title={`${percentage}% width`}
                                >
                                    {percentage}%
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        {(field.columnSpan || 12) === 12 && "Full width"}
                        {(field.columnSpan || 12) === 6 && "Half width (2 columns)"}
                        {(field.columnSpan || 12) === 4 && "One third width (3 columns)"}
                        {(field.columnSpan || 12) === 3 && "One quarter width (4 columns)"}
                    </p>
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
