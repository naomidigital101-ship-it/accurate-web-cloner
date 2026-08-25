import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { LEGACY_HOST, legacyTarget, normalizePath } from "./lib/legacy-redirects";
import { SITE_URL } from "./lib/site";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

/**
 * הפניות הכתובות הישנות, לפני ה-SSR.
 *
 * למה גם על הדומיין הראשי ולא רק על הסאב-דומיין: לאבבל מפנה בעצמו כל דומיין
 * משני לדומיין הראשי, ב-302 ששומר על הנתיב, עוד לפני שהבקשה מגיעה לקוד הזה.
 * כלומר /tefilin בסאב-דומיין מגיע בפועל כ-/tefilin על or-hadash.org.il, ורק
 * כאן אפשר לתרגם אותו ליעד הנכון.
 *
 * על הדומיין הראשי פועלים רק כשהיעד באמת שונה מהנתיב שהתבקש, אחרת כל עמוד
 * תקין היה מפנה לעצמו בלולאה.
 *
 * 301 ולא 302: המעבר קבוע, וזה מה שמעביר לגוגל את הערך של הכתובת הישנה.
 * 410 ולא 404 לארכיוני וורדפרס: 410 אומר "הוסר לצמיתות" ומזרז את הסרתם
 * מהאינדקס, במקום להשאיר אותם בתור לסריקה חוזרת.
 */
function handleLegacyHost(request: Request): Response | null {
  const url = new URL(request.url);
  const isLegacyHost = url.hostname === LEGACY_HOST;

  const target = legacyTarget(url.pathname, url.search);
  if (target === null) {
    return new Response("<!doctype html><meta charset=utf-8><title>410</title><p>העמוד הוסר.", {
      status: 410,
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=3600" },
    });
  }

  const [path, search = ""] = target.split(/(?=\?)/);
  if (!isLegacyHost && normalizePath(path) === normalizePath(url.pathname)) return null;

  return new Response(null, {
    status: 301,
    headers: {
      location: `${SITE_URL}${encodeURI(path)}${search}`,
      "cache-control": "public, max-age=3600",
    },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const legacy = handleLegacyHost(request);
      if (legacy) return legacy;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
