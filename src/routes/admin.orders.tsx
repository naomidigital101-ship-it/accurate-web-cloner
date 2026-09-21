import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { getAccessToken } from "@/lib/supabase-browser";
import { listOrders, updateOrder, type BookOrder } from "@/lib/api/orders.functions";

export const Route = createFileRoute("/admin/orders")({ component: Orders });
const money = (n: number) => new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format(n / 100);
function Orders() {
  const [orders, setOrders] = useState<BookOrder[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    try {
      const data = await listOrders({ data: { accessToken: await getAccessToken() ?? undefined, page } });
      setOrders(data.orders); setCount(data.count); setLast(data.lastReceived); setError("");
    } catch { setError("לא ניתן לטעון את הרכישות. נסו לרענן או להתחבר מחדש."); }
    finally { setLoading(false); }
  }, [page]);
  useEffect(() => {
    setLoading(true); void refresh();
    const interval = setInterval(() => { if (!document.hidden) void refresh(); }, 15000);
    return () => clearInterval(interval);
  }, [refresh]);
  return <section dir="rtl">
    <h1>רכישות ותשלומים</h1>
    <p>תשלומים שהתקבלו מ־Grow. הרשימה מתעדכנת אוטומטית כל 15 שניות. סטטוס הטיפול מתייחס להכנת ההזמנה ואספקתה.</p>
    <p>החיבור מתעד רכישות חדשות ממועד הפעלתו; עסקאות קודמות והחזרים אינם מיובאים אוטומטית.</p>
    <button type="button" onClick={() => void refresh()}>רענון רכישות</button>
    <p aria-live="polite">{loading ? "טוען רכישות…" : `${count} תשלומים התקבלו`}</p>
    {last && <p>דיווח אחרון התקבל: {new Date(last).toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })}</p>}
    {error && <p role="alert">{error}</p>}
    {!loading && !error && !orders.length && <p>טרם התקבלו רכישות. תשלום חדש שידווח מ־Grow יופיע כאן.</p>}
    <div style={{ display: "grid", gap: 16 }}>
      {orders.map(order => <article key={order.id} style={{ border: "1px solid #d5dce8", borderRadius: 16, padding: 20, background: "white", overflowWrap: "anywhere" }}>
        <h2 style={{ fontSize: 20 }}>{order.full_name || "שם לא נמסר"} · {money(order.amount_agorot)}</h2>
        <p><strong>שולם ב־Grow</strong> · אסמכתת עסקה: <bdi>{order.provider_transaction_id}</bdi></p>
        <p>תאריך תשלום: {order.provider_payment_date || "לא נמסר"} · נקלט באתר: {new Date(order.received_at).toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })}</p>
        {order.description && <p>{order.description}</p>}
        {order.products.length > 0 && <ul>{order.products.map((p, i) => <li key={i}>{p.name} · כמות: {p.quantity || "לא נמסרה"}</li>)}</ul>}
        <p>טלפון: <bdi>{order.phone || "לא נמסר"}</bdi> · מייל: <bdi>{order.email || "לא נמסר"}</bdi></p>
        <p>כתובת: {order.address || "לא נמסרה"}</p>
        <p><strong>{order.shipping_method || "אופן קבלה לא נמסר"}</strong> · דמי משלוח: {order.shipping_agorot === null ? "לא נמסרו בנפרד" : money(order.shipping_agorot)} (כלולים בסכום ששולם)</p>
        <label>טיפול בהזמנה <select value={order.fulfillment} disabled={saving === order.id} onChange={async e => {
          const fulfillment = e.target.value as BookOrder["fulfillment"];
          setSaving(order.id);
          try { await updateOrder({ data: { accessToken: await getAccessToken() ?? undefined, id: order.id, fulfillment } }); await refresh(); }
          catch { setError("לא ניתן לשמור את סטטוס הטיפול. נסו שוב."); }
          finally { setSaving(null); }
        }}><option value="new">חדש</option><option value="processing">בטיפול</option><option value="fulfilled">נשלח / נאסף</option></select></label>
      </article>)}
    </div>
    <nav aria-label="עמודי רכישות" style={{ display: "flex", gap: 16, marginTop: 20 }}>
      <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>הקודם</button>
      <span>עמוד {page + 1}</span>
      <button disabled={(page + 1) * 50 >= count} onClick={() => setPage(p => p + 1)}>הבא</button>
    </nav>
  </section>;
}
