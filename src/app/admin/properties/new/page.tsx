"use client";

import { useEffect, useState } from "react";
import { createProperty, getActiveBuilders } from "@/lib/actions/properties";
import { PropertyForm } from "@/components/admin/property-form";
import type { PropertyFormData } from "@/lib/validations/property";
import type { UploadedImage } from "@/components/admin/image-upload";
import { Loader2 } from "lucide-react";

export default function NewPropertyPage() {
  const [builders, setBuilders] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveBuilders().then((data) => {
      setBuilders(data);
      setLoading(false);
    });
  }, []);

  async function handleSubmit(data: PropertyFormData, images: UploadedImage[]) {
    return await createProperty(data, images);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Add New Property
        </h2>
        <p className="text-muted-foreground">
          Create a new property listing.
        </p>
      </div>

      <PropertyForm builders={builders} onSubmit={handleSubmit} />
    </div>
  );
}
