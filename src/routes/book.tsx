import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";
import { BookNewPage } from "./book-new";
import bookCss from "@/book-new.css?url";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "קשר של תפילין — 23 סיפורים מהחיים על הנחת תפילין" },
      {
        name: "description",
        content:
          "23 סיפורים אמיתיים על אנשים שהחליטו להתחיל להניח תפילין ועל הנסיבות שהובילו אותם לכך. הכירו את הספר של הרב עמיחי איל וקראו קטע מתוכו.",
      },
      { name: "robots", content: "index, follow" },
      {
        property: "og:title",
        content: "קשר של תפילין — הספר של הרב עמיחי איל",
      },
      {
        property: "og:description",
        content: "23 סיפורים מהחיים על הנחת תפילין והתחלה של קשר.",
      },
      { property: "og:image", content: `${SITE_URL}/book/kesher-cover.jpeg` },
      { property: "og:url", content: `${SITE_URL}/book` },
    ],
    links: [
      { rel: "stylesheet", href: bookCss },
      { rel: "canonical", href: `${SITE_URL}/book` },
    ],
  }),
  component: BookNewPage,
});
