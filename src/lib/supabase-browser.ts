import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getAuthConfig } from "./api/auth.functions";

/**
 * לקוח Supabase לדפדפן, לצורך התחברות בלבד.
 * פרטי החיבור נמשכים בזמן ריצה מהשרת ולא מוטבעים בבאנדל, כי Lovable Cloud
 * לא חושף משתני VITE_. כל קריאה וכתיבה לנתונים עוברת דרך server functions.
 */
let clientPromise: Promise<SupabaseClient> | undefined;

export function getBrowserSupabase(): Promise<SupabaseClient> {
  if (!clientPromise) {
    clientPromise = getAuthConfig().then((cfg) =>
      createClient(cfg.url, cfg.key, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      }),
    );
  }
  return clientPromise;
}

export async function getAccessToken(): Promise<string | undefined> {
  const sb = await getBrowserSupabase();
  const { data } = await sb.auth.getSession();
  return data.session?.access_token;
}
