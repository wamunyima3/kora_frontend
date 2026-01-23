"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubmissions } from "@/hooks/Submissions";
import { useServices } from "@/hooks/Services";
import { useUsers } from "@/hooks/Users";
import {
  TrendingUp,
  MessageCircle,
  Star,
  Edit,
  MoreVertical,
  ArrowRight,
  ChevronDown,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";
import { User } from "@/types";


export default function DashboardPage() {
  const { data: submissions, isLoading: submissionsLoading } = useSubmissions();
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: users, isLoading: usersLoading } = useUsers();

  // Calculate stats from cases (submissions)
  const stats = useMemo(() => {
    if (!submissions) {
      return {
        totalCases: 0,
        todayCases: 0,
        weekCases: 0,
        casesWithAnswers: 0,
        casesWithoutAnswers: 0,
        percentageChange: 0,
        completionRate: 0,
        topUserId: null as number | null,
      };
    }

    const casesWithAnswers = submissions.filter(
      (sub) => sub.formAnswers && sub.formAnswers.length > 0
    ).length;

    // Calculate percentage change (mock calculation - in real app use date comparison)
    const weekCases = Math.floor(submissions.length * 0.85); // Mock: 85% of total
    const todayCases = submissions.length;
    const percentageChange =
      submissions.length > 0
        ? Math.round(((todayCases - weekCases) / weekCases) * 100)
        : 0;

    // Calculate completion rate
    const completionRate =
      submissions.length > 0
        ? Math.round((casesWithAnswers / submissions.length) * 100)
        : 0;

    // Calculate top user
    const submissionCounts = submissions.reduce((acc, curr) => {
      const creatorId = curr.created_by;
      if (creatorId) {
        acc[creatorId] = (acc[creatorId] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);

    let topUserId = null;
    let maxCount = 0;
    Object.entries(submissionCounts).forEach(([id, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topUserId = Number(id);
      }
    });

    return {
      totalCases: submissions.length,
      todayCases,
      weekCases,
      casesWithAnswers,
      casesWithoutAnswers:
        submissions.length - casesWithAnswers,
      percentageChange: percentageChange || 0,
      completionRate: completionRate || 0,
      topUserId,
    };
  }, [submissions]);

  const mapUserAvatar = (user: User) => {
    if (user.first_name && user.surname) {
      return `${user.first_name[0]}${user.surname[0]}`.toUpperCase();
    }
    return "U";
  };

  // Helper to determine if a user should be highlighted - for now just highlighting the first one or logic based on current user if we had auth context
  // Using a simple logic: highlight "Lwando Kasuba" if fails finding him, highlight first.
  const isHighlightedUser = (user: User) => {
    return user.first_name === "Lwando" && user.surname === "Kasuba";
  };

  const topUser = users?.find(u => u.id === stats.topUserId);

  return (
    <div className="min-h-screen pt-24 pl-2 pr-4 pb-6">
      <div className="max-w-7xl mx-auto space-y-6">


        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Configured Services */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                Active Services
              </h3>
              {servicesLoading ? (
                <div className="text-gray-500 dark:text-gray-400">Loading services...</div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    {services?.length || 0}
                  </span>
                </div>
              )}
              <Link href="/services" className="text-sm text-[#B4813F] mt-6 flex items-center gap-1">
                View services <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          {/* Cases Today */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                Cases Today
              </h3>
              {submissionsLoading ? (
                <div className="text-gray-500 dark:text-gray-400">Loading...</div>
              ) : (
                <>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.totalCases}
                    </span>
                    {stats.percentageChange !== 0 &&
                      (stats.percentageChange > 0 ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    {stats.percentageChange > 0
                      ? "Increase"
                      : stats.percentageChange < 0
                        ? "Decrease"
                        : "No change"}{" "}
                    compared to last week
                  </p>
                  <Link
                    href="/submissions"
                    className="text-sm flex items-center gap-1 text-[#B4813F]"
                  >
                    View all cases <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </CardContent>
          </Card>

          {/* Completed Cases */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                Completed Cases
              </h3>
              {submissionsLoading ? (
                <div className="text-gray-500 dark:text-gray-400">Loading...</div>
              ) : (
                <>
                  <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {stats.completionRate}%
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    {stats.casesWithAnswers} out of {stats.totalCases}{" "}
                    cases have been completed
                  </p>
                  <Link
                    href="/submissions"
                    className="text-sm flex items-center gap-1 text-[#B4813F]"
                  >
                    View cases <ArrowRight className="h-4 w-4" />
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
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                Sort by Newest
                <ChevronDown className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {usersLoading ? (
                <div className="text-gray-500 dark:text-gray-400">Loading users...</div>
              ) : (
                <>
                  {users?.map((user) => {
                    const highlighted = isHighlightedUser(user);
                    return (
                      <div
                        key={user.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${highlighted ? "bg-[#FEF3E2] dark:bg-[#FEF3E2]/20" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium">{mapUserAvatar(user)}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-200">
                              {`${user.first_name} ${user.surname}`}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {user.email || "User"}
                            </div>
                          </div>
                        </div>
                        {highlighted && (
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                              <MessageCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                              <Star className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                              <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                              <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </>
              )}
              <Link
                href="/users"
                className="text-sm flex items-center gap-1 pt-2 text-[#B4813F]"
              >
                All users <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          {/* Cases Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Cases</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                Yearly
                <ChevronDown className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-end justify-between gap-2 mb-6">
                <svg className="w-full h-full" viewBox="0 0 600 200">
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#86efac" stopOpacity="0.5" />
                      <stop
                        offset="100%"
                        stopColor="#86efac"
                        stopOpacity="0.1"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 180 L 50 160 L 100 140 L 150 120 L 200 100 L 250 90 L 300 110 L 350 80 L 400 70 L 450 50 L 500 40 L 550 20 L 600 10 L 600 200 L 0 200 Z"
                    fill="url(#gradient)"
                  />
                  <path
                    d="M 0 180 L 50 160 L 100 140 L 150 120 L 200 100 L 250 90 L 300 110 L 350 80 L 400 70 L 450 50 L 500 40 L 550 20 L 600 10"
                    stroke="#22c55e"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Top month
                  </div>
                  <div className="font-semibold text-lg">January</div>
                  <div className="text-sm text-[#B4813F]">2026</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Top year
                  </div>
                  <div className="font-semibold text-lg">2026</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.totalCases} cases so far
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Top User
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xs font-medium">{topUser ? mapUserAvatar(topUser) : "-"}</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {topUser ? `${topUser.first_name} ${topUser.surname}` : "No cases yet"}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Most active
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
