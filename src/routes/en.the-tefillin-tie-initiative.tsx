import { createFileRoute } from "@tanstack/react-router";
import { EnPage, enHomeLoader } from "./en.index";
import { SITE_URL } from "@/lib/site";

const URL = `${SITE_URL}/en/the-tefillin-tie-initiative`;

export const Route = createFileRoute("/en/the-tefillin-tie-initiative")({
  head: () => ({
    meta: [
      { title: "The Tefillin Tie Initiative | Ohr Chadash" },
      {
        name: "description",
        content:
          "Connecting Jews who wish to begin wearing tefillin with donors of unused pairs. Over 1,300 sets of tefillin delivered across Israel - request or donate tefillin today.",
      },
      { property: "og:title", content: "The Tefillin Tie Initiative | Ohr Chadash" },
      {
        property: "og:description",
        content:
          "Connecting Jews who wish to begin wearing tefillin with donors of unused pairs. Over 1,300 sets of tefillin delivered across Israel - request or donate tefillin today.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  loader: enHomeLoader,
  component: Page,
});

function Page() {
  return <EnPage data={Route.useLoaderData()} />;
}
