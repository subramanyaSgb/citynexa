import { getSetting } from "@/lib/actions/settings";

export interface FeatureFlags {
  properties: boolean;
  builders: boolean;
  shortlist: boolean;
  inquiries: boolean;
  testimonials: boolean;
  whatsapp: boolean;
  map: boolean;
}

export async function getFeatureFlags(): Promise<FeatureFlags> {
  const keys = [
    "feature_properties",
    "feature_builders",
    "feature_shortlist",
    "feature_inquiries",
    "feature_testimonials",
    "feature_whatsapp",
    "feature_map",
  ] as const;

  const values = await Promise.all(keys.map((k) => getSetting(k)));

  return {
    properties: values[0] !== "false",
    builders: values[1] !== "false",
    shortlist: values[2] !== "false",
    inquiries: values[3] !== "false",
    testimonials: values[4] !== "false",
    whatsapp: values[5] !== "false",
    map: values[6] !== "false",
  };
}
