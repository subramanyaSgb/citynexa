import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { WhatsAppButton } from "@/components/common/whatsapp-button";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
