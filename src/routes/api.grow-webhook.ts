import { createFileRoute } from "@tanstack/react-router";
import { handleGrowWebhook } from "@/lib/grow-webhook.server";

export const Route = createFileRoute("/api/grow-webhook")({
  server: { handlers: { POST: ({ request }) => handleGrowWebhook(request) } },
});
