"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FormBuilder from "@/components/form-builder/FormBuilder";

function ConfigureServiceContent() {
  const searchParams = useSearchParams();
  const formId = searchParams.get("id");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return <FormBuilder formId={formId || undefined} />;
}

export default function ConfigureServicePage() {
  return (
    // <Suspense
    //   fallback={
    //     <div className="min-h-screen bg-background flex items-center justify-center">
    //       <div className="text-muted-foreground">Loading...</div>
    //     </div>
    //   }
    // >
    <div className="flex pt-0 md:pt-24 w-full h-full">
      <ConfigureServiceContent />
    </div>
    // </Suspense>
  );
}
