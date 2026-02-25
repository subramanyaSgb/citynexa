import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { WhatsAppButton } from "@/components/common/whatsapp-button";
import { ShortlistProvider } from "@/lib/shortlist-context";
import { CompareProvider } from "@/lib/compare-context";
import { CompareBar } from "@/components/property/compare-bar";
import { getSetting } from "@/lib/actions/settings";
import { MaintenancePage } from "@/components/common/maintenance-page";
import { getFeatureFlags } from "@/lib/feature-flags";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [siteLive, shutdownDate, shutdownMessage, whatsappPhone] =
    await Promise.all([
      getSetting("site_live"),
      getSetting("shutdown_date"),
      getSetting("shutdown_message"),
      getSetting("whatsapp_phone"),
    ]);

  // Check kill switch
  const isKilled = siteLive === "false";

  // Check scheduled shutdown
  const isScheduledDown =
    shutdownDate ? new Date(shutdownDate) <= new Date() : false;

  if (isKilled || isScheduledDown) {
    return <MaintenancePage message={shutdownMessage || undefined} />;
  }

  const features = await getFeatureFlags();

  return (
    <ShortlistProvider>
      <CompareProvider>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CompareBar />
        {features.whatsapp && (
          <WhatsAppButton phoneNumber={whatsappPhone || "919880875721"} />
        )}
      </CompareProvider>
    </ShortlistProvider>
  );
}
