import { createFileRoute } from "@tanstack/react-router";

import { useSetting } from "@/lib/settings";
import { SITE_URL } from "@/lib/site";

/**
 * דף הנחיתה של המיזם, שוחזר מהאתר הישן ב-/keshersheltfilin/.
 *
 * דף נחיתה עומד בפני עצמו: אין לו תפריט ואין פוטר, בדיוק כמו במקור, והוא
 * מסומן noindex כדי שלא יתחרה בעמוד הבית על אותן מילות חיפוש.
 */
export const Route = createFileRoute("/keshersheltfilin")({
  head: () => ({
    meta: [
      { title: "קשר של תפילין - דף נחיתה" },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "קשר של תפילין" },
      {
        property: "og:description",
        content: "בשנה האחרונה חילקנו בס\"ד 500 זוגות תפילין עבור חיילים ומתחזקים.",
      },
      { property: "og:url", content: `${SITE_URL}/keshersheltfilin` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/keshersheltfilin` }],
  }),
  component: Landing,
});

function Landing() {
  const donate = useSetting("donate_onetime_url");
  return (
    <main dir="rtl" className="lp">
      <div className="lp-overlay" aria-hidden="true" />
      <div className="lp-inner">
        <img
          className="lp-logo"
          src="/wp/uploads/2024/01/תמונת-רתק-300x300.png"
          alt="קשר של תפילין"
          width={300}
          height={300}
        />

        <h1 className="lp-title">בשנה האחרונה חילקנו בס&quot;ד 500 זוגות תפילין עבור חיילים ומתחזקים!</h1>

        <p className="lp-sub">
          צפו בדבריהם המרגשים של הרב אליקים לבנון והרב שמואל אליהו שליט&quot;א על ארגון &apos;קשר של תפילין&apos;.
        </p>

        <div className="lp-video">
          <iframe
            src="https://www.youtube.com/embed/r0FYqi3Y-QQ?start=6"
            title="הרב אליקים לבנון והרב שמואל אליהו על קשר של תפילין"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>

        <a className="lp-cta" href={donate} target="_blank" rel="noopener">
          לתרומה למיזם
        </a>
      </div>
    </main>
  );
}
