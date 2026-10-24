/** Reject invalid UTF-8/percent escapes before the router tries to decode them.
 * Query parameters are intentionally excluded (payment callbacks and ad tags).
 */
export function invalidPathResponse(pathname: string): Response | null {
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return reject(400);
  }
  // Serialized campaign metadata accidentally appended to a page URL is not a route.
  if (/^\/book(?:-order|-new)?["']\s*,/.test(decoded)) return reject(404);
  return null;
}

function reject(status: number): Response {
  return new Response(status === 400 ? "Invalid URL path" : "Page not found", {
    status,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "x-robots-tag": "noindex",
      "cache-control": "no-store",
      "x-path-validation": "v1",
    },
  });
}
