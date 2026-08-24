import { createContext, useContext, type ReactNode } from "react";

/**
 * הגדרות האתר.
 *
 * ברירות המחדל הן בדיוק הערכים שהיו קשיחים בקוד לפני החיבור ל-DB. הן לא
 * קישוט - הן רשת הביטחון: אם ה-DB לא זמין או שדה נמחק בטעות, האתר מציג את
 * מה שהציג תמיד במקום ערך ריק. אף פעם לא להחזיר מחרוזת ריקה מכאן.
 */
export const SETTING_DEFAULTS = {
  phone: "054-6713966",
  phone_intl: "+972-54-6713966",
  whatsapp: "972546713966",
  address: "בית אל, ארץ חמדה 33",
  address_street: "ארץ חמדה 33",
  address_city: "בית אל",
  email: "",
  facebook_url: "https://www.facebook.com/keshersheltfilin",
  instagram_url: "",
  youtube_url: "",
  org_name: "עמותת אור חדש",
  org_number: "580703965",
  org_tagline: "לקידום והעצמה של בעלי תשובה ומתקרבים ליהדות",
  founder_name: "הרב עמיחי איל",
  founder_role: "מייסד ויו\"ר 'אור חדש'",
  founder_age: "50",
  founder_city: "בית אל",
  founder_children: "שמונה",
  donate_onetime_url: "https://bit.ly/tfil",
  donate_recurring_url: "https://meshulam.co.il/s/08cd0725-9e8a-ece2-1540-638f28f8919f",
  // ערוצי תרומה לעמודים באנגלית. ריק = ליפול חזרה לערוץ הישראלי.
  donate_onetime_url_en: "",
  donate_recurring_url_en: "",
  pairs_delivered: "1,300",
  rabbi_letters_count: "9",
} as const;

export type SettingKey = keyof typeof SETTING_DEFAULTS;
export type Settings = Record<string, string>;

const Ctx = createContext<Settings>({});

export function SettingsProvider({ value, children }: { value: Settings; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** מחזיר ערך מההגדרות, ואם אין - את ברירת המחדל שהייתה קשיחה בקוד */
export function useSetting(key: SettingKey): string {
  const s = useContext(Ctx);
  const v = s[key];
  return v && v.trim() !== "" ? v : SETTING_DEFAULTS[key];
}

/**
 * קישור התרומה לפי שפת העמוד.
 *
 * הקהל דובר האנגלית תורם דרך ערוץ אמריקאי מוכר לצרכי מס, ולכן לעמודים
 * באנגלית יש מפתחות נפרדים. אם המפתח האנגלי ריק - נופלים חזרה לערוץ
 * הישראלי, כך שהכפתור לעולם לא מוביל לשום מקום.
 */
export function useDonateUrl(kind: "onetime" | "recurring", en = false): string {
  const he = useSetting(kind === "onetime" ? "donate_onetime_url" : "donate_recurring_url");
  const enUrl = useSetting(kind === "onetime" ? "donate_onetime_url_en" : "donate_recurring_url_en");
  return en && enUrl.trim() !== "" ? enUrl : he;
}

/** קישור וואטסאפ מוכן, מתוך ההגדרות */
export function useWhatsAppLink(text?: string): string {
  const digits = useSetting("whatsapp");
  const base = `https://api.whatsapp.com/send?phone=${digits}`;
  return text ? `${base}&text=${encodeURIComponent(text)}` : base;
}

/** קישור חיוג מוכן */
export function useTelLink(): string {
  const phone = useSetting("phone");
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
