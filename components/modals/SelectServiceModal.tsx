'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useServices } from '@/hooks/Services'
import { useFormsByService } from '@/hooks/Forms'
import { useFormFieldsByForm } from '@/hooks/FormFields'
import { useFields } from '@/hooks/Fields'
import { useCollectionItems } from '@/hooks/CollectionItems'
import { useCreateSubmission } from '@/hooks/Submissions'
import { useCheckReservedName } from '@/hooks/ReservedNames'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface SelectServiceModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SelectServiceModal({ open, onOpenChange }: SelectServiceModalProps) {
    const [serviceId, setServiceId] = useState('')
    const [formData, setFormData] = useState<Record<number, string>>({})
    const [reservedNameErrors, setReservedNameErrors] = useState<Record<number, string>>({})
    const [checkingFields, setCheckingFields] = useState<Record<number, boolean>>({})
    const validationTimerRef = useRef<Record<number, NodeJS.Timeout>>({})

    const { data: services = [] } = useServices()
    const { data: forms = [] } = useFormsByService(serviceId ? Number(serviceId) : undefined)
    const selectedForm = forms[0]
    const { data: formFields = [] } = useFormFieldsByForm(selectedForm?.id)
    const { data: fields = [] } = useFields()
    const { data: collectionItems = [] } = useCollectionItems()
    const createSubmission = useCreateSubmission()
    const { mutate: checkName } = useCheckReservedName()

    const resetModal = () => {
        setServiceId('')
        setFormData({})
        setReservedNameErrors({})
        setCheckingFields({})
        // Clear all timers
        Object.values(validationTimerRef.current).forEach(timer => clearTimeout(timer))
        validationTimerRef.current = {}
    }

    const handleSubmit = async () => {
        if (Object.keys(reservedNameErrors).length > 0) {
            toast.error('Please fix the validation errors before submitting.')
            return
        }

        try {
            const formAnswers = Object.entries(formData)
                .filter(([_, value]) => value)
                .map(([fieldId, value]) => ({
                    form_field_id: Number(fieldId),
                    answer: value
                }))

            await createSubmission.mutateAsync({
                services_id: Number(serviceId),
                form_id: selectedForm?.id,
                created_by: 1,
                formAnswers
            })

            toast.success('Case created successfully!')
            onOpenChange(false)
            resetModal()
        } catch (error) {
            toast.error('Failed to create case. Please try again.')
        }
    }

    const validateReservedName = (fieldId: number, name: string) => {
        if (validationTimerRef.current[fieldId]) {
            clearTimeout(validationTimerRef.current[fieldId])
        }

        if (!name) {
            setReservedNameErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[fieldId]
                return newErrors
            })
            setCheckingFields(prev => ({ ...prev, [fieldId]: false }))
            return
        }

        setCheckingFields(prev => ({ ...prev, [fieldId]: true }))
        setReservedNameErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors[fieldId]
            return newErrors
        })

        validationTimerRef.current[fieldId] = setTimeout(() => {
            checkName({ name }, {
                onSuccess: (data) => {
                    setCheckingFields(prev => ({ ...prev, [fieldId]: false }))
                    if (data && data.length > 0) {
                        setReservedNameErrors(prev => ({ ...prev, [fieldId]: 'Name is unavailable' }))
                    } else {
                        setReservedNameErrors(prev => {
                            const newErrors = { ...prev }
                            delete newErrors[fieldId]
                            return newErrors
                        })
                    }
                },
                onError: () => {
                    setCheckingFields(prev => ({ ...prev, [fieldId]: false }))
                }
            })
        }, 500)
    }

    const renderField = (formField: any) => {
        const field = fields.find(f => f.id === formField.field_id)
        if (!field) return null

        const columnSpan = formField.field_span || 12
        const colSpanClass: Record<number, string> = {
            12: "col-span-12",
            6: "col-span-12 md:col-span-6",
            4: "col-span-12 md:col-span-4",
            3: "col-span-12 md:col-span-3",
        }
        const spanClass = colSpanClass[columnSpan] || "col-span-12"

        const fieldOptions = field.collection_id
            ? collectionItems.filter(item => item.collection_id === field.collection_id)
            : []

        const isChecking = checkingFields[formField.id]
        const error = reservedNameErrors[formField.id]

        return (
            <div key={formField.id} className={spanClass}>
                <div className="space-y-2">
                    <Label className={cn(
                        "flex items-center gap-2",
                        formField.validation === 'validate_reserved_name' && error ? "text-red-500" : ""
                    )}>
                        {formField.field_name || field.label}
                        {formField.validation === 'validate_reserved_name' && isChecking && (
                            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                        )}
                    </Label>

                    {field.data_type_id === 1 && (
                        <div>
                            <Input
                                value={formData[formField.id] || ''}
                                required={formField.is_required}
                                className={cn(
                                    formField.validation === 'validate_reserved_name' && error ? "border-red-500 focus-visible:ring-red-500" : ""
                                )}
                                onChange={(e) => {
                                    const value = e.target.value
                                    setFormData({ ...formData, [formField.id]: value })

                                    if (formField?.validation === 'validate_reserved_name') {
                                        validateReservedName(formField.id, value)
                                    }
                                }}
                            />
                            {formField.validation === 'validate_reserved_name' && error && (
                                <p className="text-xs text-red-500 mt-1">{error}</p>
                            )}
                        </div>
                    )}

                    {field.data_type_id === 2 && (
                        <Input
                            type="number"
                            value={formData[formField.id] || ''}
                            required={formField.is_required}
                            onChange={(e) => setFormData({ ...formData, [formField.id]: e.target.value })}
                        />
                    )}

                    {field.data_type_id === 3 && (
                        <Input
                            type="date"
                            value={formData[formField.id] || ''}
                            required={formField.is_required}
                            onChange={(e) => setFormData({ ...formData, [formField.id]: e.target.value })}
                        />
                    )}

                    {field.data_type_id === 5 && (
                        <Select
                            value={formData[formField.id] || ''}
                            required={formField.is_required}
                            onValueChange={(v) => setFormData({ ...formData, [formField.id]: v })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                {fieldOptions.map(opt => (
                                    <SelectItem key={opt.id} value={opt.collection_item || ''}>
                                        {opt.collection_item}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </div>
        )
    }

    return (
        <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) resetModal() }}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        {!serviceId ? 'Create Case' : selectedForm?.form_name || 'Form'}
                    </DialogTitle>
                </DialogHeader>

                {!serviceId ? (
                    <div className="space-y-6 py-4">
                        <div>
                            <Label>Select Service *</Label>
                            <Select value={serviceId} onValueChange={setServiceId}>
                                <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Choose a service" />
                                </SelectTrigger>
                                <SelectContent>
                                    {services.map(service => (
                                        <SelectItem key={service.id} value={String(service.id)}>
                                            {service.service_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {serviceId && selectedForm && (
                                <p className="text-sm text-gray-600 mt-2">Form: {selectedForm.form_name}</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        {formFields.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                Loading form fields...
                            </div>
                        ) : (
                            <div className="grid grid-cols-12 gap-4">
                                {formFields.map(renderField)}
                            </div>
                        )}
                        <div className="flex gap-4 pt-4 border-t">
                            <Button
                                onClick={handleSubmit}
                                className="bg-[#8B6F47] hover:bg-[#6F5838]"
                                disabled={createSubmission.isPending || Object.keys(reservedNameErrors).length > 0}
                            >
                                {createSubmission.isPending ? 'Creating...' : 'Submit'}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
