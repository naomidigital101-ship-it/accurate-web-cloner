import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";

import { useConsent } from "./CookieConsent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY;

function loadGtag(id: string) {
  if (document.getElementById("ga-script")) return;
  const s = document.createElement("script");
  s.id = "ga-script";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);
}

/**
 * gtag נטען מכאן ולא מה-head של הרוט, ואך ורק אחרי הסכמה מפורשת בקטגוריית
 * "מדידה וסטטיסטיקה" בבאנר העוגיות. הבאנר מבטיח לגולש במפורש שבלי אישור
 * הסקריפט לא נטען כלל - טעינה ב-head היתה הופכת את ההבטחה הזו לשקר.
 *
 * שכבת המדידה ב-lib/analytics.ts מוגנת כבר בבדיקת typeof gtag, ולכן כל
 * קריאות ה-track לפני ההסכמה פשוט לא קורות במקום להיכשל.
 *
 * send_page_view: false כדי שהצפייה תישלח מכאן בכל שינוי נתיב - באתר SPA
 * הטעינה הראשונית היא היחידה ש-GA היה סופר לבד.
 */
export function GoogleAnalytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.searchStr });
  const consent = useConsent();
  const allowed = consent?.analytics === true;
  const ready = useRef(false);

  useEffect(() => {
    if (!allowed || !MEASUREMENT_ID || typeof window === "undefined") return;
    loadGtag(MEASUREMENT_ID);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, { send_page_view: false });
    ready.current = true;
  }, [allowed]);

  useEffect(() => {
    if (!allowed || !ready.current) return;
    window.gtag?.("event", "page_view", {
      page_path: `${pathname}${search ?? ""}`,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [allowed, pathname, search]);

  return null;
}
