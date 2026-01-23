'use client'

import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useUsers } from '@/hooks/Users'
import { User } from '@/types'
import { Filter, User as UserIcon } from 'lucide-react'

export default function UsersPage() {
    const { data: users, isLoading, error } = useUsers()

    if (error) {
        return (
            <AppLayout>
                <div className="min-h-screen pt-24 pl-2 pr-4 pb-6">
                    <div className="max-w-7xl mx-auto">
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-red-600">Error loading users. Please try again later.</p>
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
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <UserIcon className="h-5 w-5" />
                                Users
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
                                </div>
                            ) : !users || users.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 dark:text-gray-400">No users found.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Date of Birth</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium max-w-[50px]">
                                                    #{user.id}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {user.first_name} {user.middle_name} {user.surname}
                                                </TableCell>
                                                <TableCell>
                                                    {user.email || <span className="text-gray-400 italic">No email</span>}
                                                </TableCell>
                                                <TableCell>
                                                    {user.dob || <span className="text-gray-400 italic">N/A</span>}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
