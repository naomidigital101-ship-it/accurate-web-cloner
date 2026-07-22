import { createFileRoute } from "@tanstack/react-router";
import { EnPage } from "./en.index";

const URL = "https://accurate-web-cloner.lovable.app/en/the-tefillin-tie-initiative/";

export const Route = createFileRoute("/en/the-tefillin-tie-initiative")({
  head: () => ({
    meta: [
      { title: "The Tefillin Tie Initiative | Ohr Chadash" },
      {
        name: "description",
        content:
          "Kesher Shel Tefillin — Ohr Chadash's initiative connecting Jews who wish to begin wearing Tefillin with donors of unused Tefillin.",
      },
      { property: "og:title", content: "The Tefillin Tie Initiative | Ohr Chadash" },
      {
        property: "og:description",
        content:
          "Mutual responsibility and collective benefit — connecting one Jew who wants to begin wearing Tefillin with another whose Tefillin are unused.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: EnPage,
});
