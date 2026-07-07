import { Header } from "@/components/home/Header";
import { PageFooter } from "@/components/PageFooter";
import { InnerPageFx } from "@/components/InnerPageFx";

export function PageShell({ title, en = false, children }: { title: string; en?: boolean; children: React.ReactNode }) {
  return (
    <div dir={en ? "ltr" : "rtl"} lang={en ? "en" : "he"} className={en ? "page-shell page-shell-en" : "page-shell"}>
      <div className="page-bg-strip" aria-hidden="true" />
      <Header en={en} />
      <main className={en ? "page-content page-content-en" : "page-content"}>
        <h1 className={en ? "page-title page-title-ltr" : "page-title"}><span>{title}</span></h1>
        {children}
      </main>
      <PageFooter />
      <InnerPageFx />
    </div>
  );
}
