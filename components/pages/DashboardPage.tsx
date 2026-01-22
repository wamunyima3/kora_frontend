'use client'

import { useMemo } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSubmissions } from '@/hooks/Submissions'
import { TrendingUp, MessageCircle, Star, Edit, MoreVertical, ArrowRight, ChevronDown, Plus, TrendingDown } from 'lucide-react'
import Link from 'next/link'

const paymentServices = [
    { name: 'Name Clearance', value: '120K', color: 'bg-[#FEF3E2]' },
    { name: 'Name Reservation', value: '80K', color: 'bg-[#FDE8C8]' },
    { name: 'Certificate of Incorporation', value: '70K', color: 'bg-[#FCDCAE]' },
]

const configuredServices = [
    'Name Clearance',
    'Name Reservation',
    'Business Name Registration',
    'Certificate of Incorporation',
    'Board of Directors Change',
    'Change of Nominal Capital',
    'Change of Shareholders',
    'Company Re-registration'
]

const users = [
    { name: 'Andrew Kaleya', role: 'Administrator', avatar: 'AK' },
    { name: 'Lwando Kasuba', role: 'Supervisor', avatar: 'LK', highlight: true },
    { name: 'Fredah Banda', role: 'Case Officer', avatar: 'FB' },
    { name: 'Chiwende Sakala', role: 'Registrar', avatar: 'CS' },
]

