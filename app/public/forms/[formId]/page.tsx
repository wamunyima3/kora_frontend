import { AppLayout } from "@/components/layout/AppLayout";
import PublicFormPage from "@/components/pages/PublicFormPage";

export default function Page({ params }: { params: { formId: string } }) {
  return (
    <AppLayout>
      <PublicFormPage formId={params.formId} />
    </AppLayout>
  );
}
