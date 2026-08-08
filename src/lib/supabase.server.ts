import process from "node:process";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * לקוחות Supabase לצד השרת בלבד.
 *
 * Lovable Cloud מזריק את המשתנים בזמן בקשה ולא בזמן בנייה, ובלי קידומת VITE_ -
 * כלומר הם לעולם לא מגיעים לבאנדל של הדפדפן. לכן כל גישה ל-DB עוברת דרך
 * server functions, ואסור לקרוא את process.env ברמת המודול (על Cloudflare
 * הערך יהיה undefined) - תמיד בתוך פונקציה.
 */

function env(name: string): string {
  const v = process.env?.[name];
  if (!v) throw new Error(`Missing env var ${name}`);
  return v;
}

/** קריאה ציבורית - כפוף ל-RLS, רואה רק status='published' */
export function publicDb(): SupabaseClient {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_PUBLISHABLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * עוקף RLS. לשימוש אך ורק אחרי אימות מפורש שהמשתמש הוא צוות.
 * לעולם לא להחזיר את המפתח הזה או תוצאותיו ללא בדיקת הרשאה.
 */
export function adminDb(): SupabaseClient {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** פרטים ציבוריים בהגדרתם, שהדפדפן צריך כדי לבצע התחברות */
export function publicAuthConfig() {
  return { url: env("SUPABASE_URL"), key: env("SUPABASE_PUBLISHABLE_KEY") };
}

/**
 * מאמת טוקן גישה ומחזיר את המשתמש רק אם יש לו תפקיד בטבלת user_roles.
 * מחזיר null לכל מקרה אחר - כך שכל קריאה מוגנת נכשלת סגור.
 */
export async function requireStaff(accessToken: string | undefined) {
  if (!accessToken) return null;
  const anon = createClient(env("SUPABASE_URL"), env("SUPABASE_PUBLISHABLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
  const { data, error } = await anon.auth.getUser();
  if (error || !data.user) return null;

  const { data: roles } = await adminDb()
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id);

  if (!roles || roles.length === 0) return null;
  return {
    id: data.user.id,
    email: data.user.email ?? null,
    roles: roles.map((r) => r.role as string),
    isAdmin: roles.some((r) => r.role === "admin"),
  };
}
