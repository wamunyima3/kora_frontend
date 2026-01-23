"use client";

import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSubmissions, useDeleteSubmission } from "@/hooks/Submissions";
import { useForms } from "@/hooks/Forms";
import { DeleteDialog } from "@/components/modals/DeleteDialog";
import { Submission } from "@/types";
import { Eye, Trash2, Filter } from "lucide-react";
import Link from "next/link";
import EmptyState from "./components/empty-state";

export default function SubmissionsPage() {
  const [selectedFormId, setSelectedFormId] = useState<number | "all">("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<{
    id: number;
    formTitle?: string;
  } | null>(null);

  const {
    data: submissions,
    isLoading: submissionsLoading,
    error: submissionsError,
  } = useSubmissions();
  const { data: forms, isLoading: formsLoading } = useForms();
  const deleteSubmission = useDeleteSubmission();

  const isLoading = submissionsLoading || formsLoading;

  // Create a map of form_id to form for quick lookup
  const formsMap =
    forms?.reduce(
      (acc, form) => {
        acc[form.id] = form;
        return acc;
      },
      {} as Record<number, (typeof forms)[0]>,
    ) || {};

  // Filter submissions based on selected form
  const filteredSubmissions = useMemo(() => {
    if (!submissions) return [];
    if (selectedFormId === "all") return submissions;
    return submissions.filter(
      (submission) => submission.form_id === selectedFormId,
    );
  }, [submissions, selectedFormId]);

  const handleDeleteClick = (submission: Submission, formTitle?: string) => {
    setSubmissionToDelete({ id: submission.id, formTitle });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!submissionToDelete) return;

    try {
      await deleteSubmission.mutateAsync(submissionToDelete.id);
      setDeleteDialogOpen(false);
      setSubmissionToDelete(null);
    } catch (error) {
      console.error("Failed to delete submission:", error);
      // Error handling could be improved with toast notifications
    }
  };

  if (submissionsError) {
    return (
      <AppLayout>
        <div className="min-h-screen pt-24 pl-2 pr-4 pb-6">
          <div className="max-w-7xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <p className="text-red-600">
                  Error loading submissions. Please try again later.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen pt-24 pl-2 pr-4 pb-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Cases</CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <select
                  value={selectedFormId}
                  onChange={(e) =>
                    setSelectedFormId(
                      e.target.value === "all" ? "all" : Number(e.target.value),
                    )
                  }
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#B4813F] focus:border-transparent"
                >
                  <option value="all">All Forms</option>
                  {forms?.map((form) => (
                    <option key={form.id} value={form.id}>
                      {form.form_name}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">
                    Loading submissions...
                  </p>
                </div>
              ) : !submissions || submissions.length === 0 ? (
                // <div className="text-center py-8">
                //     <p className="text-gray-600 dark:text-gray-400">No submissions found.</p>
                // </div>
                <EmptyState />
              ) : filteredSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">
                    No submissions found for the selected form.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Form</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => {
                      const form = submission.form_id
                        ? formsMap[submission.form_id]
                        : undefined;
                      return (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">
                            #{submission.id}
                          </TableCell>
                          <TableCell>
                            {form ? (
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {form.form_name}
                              </span>
                            ) : (
                              <span className="text-gray-500 dark:text-gray-400">
                                Form ID: {submission.form_id || "N/A"}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {form?.description ? (
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {form.description}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400 dark:text-gray-500">
                                No description
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/submissions/${submission.id}`}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                title="View submission"
                              >
                                <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Case"
        itemName={
          submissionToDelete
            ? `Case #${submissionToDelete.id}${submissionToDelete.formTitle ? ` (${submissionToDelete.formTitle})` : ""}`
            : undefined
        }
        isLoading={deleteSubmission.isPending}
      />
    </AppLayout>
  );
}
