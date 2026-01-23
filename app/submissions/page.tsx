"use client";
// Your Request has been successfully submitted!
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
import { SelectServiceModal } from "@/components/modals/SelectServiceModal";
import { Submission } from "@/types";
import { Eye, Trash2, Filter, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EmptyState from "./components/empty-state";

export default function SubmissionsPage() {
  const [selectedFormId, setSelectedFormId] = useState<number | "all">("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectServiceModalOpen, setSelectServiceModalOpen] = useState(false);
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
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setSelectServiceModalOpen(true)}
                  className="bg-[#8B6F47] hover:bg-[#6F5838]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Case
                </Button>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <select
                    value={selectedFormId}
                    onChange={(e) =>
                      setSelectedFormId(
                        e.target.value === "all"
                          ? "all"
                          : Number(e.target.value),
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
                    <TableRow className="bg-yellow-100 dark:bg-yellow-900/30 border-b-2 border-yellow-200 dark:border-yellow-800">
                      <TableHead className="font-bold text-stone-900 dark:text-stone-100">Case ID</TableHead>
                      <TableHead className="font-bold text-stone-900 dark:text-stone-100">Form</TableHead>
                      <TableHead className="font-bold text-stone-900 dark:text-stone-100">Status</TableHead>
                      <TableHead className="text-right font-bold text-stone-900 dark:text-stone-100">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => {
                      const form = submission.form_id
                        ? formsMap[submission.form_id]
                        : undefined;
                      return (
                        <TableRow key={submission.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                          <TableCell className="font-medium text-stone-900 dark:text-stone-100">
                            #{submission.id}
                          </TableCell>
                          <TableCell>
                            {form ? (
                              <div>
                                <span className="font-medium text-stone-900 dark:text-stone-100">
                                  {form.form_name}
                                </span>
                                {form.description && (
                                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                                    {form.description}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-stone-500 dark:text-stone-400">
                                Form ID: {submission.form_id || "N/A"}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800">
                              Pending
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/submissions/${submission.id}`}
                                className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors"
                                title="View submission"
                              >
                                <Eye className="h-4 w-4 text-stone-600 dark:text-stone-400" />
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

      <SelectServiceModal
        open={selectServiceModalOpen}
        onOpenChange={setSelectServiceModalOpen}
      />
    </AppLayout>
  );
}
