'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface PublicFormPageProps {
    formId: string
}

// Mock form data
const mockForm = {
    id: 1,
    title: 'Name Clearance Application',
    description: 'Apply for business name clearance',
    fields: [
        { id: 1, label: 'Business Name', data_type: 'text', required: true },
        { id: 2, label: 'Applicant Full Name', data_type: 'text', required: true },
        { id: 3, label: 'Email Address', data_type: 'email', required: true },
        { id: 4, label: 'Phone Number', data_type: 'tel', required: true },
        { id: 5, label: 'Business Type', data_type: 'text', required: false },
    ]
}

export default function PublicFormPage({ formId }: PublicFormPageProps) {
    const router = useRouter()
    const [formData, setFormData] = useState<Record<number, string>>({})
    const [errors, setErrors] = useState<Record<number, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Validate required fields
        const newErrors: Record<number, string> = {}
        mockForm.fields.forEach(field => {
            if (field.required && !formData[field.id]) {
                newErrors[field.id] = `${field.label} is required`
            }
        })

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            toast.error('Please fill in all required fields')
            return
        }

        setIsSubmitting(true)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const submissionId = Math.floor(Math.random() * 1000) + 1
        
        toast.success('Form submitted successfully!')
        router.push(`/public/payment/${submissionId}`)
    }

    const handleChange = (fieldId: number, value: string) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }))
        if (errors[fieldId]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[fieldId]
                return newErrors
            })
        }
    }

    return (
        <div className="min-h-screen bg-stone-100 dark:bg-stone-950 pt-24 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">{mockForm.title}</CardTitle>
                        {mockForm.description && (
                            <p className="text-muted-foreground">{mockForm.description}</p>
                        )}
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {mockForm.fields.map(field => (
                                <div key={field.id} className="space-y-2">
                                    <Label htmlFor={`field-${field.id}`}>
                                        {field.label}
                                        {field.required && <span className="text-red-500 ml-1">*</span>}
                                    </Label>
                                    <Input
                                        id={`field-${field.id}`}
                                        type={field.data_type}
                                        value={formData[field.id] || ''}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        required={field.required}
                                        aria-required={field.required}
                                        aria-invalid={!!errors[field.id]}
                                        aria-describedby={errors[field.id] ? `error-${field.id}` : undefined}
                                    />
                                    {errors[field.id] && (
                                        <p id={`error-${field.id}`} className="text-sm text-red-500" role="alert">
                                            {errors[field.id]}
                                        </p>
                                    )}
                                </div>
                            ))}

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
