'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/layout/AppLayout'

export default function SelectServicePage() {
    const router = useRouter()
    const [service, setService] = useState('')
    const [form, setForm] = useState('')

    const handleNext = () => {
        if (!service || !form) return
        const servicePath = service.toLowerCase().replace(/\s+/g, '-')
        router.push(`/public/service/${servicePath}/forms/${form}`)
    }

    return (
        <AppLayout>
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Create Submission</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Label>Select Service</Label>
                            <Select value={service} onValueChange={setService}>
                                <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Choose a service" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Name Clearance">Name Clearance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Select Form</Label>
                            <Select value={form} onValueChange={setForm}>
                                <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Choose a form" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="form-3">Form 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button 
                            onClick={handleNext} 
                            disabled={!service || !form}
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