export default function DashboardPage() {
    const { data: submissions, isLoading: submissionsLoading } = useSubmissions()

    // Calculate stats from submissions
    const stats = useMemo(() => {
        if (!submissions) {
            return {
                totalSubmissions: 0,
                todaySubmissions: 0,
                weekSubmissions: 0,
                submissionsWithAnswers: 0,
                submissionsWithoutAnswers: 0,
                percentageChange: 0,
                completionRate: 0,
                quarterGoal: 0,
            }
        }

        const now = new Date()
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const weekAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000)

        const todaySubmissions = submissions.filter((sub) => {
            // Since we don't have created_at in the type, we'll use a simple count
            // In a real app, you'd filter by date
            return true // For now, we'll show all as "today" or calculate differently
        }).length

        const submissionsWithAnswers = submissions.filter(
            (sub) => sub.formAnswers && sub.formAnswers.length > 0
        ).length

        const submissionsWithoutAnswers = submissions.filter(
            (sub) => !sub.formAnswers || sub.formAnswers.length === 0
        ).length

        // Calculate percentage change (mock calculation - in real app use date comparison)
        const weekSubmissions = Math.floor(submissions.length * 0.85) // Mock: 85% of total
        const percentageChange = submissions.length > 0 
            ? Math.round(((todaySubmissions - weekSubmissions) / weekSubmissions) * 100)
            : 0

        // Calculate completion rate
        const completionRate = submissions.length > 0
            ? Math.round((submissionsWithAnswers / submissions.length) * 100)
            : 0

        // Calculate quarter goal (mock: 84% based on submissions)
        const quarterGoal = submissions.length > 0
            ? Math.min(84, Math.round((submissions.length / 100) * 84))
            : 0

        return {
            totalSubmissions: submissions.length,
            todaySubmissions,
            weekSubmissions,
            submissionsWithAnswers,
            submissionsWithoutAnswers,
            percentageChange: percentageChange || 0,
            completionRate: completionRate || 0,
            quarterGoal: quarterGoal || 0,
        }
    }, [submissions])

    return (
        <AppLayout>
            <div className="min-h-screen pt-24 pl-2 pr-4 pb-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Top Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Payment Services */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Top Payment Services</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {paymentServices.map((service) => (
                                    <div key={service.name} className={`${service.color} rounded-lg px-4 py-3 flex items-center justify-between`}>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">{service.name}</span>
                                        <span className="font-semibold text-gray-900 dark:text-gray-100">{service.value}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Configured Services */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Configured Services</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-2">
                                    {configuredServices.map((service) => (
                                        <div key={service} className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: '#FEF3E2' }}>
                                            <Plus className="h-4 w-4" style={{ color: '#B4813F' }} />
                                            <span className="text-sm text-gray-900 dark:text-gray-100">{service}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Submissions Today */}
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Submissions Today</h3>
                                {submissionsLoading ? (
                                    <div className="text-gray-500 dark:text-gray-400">Loading...</div>
                                ) : (
                                    <>
                                        <div className="flex items-baseline gap-2 mb-2">
                                            <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                                                {stats.totalSubmissions}
                                            </span>
                                            {stats.percentageChange !== 0 && (
                                                stats.percentageChange > 0 ? (
                                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                                ) : (
                                                    <TrendingDown className="h-5 w-5 text-red-600" />
                                                )
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                            {stats.percentageChange > 0 ? 'Increase' : stats.percentageChange < 0 ? 'Decrease' : 'No change'} compared to last week
                                        </p>
                                        <Link href="/submissions" className="text-sm flex items-center gap-1" style={{ color: '#B4813F' }}>
                                            View all submissions <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Completed Submissions */}
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Completed Submissions</h3>
                                {submissionsLoading ? (
                                    <div className="text-gray-500 dark:text-gray-400">Loading...</div>
                                ) : (
                                    <>
                                        <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                            {stats.completionRate}%
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                            {stats.submissionsWithAnswers} out of {stats.totalSubmissions} submissions have answers
                                        </p>
                                        <Link href="/submissions" className="text-sm flex items-center gap-1" style={{ color: '#B4813F' }}>
                                            View submissions <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quarter Goal */}
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Quarter goal</h3>
                                {submissionsLoading ? (
                                    <div className="text-gray-500 dark:text-gray-400">Loading...</div>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-center mb-4">
                                            <div className="relative w-32 h-32">
                                                <svg className="w-32 h-32 transform -rotate-90">
                                                    <circle 
                                                        cx="64" 
                                                        cy="64" 
                                                        r="56" 
                                                        stroke="#f3f4f6" 
                                                        strokeWidth="12" 
                                                        fill="none" 
                                                    />
                                                    <circle 
                                                        cx="64" 
                                                        cy="64" 
                                                        r="56" 
                                                        stroke="#B4813F" 
                                                        strokeWidth="12" 
                                                        fill="none" 
                                                        strokeDasharray="351.86" 
                                                        strokeDashoffset={351.86 * (1 - stats.quarterGoal / 100)} 
                                                        strokeLinecap="round" 
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                                        {stats.quarterGoal}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link href="/submissions" className="text-sm flex items-center gap-1" style={{ color: '#B4813F' }}>
                                            View all submissions <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Users */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-semibold">Users</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    Sort by Newest
                                    <ChevronDown className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {users.map((user) => (
                                    <div key={user.name} className={`flex items-center justify-between p-3 rounded-lg ${user.highlight ? '' : ''}`} style={user.highlight ? { backgroundColor: '#FEF3E2' } : {}}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                <span className="text-sm font-medium">{user.avatar}</span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-600">{user.role}</div>
                                            </div>
                                        </div>
                                        {user.highlight && (
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                    <MessageCircle className="h-4 w-4 text-gray-600" />
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                    <Star className="h-4 w-4 text-gray-600" />
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                    <Edit className="h-4 w-4 text-gray-600" />
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                    <MoreVertical className="h-4 w-4 text-gray-600" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <Link href="/users" className="text-sm flex items-center gap-1 pt-2" style={{ color: '#B4813F' }}>
                                    All users <ArrowRight className="h-4 w-4" />
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Services Chart */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-semibold">Services</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    Yearly
                                    <ChevronDown className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-48 flex items-end justify-between gap-2 mb-6">
                                    <svg className="w-full h-full" viewBox="0 0 600 200">
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="#86efac" stopOpacity="0.5" />
                                                <stop offset="100%" stopColor="#86efac" stopOpacity="0.1" />
                                            </linearGradient>
                                        </defs>
                                        <path d="M 0 180 L 50 160 L 100 140 L 150 120 L 200 100 L 250 90 L 300 110 L 350 80 L 400 70 L 450 50 L 500 40 L 550 20 L 600 10 L 600 200 L 0 200 Z" fill="url(#gradient)" />
                                        <path d="M 0 180 L 50 160 L 100 140 L 150 120 L 200 100 L 250 90 L 300 110 L 350 80 L 400 70 L 450 50 L 500 40 L 550 20 L 600 10" stroke="#22c55e" strokeWidth="2" fill="none" />
                                    </svg>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Top month</div>
                                        <div className="font-semibold text-lg">January</div>
                                        <div className="text-sm" style={{ color: '#B4813F' }}>2026</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Top year</div>
                                        <div className="font-semibold text-lg">2026</div>
                                        <div className="text-sm text-gray-600">96K cases so far</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Top User</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                <span className="text-xs font-medium">CS</span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">Chiwende Sakala</div>
                                                <div className="text-xs text-gray-600">Registrar</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
