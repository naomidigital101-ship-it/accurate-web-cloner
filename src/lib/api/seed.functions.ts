import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminDb, requireStaff } from "../supabase.server";
import { stories as heStories } from "../../data/stories";
import { enStories } from "../../data/en-stories";
import { rabbis as heRabbis } from "../../routes/agreements";
import { rabbis as enRabbis } from "../../routes/en.rabbis-agreements";
import { newsItems as hePress } from "../../routes/in-news";
import { press as enPress } from "../../routes/en.articles-in-the-media";

/**
 * זריעה חד-פעמית של התוכן שכתוב היום בקוד אל תוך ה-DB.
 * רצה בשרת ולכן התוכן לא עובר דרך שום מקום אחר.
 * אידמפוטנטית: upsert לפי מפתח טבעי, אפשר להריץ שוב בלי לשכפל.
 */
/**
 * מאשרת או מנהל מחובר, או אסימון חד-פעמי שנוצר ידנית ב-DB.
 * האסימון נמחק מיד לאחר שימוש מוצלח, כדי שלא יישאר נתיב עוקף פתוח.
 */
async function authorizeSeed(accessToken: string | undefined, oneTimeToken: string | undefined) {
  const staff = await requireStaff(accessToken);
  if (staff?.isAdmin) return "staff" as const;
  if (!oneTimeToken) throw new Error("unauthorized");
  const db = adminDb();
  const { data: row } = await db
    .from("site_settings")
    .select("value")
    .eq("key", "__seed_token")
    .maybeSingle();
  if (!row?.value || row.value !== oneTimeToken) throw new Error("unauthorized");
  return "token" as const;
}

export const seedContent = createServerFn({ method: "POST" })
  .inputValidator(z.object({ accessToken: z.string().optional(), token: z.string().optional() }))
  .handler(async ({ data }) => seedInternal(data.accessToken, data.token));

/** לשימוש מ-loader של נתיב, שם אין מעטפת של server function */
export async function runSeed(token: string | undefined) {
  try {
    return { ok: true as const, ...(await seedInternal(undefined, token)) };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : String(e) };
  }
}

