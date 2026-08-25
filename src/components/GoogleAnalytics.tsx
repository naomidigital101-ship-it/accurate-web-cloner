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

function loadGtag(measurementId: string) {
  if (document.getElementById("ga-script")) return;
  const script = document.createElement("script");
  script.id = "ga-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
}

/**
 * נטען אך ורק אחרי הסכמה מפורשת בקטגוריית "מדידה וסטטיסטיקה" בבאנר העוגיות.
 * בלי התנאי הזה הסקריפט היה נטען לכל מבקר עוד לפני שנשאל - וזה גם סותר את
 * מה שכתוב בבאנר עצמו.
 */
export function GoogleAnalytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const consent = useConsent();
  const allowed = consent?.analytics === true;
  const isFirst = useRef(true);

  useEffect(() => {
    if (!allowed) return;
    if (!MEASUREMENT_ID) return;
    if (typeof window === "undefined") return;

    loadGtag(MEASUREMENT_ID);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", MEASUREMENT_ID);
  }, [allowed]);

  useEffect(() => {
    if (!allowed) return;
    if (!MEASUREMENT_ID) return;
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    window.gtag?.("event", "page_view", { page_path: pathname });
  }, [allowed, pathname]);

  return null;
}
