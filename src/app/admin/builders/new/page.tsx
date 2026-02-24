"use client";

import { createBuilder } from "@/lib/actions/builders";
import { BuilderForm } from "@/components/admin/builder-form";
import type { BuilderFormData } from "@/lib/validations/builder";

export default function NewBuilderPage() {
  async function handleSubmit(data: BuilderFormData) {
    return await createBuilder(data);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Add New Builder
        </h2>
        <p className="text-muted-foreground">
          Create a new builder partner for your listings.
        </p>
      </div>

      <BuilderForm onSubmit={handleSubmit} />
    </div>
  );
}
