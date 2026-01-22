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
import { Plus, ArrowUpDown, Eye, CheckCircle2, XCircle, Clock } from 'lucide-react'
import mockData from '@/data/mock-data.json'

interface NameRegistration {
    id: number
    name: string
    applicantName: string
    applicantEmail: string
    applicantPhone: string
    status: 'pending' | 'approved' | 'rejected'
    submittedAt: string
    reviewedAt: string | null
    approvedAt: string | null
}

const columnHelper = createColumnHelper<NameRegistration>()

const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
    switch (status) {
        case 'approved':
            return (
                <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`}>
                    <CheckCircle2 className="h-3 w-3" />
                    Approved
                </span>
            )
        case 'rejected':
            return (
                <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`}>
                    <XCircle className="h-3 w-3" />
                    Rejected
                </span>
            )
        case 'pending':
            return (
                <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`}>
                    <Clock className="h-3 w-3" />
                    Pending
                </span>
            )
        default:
            return <span className={baseClasses}>{status}</span>
    }
}

export default function NameRegistrationPage() {
    const router = useRouter()
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    
    const registrations = mockData.nameRegistrations as NameRegistration[]

    const columns = useMemo(
        () => [
            columnHelper.accessor('name', {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="h-8 px-2 -ml-3"
                    >
                        Company Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: (info) => (
                    <div className="font-medium">{info.getValue()}</div>
                ),
            }),
            columnHelper.accessor('applicantName', {
                header: 'Applicant',
                cell: (info) => (
                    <div className="text-sm">{info.getValue()}</div>
                ),
            }),
            columnHelper.accessor('applicantEmail', {
                header: 'Email',
                cell: (info) => (
                    <div className="text-sm text-muted-foreground">{info.getValue()}</div>
                ),
            }),
            columnHelper.accessor('status', {
                header: 'Status',
                cell: (info) => getStatusBadge(info.getValue()),
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
                    const date = new Date(info.getValue())
                    return (
                        <div className="text-sm text-muted-foreground">
                            {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                            // View details
                            console.log('View registration:', info.row.original)
                        }}
                        className="h-8"
                    >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                    </Button>
                ),
            }),
        ],
        []
    )

    const table = useReactTable({
        data: registrations,
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

    return (
        <AppLayout>
            <div className="container mx-auto py-8 px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Name Registration</h1>
                        <p className="text-muted-foreground text-lg mt-2">
                            Manage company name registration applications
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            // Create new registration
                            console.log('Create new registration')
                        }}
                        size="lg"
                        className="gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        New Registration
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Registration Applications</CardTitle>
                        <CardDescription>
                            {registrations.length} application{registrations.length !== 1 ? 's' : ''} total
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
