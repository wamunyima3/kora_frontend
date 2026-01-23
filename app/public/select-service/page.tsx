'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/layout/AppLayout'
import { useServices } from '@/hooks/Services'
import { useFormsByService } from '@/hooks/Forms'

export default function SelectServicePage() {
    const router = useRouter()
    const [serviceId, setServiceId] = useState('')
    const [formId, setFormId] = useState('')
    const { data: services = [], isLoading: servicesLoading } = useServices()
    const { data: forms = [] } = useFormsByService(serviceId ? Number(serviceId) : undefined)

    const handleNext = () => {
        if (!serviceId || !formId) return
        router.push(`/public/service/${serviceId}/forms/${formId}`)
    }

    return (
        <AppLayout>
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Create Case</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Label>Select Service</Label>
                            <Select value={serviceId} onValueChange={(v) => { setServiceId(v); setFormId(''); }}>
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
                        </div>

                        <div>
                            <Label>Select Form</Label>
                            <Select value={formId} onValueChange={setFormId} disabled={!serviceId}>
                                <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Choose a form" />
                                </SelectTrigger>
                                <SelectContent>
                                    {forms.map(form => (
                                        <SelectItem key={form.id} value={String(form.id)}>
                                            {form.form_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button 
                            onClick={handleNext} 
                            disabled={!serviceId || !formId}
                            className="w-full bg-[#8B6F47] hover:bg-[#6F5838]"
                        >
                            Next
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
