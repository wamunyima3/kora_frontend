import PublicFormPage from "@/components/pages/PublicFormPage";

const page = async ({ params }: { params: Promise<{ formId: string }> }) => {
  const { formId } = await params;
  return <PublicFormPage formId={formId} />;
};

export default page;
