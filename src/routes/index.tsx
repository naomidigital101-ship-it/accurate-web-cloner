import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "קשר של תפילין | מיזם אור חדש - ערבות הדדית וזיכוי הרבים" },
      { name: "description", content: "מיזם של ערבות הדדית וזיכוי הרבים. חילקנו מעל 1,300 זוגות תפילין. מבקשים תפילין? יש לכם תפילין לתרומה? פנו אלינו." },
      { property: "og:title", content: "קשר של תפילין | מיזם אור חדש" },
      { property: "og:description", content: "מיזם של ערבות הדדית וזיכוי הרבים - חילקנו מעל 1,300 זוגות תפילין." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  // מראה 1:1 של עמוד הבית המקורי מ-WordPress (HTML+CSS+JS+תמונות אמיתיים).
  // נטען ב-iframe על-מנת לשמור את ה-Elementor scripts/styles במלואם.
  return (
    <iframe
      src="/home-mirror.html"
      title="קשר של תפילין"
      aria-label="קשר של תפילין - עמוד הבית"
      className="fixed inset-0 w-screen h-screen border-0 block"
    />
  );
}
