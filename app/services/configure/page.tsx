import { AppLayout } from "@/components/layout/AppLayout";
import ConfigureServicePage from "@/components/pages/ConfigureServicePage";
import React from "react";

const page = async () => {
  return (
    <AppLayout>
      <ConfigureServicePage />
    </AppLayout>
  );
};

export default page;
