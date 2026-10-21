// Previous bundle prices documented in commit 16f1370, before the 19 Oct price update.
// Display only: checkout amounts and shipping are owned by the existing pages.
const PREVIOUS_PRICES: Record<number, number> = { 1: 78, 2: 143, 3: 199 };

export function BookLaunchPrice({ quantity }: { quantity: number }) {
  return (
    <span className="book-launch-price" style={{ display: "block", fontSize: 14, lineHeight: 1.6, fontWeight: 500, marginBlock: "8px 4px" }}>
      <span style={{ display: "block" }}>מחיר מיוחד לרגל השקת הספר</span>
      <span>מחיר קודם: <s>{PREVIOUS_PRICES[quantity]} ₪</s></span>
    </span>
  );
}
