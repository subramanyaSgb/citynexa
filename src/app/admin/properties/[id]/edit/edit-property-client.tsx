"use client";

import type { Property, Builder } from "@/generated/prisma/client";
import { updateProperty } from "@/lib/actions/properties";
import { PropertyForm } from "@/components/admin/property-form";
import type { PropertyFormData } from "@/lib/validations/property";

interface EditPropertyClientProps {
  property: Property & { builder: Builder };
  builders: { id: string; name: string }[];
}

export function EditPropertyClient({ property, builders }: EditPropertyClientProps) {
  async function handleSubmit(data: PropertyFormData) {
    return await updateProperty(property.id, data);
  }

  return (
    <PropertyForm
      initialData={property}
      builders={builders}
      onSubmit={handleSubmit}
    />
  );
}
