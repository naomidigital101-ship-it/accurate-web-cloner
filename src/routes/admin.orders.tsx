import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useCallback, useEffect, useState } from "react";
import { getAccessToken } from "@/lib/supabase-browser";
import { listOrders, orderCounts, updateOrder, type BookOrder, type OrderStatus } from "@/lib/api/orders.functions";
import { shippingWhatsAppText } from "@/lib/order-communication";

export const Route = createFileRoute("/admin/orders")({ component: OrdersPage });
const STATUS: Record<OrderStatus, string> = { new: "חדש", processing: "בטיפול", fulfilled: "נשלח / נאסף" };
type Filter = OrderStatus | "all";
type Counts = Record<Filter, number>;
const money = (n: number) => new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 2 }).format(n / 100);
const fmt = (iso: string) => new Date(iso).toLocaleString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jerusalem" });
const productLabel = (o: BookOrder) => o.products.length ? o.products.map((p) => `${p.name}${p.quantity ? ` × ${p.quantity}` : ""}`).join(", ") : o.description || "פרטי המוצר לא נמסרו";

const CSV: [string, (o: BookOrder) => string][] = [
  ["נקלט בתאריך", (o) => fmt(o.received_at)], ["תאריך תשלום ב-Grow", (o) => o.provider_payment_date],
  ["סטטוס טיפול", (o) => STATUS[o.fulfillment]], ["שם", (o) => o.full_name], ["טלפון", (o) => o.phone],
  ["אימייל", (o) => o.email], ["כתובת", (o) => o.address], ["מוצרים", productLabel],
  ["סכום ששולם", (o) => (o.amount_agorot / 100).toFixed(2)], ["אופן קבלה", (o) => o.shipping_method],
  ["דמי משלוח", (o) => o.shipping_agorot === null ? "" : (o.shipping_agorot / 100).toFixed(2)],
  ["אסמכתת עסקה", (o) => o.provider_transaction_id],
];
function csv(rows: BookOrder[]) {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return "﻿" + [CSV.map(([h]) => esc(h)).join(","), ...rows.map((r) => CSV.map(([, f]) => esc(f(r))).join(","))].join("\r\n");
}

