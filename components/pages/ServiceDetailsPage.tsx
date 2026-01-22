'use client'

import { AppLayout } from '@/components/layout/AppLayout'
import Image from 'next/image'

interface ServiceDetailsPageProps {
    serviceId: string
}

const mockForm = {
    id: 1,
    formNumber: 'Form 3',
    regulation: 'Regulation 4',
    subtitle: '(In typescript and completed in duplicate)',
    title: 'THE PATENTS AND COMPANIES REGISTRATION AGENCY',
    fields: [
        { id: 1, label: 'Type of Company', type: 'select' as const },
    ]
}

export default function ServiceDetailsPage({ serviceId }: ServiceDetailsPageProps) {
    return (
        <AppLayout>
            <div className="flex h-full items-center justify-center p-8 bg-stone-200 dark:bg-stone-900">
                <div className="w-full max-w-3xl bg-white dark:bg-stone-800 rounded-lg shadow-lg p-12">
                    <div className="text-right text-sm mb-8">
                        <div>{mockForm.formNumber}</div>
                        <div>{mockForm.regulation}</div>
                        <div className="text-xs mt-1">{mockForm.subtitle}</div>
                    </div>

                    <div className="flex justify-center mb-8">
                        <Image
                            src="/pacra-logo.webp"
                            alt="PACRA"
                            width={80}
                            height={80}
                        />
                    </div>

                    <h1 className="text-center text-lg font-semibold mb-12">
                        {mockForm.title}
                    </h1>

                    <div className="space-y-6">
                        {mockForm.fields.map(field => (
                            <div key={field.id} className="flex items-center gap-4">
                                <label className="text-sm font-medium min-w-[150px]">
                                    {field.label}
                                </label>
                                <div className="flex-1 border-b border-stone-300 dark:border-stone-600 pb-1 flex items-center justify-end">
                                    <svg className="w-4 h-4 text-stone-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
