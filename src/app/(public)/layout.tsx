import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { WhatsAppButton } from "@/components/common/whatsapp-button";
import { ShortlistProvider } from "@/lib/shortlist-context";
import { getSetting } from "@/lib/actions/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const whatsappPhone = await getSetting("whatsapp_phone");

  return (
    <ShortlistProvider>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton phoneNumber={whatsappPhone || "919876543210"} />
    </ShortlistProvider>
  );
}
