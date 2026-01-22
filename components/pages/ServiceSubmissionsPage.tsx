'use client'

import { useMemo, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    createColumnHelper,
    type SortingState,
    type ColumnFiltersState,
} from '@tanstack/react-table'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpDown, Eye, ArrowLeft, Calendar, User } from 'lucide-react'
import mockData from '@/data/mock-data.json'
import type { Submissions, Forms, FormAnswers, Questions } from '@/types'

interface SubmissionWithDetails extends Submissions {
    form?: Forms
    answers?: Array<FormAnswers & { question?: Questions }>
    submittedAt?: string
}

const columnHelper = createColumnHelper<SubmissionWithDetails>()

export default function ServiceSubmissionsPage() {
    const router = useRouter()
    const params = useParams()
    const serviceId = params?.serviceId as string
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const formId = serviceId ? parseInt(serviceId, 10) : null

    // Get all submissions for this service
    const allSubmissions = (mockData.submissions as Submissions[]) || []
    const allForms = (mockData.forms as Forms[]) || []
    const allAnswers = (mockData.formAnswers as FormAnswers[]) || []
    const allQuestions = (mockData.questions as Questions[]) || []

    const submissions: SubmissionWithDetails[] = useMemo(() => {
        if (!formId) return []

        return allSubmissions
            .filter((sub) => sub.formId === formId && !sub.deletedBy)
            .map((sub) => {
                const form = allForms.find((f) => f.id === sub.formId)
                const answers = allAnswers
                    .filter((a) => a.submissionId === sub.id)
                    .map((answer) => ({
                        ...answer,
                        question: allQuestions.find((q) => q.id === answer.questionId),
                    }))

                // Get the first answer's timestamp as submittedAt (or use created date)
                const submittedAt = answers.length > 0 
                    ? new Date().toISOString() // In real app, this would come from the submission
                    : undefined

                return {
                    ...sub,
                    form,
                    answers,
                    submittedAt,
                }
            })
    }, [formId, allSubmissions, allForms, allAnswers, allQuestions])

    const columns = useMemo(
        () => [
            columnHelper.accessor('id', {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="h-8 px-2 -ml-3"
                    >
                        Submission ID
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: (info) => (
                    <div className="font-medium">#{info.getValue()}</div>
                ),
            }),
            columnHelper.accessor('form', {
                header: 'Service',
                cell: (info) => {
                    const form = info.getValue()
                    return (
                        <div>
                            <div className="font-medium">{form?.title || 'Unknown'}</div>
                            <div className="text-xs text-muted-foreground">{form?.description}</div>
                        </div>
                    )
                },
            }),
            columnHelper.accessor('answers', {
                header: 'Answers',
                cell: (info) => {
                    const answers = info.getValue() || []
                    return (
                        <div className="text-sm text-muted-foreground">
                            {answers.length} answer{answers.length !== 1 ? 's' : ''}
                        </div>
                    )
                },
            }),
            columnHelper.accessor('submittedAt', {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="h-8 px-2 -ml-3"
                    >
                        Submitted
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: (info) => {
                    const date = info.getValue()
                    if (!date) return <div className="text-sm text-muted-foreground">N/A</div>
                    const dateObj = new Date(date)
                    return (
                        <div className="text-sm">
                            <div>{dateObj.toLocaleDateString()}</div>
                            <div className="text-xs text-muted-foreground">
                                {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    )
                },
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Actions',
                cell: (info) => (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            router.push(`/services/submissions/${info.row.original.formId}/${info.row.original.id}`)
                        }}
                        className="h-8"
                    >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                    </Button>
                ),
            }),
        ],
        [router]
    )

    const table = useReactTable({
        data: submissions,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            columnFilters,
        },
    })

    const currentForm = allForms.find((f) => f.id === formId)

    if (!formId) {
        return (
            <AppLayout>
                <div className="container mx-auto py-8 px-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-12">
                                <p className="text-muted-foreground mb-4">Invalid service ID</p>
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

    return (
        <AppLayout>
            <div className="container mx-auto py-8 px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/services/details/1')}
                            className="mb-2"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Service
                        </Button>
                        <h1 className="text-4xl font-bold tracking-tight">
                            {currentForm?.title || 'Service'} Submissions
                        </h1>
                        <p className="text-muted-foreground text-lg mt-2">
                            View and manage all submissions for this service
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Submissions</CardDescription>
                            <CardTitle className="text-2xl">{submissions.length}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Service</CardDescription>
                            <CardTitle className="text-lg">{currentForm?.title || 'Unknown'}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Status</CardDescription>
                            <CardTitle className="text-lg">
                                {currentForm?.status === 1 ? 'Active' : 'Inactive'}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Submissions</CardTitle>
                        <CardDescription>
                            {submissions.length} submission{submissions.length !== 1 ? 's' : ''} total
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {submissions.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground mb-4">
                                    No submissions found for this service yet.
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <TableHead key={header.id}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableHeader>
                                    <TableBody>
                                        {table.getRowModel().rows.length ? (
                                            table.getRowModel().rows.map((row) => (
                                                <TableRow
                                                    key={row.id}
                                                    data-state={row.getIsSelected() && 'selected'}
                                                >
                                                    {row.getVisibleCells().map((cell) => (
                                                        <TableCell key={cell.id}>
                                                            {flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={columns.length}
                                                    className="h-24 text-center"
                                                >
                                                    No results.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}