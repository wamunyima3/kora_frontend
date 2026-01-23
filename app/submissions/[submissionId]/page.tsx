"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { useSubmission } from "@/hooks/Submissions";
import { useForm } from "@/hooks/Forms";
import { useFields } from "@/hooks/Fields";
import { ArrowLeft, Loader2, Download } from "lucide-react";
import { useDataTypes } from '@/hooks/DataTypes'
import { useCollectionItems } from '@/hooks/CollectionItems'
import Link from "next/link";
import Image from "next/image";

export default function SubmissionDetailPage() {
    const params = useParams();
    const submissionId = params?.submissionId
        ? Number(params.submissionId)
        : null;

    const {
        data: submission,
        isLoading: submissionLoading,
        error: submissionError,
    } = useSubmission(submissionId || 0);
    const { data: form, isLoading: formLoading } = useForm(
        submission?.form_id || 0,
    );
    const { data: fields, isLoading: fieldsLoading } = useFields();
    const { data: dataTypes, isLoading: dataTypesLoading } = useDataTypes();
    const { data: collectionItems, isLoading: collectionItemsLoading } = useCollectionItems();

    const isLoading = submissionLoading || formLoading || fieldsLoading || dataTypesLoading || collectionItemsLoading;

    const fieldsMap = useMemo(() => {
        return (
            fields?.reduce(
                (acc, field) => {
                    acc[field.id] = field;
                    return acc;
                },
                {} as Record<number, (typeof fields)[0]>,
            ) || {}
        );
    }, [fields]);

    const dataTypesMap = useMemo(() => {
        return dataTypes?.reduce((acc, dt) => {
            acc[dt.id] = dt
            return acc
        }, {} as Record<number, typeof dataTypes[0]>) || {}
    }, [dataTypes])

    const collectionItemsMap = useMemo(() => {
        return collectionItems?.reduce((acc, ci) => {
            acc[ci.id] = ci
            return acc
        }, {} as Record<number, typeof collectionItems[0]>) || {}
    }, [collectionItems])

    const formFieldsWithAnswers = useMemo(() => {
        if (!submission?.formFields || !submission?.formAnswers) return [];

        return submission.formFields.map((formField) => {
            const field = fieldsMap[formField.field_id];
            const answer = submission.formAnswers?.find(
                (fa) => fa.form_field_id === formField.id,
            );

            let displayAnswer = answer?.answer || "";

            // Resolve dropdown and radio answers to meaningful values
            if (displayAnswer && field) {
                const dataType = dataTypesMap[field.data_type_id]
                if ((dataType?.data_type === 'Dropdown' || dataType?.data_type === 'Radio') && field.collection_id) {
                    const collectionItemId = parseInt(displayAnswer)
                    const collectionItem = collectionItemsMap[collectionItemId]
                    if (collectionItem) {
                        displayAnswer = collectionItem.collection_item || displayAnswer
                    }
                }
            }

            return {
                formField,
                field,
                answer: displayAnswer,
            };
        });
    }, [submission, fieldsMap, dataTypesMap, collectionItemsMap]);

    const handleDownload = () => {
        window.print();
    };

    if (!submissionId || submissionError) {
        return (
            <AppLayout>
                <div className="min-h-screen pt-24 pl-2 pr-4 pb-6">
                    <div className="max-w-7xl mx-auto">
                        <p className="text-red-600">Error loading case.</p>
                        <Link
                            href="/submissions"
                            className="text-sm text-[#B4813F] mt-4 inline-block"
                        >
                            ← Back to Cases
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="min-h-screen pt-24 pl-2 pr-4 pb-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex justify-between items-center">
                        <Link
                            href="/submissions"
                            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-[#B4813F] transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Cases
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-600 dark:text-gray-400" />
                        </div>
                    ) : submission ? (
                        <div className="bg-white dark:bg-stone-900 p-8">
                            <div className="max-w-4xl mx-auto border-2 border-stone-300 dark:border-stone-700 p-12">
                                <div className="text-right text-sm mb-6">
                                    <div className="font-bold">
                                        {form?.id === 1
                                            ? "Form 1"
                                            : form?.id === 3
                                                ? "Form 3"
                                                : form?.form_name}
                                    </div>
                                    <div className="underline">
                                        (Regulation {form?.id === 1 ? "2" : "4"})
                                    </div>
                                    <div className="text-xs italic mt-1">
                                        (In typescript and completed in duplicate)
                                    </div>
                                </div>

                                <div className="flex justify-center mb-6">
                                    <Image
                                        src="/pacra-logo.webp"
                                        alt="PACRA"
                                        width={100}
                                        height={100}
                                    />
                                </div>

                                <h1 className="text-center font-bold text-base mb-4 dark:text-white">
                                    THE PATENTS AND COMPANIES REGISTRATION AGENCY
                                </h1>

                                <div className="text-center mb-6 text-sm dark:text-stone-300">
                                    <div className="font-bold">The Companies Act, 2017</div>
                                    <div className="font-bold">(Act No. 10 of 2017)</div>
                                    <div className="my-2">___________</div>
                                    <div className="font-bold">
                                        The Companies (Prescribed Forms) Regulations, 2018
                                    </div>
                                    <div className="italic">(Section 12, 13 and 94)</div>
                                    <div className="text-xs mt-2">
                                        Available at{" "}
                                        <span className="text-blue-600">www.pacra.org.zm</span>
                                    </div>
                                </div>

                                <table className="w-full border-collapse border border-stone-900 dark:border-stone-300 text-sm">
                                    <thead>
                                        <tr style={{ backgroundColor: '#ffe598' }}>
                                            <th
                                                colSpan={4}
                                                className="border border-stone-900 dark:border-stone-300 p-2 font-bold text-center"
                                            >
                                                {form?.id === 3
                                                    ? "INCORPORATION"
                                                    : "NAME CLEARANCE"}
                                            </th>
                                        </tr>
                                        <tr style={{ backgroundColor: '#ffe598' }}>
                                            <th
                                                colSpan={4}
                                                className="border border-stone-900 dark:border-stone-300 p-2 text-center"
                                            >
                                                <div className="font-bold">PART A</div>
                                                <div className="font-bold">
                                                    {form?.id === 3
                                                        ? "COMPANY DETAILS"
                                                        : "APPLICANT DETAILS"}
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formFieldsWithAnswers
                                            .slice(0, 10)
                                            .map(({ formField, field, answer }, idx) => (
                                                <tr key={formField.id}>
                                                    <td className="border border-stone-900 dark:border-stone-300 p-2 w-12 text-center font-bold">
                                                        {idx + 1}.
                                                    </td>
                                                    <td className="border border-stone-900 dark:border-stone-300 p-2 w-48 dark:text-stone-300">
                                                        <div className="font-semibold">
                                                            {formField.field_name || field?.label}
                                                        </div>
                                                    </td>
                                                    <td className="border border-stone-900 dark:border-stone-300 p-2 bg-white dark:bg-stone-800">
                                                        {answer}
                                                    </td>
                                                    <td className="border border-stone-900 dark:border-stone-300 p-2 w-48 text-xs italic dark:text-stone-400" style={{ backgroundColor: '#ffe598' }}></td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>

                                {formFieldsWithAnswers.length > 10 && (
                                    <table className="w-full border-collapse border border-stone-900 dark:border-stone-300 text-sm mt-8">
                                        <thead>
                                            <tr style={{ backgroundColor: '#ffe598' }}>
                                                <th
                                                    colSpan={4}
                                                    className="border border-stone-900 dark:border-stone-300 p-2 text-center"
                                                >
                                                    <div className="font-bold">PART B</div>
                                                    <div className="font-bold">
                                                        {form?.id === 3
                                                            ? "FIRST DIRECTORS"
                                                            : "PROPOSED NAMES"}
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formFieldsWithAnswers
                                                .slice(10)
                                                .map(({ formField, field, answer }, idx) => (
                                                    <tr key={formField.id}>
                                                        <td className="border border-stone-900 dark:border-stone-300 p-2 w-12 text-center font-bold">
                                                            {idx + 11}.
                                                        </td>
                                                        <td className="border border-stone-900 dark:border-stone-300 p-2 w-48 dark:text-stone-300">
                                                            <div className="font-semibold">
                                                                {formField.field_name || field?.label}
                                                            </div>
                                                        </td>
                                                        <td className="border border-stone-900 dark:border-stone-300 p-2 bg-white dark:bg-stone-800">
                                                            {answer}
                                                        </td>
                                                        <td className="border border-stone-900 dark:border-stone-300 p-2 w-48 text-xs italic dark:text-stone-400" style={{ backgroundColor: '#ffe598' }}></td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-600 dark:text-gray-400">
                                Case not found.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
