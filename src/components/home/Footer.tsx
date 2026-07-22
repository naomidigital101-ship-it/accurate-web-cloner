export function Footer() {
  return (
    <footer dir="rtl" className="footer-e footer-brand-only">
      <a href="/" aria-label="אור חדש - דף הבית" className="footer-brand-logo">
        <img src="/wp/img/אור-חדש-לוגו-01.svg" alt="אור חדש" />
      </a>
      <p className="footer-tagline">
        לקידום והעצמה של בעלי תשובה ומתקרבים ליהדות
        <br />
        ע"ר: 580703965
      </p>
      <div className="footer-contact-row">
        <a href="https://waze.com/ul?q=בית אל, ארץ חמדה 33" target="_blank" rel="noopener">
          בית אל, ארץ חמדה 33
        </a>
        <a href="tel:0546713966">054-6713966</a>
      </div>
      <a href="https://kavnekuda.com" target="_blank" rel="noopener" aria-label="אפיון, בניה ופיתוח: KAV" className="footer-credit-link">
        <img src="/wp/img/קרדיט-45.svg" alt="אפיון, בניה ופיתוח: KAV" />
      </a>
      <p className="footer-rights">כל הזכויות שמורות</p>
    </footer>
  );
}
