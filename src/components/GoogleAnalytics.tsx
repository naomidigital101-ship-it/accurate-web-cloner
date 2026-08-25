import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * ה-gtag.js נטען ומאותחל ישירות ב-head של ה-root route עם send_page_view: false,
 * ולכן כאן נשלח page_view ידני בכל שינוי נתיב - כולל הטעינה הראשונה - בלי ספירה כפולה.
 */
export function GoogleAnalytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.searchStr });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.gtag?.("event", "page_view", {
      page_path: `${pathname}${search ?? ""}`,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, search]);

  return null;
}
