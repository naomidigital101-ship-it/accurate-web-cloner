import { createFileRoute } from "@tanstack/react-router";
import { LettersPage } from "./letters";
import { readThankYouLetters } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const CANONICAL = `${SITE_URL}/%D7%9E%D7%9B%D7%AA%D7%91%D7%99-%D7%AA%D7%95%D7%93%D7%94`;

export const Route = createFileRoute("/מכתבי-תודה")({
  loader: async () => ({ items: await readThankYouLetters("he") }),
  head: () => ({
    meta: [
      { title: "מכתבי תודה ממקבלי תפילין | קשר של תפילין" },
      { name: "description", content: "מכתבי תודה מרגשים מחיילים, מפקדים, רבנים וקהילות שקיבלו תפילין מעמותת אור חדש במסגרת מיזם קשר של תפילין." },
      { property: "og:title", content: "מכתבי תודה ממקבלי תפילין | קשר של תפילין" },
      { property: "og:description", content: "מכתבי תודה מרגשים מחיילים, מפקדים, רבנים וקהילות שקיבלו תפילין מעמותת אור חדש במסגרת מיזם קשר של תפילין." },
      { property: "og:url", content: CANONICAL },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
  }),
  component: Page,
});

function Page() {
  const { items } = Route.useLoaderData();
  return <LettersPage items={items} />;
}
