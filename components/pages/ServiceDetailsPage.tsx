"use client";

import { useFormsByService } from "@/hooks/Forms";
import { useService } from "@/hooks/Services";
import { useFormFieldsByForm } from "@/hooks/FormFields";
import { useFields } from "@/hooks/Fields";
import { useState, useRef } from "react";
import Image from "next/image";
import { Form } from "@/types";

interface ServiceDetailsPageProps {
  serviceId: string;
}

export default function ServiceDetailsPage({
  serviceId,
}: ServiceDetailsPageProps) {
  const { data: service, isLoading: serviceLoading } = useService(
    Number(serviceId),
  );
  const { data: forms = [], isLoading: formsLoading } = useFormsByService(
    Number(serviceId),
  );
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const { data: formFields = [] } = useFormFieldsByForm(selectedForm?.id);
  const { data: allFields = [] } = useFields();
  const formRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    window.print();
  };

  if (serviceLoading || formsLoading) {
    return <div className="p-8 pt-24">Loading...</div>;
  }

  return (
    <>
      <div className="p-8 pt-24 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="mb-2">
            <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
              Service Name:
            </span>
            <h1 className="text-3xl font-bold dark:text-white">
              {service?.service_name}
            </h1>
          </div>
          <div>
            <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
              Description:
            </span>
            <p className="text-lg text-stone-700 dark:text-stone-300">
              {service?.description}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Forms:</h2>
          {forms.length === 0 ? (
            <p className="text-stone-500 dark:text-stone-400">
              No forms available for this service.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {forms.map((form) => (
                <button
                  key={form.id}
                  onClick={() => setSelectedForm(form)}
                  className="block group text-left"
                >
                  <div className="bg-white dark:bg-stone-800 rounded shadow-md hover:shadow-lg transition-shadow p-4 aspect-[8.5/11] flex flex-col items-center justify-center text-center">
                    <svg
                      className="w-10 h-10 mb-2 text-red-600 dark:text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                      <path
                        d="M14 2v6h6"
                        fill="currentColor"
                        className="fill-white dark:fill-stone-800"
                      />
                      <text
                        x="12"
                        y="16"
                        fontSize="6"
                        textAnchor="middle"
                        className="fill-white dark:fill-stone-800"
                        fontWeight="bold"
                      >
                        PDF
                      </text>
                    </svg>
                    <h3 className="font-semibold text-sm text-stone-900 dark:text-white">
                      {form.form_name}
                    </h3>
                    {form.description && (
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 line-clamp-2">
                        {form.description}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedForm(null)}
        >
          <div
            className="bg-white dark:bg-stone-900 rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-stone-900 border-b dark:border-stone-700 p-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-semibold dark:text-white">
                {selectedForm.form_name}
              </h2>
              <button
                onClick={() => setSelectedForm(null)}
                className="text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-8 bg-white dark:bg-stone-900">
              <div
                ref={formRef}
                className="max-w-4xl mx-auto border-2 border-stone-300 dark:border-stone-700 p-12"
              >
                <div className="text-right text-sm mb-6">
                  <div className="font-bold">
                    {selectedForm.id === 1
                      ? "Form 1"
                      : selectedForm.id === 3
                        ? "Form 3"
                        : selectedForm.form_name}
                  </div>
                  <div className="underline">
                    (Regulation {selectedForm.id === 1 ? "2" : "4"})
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
                    <tr className="bg-yellow-100 dark:bg-yellow-900">
                      <th
                        colSpan={4}
                        className="border border-stone-900 dark:border-stone-300 p-2 font-bold text-center"
                      >
                        {selectedForm.id === 3
                          ? "APPLICATION FOR INCORPORATION"
                          : "APPLICATION FOR NAME CLEARANCE"}
                      </th>
                    </tr>
                    <tr className="bg-yellow-100 dark:bg-yellow-900">
                      <th
                        colSpan={4}
                        className="border border-stone-900 dark:border-stone-300 p-2 text-center"
                      >
                        <div className="font-bold">PART A</div>
                        <div className="font-bold">
                          {selectedForm.id === 3
                            ? "COMPANY DETAILS"
                            : "APPLICANT DETAILS"}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formFields.slice(0, 10).map((formField, idx) => {
                      const field = allFields.find(
                        (f) => f.id === formField.field_id,
                      );
                      return (
                        <tr key={formField.id}>
                          <td className="border border-stone-900 dark:border-stone-300 p-2 w-12 text-center font-bold">
                            {idx + 1}.
                          </td>
                          <td className="border border-stone-900 dark:border-stone-300 p-2 w-48 dark:text-stone-300">
                            <div className="font-semibold">
                              {formField.field_name || field?.label}
                            </div>
                          </td>
                          <td className="border border-stone-900 dark:border-stone-300 p-2 bg-white dark:bg-stone-800"></td>
                          <td className="border border-stone-900 dark:border-stone-300 p-2 w-48 bg-yellow-50 dark:bg-yellow-900/20 text-xs italic dark:text-stone-400"></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {formFields.length > 10 && (
                  <table className="w-full border-collapse border border-stone-900 dark:border-stone-300 text-sm mt-8">
                    <thead>
                      <tr className="bg-yellow-100 dark:bg-yellow-900">
                        <th
                          colSpan={4}
                          className="border border-stone-900 dark:border-stone-300 p-2 text-center"
                        >
                          <div className="font-bold">PART B</div>
                          <div className="font-bold">
                            {selectedForm.id === 3
                              ? "FIRST DIRECTORS"
                              : "PROPOSED NAMES"}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formFields.slice(10).map((formField, idx) => {
                        const field = allFields.find(
                          (f) => f.id === formField.field_id,
                        );
                        return (
                          <tr key={formField.id}>
                            <td className="border border-stone-900 dark:border-stone-300 p-2 w-12 text-center font-bold">
                              {idx + 11}.
                            </td>
                            <td className="border border-stone-900 dark:border-stone-300 p-2 w-48 dark:text-stone-300">
                              <div className="font-semibold">
                                {formField.field_name || field?.label}
                              </div>
                            </td>
                            <td className="border border-stone-900 dark:border-stone-300 p-2 bg-white dark:bg-stone-800"></td>
                            <td className="border border-stone-900 dark:border-stone-300 p-2 w-48 bg-yellow-50 dark:bg-yellow-900/20 text-xs italic dark:text-stone-400"></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
