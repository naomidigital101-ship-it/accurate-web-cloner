import { useRef, useState } from "react";
import "./BookMediaSlider.css";

const root = "/book/media/";
const articleLinks: Record<string, string> = {
  karov: "https://karovel.co.il/הכתבה-המרכזית/שחור-על-גבי-לב/",
  makor: "https://www.makorrishon.co.il/news/local/article/370857",
};
const publications = [
  { id: "video", logo: "i24.svg", name: "i24NEWS", image: "interview", title: "ראיון עם אלירז שדה", text: "מהמפגשים עם מבקשי התפילין אל הספר", action: "לצפייה בראיון · 5:46" },
  { id: "karov", logo: "karov.png", name: "קרוב אליך", image: "karov", title: "שחור על גבי לב", text: "״היה לי חשוב להביא את התופעה הזו ישירות מהשטח״", action: "לקריאת הכתבה" },
  { id: "makor", logo: "makor.svg", name: "מקור ראשון", image: "makor", title: "הרב עמיחי איל: אנשי השנה", text: "כתבת פרופיל על המיזם ועל הספר שיצא בעקבותיו", action: "לקריאת הכתבה" },
  { id: "hed", logo: "hed.png", name: "הד העיר", image: "hed", title: "שומר על הקשר", text: "על חלוקת התפילין ועל האנשים שהחליטו להתחיל להניח אותן", action: "לקריאת הכתבה" },
];
export function BookMediaSlider({ campaign = false }: { campaign?: boolean }) {
  const items = campaign ? publications.slice(0, 3) : publications;
  const rail = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<(typeof publications)[number] | null>(null);
  function sync() {
    const el = rail.current;
    if (!el) return;
    const edge = el.getBoundingClientRect().right;
    const children = [...el.children];
    setIndex(children.reduce((best, card, i) => Math.abs(card.getBoundingClientRect().right - edge) < Math.abs(children[best].getBoundingClientRect().right - edge) ? i : best, 0));
  }
  function move(delta: number) {
    const el = rail.current;
    if (!el) return;
    const next = Math.max(0, Math.min(items.length - 1, index + delta));
    el.scrollBy({ left: el.children[next].getBoundingClientRect().right - el.getBoundingClientRect().right, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  function open(item: (typeof publications)[number]) { setSelected(item); dialog.current?.showModal(); }
  return <section className={`book-media ${campaign ? "book-media--campaign" : ""}`} dir="rtl" aria-labelledby="book-media-title" data-book-media="approved-slider">
    <div className="book-media-heading"><div><h2 id="book-media-title">{campaign ? "הספר בתקשורת" : "הספר והמיזם בתקשורת"}</h2></div><div className="book-media-controls"><button type="button" onClick={() => move(-1)} disabled={index === 0} aria-label="הפרסום הקודם">→</button><span aria-live="polite">{index + 1} / {items.length}</span><button type="button" onClick={() => move(1)} disabled={index === items.length - 1} aria-label="הפרסום הבא">←</button></div></div>
    <div ref={rail} className="book-media-rail" role="region" aria-roledescription="קרוסלה" aria-label="פרסומים בתקשורת" tabIndex={0} onScroll={sync} onKeyDown={e => { if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); move(e.key === "ArrowLeft" ? 1 : -1); } }}>
      {items.map(item => <article className="book-media-card" key={item.id} aria-label={item.name}>
        {item.id === "video" ? <button type="button" className="book-media-image book-media-video" onClick={() => open(item)} aria-label="צפייה בראיון עם הרב עמיחי איל"><img src={`${root}${item.image}.webp`} alt="מתוך הראיון" loading="lazy" width="800" height="560" /><span>▶</span></button> : !campaign && articleLinks[item.id] ? <a className="book-media-image" href={articleLinks[item.id]} target="_blank" rel="noopener noreferrer" aria-label={`לכתבה באתר ${item.name} (נפתח בלשונית חדשה)`}><img src={`${root}${item.image}.webp`} alt={`מתוך הפרסום ב${item.name}`} loading="lazy" width="800" height="560" /></a> : <div className="book-media-image"><img src={`${root}${item.image}.webp`} alt={`מתוך הפרסום ב${item.name}`} loading="lazy" width="800" height="560" /></div>}
        <div className="book-media-copy"><div className="book-media-meta"><img className={item.id === "karov" ? "book-media-karov" : ""} src={`${root}logo-${item.logo}`} alt={item.name} width="105" height="34" loading="lazy" /><span>{item.id === "hed" ? "המיזם והעמותה" : "הספר והמיזם"}</span></div><h3>{item.title}</h3><p>{item.text}</p>{item.id === "video" ? <button type="button" className="book-media-link" onClick={() => open(item)}>{item.action} ←</button> : !campaign && articleLinks[item.id] ? <a className="book-media-link" href={articleLinks[item.id]} target="_blank" rel="noopener noreferrer">לכתבה באתר {item.name} ↗</a> : null}</div>
      </article>)}
    </div><p className="book-media-hint">{campaign ? "אפשר להחליק בין הפרסומים ולצפות בראיון" : "אפשר להחליק בין הפרסומים · הכתבות המקושרות נפתחות באתר המפרסם"}</p>
    <dialog className="book-media-dialog" ref={dialog} aria-labelledby="book-media-dialog-title" onClose={() => setSelected(null)} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}>
      <header><h2 id="book-media-dialog-title">{selected?.name} · {selected?.title}</h2><button type="button" autoFocus aria-label="סגירת התצוגה" onClick={() => dialog.current?.close()}>×</button></header>
      {selected?.id === "video" && <video controls playsInline preload="metadata" poster={`${root}interview.webp`} src={`${root}interview.mp4`} />}
    </dialog>
  </section>;
}
