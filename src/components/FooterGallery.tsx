import { thumb, thumbFallback, thumbSize } from "@/lib/thumb";

/**
 * גלריית התמונות שמעל הפוטר. הופרדה מהפוטר עצמו כדי שהפוטר יוכל לרוץ בכל האתר
 * בלי לגרור 28 תמונות לכל עמוד. מוצגת בעמודי הבית בלבד, כפי שהיה מאז ומעולם.
 */
export const gallery = [

  "g1.webp", "g2.webp", "g3.jpg", "g4.jpg", "g5.webp", "g6.jpg", "g7.jpg",
  "g8.jpg", "g9.jpg", "g10.jpg", "g11.webp", "g12.jpg", "g13.jpg", "g14.jpg",
  "g15.webp", "g16.webp", "g17.jpg", "g18.webp", "g19.webp", "g20.jpg",
  "g21.jpg", "g22.webp", "g23.jpg", "g24.webp", "g25.jpg", "g26.webp",
  "g27.jpg", "g28.jpg",
];

export function FooterGallery({ images }: { images?: { url: string; alt: string | null }[] } = {}) {
  return (
    <section dir="rtl" className="footer-gallery-section" aria-label="גלריית תמונות">
      <div className="footer-gallery">
        {(images ?? gallery.map((g) => ({ url: `/wp/uploads/gallery/${g}`, alt: null }))).map((g) => (
          <img
            key={g.url}
            src={thumb(g.url)}
            data-full={g.url}
            width={thumbSize(g.url)?.[0]}
            height={thumbSize(g.url)?.[1]}
            onError={(e) => thumbFallback(e, g.url)}
            alt={g.alt ?? "רגעים ממיזם קשר של תפילין"}
            className="footer-gallery-img"
            loading="lazy"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              // הלייטבוקס נפתח ב-click בלבד; בלי זה 28 התמונות ממוקדות אך לא נפתחות במקלדת
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.currentTarget.click();
              }
            }}
            style={{ cursor: "zoom-in" }} decoding="async" />
        ))}
      </div>
    </section>
  );
}
