import { useRef, useState } from "react";
import { bookReaderReviews } from "@/lib/book-reader-reviews";
import "./BookReaderReviews.css";

type ReaderReview = (typeof bookReaderReviews)[number];

export function BookReaderReviews() {
  const rail = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<ReaderReview | null>(null);

  function move(direction: number) {
    const element = rail.current;
    if (!element) return;
    element.scrollBy({
      left: direction * (element.children[0].getBoundingClientRect().width + 20),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  function open(review: ReaderReview) {
    setSelected(review);
    dialog.current?.showModal();
  }

  return (
    <section className="book-readers" dir="rtl" aria-labelledby="book-readers-title" data-book-readers="reader-messages-v1">
      <div className="book-readers-heading">
        <div>
          <h2 id="book-readers-title">קוראים כותבים על הספר</h2>
          <p>מתוך ההמלצות שנשלחו לרב עמיחי איל</p>
        </div>
        <div className="book-readers-controls">
          <button type="button" aria-label="להמלצות הקודמות" onClick={() => move(1)}>→</button>
          <button type="button" aria-label="להמלצות הבאות" onClick={() => move(-1)}>←</button>
        </div>
      </div>
      <div className="book-readers-rail" ref={rail} role="region" aria-label="המלצות קוראים" tabIndex={0}
        onKeyDown={event => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}>
        {bookReaderReviews.map(review => (
          <figure className="book-readers-card" key={review.id}>
            <button className="book-readers-image" type="button" onClick={() => open(review)} aria-label={`פתיחת ההמלצה של ${review.name}`}>
              <img src={review.image} width={review.width} height={review.height} loading="lazy" decoding="async" alt={`המלצה על הספר קשר של תפילין מאת ${review.name}, בעיצוב הודעה`} />
            </button>
            <figcaption>
              <strong>{review.name}</strong>
              <button type="button" onClick={() => open(review)}>לקריאת ההמלצה</button>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="book-readers-note">המלצות הקוראים מוצגות בעיצוב הודעות. אפשר להחליק בין ההמלצות וללחוץ להגדלה.</p>
      <dialog className="book-readers-dialog" ref={dialog} aria-labelledby="book-readers-dialog-title"
        onClose={() => setSelected(null)} onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }}>
        <div className="book-readers-dialog-heading">
          <h2 id="book-readers-dialog-title">{selected?.name}</h2>
          <button type="button" autoFocus onClick={() => dialog.current?.close()} aria-label="סגירת ההמלצה">×</button>
        </div>
        {selected && <div className="book-readers-expanded">
          <img src={selected.image} width={selected.width} height={selected.height} alt={`ההמלצה של ${selected.name}`} />
          <blockquote>{selected.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</blockquote>
        </div>}
      </dialog>
    </section>
  );
}
