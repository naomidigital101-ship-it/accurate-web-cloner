import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";

export function PageShell({ title, en = false, children }: { title: string; en?: boolean; children: React.ReactNode }) {
  return (
    <div dir={en ? "ltr" : "rtl"} lang={en ? "en" : "he"} className="page-shell">
      <Header en={en} />
      <main className="page-content">
        <h1 className={en ? "page-title page-title-ltr" : "page-title"}><span>{title}</span></h1>
        {children}
      </main>
      <Footer />
    </div>
  );
}
