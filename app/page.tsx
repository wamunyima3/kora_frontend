'use client'

import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
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
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { selectAllForms, deleteForm, type Form } from '@/lib/features/formBuilder/formSlice'
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
import { Plus, Settings, Trash2, ArrowUpDown } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'

const columnHelper = createColumnHelper<Form>()

export default function DashboardPage() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const forms = useAppSelector(selectAllForms)
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const columns = useMemo(
        () => [
            columnHelper.accessor('name', {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="h-8 px-2 -ml-3"
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: (info) => (
                    <div className="font-medium">{info.getValue()}</div>
                ),
            }),
            columnHelper.accessor('description', {
                header: 'Description',
                cell: (info) => (
                    <div className="text-muted-foreground max-w-md truncate">
                        {info.getValue() || 'No description'}
                    </div>
                ),
            }),
            columnHelper.accessor('fields', {
                header: 'Fields',
                cell: (info) => (
                    <div className="text-sm text-muted-foreground">
                        {info.getValue().length} field{info.getValue().length !== 1 ? 's' : ''}
                    </div>
                ),
            }),
            columnHelper.accessor('updatedAt', {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="h-8 px-2 -ml-3"
                    >
                        Last Updated
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
                    <div className="flex items-center gap-1 md:gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/services/configure?id=${info.row.original.id}`)}
                            className="h-8 px-2 md:px-3"
                            title="Configure"
                        >
                            <Settings className="h-4 w-4 md:mr-1" />
                            <span className="hidden md:inline">Configure</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                if (confirm(`Are you sure you want to delete "${info.row.original.name}"?`)) {
                                    dispatch(deleteForm(info.row.original.id))
                                }
                            }}
                            className="h-8 px-2 text-destructive hover:text-destructive"
                            title="Delete"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ),
            }),
        ],
        [router, dispatch]
    )

    const table = useReactTable({
        data: forms,
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
            <div className="container mx-auto py-4 md:py-8 px-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Forms</h1>
                        <p className="text-muted-foreground text-sm md:text-lg mt-1 md:mt-2">
                            Manage and configure your service forms
                        </p>
                    </div>
                    <Button
                        onClick={() => router.push('/services/configure')}
                        size="lg"
                        className="gap-2 w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4 md:h-5 md:w-5" />
                        <span className="text-sm md:text-base">Create New Form</span>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Forms</CardTitle>
                        <CardDescription>
                            {forms.length} form{forms.length !== 1 ? 's' : ''} total
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {forms.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground mb-4">
                                    No forms created yet. Create your first form to get started.
                                </p>
                                <Button
                                    onClick={() => router.push('/services/configure')}
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Create Form
                                </Button>
                            </div>
                        ) : (
                            <div className="rounded-md border overflow-x-auto">
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
