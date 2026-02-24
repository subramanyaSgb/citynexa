import { redirect } from "next/navigation";
import { getBuilder, updateBuilder } from "@/lib/actions/builders";
import { EditBuilderClient } from "./edit-builder-client";

interface EditBuilderPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBuilderPage({ params }: EditBuilderPageProps) {
  const { id } = await params;
  const builder = await getBuilder(id);

  if (!builder) {
    redirect("/admin/builders");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Edit Builder
        </h2>
        <p className="text-muted-foreground">
          Update the details for {builder.name}.
        </p>
      </div>

      <EditBuilderClient builder={builder} />
    </div>
  );
}
