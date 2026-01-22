import { AppLayout } from "@/components/layout/AppLayout";
import ServiceDetailsPage from "@/components/pages/ServiceDetailsPage";
import React from "react";

const page = async ({ params }: { params: { serviceId: string } }) => {
  return (
    <AppLayout>
      <ServiceDetailsPage serviceId={params.serviceId} />
    </AppLayout>
  );
};

export default page;
