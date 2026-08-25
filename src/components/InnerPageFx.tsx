import { useEffect, useState, useCallback } from "react";

export function InnerPageFx() {
  const [gallery, setGallery] = useState<{ src: string; title: string }[]>([]);
  const [index, setIndex] = useState(-1);
  const open = index >= 0;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const a = target.closest("a.doc-card-letter") as HTMLAnchorElement | null;
      if (a) {
        e.preventDefault();
        const links = Array.from(document.querySelectorAll("a.doc-card-letter")) as HTMLAnchorElement[];
        const items = links.map((l) => ({ src: l.getAttribute("href") || "", title: l.querySelector("img")?.getAttribute("alt") || "" }));
        setGallery(items);
        setIndex(links.indexOf(a));
        return;
      }
      const g = target.closest("img.footer-gallery-img") as HTMLImageElement | null;
      if (!g) return;
      e.preventDefault();
      const imgs = Array.from(document.querySelectorAll("img.footer-gallery-img")) as HTMLImageElement[];
      setGallery(imgs.map((i) => ({ src: i.currentSrc || i.src, title: i.alt })));
      setIndex(imgs.indexOf(g));
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
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const strip = document.querySelector(".page-bg-strip") as HTMLElement | null;
        if (strip) strip.style.transform = `translateY(${-window.scrollY * 0.06}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  if (!open) return null;
  const item = gallery[index];
  return (
    <div className="lb-overlay" onClick={close}>
      <button className="lb-close" onClick={close} aria-label="Close">×</button>
      {gallery.length > 1 && <button className="lb-nav lb-prev" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous">‹</button>}
      <img className="lb-img" src={item.src} alt={item.title} onClick={(e) => e.stopPropagation()} loading="lazy" decoding="async" />
      {gallery.length > 1 && <button className="lb-nav lb-next" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next">›</button>}
    </div>
  );
}
