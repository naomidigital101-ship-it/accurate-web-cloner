const gallery = [
  "g1.webp", "g2.webp", "g3.jpg", "g4.jpg", "g5.webp", "g6.jpg", "g7.jpg",
  "g8.jpg", "g9.jpg", "g10.jpg", "g11.png", "g12.jpg", "g13.jpg", "g14.jpg",
  "g15.webp", "g16.webp", "g17.jpg", "g18.webp", "g19.webp", "g20.jpg",
  "g21.jpg", "g22.webp", "g23.jpg", "g24.webp", "g25.jpg", "g26.webp",
  "g27.jpg", "g28.jpg",
];

function PhoneIcon() {
  return (
    <svg viewBox="0 0 512 512" width="16" height="16" fill="#67ffd1" aria-hidden="true">
      <path d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z" />
    </svg>
  );
}

function HouseIcon() {
  return (
    <svg viewBox="0 0 576 512" width="16" height="16" fill="#67ffd1" aria-hidden="true">
      <path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z" />
    </svg>
  );
}

export function Footer() {
  return (
    <>
      <section dir="rtl" className="footer-gallery-section" aria-label="גלריית תמונות">
        <div className="footer-gallery">
          {gallery.map((g) => (
            <img
              key={g}
              src={`/wp/uploads/gallery/${g}`}
              alt="רגעים ממיזם קשר של תפילין"
              className="footer-gallery-img"
              loading="lazy"
            />
          ))}
        </div>
      </section>
      <footer dir="rtl" className="footer-e footer-brand-only">
        <a href="/" aria-label="אור חדש - דף הבית" className="footer-brand-logo">
          <img src="/wp/img/אור-חדש-לוגו-13.svg" alt="אור חדש" />
        </a>
        <h2 className="footer-tagline">
          לקידום והעצמה של בעלי תשובה ומתקרבים ליהדות
          <br />
          ע"ר: 580703965
        </h2>
        <div className="footer-contact-row">
          <a href="tel:0546713966" aria-label="התקשרו אלינו: 054-6713966">
            <PhoneIcon />
            054-6713966
          </a>
          <a
            href="https://waze.com/ul?q=בית%20אל,%20ארץ%20חמדה%2033&z=10&navigate=yes"
            target="_blank"
            rel="noopener"
            aria-label="ניווט בוויז לכתובת: בית אל, ארץ חמדה 33"
          >
            <HouseIcon />
            בית אל, ארץ חמדה 33
          </a>
        </div>
        <a href="https://kavnekuda.com" target="_blank" rel="noopener" aria-label="אפיון, בניה ופיתוח: KAV" className="footer-credit-link">
          <img src="/wp/img/קרדיט-45.svg" alt="אפיון, בניה ופיתוח: KAV" />
        </a>
      </footer>
    </>
  );
}
