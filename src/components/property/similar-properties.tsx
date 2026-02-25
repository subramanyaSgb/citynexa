import type { Property, PropertyImage } from "@/generated/prisma/client";
import { PropertyCard } from "@/components/property/property-card";

type PropertyWithRelations = Property & {
  builder: { id: string; name: string };
  images: PropertyImage[];
};

interface SimilarPropertiesProps {
  properties: PropertyWithRelations[];
}

export function SimilarProperties({ properties }: SimilarPropertiesProps) {
  if (properties.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">
        Similar Properties
      </h2>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {properties.map((property) => (
          <div key={property.id} className="w-[320px] shrink-0">
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </section>
  );
}