async function seedInternal(accessToken: string | undefined, token: string | undefined) {
  {
    const via = await authorizeSeed(accessToken, token);
    const db = adminDb();
    const report: Record<string, number> = {};

    // --- סיפורים ---
    const storyRows = [
      ...heStories.map((s, i) => ({
        lang: "he",
        slug: s.slug,
        sort_order: (i + 1) * 10,
        title: s.title,
        subtitle: (s as { subtitle?: string }).subtitle ?? null,
        author: (s as { author?: string }).author ?? null,
        city: (s as { city?: string }).city ?? null,
        img: (s as { img?: string }).img ?? null,
        extra_img: (s as { extraImg?: string }).extraImg ?? null,
        paragraphs: (s as { paragraphs?: string[] }).paragraphs ?? [],
        status: "published",
      })),
      ...enStories.map((s, i) => ({
        lang: "en",
        slug: s.slug,
        sort_order: (i + 1) * 10,
        title: s.title,
        subtitle: (s as { subtitle?: string }).subtitle ?? null,
        author: (s as { name?: string }).name ?? null,
        city: (s as { place?: string }).place ?? null,
        img: (s as { img?: string }).img ?? null,
        extra_img: (s as { extraImg?: string }).extraImg ?? null,
        paragraphs: (s as { paragraphs?: string[] }).paragraphs ?? [],
        status: "published",
      })),
    ];
    {
      const { error } = await db.from("stories").upsert(storyRows, { onConflict: "lang,slug" });
      if (error) throw new Error(`stories: ${error.message}`);
      report.stories = storyRows.length;
    }

    // --- הסכמות רבנים ---
    const rabbiRows = [
      ...heRabbis.map((r, i) => ({
        lang: "he", sort_order: (i + 1) * 10, name: r.name, role: r.role,
        letter_url: r.letter, portrait_url: r.portrait, status: "published",
      })),
      ...enRabbis.map((r, i) => ({
        lang: "en", sort_order: (i + 1) * 10, name: r.name, role: r.role,
        letter_url: r.letter, portrait_url: r.portrait, status: "published",
      })),
    ];
    {
      const { count } = await db.from("rabbi_letters").select("id", { count: "exact", head: true });
      if (!count) {
        const { error } = await db.from("rabbi_letters").insert(rabbiRows);
        if (error) throw new Error(`rabbis: ${error.message}`);
      }
      report.rabbi_letters = rabbiRows.length;
    }

    // --- כתבות בתקשורת ---
    const pressRows = [
      ...hePress.map((p, i) => ({
        lang: "he", sort_order: (i + 1) * 10,
        title: (p as { title?: string }).title ?? null,
        source: p.source, published_label: p.date,
        href: p.href, logo_url: p.img ?? null, status: "published",
      })),
      ...enPress.map((p, i) => ({
        lang: "en", sort_order: (i + 1) * 10,
        title: p.title ?? null, source: p.source, published_label: p.date,
        href: p.href, logo_url: p.img ?? null,
        logo_text: (p as { logoText?: string }).logoText ?? null,
        status: "published",
      })),
    ];
    {
      const { count } = await db.from("press_items").select("id", { count: "exact", head: true });
      if (!count) {
        const { error } = await db.from("press_items").insert(pressRows);
        if (error) throw new Error(`press: ${error.message}`);
      }
      report.press_items = pressRows.length;
    }

    // אסימון חד-פעמי - נשרף מיד אחרי שימוש מוצלח
    if (via === "token") await db.from("site_settings").delete().eq("key", "__seed_token");

    // ספירה בפועל אחרי הזריעה, לא מה שניסינו לכתוב
    for (const t of ["stories", "rabbi_letters", "press_items", "gallery_images", "services", "faqs"] as const) {
      const { count } = await db.from(t).select("id", { count: "exact", head: true });
      report[`${t}_in_db`] = count ?? 0;
    }
    return report;
  }
}

/** משווה את מה שב-DB למה שבקוד, כדי לאתר פערים אחרי ההגירה */
export const verifySeed = createServerFn({ method: "POST" })
  .inputValidator(z.object({ accessToken: z.string().optional(), token: z.string().optional() }))
  .handler(async ({ data }) => {
    const staff = await requireStaff(data.accessToken);
    if (!staff) {
      // אימות בלבד - קריאה, אין כתיבה. מותר גם עם אסימון הבדיקה.
      const { data: row } = await adminDb().from("site_settings").select("value").eq("key", "__verify_token").maybeSingle();
      if (!row?.value || row.value !== data.token) throw new Error("unauthorized");
    }
    const db = adminDb();

    const { data: rows } = await db.from("stories").select("lang,slug,title,paragraphs");
    const byKey = new Map((rows ?? []).map((r) => [`${r.lang}|${r.slug}`, r]));
    const mismatches: string[] = [];

    const check = (lang: string, list: { slug: string; title: string; paragraphs?: string[] }[]) => {
      for (const s of list) {
        const row = byKey.get(`${lang}|${s.slug}`);
        if (!row) { mismatches.push(`חסר: ${lang}/${s.slug}`); continue; }
        if (row.title !== s.title) mismatches.push(`כותרת שונה: ${lang}/${s.slug}`);
        const a = (s.paragraphs ?? []).join("\n").trim();
        const b = ((row.paragraphs as string[]) ?? []).join("\n").trim();
        if (a !== b) mismatches.push(`תוכן שונה: ${lang}/${s.slug} (קוד ${a.length} תווים, DB ${b.length})`);
      }
    };
    check("he", heStories as never);
    check("en", enStories as never);

    return { checked: heStories.length + enStories.length, mismatches };
  });
