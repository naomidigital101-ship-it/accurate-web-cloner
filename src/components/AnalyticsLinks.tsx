import { useEffect } from "react";

import { track, pageLang } from "@/lib/analytics";
import { useDonateUrl } from "@/lib/settings";

/**
 * מדידת לחיצות על קישורי תרומה ויצירת קשר בכל האתר.
 *
 * הקישורים האלה פזורים בעשרות מקומות (באנרים, פוטרים, תפריט, כפתור צף),
 * ולכן במקום להוסיף onClick לכל אחד מהם מאזינים ללחיצות ברמת המסמך
 * ומזהים את הקישור לפי ה-href שלו. זה לא נוגע בעיצוב או בהתנהגות -
 * רק שולח אירוע לאנליטיקס.
 */

const LOCATIONS: [string, string][] = [
  [".fab-donate", "mobile_fab"],
  [".partners-e", "banner"],
  ["header", "header"],
  [".hero-e", "hero"],
  [".donate-cards", "donate_page"],
  ["footer", "footer"],
  [".story-body", "story"],
  [".faq-e", "faq"],
  [".forms-e", "form"],
];

function locationOf(el: Element): string {
  for (const [sel, name] of LOCATIONS) {
    if (el.closest(sel)) return name;
  }
  return "page";
}

const DONATE_PAGES = ["/donate", "/en/support-and-donation"];

export function AnalyticsLinks() {
  const onetimeHe = useDonateUrl("onetime");
  const recurringHe = useDonateUrl("recurring");
  const onetimeEn = useDonateUrl("onetime", true);
  const recurringEn = useDonateUrl("recurring", true);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const a = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const lang = pageLang();
      const location = locationOf(a);

      if (href.startsWith("tel:")) {
        track("contact_click", { method: "phone", location, lang });
        return;
      }
      if (href.startsWith("mailto:")) {
        track("contact_click", { method: "email", location, lang });
        return;
      }
      if (href.includes("wa.me") || href.includes("whatsapp.com")) {
        track("contact_click", { method: "whatsapp", location, lang });
        return;
      }

      const isOnetime = href === onetimeHe || href === onetimeEn;
      const isMonthly = href === recurringHe || href === recurringEn;
      const path = href.split("?")[0].replace(/\/+$/, "");
      const isDonatePage = DONATE_PAGES.includes(path);
      if (isOnetime || isMonthly || isDonatePage) {
        track("donate_click", {
          location,
          lang,
          ...(isOnetime ? { donation_type: "onetime" } : {}),
          ...(isMonthly ? { donation_type: "monthly" } : {}),
        });
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [onetimeHe, recurringHe, onetimeEn, recurringEn]);

  return null;
}
