"use client";

import "leaflet/dist/leaflet.css";

import { useMemo } from "react";
import Link from "next/link";
import L from "leaflet";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { MapPin } from "lucide-react";
import {
  PROPERTY_TYPE_LABELS,
  LISTING_TYPE_LABELS,
} from "@/lib/constants";
import type { MapProperty } from "./property-map";

interface PropertyMapInnerProps {
  properties: MapProperty[];
}

// Bangalore center coordinates
const BANGALORE_CENTER: [number, number] = [12.9716, 77.5946];
const DEFAULT_ZOOM = 11;

// Color scheme per property type
function getMarkerColor(propertyType: string): string {
  switch (propertyType) {
    case "RESIDENTIAL":
      return "#1b3a5c"; // navy - residential
    case "COMMERCIAL":
      return "#16a34a"; // green - commercial
    case "PLOT":
      return "#c5956b"; // copper - plots
    default:
      return "#1b3a5c";
  }
}

function formatPrice(price: number, unit: string): string {
  if (unit === "CRORE") {
    return `${price % 1 === 0 ? price.toFixed(0) : price.toFixed(1)} Cr`;
  }
  return `${price % 1 === 0 ? price.toFixed(0) : price.toFixed(1)} L`;
}

export function PropertyMapInner({ properties }: PropertyMapInnerProps) {
  // Calculate bounds if there are properties, otherwise use Bangalore center
  const bounds = useMemo(() => {
    if (properties.length === 0) return null;

    const latLngs = properties.map(
      (p) => [p.latitude!, p.longitude!] as [number, number]
    );

    return L.latLngBounds(latLngs);
  }, [properties]);

  return (
    <div className="space-y-3">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-warm-200 bg-white px-4 py-2.5">
        <span className="text-xs font-medium text-warm-500">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block size-3 rounded-full"
            style={{ backgroundColor: "#1b3a5c" }}
          />
          <span className="text-xs text-warm-700">Residential</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block size-3 rounded-full"
            style={{ backgroundColor: "#16a34a" }}
          />
          <span className="text-xs text-warm-700">Commercial</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block size-3 rounded-full"
            style={{ backgroundColor: "#c5956b" }}
          />
          <span className="text-xs text-warm-700">Plot</span>
        </div>
        <span className="ml-auto text-xs text-warm-400">
          {properties.length} propert{properties.length === 1 ? "y" : "ies"} on
          map
        </span>
      </div>

      {/* Map */}
      <div className="overflow-hidden rounded-2xl border border-warm-200 shadow-sm">
        <MapContainer
          center={BANGALORE_CENTER}
          zoom={DEFAULT_ZOOM}
          bounds={bounds ?? undefined}
          boundsOptions={{ padding: [40, 40] }}
          scrollWheelZoom={true}
          style={{ height: "600px", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {properties.map((property) => {
            const color = getMarkerColor(property.propertyType);

            return (
              <CircleMarker
                key={property.id}
                center={[property.latitude!, property.longitude!]}
                radius={10}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.7,
                  weight: 2,
                  opacity: 0.9,
                }}
              >
                <Popup>
                  <div className="min-w-[220px] space-y-2 p-1">
                    <h3 className="text-sm font-semibold leading-tight text-warm-900">
                      {property.title}
                    </h3>

                    <div className="flex items-center gap-1.5">
                      <span
                        className="inline-block size-2 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs text-warm-500">
                        {PROPERTY_TYPE_LABELS[property.propertyType] ??
                          property.propertyType}{" "}
                        &middot;{" "}
                        {LISTING_TYPE_LABELS[property.listingType] ??
                          property.listingType}
                      </span>
                    </div>

                    <p className="text-base font-bold text-copper">
                      &#8377;{formatPrice(property.price, property.priceUnit)}
                    </p>

                    {property.locality && (
                      <div className="flex items-center gap-1 text-xs text-warm-500">
                        <MapPin className="size-3 shrink-0" />
                        <span>
                          {property.locality}, {property.city}
                        </span>
                      </div>
                    )}

                    <Link
                      href={`/properties/${property.slug}`}
                      className="mt-1 inline-block rounded-lg bg-navy px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-navy/90"
                    >
                      View Details
                    </Link>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
