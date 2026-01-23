import { AppLayout } from "@/components/layout/AppLayout";
import ServicesPage from "@/components/pages/ServicesPage";
import React from "react";

const page = async () => {
  return (
    <AppLayout>
      <ServicesPage />
    </AppLayout>
  );
};

export default page;
