import {
  Bed,
  Bath,
  Ruler,
  Building2,
  Compass,
  Sofa,
  Calendar,
  Move3D,
} from "lucide-react";
import {
  FURNISHING_LABELS,
  POSSESSION_STATUS_LABELS,
} from "@/lib/constants";
import type { Property } from "@/generated/prisma/client";

interface PropertySpecsProps {
  property: Pick<
    Property,
    | "bedrooms"
    | "bathrooms"
    | "carpetArea"
    | "carpetAreaUnit"
    | "builtUpArea"
    | "floorNumber"
    | "totalFloors"
    | "facingDirection"
    | "furnishing"
    | "possessionStatus"
    | "possessionDate"
  >;
}

interface SpecItem {
  icon: React.ReactNode;
  value: string;
  label: string;
}

function formatArea(area: number, unit: string | null): string {
  const unitLabel =
    unit === "SQFT"
      ? "sq.ft"
      : unit === "SQYD"
        ? "sq.yd"
        : unit === "SQMT"
          ? "sq.mt"
          : "sq.ft";
  return `${area.toLocaleString()} ${unitLabel}`;
}

export function PropertySpecs({ property }: PropertySpecsProps) {
  const specs: SpecItem[] = [];

  if (property.bedrooms != null) {
    specs.push({
      icon: <Bed className="size-5" />,
      value: String(property.bedrooms),
      label: property.bedrooms === 1 ? "Bedroom" : "Bedrooms",
    });
  }

  if (property.bathrooms != null) {
    specs.push({
      icon: <Bath className="size-5" />,
      value: String(property.bathrooms),
      label: property.bathrooms === 1 ? "Bathroom" : "Bathrooms",
    });
  }

  if (property.carpetArea != null) {
    specs.push({
      icon: <Ruler className="size-5" />,
      value: formatArea(property.carpetArea, property.carpetAreaUnit),
      label: "Carpet Area",
    });
  }

  if (property.builtUpArea != null) {
    specs.push({
      icon: <Move3D className="size-5" />,
      value: `${property.builtUpArea.toLocaleString()} sq.ft`,
      label: "Built-up Area",
    });
  }

  if (property.floorNumber != null) {
    const floorValue = property.totalFloors
      ? `${property.floorNumber}/${property.totalFloors}`
      : String(property.floorNumber);
    specs.push({
      icon: <Building2 className="size-5" />,
      value: floorValue,
      label: "Floor",
    });
  }

  if (property.facingDirection) {
    specs.push({
      icon: <Compass className="size-5" />,
      value: property.facingDirection,
      label: "Facing",
    });
  }

  if (property.furnishing) {
    specs.push({
      icon: <Sofa className="size-5" />,
      value: FURNISHING_LABELS[property.furnishing] ?? property.furnishing,
      label: "Furnishing",
    });
  }

  if (property.possessionStatus) {
    specs.push({
      icon: <Calendar className="size-5" />,
      value:
        POSSESSION_STATUS_LABELS[property.possessionStatus] ??
        property.possessionStatus,
      label: "Possession",
    });
  }

  if (specs.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {specs.map((spec) => (
        <div
          key={spec.label}
          className="flex flex-col items-center gap-1.5 rounded-xl border bg-muted/30 p-4 text-center transition-colors hover:bg-muted/50"
        >
          <div className="text-primary">{spec.icon}</div>
          <span className="text-base font-semibold text-foreground">
            {spec.value}
          </span>
          <span className="text-xs text-muted-foreground">{spec.label}</span>
        </div>
      ))}
    </div>
  );
}
