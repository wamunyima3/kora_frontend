'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import FormBuilder from '@/components/form-builder/FormBuilder'
import { AppLayout } from '@/components/layout/AppLayout'

function ConfigureServiceContent() {
    const searchParams = useSearchParams()
    const formId = searchParams.get('id')
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return (
            <AppLayout showSidebar={true} showHeader={false}>
                <div className="flex items-center justify-center flex-1">
                    <div className="text-muted-foreground">Loading...</div>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout showSidebar={true} showHeader={false}>
            <FormBuilder formId={formId || undefined} />
        </AppLayout>
    )
}

export default function ConfigureServicePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        }>
            <ConfigureServiceContent />
        </Suspense>
    )
}
