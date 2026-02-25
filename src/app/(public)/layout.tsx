import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { WhatsAppButton } from "@/components/common/whatsapp-button";
import { ShortlistProvider } from "@/lib/shortlist-context";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShortlistProvider>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
    </ShortlistProvider>
  );
}
