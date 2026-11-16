/**
 * Microsoft Clarity: session recordings, heatmaps, and the AI-referral channel
 * (visits from ChatGPT, Perplexity, Copilot, Gemini and Claude).
 *
 * The tag is only injected on the production host, once the page has finished
 * loading, and only when the caller has established analytics consent - so it
 * never runs in the Lovable preview, in admin screens, or for a visitor who
 * declined. Clicks on phone, WhatsApp and email links are sent as Clarity
 * events so they can be used in funnels and filters.
 */
const CLARITY_ID = "zejwc2lfcl";
const HOSTS = ["or-hadash.org.il","www.or-hadash.org.il"];
const EXCLUDED_PATH = /^\/(admin|auth|account|api|lovable|login|portal|checkout|payment-result|payment-success)(\/|$)/;

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[] };
declare global {
  interface Window {
    clarity?: ClarityFn;
  }
}

let started = false;

function eligible(): boolean {
  if (typeof window === "undefined") return false;
  if (!HOSTS.includes(window.location.hostname)) return false;
  if (navigator.webdriver || window.self !== window.top) return false;
  return !EXCLUDED_PATH.test(window.location.pathname);
}

function onContactClick(event: MouseEvent) {
  const link = (event.target as Element | null)?.closest?.("a[href]");
  if (!link || !window.clarity) return;
  const href = link.getAttribute("href") || "";
  if (/^tel:/i.test(href)) window.clarity("event", "click_tel");
  else if (/wa\.me|whatsapp/i.test(href)) window.clarity("event", "click_whatsapp");
  else if (/^mailto:/i.test(href)) window.clarity("event", "click_email");
}

/** Starts Clarity once. Call only after analytics consent is known to be granted. */
export function startClarity(): void {
  if (started || !eligible()) return;
  started = true;
  const w = window;
  w.clarity =
    w.clarity ||
    (function () {
      // eslint-disable-next-line prefer-rest-params -- Clarity's queue expects Arguments objects.
      (w.clarity!.q = w.clarity!.q || []).push(arguments);
    } as ClarityFn);
  const load = () => {
    if (document.getElementById("clarity-tag")) return;
    const s = document.createElement("script");
    s.id = "clarity-tag";
    s.async = true;
    s.src = "https://www.clarity.ms/tag/" + CLARITY_ID;
    document.head.appendChild(s);
  };
  if (document.readyState === "complete") setTimeout(load, 1500);
  else window.addEventListener("load", () => setTimeout(load, 1500), { once: true });
  document.addEventListener("click", onContactClick, true);
}

/** Withdrawal: tells Clarity to stop and clear its cookies. */
export function stopClarity(): void {
  if (typeof window === "undefined" || !started) return;
  window.clarity?.("consent", false);
}
