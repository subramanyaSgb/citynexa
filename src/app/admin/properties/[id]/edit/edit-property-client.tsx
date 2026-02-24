"use client";

import type { Property, Builder, PropertyImage } from "@/generated/prisma/client";
import { updateProperty } from "@/lib/actions/properties";
import { PropertyForm } from "@/components/admin/property-form";
import type { PropertyFormData } from "@/lib/validations/property";
import type { UploadedImage } from "@/components/admin/image-upload";

interface EditPropertyClientProps {
  property: Property & { builder: Builder; images: PropertyImage[] };
  builders: { id: string; name: string }[];
}

export function EditPropertyClient({ property, builders }: EditPropertyClientProps) {
  async function handleSubmit(data: PropertyFormData, images: UploadedImage[]) {
    return await updateProperty(property.id, data, images);
  }

  return (
    <PropertyForm
      initialData={property}
      builders={builders}
      onSubmit={handleSubmit}
    />
  );
}