function OrdersPage() {
  const [orders, setOrders] = useState<BookOrder[] | null>(null);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [status, setStatus] = useState<Filter>("new");
  const [search, setSearch] = useState(""); const [term, setTerm] = useState("");
  const [page, setPage] = useState(0); const [count, setCount] = useState(0);
  const [open, setOpen] = useState<string | null>(null); const [last, setLast] = useState<string | null>(null);
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError("");
    try {
      const accessToken = await getAccessToken() ?? undefined;
      const [result, totals] = await Promise.all([
        listOrders({ data: { accessToken, page, status, search: term || undefined } }), orderCounts({ data: { accessToken } }),
      ]);
      setOrders(result.orders); setCount(result.count); setLast(result.lastReceived); setCounts(totals);
    } catch { setError("טעינת הרכישות נכשלה. נסו לרענן או להתחבר מחדש."); }
  }, [page, status, term]);
  useEffect(() => {
    setOrders(null); void load();
    const timer = setInterval(() => { if (!document.hidden) void load(); }, 15000);
    return () => clearInterval(timer);
  }, [load]);

  const choose = (next: Filter) => { setStatus(next); setPage(0); setOpen(null); };
  const patch = async (id: string, fulfillment: OrderStatus) => {
    setBusy(true);
    try { await updateOrder({ data: { accessToken: await getAccessToken() ?? undefined, id, fulfillment } }); await load(); }
    catch { setError("שמירת סטטוס הטיפול נכשלה."); } finally { setBusy(false); }
  };
  const exportCsv = async () => {
    setBusy(true);
    try {
      const result = await listOrders({ data: { accessToken: await getAccessToken() ?? undefined, page: 0, status, search: term || undefined, limit: 20000 } });
      const url = URL.createObjectURL(new Blob([csv(result.orders)], { type: "text/csv;charset=utf-8" }));
      const a = document.createElement("a"); a.href = url; a.download = `רכישות-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(url);
    } catch { setError("ייצוא הרכישות נכשל."); } finally { setBusy(false); }
  };
  const copyShipping = async (order: BookOrder) => {
    const message = shippingWhatsAppText(order);
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      const area = document.createElement("textarea"); area.value = message; area.style.position = "fixed"; area.style.opacity = "0";
      document.body.appendChild(area); area.select(); document.execCommand("copy"); area.remove();
    }
    setCopied(order.id); window.setTimeout(() => setCopied((id) => id === order.id ? null : id), 2500);
  };

  return <>
    <header className="adm-head"><h1>רכישות ותשלומים</h1><p>כל תשלום חדש שמתקבל מ־Grow נכנס לכאן. ברירת המחדל היא הזמנות חדשות שממתינות לטיפול.</p></header>
    <div className="adm-queues">{(["new", "processing", "fulfilled", "all"] as Filter[]).map((item) =>
      <button key={item} type="button" className={status === item ? "on" : ""} onClick={() => choose(item)}>
        {item === "all" ? "כל הרכישות" : STATUS[item]}<span className="adm-qnum">{counts?.[item] ?? "–"}</span>
      </button>)}</div>
    <div className="adm-filters">
      <div className="adm-search"><input type="search" value={search} placeholder="חיפוש שם, טלפון, מייל או אסמכתה" onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { setTerm(search.trim()); setPage(0); } }} />
        <button type="button" onClick={() => { setTerm(search.trim()); setPage(0); }}>חיפוש</button>
        {term && <button type="button" onClick={() => { setSearch(""); setTerm(""); setPage(0); }}>ניקוי</button>}</div>
      <div><button type="button" disabled={busy || !orders?.length} onClick={() => void exportCsv()}>ייצוא לאקסל</button><button type="button" disabled={busy} onClick={() => void load()}>רענון</button></div>
    </div>
    <div className="adm-order-meta" aria-live="polite"><span>{orders === null ? "טוען רכישות…" : `${count} רכישות בסינון הנוכחי`}</span>{last && <span>דיווח אחרון מ־Grow: {fmt(last)}</span>}</div>
    <p className="adm-orders-note">החיבור מתעד רכישות חדשות ממועד הפעלתו. עסקאות קודמות והחזרים אינם מיובאים אוטומטית.</p>
    {error && <p className="adm-err" role="alert">{error}</p>}
    {orders === null ? <p className="adm-muted">טוען…</p> : orders.length === 0 ? <div className="adm-empty"><b>{status === "new" && !term ? "אין כרגע הזמנות חדשות" : "לא נמצאו רכישות"}</b><p>{status === "new" && !term ? "רכישה חדשה מ־Grow תופיע כאן אוטומטית." : "אפשר לשנות את הסטטוס או לנקות את החיפוש."}</p></div> :
      <div className="adm-table-wrap"><table className="adm-table adm-orders-table"><thead><tr><th>תאריך</th><th>לקוח</th><th>הזמנה</th><th>סכום</th><th>קבלה</th><th>סטטוס</th><th /></tr></thead><tbody>
        {orders.map((o) => <Fragment key={o.id}><tr className={o.fulfillment === "new" ? "is-new" : undefined}>
          <td className="adm-nowrap">{fmt(o.received_at)}</td><td><b>{o.full_name || "ללא שם"}</b>{o.phone && <small>{o.phone}</small>}</td>
          <td><span className="adm-order-product">{productLabel(o)}</span></td><td className="adm-nowrap"><b>{money(o.amount_agorot)}</b></td><td>{o.shipping_method || "לא נמסר"}</td>
          <td><select value={o.fulfillment} disabled={busy} onChange={(e) => void patch(o.id, e.target.value as OrderStatus)}>{(Object.keys(STATUS) as OrderStatus[]).map((key) => <option key={key} value={key}>{STATUS[key]}</option>)}</select></td>
          <td><button type="button" className="adm-linkbtn" onClick={() => setOpen(open === o.id ? null : o.id)}>{open === o.id ? "סגירה" : "פרטים"}</button></td>
        </tr>{open === o.id && <tr className="adm-detail"><td colSpan={7}><dl>
          {([["טלפון", o.phone], ["אימייל", o.email], ["כתובת", o.address], ["מוצרים", productLabel(o)], ["סכום ששולם", money(o.amount_agorot)], ["אופן קבלה", o.shipping_method || "לא נמסר"], ["דמי משלוח", o.shipping_agorot === null ? "לא נמסרו בנפרד" : money(o.shipping_agorot)], ["תאריך תשלום ב־Grow", o.provider_payment_date || "לא נמסר"], ["אסמכתת עסקה", o.provider_transaction_id], ["תיאור", o.description]] as const).filter(([, v]) => v).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl><div className="adm-detail-actions"><button type="button" onClick={() => void copyShipping(o)}>{copied === o.id ? "ההודעה הועתקה ✓" : "העתקת הודעה לאחראי המשלוחים"}</button>{o.phone && <a href={`https://wa.me/${o.phone.replace(/\D/g, "").replace(/^0/, "972")}`} target="_blank" rel="noopener">פתיחת שיחה עם הלקוח</a>}{o.phone && <a href={`tel:${o.phone}`}>חיוג ללקוח</a>}{o.email && <a href={`mailto:${o.email}`}>שליחת מייל</a>}</div></td></tr>}</Fragment>)}
      </tbody></table></div>}
    <nav className="adm-orders-pages" aria-label="עמודי רכישות"><button disabled={page === 0} onClick={() => { setPage((p) => p - 1); setOpen(null); }}>הקודם</button><span>עמוד {page + 1}</span><button disabled={(page + 1) * 50 >= count} onClick={() => { setPage((p) => p + 1); setOpen(null); }}>הבא</button></nav>
  </>;
}
