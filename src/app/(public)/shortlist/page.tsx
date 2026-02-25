import { redirect } from "next/navigation";
import { getFeatureFlags } from "@/lib/feature-flags";
import { ShortlistContent } from "./shortlist-content";

export default async function ShortlistPage() {
  const features = await getFeatureFlags();
  if (!features.shortlist) redirect("/");

  return <ShortlistContent />;
}
