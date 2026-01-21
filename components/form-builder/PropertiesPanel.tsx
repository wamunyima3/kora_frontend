
'use client'

import React from 'react';
import { FormField } from './types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertiesPanelProps {
    field: FormField | null;
    onChange: (fieldId: string, updates: Partial<FormField>) => void;
    onDelete: (fieldId: string) => void;
}

export default function PropertiesPanel({ field, onChange, onDelete }: PropertiesPanelProps) {
    if (!field) {
        return (
            <aside className="hidden lg:block w-80 border-l bg-background p-4 lg:p-6 overflow-y-auto">
                <h2 className="font-semibold mb-4 text-sm uppercase text-muted-foreground">Properties</h2>
                <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground bg-muted/20 rounded-md border border-dashed">
                    <p className="text-sm">Select a field to configure its properties.</p>
                </div>
            </aside>
        );
    }

    return (
        <aside className="hidden lg:flex w-80 border-l bg-background p-4 lg:p-6 overflow-y-auto h-full flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-sm uppercase text-muted-foreground">Properties</h2>
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
                    <Label htmlFor="label">Field Label</Label>
                    <Input
                        id="label"
                        value={field.label}
                        onChange={(e) => onChange(field.id, { label: e.target.value })}
                        placeholder="Enter field label"
                    />
                </div>

                {field.type !== 'checkbox' && (
                    <div className="space-y-2">
                        <Label htmlFor="placeholder">Placeholder</Label>
                        <Input
                            id="placeholder"
                            value={field.placeholder || ''}
                            onChange={(e) => onChange(field.id, { placeholder: e.target.value })}
                            placeholder="Enter placeholder text"
                        />
                    </div>
                )}

                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/10">
                    <Label htmlFor="required" className="cursor-pointer">Required Field</Label>
                    <Switch
                        id="required"
                        checked={field.required}
                        onCheckedChange={(checked) => onChange(field.id, { required: checked })}
                    />
                </div>

                {/* Column Width Control */}
                <div className="space-y-2">
                    <Label>Field Width</Label>
                    <div className="grid grid-cols-4 gap-2">
                        {[12, 6, 4, 3].map((span) => {
                            const percentage = Math.round((span / 12) * 100);
                            return (
                                <button
                                    key={span}
                                    onClick={() => onChange(field.id, { columnSpan: span })}
                                    className={cn(
                                        "p-2 text-xs border rounded-md transition-all",
                                        (field.columnSpan || 12) === span
                                            ? "bg-primary text-primary-foreground border-primary font-semibold"
                                            : "bg-background hover:bg-accent border-border"
                                    )}
                                    title={`${percentage}% width`}
                                >
                                    {percentage}%
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {(field.columnSpan || 12) === 12 && "Full width"}
                        {(field.columnSpan || 12) === 6 && "Half width (2 columns)"}
                        {(field.columnSpan || 12) === 4 && "One third width (3 columns)"}
                        {(field.columnSpan || 12) === 3 && "One quarter width (4 columns)"}
                    </p>
                </div>

                {/* Type-specific settings could go here */}
                <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Field ID</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded block w-full overflow-hidden text-ellipsis">
                        {field.id}
                    </code>
                </div>
            </div>
        </aside>
    );
}
