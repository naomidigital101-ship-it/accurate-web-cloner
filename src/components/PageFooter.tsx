export function PageFooter() {
  return (
    <footer dir="rtl" className="page-footer">
      <a href="/" aria-label="אור חדש">
        <img src="/wp/img/אור-חדש-לוגו-13.svg" alt="אור חדש" className="page-footer-logo" />
      </a>
      <p className="page-footer-tagline">
        לקידום והעצמה של בעלי תשובה ומתקרבים ליהדות<br />
        ע"ר: 580703965
      </p>
      <div className="page-footer-contact">
        <span>בית אל, ארץ חמדה 33</span>
        <a href="tel:0546713966">054-6713966</a>
      </div>
      <img src="/wp/img/קרדיט-45.svg" alt="אפיון, בניה ופיתוח: KAV" className="page-footer-credit" />
    </footer>
  );
}
