import { useEffect, useState, useCallback } from "react";

export function InnerPageFx() {
  const [gallery, setGallery] = useState<{ src: string; title: string }[]>([]);
  const [index, setIndex] = useState(-1);
  const open = index >= 0;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a.doc-card-letter") as HTMLAnchorElement | null;
      if (!a) return;
      e.preventDefault();
      const links = Array.from(document.querySelectorAll("a.doc-card-letter")) as HTMLAnchorElement[];
      const items = links.map((l) => ({ src: l.getAttribute("href") || "", title: l.querySelector("img")?.getAttribute("alt") || "" }));
      setGallery(items);
      setIndex(links.indexOf(a));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const close = useCallback(() => setIndex(-1), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + gallery.length) % gallery.length), [gallery.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % gallery.length), [gallery.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, close, next, prev]);

  useEffect(() => {
    const strip = document.querySelector(".page-bg-strip") as HTMLElement | null;
    if (!strip) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { strip.style.transform = `translateY(${-window.scrollY * 0.06}px)`; });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  if (!open) return null;
  const item = gallery[index];
  return (
    <div className="lb-overlay" onClick={close}>
      <button className="lb-close" onClick={close} aria-label="Close">×</button>
      {gallery.length > 1 && <button className="lb-nav lb-prev" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous">‹</button>}
      <img className="lb-img" src={item.src} alt={item.title} onClick={(e) => e.stopPropagation()} />
      {gallery.length > 1 && <button className="lb-nav lb-next" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next">›</button>}
    </div>
  );
}
