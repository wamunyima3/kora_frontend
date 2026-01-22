'use client'

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updateSettings, FormSettings as FormSettingsType } from '@/lib/features/formBuilder/formSlice';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface FormSettingsProps {
  onClose: () => void;
}

export function FormSettings({ onClose }: FormSettingsProps) {
  const dispatch = useAppDispatch();
  const { settings } = useAppSelector((state) => state.forms);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleChange = (field: keyof FormSettingsType, value: string) => {
    setLocalSettings((prev: FormSettingsType) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    dispatch(updateSettings(localSettings));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Form Settings</CardTitle>
              <CardDescription>
                Configure the form title, description, and submission messages
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Form Title</Label>
            <Input
              id="title"
              value={localSettings.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter form title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Form Description</Label>
            <textarea
              id="description"
              value={localSettings.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter form description"
              rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="successMessage">Success Message</Label>
            <Input
              id="successMessage"
              value={localSettings.successMessage}
              onChange={(e) => handleChange('successMessage', e.target.value)}
              placeholder="Thank you! Your form has been submitted successfully."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="submitButtonText">Submit Button Text</Label>
            <Input
              id="submitButtonText"
              value={localSettings.submitButtonText}
              onChange={(e) => handleChange('submitButtonText', e.target.value)}
              placeholder="Submit"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
