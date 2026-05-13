import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-void-950">
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
    </div>
  );
}
