import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  CheckCircle,
  ExternalLink,
  Building2,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ImageGallery } from "@/components/property/image-gallery";
import { PropertySpecs } from "@/components/property/property-specs";
import { InquiryForm } from "@/components/property/inquiry-form";
import { SimilarProperties } from "@/components/property/similar-properties";
import {
  getPropertyBySlug,
  getSimilarProperties,
} from "@/lib/actions/public-properties";
import {
  PROPERTY_TYPE_LABELS,
  LISTING_TYPE_LABELS,
  PRICE_UNIT_LABELS,
} from "@/lib/constants";

export const revalidate = 3600; // Revalidate every hour

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

function formatPrice(price: number, unit: string): string {
  if (unit === "CRORE") {
    return `${price % 1 === 0 ? price.toFixed(0) : price.toFixed(1)} Crore`;
  }
  return `${price % 1 === 0 ? price.toFixed(0) : price.toFixed(1)} Lakh`;
}

function getPrimaryImageUrl(
  images: { imageUrl: string; isPrimary: boolean }[],
): string | null {
  const primary = images.find((img) => img.isPrimary);
  if (primary) return primary.imageUrl;
  if (images.length > 0) return images[0].imageUrl;
  return null;
}

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return { title: "Property Not Found" };
  }

  const primaryImage = getPrimaryImageUrl(property.images);
  const description =
    property.description?.slice(0, 160) ||
    `${property.title} - ${PROPERTY_TYPE_LABELS[property.propertyType]} ${LISTING_TYPE_LABELS[property.listingType]} in ${property.locality ? `${property.locality}, ` : ""}${property.city}`;

  return {
    title: `${property.title} | City Nexa Networks`,
    description,
    openGraph: {
      title: property.title,
      description,
      ...(primaryImage ? { images: [{ url: primaryImage }] } : {}),
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const similarProperties = await getSimilarProperties(
    property.id,
    property.propertyType,
    property.locality,
  );

  const amenities = (property.amenities as string[]) || [];
  const primaryImage = getPrimaryImageUrl(property.images);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description || "",
    url: `https://citynexa.vercel.app/properties/${property.slug}`,
    ...(primaryImage ? { image: primaryImage } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: property.locality || property.city,
      addressRegion: property.state,
      addressCountry: "IN",
      ...(property.pincode ? { postalCode: property.pincode } : {}),
    },
    offers: {
      "@type": "Offer",
      price: property.priceUnit === "CRORE" ? property.price * 10000000 : property.price * 100000,
      priceCurrency: "INR",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Image Gallery */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <ImageGallery images={property.images} propertyTitle={property.title} />
      </section>

      {/* Main Content + Sidebar */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content (2/3) */}
          <div className="space-y-8 lg:col-span-2">
            {/* Title and Location */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {PROPERTY_TYPE_LABELS[property.propertyType] ??
                    property.propertyType}
                </Badge>
                <Badge
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  {LISTING_TYPE_LABELS[property.listingType] ??
                    property.listingType}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {property.title}
              </h1>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-4 shrink-0" />
                <span>
                  {[property.locality, property.city, property.state]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            </div>

            <Separator />

            {/* Specs Grid */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Property Details
              </h2>
              <PropertySpecs property={property} />
            </div>

            {/* Description */}
            {property.description && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Description
                  </h2>
                  <div className="prose prose-slate max-w-none dark:prose-invert">
                    <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                      {property.description}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Amenities
                  </h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2.5"
                      >
                        <CheckCircle className="size-4 shrink-0 text-green-600" />
                        <span className="text-sm text-foreground">
                          {amenity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Google Maps */}
            {property.latitude != null && property.longitude != null && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Location
                  </h2>
                  <div className="overflow-hidden rounded-xl border">
                    <iframe
                      src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
                      className="h-[350px] w-full border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map showing location of ${property.title}`}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Price Card */}
            <Card className="border-2 border-primary/20 shadow-md">
              <CardContent className="space-y-4 p-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Price
                  </p>
                  <p className="text-3xl font-bold text-[#1B3A5C]">
                    &#8377;{formatPrice(property.price, property.priceUnit)}
                  </p>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">
                      {PROPERTY_TYPE_LABELS[property.propertyType] ??
                        property.propertyType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Listing</span>
                    <span className="font-medium">
                      {LISTING_TYPE_LABELS[property.listingType] ??
                        property.listingType}
                    </span>
                  </div>
                  {property.reraNumber && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Shield className="size-3.5" /> RERA
                      </span>
                      <span className="font-medium text-xs">
                        {property.reraNumber}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Builder Card */}
            <Card>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  {property.builder.logoUrl ? (
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border bg-white">
                      <Image
                        src={property.builder.logoUrl}
                        alt={property.builder.name}
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    </div>
                  ) : (
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-muted">
                      <Building2 className="size-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {property.builder.name}
                    </p>
                    <p className="text-xs text-muted-foreground">Builder</p>
                  </div>
                </div>
                {property.builder.description && (
                  <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                    {property.builder.description}
                  </p>
                )}
                {property.builder.websiteUrl && (
                  <a
                    href={property.builder.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                  >
                    <ExternalLink className="size-3.5" />
                    Visit Website
                  </a>
                )}
                <Link
                  href={`/builders/${property.builder.id}`}
                  className="block text-center text-xs font-medium text-[#1B3A5C] hover:underline"
                >
                  View all properties by {property.builder.name}
                </Link>
              </CardContent>
            </Card>

            {/* Inquiry Form */}
            <Card>
              <CardContent className="p-6">
                <InquiryForm
                  propertyId={property.id}
                  propertyTitle={property.title}
                  inquiryType="PROPERTY_SPECIFIC"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <Separator className="mb-8" />
          <SimilarProperties properties={similarProperties} />
        </section>
      )}
    </div>
  );
}
