import { createFileRoute } from "@tanstack/react-router";
import { LettersPage } from "./letters";

const CANONICAL = "https://accurate-web-cloner.lovable.app/%D7%9E%D7%9B%D7%AA%D7%91%D7%99-%D7%AA%D7%95%D7%93%D7%94/";

export const Route = createFileRoute("/מכתבי-תודה")({
  head: () => ({
    meta: [
      { title: "מכתבי תודה | קשר של תפילין" },
      { name: "description", content: "מכתבי תודה מקהילות, מוסדות ויחידים שקיבלו תפילין ממיזם 'קשר של תפילין' של עמותת אור חדש." },
      { property: "og:title", content: "מכתבי תודה | קשר של תפילין" },
      { property: "og:description", content: "מכתבי תודה מקהילות ויחידים שקיבלו תפילין ממיזם 'קשר של תפילין'." },
      { property: "og:url", content: CANONICAL },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
  }),
  component: LettersPage,
});
