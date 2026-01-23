"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="text-center py-12">
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="mx-auto size-12 text-gray-400 dark:text-gray-600"
      >
        <path
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h3 className="mt-2 text-sm font-semibold dark:text-white">No Cases</h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Get started by creating a new case.
      </p>

      <div className="mt-6">
        <Link href="/public/select-service">
          <Button className="bg-[#B4813F] hover:bg-[#8B6F47]">
            <Plus className="mr-2 h-4 w-4" />
            New Case
          </Button>
        </Link>
      </div>
    </div>
  );
}
