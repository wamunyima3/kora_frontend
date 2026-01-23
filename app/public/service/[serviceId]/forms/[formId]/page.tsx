import PublicFormPage from "@/components/pages/PublicFormPage";
import { AppLayout } from "@/components/layout/AppLayout";

const page = async ({ params }: { params: Promise<{ formId: string; serviceId: string }> }) => {
  const { formId, serviceId } = await params;
  return (
    <AppLayout>
      <PublicFormPage formId={formId} serviceId={serviceId} />
    </AppLayout>
  );
};

export default page;
