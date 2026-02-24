import { redirect } from "next/navigation";
import { getProperty, getActiveBuilders } from "@/lib/actions/properties";
import { EditPropertyClient } from "./edit-property-client";

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;

  const [property, builders] = await Promise.all([
    getProperty(id),
    getActiveBuilders(),
  ]);

  if (!property) {
    redirect("/admin/properties");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Edit Property
        </h2>
        <p className="text-muted-foreground">
          Update the details for {property.title}.
        </p>
      </div>

      <EditPropertyClient property={property} builders={builders} />
    </div>
  );
}
