'use client'

import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSubmission } from '@/hooks/Submissions'
import { useForm } from '@/hooks/Forms'
import { useFields } from '@/hooks/Fields'
import { useDataTypes } from '@/hooks/DataTypes'
import { useCollectionItems } from '@/hooks/CollectionItems'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { ReservedNameValidationDialog } from '@/components/dialogs/ReservedNameValidationDialog'

export default function SubmissionDetailPage() {
    const params = useParams()
    const submissionId = params?.submissionId ? Number(params.submissionId) : null

    const { data: submission, isLoading: submissionLoading, error: submissionError } = useSubmission(submissionId || 0)
    const { data: form, isLoading: formLoading } = useForm(submission?.form_id || 0)
    const { data: fields, isLoading: fieldsLoading } = useFields()
    const { data: dataTypes, isLoading: dataTypesLoading } = useDataTypes()
    const { data: collectionItems, isLoading: collectionItemsLoading } = useCollectionItems()

    const isLoading = submissionLoading || formLoading || fieldsLoading || dataTypesLoading || collectionItemsLoading

    // Create maps for quick lookup
    const fieldsMap = useMemo(() => {
        return fields?.reduce((acc, field) => {
            acc[field.id] = field
            return acc
        }, {} as Record<number, typeof fields[0]>) || {}
    }, [fields])

    const dataTypesMap = useMemo(() => {
        return dataTypes?.reduce((acc, dt) => {
            acc[dt.id] = dt
            return acc
        }, {} as Record<number, typeof dataTypes[0]>) || {}
    }, [dataTypes])

    const collectionItemsMap = useMemo(() => {
        return collectionItems?.reduce((acc, ci) => {
            acc[ci.id] = ci
            return acc
        }, {} as Record<number, typeof collectionItems[0]>) || {}
    }, [collectionItems])

    console.log(submission)

    // Match form fields with their answers
    const formFieldsWithAnswers = useMemo(() => {
        if (!submission?.formFields || !submission?.formAnswers) return []

        return submission.formFields
            .map((formField) => {
                const field = fieldsMap[formField.field_id]
                const answer = submission.formAnswers?.find(
                    (fa) => fa.form_field_id === formField.id
                )

                let displayAnswer = answer?.answer || null

                // Resolve dropdown and radio answers to meaningful values
                if (displayAnswer && field) {
                    const dataType = dataTypesMap[field.data_type_id]
                    if ((dataType?.data_type === 'Dropdown' || dataType?.data_type === 'Radio') && field.collection_id) {
                        const collectionItemId = parseInt(displayAnswer)
                        const collectionItem = collectionItemsMap[collectionItemId]
                        if (collectionItem) {
                            displayAnswer = collectionItem.collection_item || displayAnswer
                        }
                    }
                }

                return {
                    formField,
                    field,
                    answer: displayAnswer,
                }
            })
            .filter(item => item.answer !== null && item.answer !== '')
    }, [submission, fieldsMap, dataTypesMap, collectionItemsMap])

    if (!submissionId) {
        return (
            <AppLayout>
                <div className="min-h-screen pt-24 pl-2 pr-4 pb-6">
                    <div className="max-w-7xl mx-auto">
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-red-600">Invalid submission ID.</p>
                                <Link href="/submissions" className="text-sm text-[#B4813F] mt-4 inline-block">
                                    ← Back to Cases
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        )
    }

    if (submissionError) {
        return (
            <AppLayout>
                <div className="min-h-screen pt-24 pl-2 pr-4 pb-6">
                    <div className="max-w-7xl mx-auto">
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-red-600">Error loading case. Please try again later.</p>
                                <Link href="/submissions" className="text-sm text-[#B4813F] mt-4 inline-block">
                                    ← Back to Cases
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="min-h-screen pt-24 pl-2 pr-4 pb-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    <Link
                        href="/submissions"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-[#B4813F] transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Cases
                    </Link>

                    {/* Submission Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">
                                Case {submission?.case_number || ''}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-gray-600 dark:text-gray-400" />
                                </div>
                            ) : submission ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Form
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100 mt-1">
                                            {form ? (
                                                <>
                                                    <span className="font-medium">{form.form_name}</span>
                                                    {form.description && (
                                                        <span className="text-sm text-gray-600 dark:text-gray-400 block mt-1">
                                                            {form.description}
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    Form ID: {submission.form_id}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 dark:text-gray-400">Case not found.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Form Answers Card */}
                    {submission && formFieldsWithAnswers.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Form Responses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {formFieldsWithAnswers.map(({ formField, field, answer }) => (
                                        <div
                                            key={formField.id}
                                            className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0"
                                        >
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {field?.label || `Field ID: ${formField.field_id}`}
                                                        {formField.validation?.includes('required') && (
                                                            <span className="text-red-500 ml-1">*</span>
                                                        )}
                                                    </label>
                                                    {formField.validation === 'validate_reserved_name' && answer && (
                                                        <ReservedNameValidationDialog
                                                            currentName={answer}
                                                            trigger={
                                                                <button className="text-xs text-[#B4813F] hover:text-[#9e6d31] font-medium underline">
                                                                    Validate Name
                                                                </button>
                                                            }
                                                        />
                                                    )}
                                                </div>
                                                <div className="mt-1">
                                                    {answer ? (
                                                        <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700">
                                                            {answer}
                                                        </p>
                                                    ) : (
                                                        <p className="text-gray-400 dark:text-gray-500 italic bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700">
                                                            No answer provided
                                                        </p>
                                                    )}
                                                </div>
                                                {/* {field && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Type ID: {field.data_type_id}
                                                    </p>
                                                )} */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Empty State for Form Answers */}
                    {submission && (!submission.formFields || submission.formFields.length === 0) && !isLoading && (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center py-8">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        No form fields found for this case.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}