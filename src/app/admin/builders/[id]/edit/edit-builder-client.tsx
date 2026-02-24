"use client";

import type { Builder } from "@/generated/prisma/client";
import { updateBuilder } from "@/lib/actions/builders";
import { BuilderForm } from "@/components/admin/builder-form";
import type { BuilderFormData } from "@/lib/validations/builder";

interface EditBuilderClientProps {
  builder: Builder;
}

export function EditBuilderClient({ builder }: EditBuilderClientProps) {
  async function handleSubmit(data: BuilderFormData) {
    return await updateBuilder(builder.id, data);
  }

  return <BuilderForm initialData={builder} onSubmit={handleSubmit} />;
}
