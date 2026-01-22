'use client'

import { useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Calendar, User, FileText, CheckCircle2, Clock, XCircle } from 'lucide-react'
import mockData from '@/data/mock-data.json'
import type { Submissions, Forms, FormAnswers, Questions } from '@/types'

interface SubmissionWithDetails extends Submissions {
    form?: Forms
    answers?: Array<FormAnswers & { question?: Questions }>
    submittedAt?: string
}

export default function SubmittedServiceDetailsPage() {
    const router = useRouter()
    const params = useParams()
    const serviceId = params?.serviceId as string
    const submissionId = params?.submissionId as string

    const formId = serviceId ? parseInt(serviceId, 10) : null
    const subId = submissionId ? parseInt(submissionId, 10) : null

    const submission: SubmissionWithDetails | null = useMemo(() => {
        if (!formId || !subId) return null

        const allSubmissions = (mockData.submissions as Submissions[]) || []
        const allForms = (mockData.forms as Forms[]) || []
        const allAnswers = (mockData.formAnswers as FormAnswers[]) || []
        const allQuestions = (mockData.questions as Questions[]) || []

        const sub = allSubmissions.find((s) => s.id === subId && s.formId === formId && !s.deletedBy)
        if (!sub) return null

        const form = allForms.find((f) => f.id === sub.formId)
        const answers = allAnswers
            .filter((a) => a.submissionId === sub.id)
            .map((answer) => ({
                ...answer,
                question: allQuestions.find((q) => q.id === answer.questionId),
            }))
            .sort((a, b) => (a.questionId || 0) - (b.questionId || 0))

        const submittedAt = answers.length > 0 
            ? new Date().toISOString()
            : undefined

        return {
            ...sub,
            form,
            answers,
            submittedAt,
        }
    }, [formId, subId])

    if (!formId || !subId) {
        return (
            <AppLayout>
                <div className="container mx-auto py-8 px-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-12">
                                <p className="text-muted-foreground mb-4">Invalid submission ID</p>
                                <Button onClick={() => router.push('/')} variant="outline">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Go Back
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        )
    }

    if (!submission) {
        return (
            <AppLayout>
                <div className="container mx-auto py-8 px-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-12">
                                <p className="text-muted-foreground mb-4">Submission not found</p>
                                <Button onClick={() => router.push(`/services/submissions/${formId}`)} variant="outline">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Submissions
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        )
    }

    const submittedDate = submission.submittedAt ? new Date(submission.submittedAt) : null

    return (
        <AppLayout>
            <div className="container mx-auto py-8 px-4 max-w-4xl">
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/services/submissions/${formId}`)}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Submissions
                    </Button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">
                                Submission #{submission.id}
                            </h1>
                            <p className="text-muted-foreground text-lg mt-2">
                                {submission.form?.title || 'Service Submission'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Submission Information</CardTitle>
                            <CardDescription>Details about this submission</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-muted-foreground">Submission ID</div>
                                    <div className="text-lg font-semibold">#{submission.id}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-muted-foreground">Service</div>
                                    <div className="text-lg">{submission.form?.title || 'Unknown'}</div>
                                </div>
                                {submittedDate && (
                                    <div className="space-y-1">
                                        <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Submitted Date
                                        </div>
                                        <div className="text-lg">
                                            {submittedDate.toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {submittedDate.toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-muted-foreground">Status</div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        <span className="text-lg">Submitted</span>
                                    </div>
                                </div>
                            </div>
                            {submission.form?.description && (
                                <div className="pt-4 border-t">
                                    <div className="text-sm font-medium text-muted-foreground mb-2">Service Description</div>
                                    <p className="text-sm">{submission.form.description}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Submission Answers
                            </CardTitle>
                            <CardDescription>
                                {submission.answers?.length || 0} answer{(submission.answers?.length || 0) !== 1 ? 's' : ''} provided
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {submission.answers && submission.answers.length > 0 ? (
                                <div className="space-y-4">
                                    {submission.answers.map((answer, index) => (
                                        <div
                                            key={answer.id}
                                            className="border rounded-lg p-4 space-y-2"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-muted-foreground mb-1">
                                                        {answer.question?.label || `Question ${answer.questionId}`}
                                                    </div>
                                                    <div className="text-base">
                                                        {typeof answer.answer === 'object'
                                                            ? JSON.stringify(answer.answer, null, 2)
                                                            : String(answer.answer || 'No answer provided')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No answers found for this submission</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Metadata</CardTitle>
                            <CardDescription>Additional information about this submission</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-muted-foreground">Created By</div>
                                    <div className="text-sm">User ID: {submission.createdBy}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-muted-foreground">Last Updated By</div>
                                    <div className="text-sm">User ID: {submission.updatedBy}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-muted-foreground">Form ID</div>
                                    <div className="text-sm">{submission.formId}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}