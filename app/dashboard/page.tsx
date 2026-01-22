import { AppLayout } from "@/components/layout/AppLayout";
import DashboardPage from "@/components/pages/DashboardPage";
import React from "react";

const Dashboard = async () => {
  return (
    <AppLayout>
      <DashboardPage />
    </AppLayout>
  );
};

export default Dashboard;
