'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { ArrowUpDown, Eye, Calendar, FileText } from 'lucide-react'
import mockData from '@/data/mock-data.json'
import type { Submissions, Forms, FormAnswers } from '@/types'

interface SubmissionWithDetails extends Submissions {
    form?: Forms
    answerCount?: number
    submittedAt?: string
}

const columnHelper = createColumnHelper<SubmissionWithDetails>()

export default function SubmittedServicesPage() {
    const router = useRouter()
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const allSubmissions = (mockData.submissions as Submissions[]) || []
    const allForms = (mockData.forms as Forms[]) || []
    const allAnswers = (mockData.formAnswers as FormAnswers[]) || []

    const submissions: SubmissionWithDetails[] = useMemo(() => {
        return allSubmissions
            .filter((sub) => !sub.deletedBy)
            .map((sub) => {
                const form = allForms.find((f) => f.id === sub.formId)
                const answerCount = allAnswers.filter((a) => a.submissionId === sub.id).length
                const submittedAt = answerCount > 0 
                    ? new Date().toISOString()
                    : undefined

                return {
                    ...sub,
                    form,
                    answerCount,
                    submittedAt,
                }
            })
            .sort((a, b) => {
                // Sort by most recent first
                if (a.submittedAt && b.submittedAt) {
                    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
                }
                return b.id - a.id
            })
    }, [allSubmissions, allForms, allAnswers])

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
                            <div className="font-medium">{form?.title || 'Unknown Service'}</div>
                            <div className="text-xs text-muted-foreground">
                                {form?.description || 'No description'}
                            </div>
                        </div>
                    )
                },
            }),
            columnHelper.accessor('answerCount', {
                header: 'Answers',
                cell: (info) => {
                    const count = info.getValue() || 0
                    return (
                        <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span>{count} answer{count !== 1 ? 's' : ''}</span>
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
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <div>{dateObj.toLocaleDateString()}</div>
                                <div className="text-xs text-muted-foreground">
                                    {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
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

    // Statistics
    const totalSubmissions = submissions.length
    const uniqueServices = new Set(submissions.map((s) => s.formId)).size
    const totalAnswers = submissions.reduce((sum, s) => sum + (s.answerCount || 0), 0)

    return (
        <AppLayout>
            <div className="container mx-auto py-8 px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">All Submissions</h1>
                        <p className="text-muted-foreground text-lg mt-2">
                            View and manage all service submissions across all services
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Submissions</CardDescription>
                            <CardTitle className="text-2xl">{totalSubmissions}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Services</CardDescription>
                            <CardTitle className="text-2xl">{uniqueServices}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Answers</CardDescription>
                            <CardTitle className="text-2xl">{totalAnswers}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Submissions</CardTitle>
                        <CardDescription>
                            {totalSubmissions} submission{totalSubmissions !== 1 ? 's' : ''} across {uniqueServices} service{uniqueServices !== 1 ? 's' : ''}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {submissions.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                                <p className="text-muted-foreground mb-4">
                                    No submissions found yet.
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