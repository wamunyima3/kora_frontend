
'use client'

import React from 'react';
import { FormField } from './types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

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
