import { createFileRoute } from "@tanstack/react-router";
import { handleGrowWebhook } from "@/lib/grow-webhook.server";

function methodNotAllowed(): Response {
  return new Response("Method Not Allowed", {
    status: 405,
    headers: {
      allow: "POST",
      "cache-control": "no-store",
      "content-type": "text/plain; charset=utf-8",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

export const Route = createFileRoute("/api/grow-webhook")({
  server: {
    handlers: {
      GET: methodNotAllowed,
      HEAD: methodNotAllowed,
      POST: ({ request }) => handleGrowWebhook(request),
    },
  },
});
