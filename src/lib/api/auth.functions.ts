import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { publicAuthConfig, requireStaff } from "../supabase.server";

/**
 * מחזיר את פרטי החיבור הציבוריים לדפדפן.
 * ה-URL וה-publishable key ציבוריים בהגדרתם - ההגנה היא RLS, לא סודיות המפתח.
 * נמסרים בזמן ריצה כדי שלא יהיה צורך בערך קשיח בקוד או ב-.env.
 */
export const getAuthConfig = createServerFn({ method: "GET" }).handler(async () => publicAuthConfig());

/** מאמת שהמשתמש הנוכחי הוא צוות. מחזיר null אם לא. */
export const getStaffUser = createServerFn({ method: "POST" })
  .inputValidator(z.object({ accessToken: z.string().optional() }))
  .handler(async ({ data }) => requireStaff(data.accessToken));
