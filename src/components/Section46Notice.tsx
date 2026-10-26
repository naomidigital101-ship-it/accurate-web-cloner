export const SECTION46_PDF = "/documents/section-46-2026-2028.pdf";

/** Donation information only; never present a book payment as a donation. */
export function Section46Notice({ en = false, compact = false, dark = false }: { en?: boolean; compact?: boolean; dark?: boolean }) {
  return (
    <aside dir={en ? "ltr" : "rtl"} aria-label={en ? "Section 46 donation approval" : "אישור תרומות לפי סעיף 46"}
      style={{ margin: "20px auto", padding: compact ? "12px 18px" : "24px", maxWidth: 700, borderRadius: 16, border: `1px solid ${dark ? "#67ffd180" : "#c6e5dc"}`, background: dark ? "#080b32e6" : "#effaf6", color: dark ? "#fff" : "#181b44", fontSize: compact ? 16 : 18, lineHeight: 1.65, textAlign: "start" }}>
      <strong style={{ display: "block" }}>{en ? "Donations recognized under Section 46 in Israel" : "התרומות לעמותה מוכרות לזיכוי מס לפי סעיף 46"}</strong>
      {!compact && <p style={{ margin: "10px 0", fontSize: "inherit", color: "inherit", lineHeight: "inherit" }}>{en ? "Eligible individual donors can receive an Israeli income tax credit of 35% of their donation, subject to statutory thresholds, limits and tax liability. Keep your donation receipt to claim the credit. This is not an automatic refund." : "תורמים פרטיים זכאים יכולים לקבל זיכוי ממס הכנסה בשיעור 35% מסכום התרומה, בכפוף לסכומי הסף, לתקרות ולחבות המס. שמרו את קבלת התרומה לצורך מימוש הזיכוי; הוא אינו החזר אוטומטי."}</p>}
      <a href={SECTION46_PDF} target="_blank" rel="noopener" style={{ color: dark ? "#86ffdc" : "#095d4d", textDecoration: "underline", textUnderlineOffset: 4 }}>{en ? "View the approval (PDF, Hebrew)" : "לצפייה באישור רשות המסים (PDF)"}</a>
      {!compact && <p style={{ margin: "10px 0 0", fontSize: 14, color: "inherit" }}>{en ? "Approval valid: 21 October 2026–31 December 2028. Applies to donations, not book purchases." : "תוקף האישור: 21.10.2026–31.12.2028. ההטבה מיועדת לתרומות, ולא לרכישת הספר."}</p>}
    </aside>
  );
}
