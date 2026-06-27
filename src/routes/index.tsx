import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const STYLESHEETS = [
  "https://tefilin.or-hadash.org.il/wp-content/plugins/jet-engine/assets/css/frontend.css?ver=3.8.1.2",
  "https://tefilin.or-hadash.org.il/wp-content/themes/hello-elementor/assets/css/reset.css?ver=3.4.4",
  "https://tefilin.or-hadash.org.il/wp-content/themes/hello-elementor/assets/css/theme.css?ver=3.4.4",
  "https://tefilin.or-hadash.org.il/wp-content/themes/hello-elementor/assets/css/header-footer.css?ver=3.4.4",
  "https://tefilin.or-hadash.org.il/wp-content/plugins/elementor/assets/css/frontend.min.css?ver=4.0.6",
  "https://tefilin.or-hadash.org.il/wp-content/uploads/elementor/css/post-7.css?ver=1781094740",
  "https://tefilin.or-hadash.org.il/wp-content/plugins/elementor-pro/assets/css/widget-nav-menu-rtl.min.css?ver=3.30.1",
  "https://tefilin.or-hadash.org.il/wp-content/plugins/elementor/assets/css/widget-image-rtl.min.css?ver=4.0.6",
  "https://tefilin.or-hadash.org.il/wp-content/plugins/elementor-pro/assets/css/modules/sticky.min.css?ver=3.30.1",
  "https://tefilin.or-hadash.org.il/wp-content/plugins/elementor-pro/assets/css/modules/motion-fx.min.css?ver=3.30.1",
  "https://tefilin.or-hadash.org.il/wp-content/plugins/elementor/assets/css/widget-heading-rtl.min.css?ver=4.0.6",
  "https://tefilin.or-hadash.org.il/wp-content/plugins/elementor/assets/css/widget-counter-rtl.min.css?ver=4.0.6",
  "https://tefilin.or-hadash.org.il/wp-content/plugins/elementor/assets/css/conditionals/shapes.min.css?ver=4.0.6",
  "https://tefilin.or-hadash.org.il/wp-content/plugins/elementor-pro/assets/css/widget-form-rtl.min.css?ver=3.30.1",
  "https://tefilin.or-hadash.org.il/wp-content/plugins/elementor/assets/css/widget-nested-tabs-rtl.min.css?ver=4.0.6",
  "https://tefilin.or-hadash.org.il/wp-content/plugins/elementor/assets/css/widget-video-rtl.min.css?ver=4.0.6",
  "https://tefilin.or-hadash.org.il/wp-content/plugins/elementor/assets/lib/swiper/v8/css/swiper.min.css?ver=8.4.5",
  "https://tefilin.or-hadash.org.il/wp-content/plugins/elementor/assets/css/conditionals/e-swiper.min.css?ver=4.0.6",
  "https://tefilin.or-hadash.org.il/wp-content/plugins/elementor/assets/lib/animations/styles/fadeInRight.min.css?ver=4.0.6",
  "https://tefilin.or-hadash.org.il/wp-content/plugins/elementor/assets/lib/animations/styles/fadeInLeft.min.css?ver=4.0.6",
  "https://tefilin.or-hadash.org.il/wp-content/plugins/elementor/assets/css/widget-nested-accordion-rtl.min.css?ver=4.0.6",
  "https://tefilin.or-hadash.org.il/wp-content/plugins/elementor-pro/assets/css/widget-flip-box-rtl.min.css?ver=3.30.1",
  "https://tefilin.or-hadash.org.il/wp-content/plugins/elementor-pro/assets/css/widget-gallery-rtl.min.css?ver=3.30.1",
  "https://tefilin.or-hadash.org.il/wp-content/plugins/elementor/assets/lib/e-gallery/css/e-gallery.min.css?ver=1.2.0",
  "https://tefilin.or-hadash.org.il/wp-content/plugins/elementor-pro/assets/css/conditionals/transitions.min.css?ver=3.30.1",
  "https://tefilin.or-hadash.org.il/wp-content/uploads/elementor/css/post-10.css?ver=1782381715",
  "https://tefilin.or-hadash.org.il/wp-content/uploads/elementor/css/post-168.css?ver=1781094751",
  "https://tefilin.or-hadash.org.il/wp-content/uploads/elementor/css/post-230.css?ver=1781094799",
  "https://tefilin.or-hadash.org.il/wp-content/uploads/elementor/css/post-190.css?ver=1781096316",
  "https://tefilin.or-hadash.org.il/wp-content/uploads/elementor/css/post-55.css?ver=1781094741",
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

  return <div className="tefilin-mirror" dangerouslySetInnerHTML={{ __html: html }} />;
}
