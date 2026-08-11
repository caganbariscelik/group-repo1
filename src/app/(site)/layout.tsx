import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NeonMesh } from "@/components/ui/neon-mesh";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NeonMesh
        title=""
        subtitle=""
        description=""
        className="fixed inset-0 overflow-hidden bg-black"
      />
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="relative flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
