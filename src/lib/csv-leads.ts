/**
 * פרסור ייצוא הפניות של Elementor.
 *
 * שתי מלכודות שהקובץ מכיל, ובגללן אי אפשר להשתמש בשמות עמודות:
 * 1. יש עמודות עם שם ריק ועמודות בשם 'שלב' שחוזרות פעמיים - מיפוי לפי שם דורס.
 * 2. חלק מהשורות ארוכות בעמודה אחת מהכותרת, ולכן כל האינדקסים זזים.
 * הפתרון: מאתרים את עמודת התאריך לפי תבנית, ומחשבים ממנה את ההיסט לכל שורה.
 */

export type ParsedLead = {
  kind: "request" | "donate";
  lang: "he" | "en";
  status: "new" | "in_progress" | "done" | "spam";
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  target: string | null;
  hand: string | null;
  delivery: string | null;
  condition: string | null;
  dedication: string | null;
  referer_url: string | null;
  legacy_id: string | null;
  created_at: string;
};

const DATE = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
const SPAM =
  /(baobo|industr|seo servic|crypto|casino|\bloan\b|investment|wholesale|supplier|alibaba|dear sir|business propos)/i;

/**
 * טוקנייזר CSV אחד שמחזיר ישירות שורות של שדות.
 *
 * מלכודת: מרכאות נחשבות פותחות ציטוט **רק בתחילת שדה**. בעברית התו " נפוץ
 * כגרשיים בתוך טקסט (סת"ם, ר"מ), ומפרסר שמחליף מצב על כל " מאחד שורות
 * ומאבד רוב הרשומות.
 */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let quoted = false;
  let fieldStart = true;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i++;
        } else quoted = false;
      } else cur += c;
      continue;
    }

    if (c === '"' && fieldStart) {
      quoted = true;
      fieldStart = false;
      continue;
    }
    if (c === ",") {
      row.push(cur);
      cur = "";
      fieldStart = true;
      continue;
    }
    if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cur);
      if (row.some((f) => f.trim() !== "")) rows.push(row);
      row = [];
      cur = "";
      fieldStart = true;
      continue;
    }
    cur += c;
    fieldStart = false;
  }
  if (cur !== "" || row.length) {
    row.push(cur);
    if (row.some((f) => f.trim() !== "")) rows.push(row);
  }
  return rows;
}

function channel(url: string | null): string | null {
  if (!url) return "direct";
  const u = url.toLowerCase();
  if (u.includes("chatgpt")) return "chatgpt";
  if (u.includes("google")) return "google";
  if (u.includes("facebook")) return "facebook";
  if (u.includes("whatsapp") || u.includes("wa.me")) return "whatsapp";
  if (u.includes("instagram")) return "instagram";
  if (u.includes("or-hadash")) return "internal";
  return "other";
}

function looksLikeSpam(fields: (string | null)[], phone: string | null): boolean {
  if (SPAM.test(fields.filter(Boolean).join(" "))) return true;
  const d = (phone ?? "").replace(/\D/g, "");
  return d.length >= 11 && !d.startsWith("0") && !d.startsWith("972");
}

export function parseElementorCsv(text: string): { rows: ParsedLead[]; skipped: number } {
  const records = parseCsv(text.replace(/^﻿/, ""));
  if (records.length < 2) return { rows: [], skipped: 0 };

  const header = records[0];
  const isDonate = header.includes("שם מלא") || header.includes("full name");
  const isEn = header.includes("full name");
  const dateBase = isDonate ? 11 : 15;

  const rows: ParsedLead[] = [];
  let skipped = 0;

  for (const c of records.slice(1)) {
    const di = c.findIndex((v) => DATE.test(v.trim()));
    if (di < 0) {
      skipped++;
      continue;
    }
    const shift = di - dateBase;
    const at = (base: number): string | null => {
      const v = c[base + shift];
      const t = (v ?? "").trim();
      return t === "" ? null : t;
    };

    const created = c[di].trim();
    const referer = (c[c.length - 1] ?? "").trim() || null;

    const common = {
      lang: (isEn ? "en" : "he") as "he" | "en",
      legacy_id: (c[di - 1] ?? "").trim() || null,
      referer_url: channel(referer),
      created_at: `${created}+00`,
    };

    if (isDonate) {
      const full = at(1);
      const phone = at(6);
      rows.push({
        ...common,
        kind: "donate",
        status: looksLikeSpam([full, at(5), at(7)], phone) ? "spam" : "done",
        first_name: null,
        last_name: null,
        full_name: full,
        address: at(2),
        condition: at(3),
        email: at(5),
        phone,
        dedication: at(7),
        city: null,
        target: null,
        hand: null,
      });
    } else {
      const first = at(5);
      const last = at(6);
      const phone = at(10);
      rows.push({
        ...common,
        kind: "request",
        status: looksLikeSpam([first, last, at(11)], phone) ? "spam" : "done",
        target: at(1),
        hand: at(2),
        delivery: at(3),
        first_name: first,
        last_name: last,
        full_name: [first, last].filter(Boolean).join(" ") || null,
        address: at(7),
        city: at(8),
        phone,
        email: at(11),
        condition: null,
        dedication: null,
      });
    }
  }
  return { rows, skipped };
}
