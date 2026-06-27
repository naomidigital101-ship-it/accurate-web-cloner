import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const STYLESHEETS = [
  "/wp/css/frontend.css",
  "/wp/css/reset.css",
  "/wp/css/theme.css",
  "/wp/css/header-footer.css",
  "/wp/css/frontend.min.css",
  "/wp/css/post-7.css",
  "/wp/css/widget-nav-menu-rtl.min.css",
  "/wp/css/widget-image-rtl.min.css",
  "/wp/css/sticky.min.css",
  "/wp/css/motion-fx.min.css",
  "/wp/css/widget-heading-rtl.min.css",
  "/wp/css/widget-counter-rtl.min.css",
  "/wp/css/shapes.min.css",
  "/wp/css/widget-form-rtl.min.css",
  "/wp/css/widget-nested-tabs-rtl.min.css",
  "/wp/css/widget-video-rtl.min.css",
  "/wp/css/swiper.min.css",
  "/wp/css/e-swiper.min.css",
  "/wp/css/fadeInRight.min.css",
  "/wp/css/fadeInLeft.min.css",
  "/wp/css/widget-nested-accordion-rtl.min.css",
  "/wp/css/widget-flip-box-rtl.min.css",
  "/wp/css/widget-gallery-rtl.min.css",
  "/wp/css/e-gallery.min.css",
  "/wp/css/transitions.min.css",
  "/wp/css/post-10.css",
  "/wp/css/post-168.css",
  "/wp/css/post-230.css",
  "/wp/css/post-190.css",
  "/wp/css/post-55.css",
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "קשר של תפילין | מיזם אור חדש - ערבות הדדית וזיכוי הרבים" },
      { name: "description", content: "מיזם של ערבות הדדית וזיכוי הרבים. חילקנו מעל 1,300 זוגות תפילין." },
      { property: "og:title", content: "קשר של תפילין | מיזם אור חדש" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preconnect", href: "https://tefilin.or-hadash.org.il" },
      ...STYLESHEETS.map((href) => ({ rel: "stylesheet", href })),
    ],
  }),
  component: Index,
});

function Index() {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    fetch("/mirror-body.html")
      .then((r) => r.text())
      .then(setHtml)
      .catch(() => setHtml("<p>שגיאה בטעינה</p>"));
  }, []);

  if (!html) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "sans-serif" }}>
        טוען…
      </div>
    );
  }

  return <div className="tefilin-mirror elementor-kit-7" dangerouslySetInnerHTML={{ __html: html }} />;
}
