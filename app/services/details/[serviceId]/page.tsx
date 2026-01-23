import { AppLayout } from "@/components/layout/AppLayout";
import ServiceDetailsPage from "@/components/pages/ServiceDetailsPage";
import React from "react";

const page = async ({ params }: { params: Promise<{ serviceId: string }> }) => {
  const { serviceId } = await params;
  return (
    <AppLayout>
      <ServiceDetailsPage serviceId={serviceId} />
    </AppLayout>
  );
};

export default page;
