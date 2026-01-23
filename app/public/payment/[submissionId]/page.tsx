import { AppLayout } from "@/components/layout/AppLayout";
import PaymentPage from "@/components/pages/PaymentPage";

export default function Page({ params }: { params: { submissionId: string } }) {
  return (
    <AppLayout>
      <PaymentPage submissionId={params.submissionId} />
    </AppLayout>
  );
}
