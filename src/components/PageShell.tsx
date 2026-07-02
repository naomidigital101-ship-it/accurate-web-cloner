import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";

export function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div dir="rtl" lang="he" className="page-shell">
      <Header />
      <main className="page-content">
        <h1 className="page-title"><span>{title}</span></h1>
        {children}
      </main>
      <Footer />
    </div>
  );
}
