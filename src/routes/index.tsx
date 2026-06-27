import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "קשר של תפילין | מיזם אור חדש - ערבות הדדית וזיכוי הרבים" },
      { name: "description", content: "מיזם של ערבות הדדית וזיכוי הרבים. חילקנו מעל 1,300 זוגות תפילין." },
      { property: "og:title", content: "קשר של תפילין | מיזם אור חדש" },
      { property: "og:description", content: "מיזם של ערבות הדדית וזיכוי הרבים - חילקנו מעל 1,300 זוגות תפילין." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <iframe
      src="/home-mirror.html"
      title="קשר של תפילין"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: 0 }}
    />
  );
}
