export function Footer() {
  return (
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
        <a href="tel:0546713966">054-6713966</a>
        <a href="https://waze.com/ul?q=בית%20אל,%20ארץ%20חמדה%2033&z=10&navigate=yes" target="_blank" rel="noopener">
          בית אל, ארץ חמדה 33
        </a>
      </div>
      <a href="https://kavnekuda.com" target="_blank" rel="noopener" aria-label="אפיון, בניה ופיתוח: KAV" className="footer-credit-link">
        <img src="/wp/img/קרדיט-45.svg" alt="אפיון, בניה ופיתוח: KAV" />
      </a>
    </footer>
  );
}
