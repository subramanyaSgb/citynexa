import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { WhatsAppButton } from "@/components/common/whatsapp-button";
import { ShortlistProvider } from "@/lib/shortlist-context";
import { CompareProvider } from "@/lib/compare-context";
import { CompareBar } from "@/components/property/compare-bar";
import { getSetting } from "@/lib/actions/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const whatsappPhone = await getSetting("whatsapp_phone");

  return (
    <ShortlistProvider>
      <CompareProvider>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CompareBar />
        <WhatsAppButton phoneNumber={whatsappPhone || "919880875721"} />
      </CompareProvider>
    </ShortlistProvider>
  );
}
