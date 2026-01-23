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
// import mockData from '@/data/mock-data.json'

const mockData = [
    {
        id: 1,
        name: 'Company Name 1',
        applicantName: 'John Doe',
        applicantEmail: 'john.doe@example.com',
        applicantPhone: '1234567890',
        reservationDate: '2024-01-01',
        expiryDate: '2024-01-01',
        status: 'active',
        submittedAt: '2024-01-01',
    },
    {
        id: 2,
        name: 'Company Name 2',
        applicantName: 'Jane Doe',
        applicantEmail: 'jane.doe@example.com',
        applicantPhone: '1234567890',
        reservationDate: '2024-01-01',
        expiryDate: '2024-01-01',
        status: 'expired',
        submittedAt: '2024-01-01',
    },
]

interface NameReservation {
    id: number
    name: string
    applicantName: string
    applicantEmail: string
    applicantPhone: string
    reservationDate: string
    expiryDate: string
    status: 'active' | 'expired'
    submittedAt: string
}

const columnHelper = createColumnHelper<NameReservation>()

const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
    switch (status) {
        case 'active':
            return (
                <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`}>
                    <CheckCircle2 className="h-3 w-3" />
                    Active
                </span>
            )
        case 'expired':
            return (
                <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`}>
                    <XCircle className="h-3 w-3" />
                    Expired
                </span>
            )
        default:
            return <span className={baseClasses}>{status}</span>
    }
}

const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0
}

export default function ServiceDetailsPage() {
    const router = useRouter()
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const reservations = [] as NameReservation[]

    const columns = useMemo(
        () => [
            columnHelper.accessor('name', {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="h-8 px-2 -ml-3"
                    >
                        Reserved Name
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
            columnHelper.accessor('reservationDate', {
                header: 'Reserved Date',
                cell: (info) => {
                    const date = new Date(info.getValue())
                    return (
                        <div className="text-sm">
                            {date.toLocaleDateString()}
                        </div>
                    )
                },
            }),
            columnHelper.accessor('expiryDate', {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="h-8 px-2 -ml-3"
                    >
                        Expiry Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: (info) => {
                    const date = new Date(info.getValue())
                    const expiringSoon = isExpiringSoon(info.getValue())
                    return (
                        <div className={`text-sm ${expiringSoon ? 'text-yellow-600 dark:text-yellow-400 font-medium' : ''}`}>
                            {date.toLocaleDateString()}
                            {expiringSoon && (
                                <span className="ml-2 text-xs">⚠️ Expiring soon</span>
                            )}
                        </div>
                    )
                },
            }),
            columnHelper.accessor('status', {
                header: 'Status',
                cell: (info) => getStatusBadge(info.getValue()),
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
                            console.log('View reservation:', info.row.original)
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
        data: reservations,
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

    const activeReservations = reservations.filter(r => r.status === 'active').length
    const expiredReservations = reservations.filter(r => r.status === 'expired').length

    return (
        <AppLayout>
            <div className="container mx-auto py-8 px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Name Reservation</h1>
                        <p className="text-muted-foreground text-lg mt-2">
                            Manage company name reservations
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            // Create new reservation
                            console.log('Create new reservation')
                        }}
                        size="lg"
                        className="gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        New Reservation
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Reservations</CardDescription>
                            <CardTitle className="text-2xl">{reservations.length}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Active</CardDescription>
                            <CardTitle className="text-2xl text-green-600 dark:text-green-400">{activeReservations}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Expired</CardDescription>
                            <CardTitle className="text-2xl text-red-600 dark:text-red-400">{expiredReservations}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Reserved Names</CardTitle>
                        <CardDescription>
                            {reservations.length} reservation{reservations.length !== 1 ? 's' : ''} total
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
