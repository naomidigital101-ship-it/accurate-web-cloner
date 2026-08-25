/**
 * שכבת מדידה דקה מעל gtag של GA4.
 *
 * הכלל היחיד כאן: מדידה לעולם לא שוברת את הזרימה של המשתמש. אם gtag לא
 * נטען, חסום על ידי חוסם פרסומות או שאנחנו ב-SSR - הקריאה פשוט לא קורית.
 * אף פעם לא לשלוח מידע מזהה אישית (שם, טלפון, אימייל, כתובת) בפרמטרים.
 */
export function track(name: string, params: Record<string, unknown> = {}): void {
  try {
    if (typeof window === "undefined") return;
    const g = window.gtag;
    if (typeof g !== "function") return;
    g("event", name, params);
  } catch {
    /* מדידה לא מפילה כלום */
  }
}

/** שפת העמוד הנוכחי, לפי ה-lang של המסמך */
export function pageLang(): "he" | "en" {
  if (typeof document === "undefined") return "he";
  return document.documentElement.lang?.toLowerCase().startsWith("en") ? "en" : "he";
}
