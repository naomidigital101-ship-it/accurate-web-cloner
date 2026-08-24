import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useSetting, useWhatsAppLink } from "@/lib/settings";
import { SITE_URL } from "@/lib/site";

const URL = `${SITE_URL}/en/accessibility`;
const TITLE = "Accessibility Statement | The Tefillin Tie Initiative";
const DESC =
  "Accessibility statement for the Tefillin Tie Initiative website - the adjustments made, known limitations and how to reach us about accessibility.";

export const Route = createFileRoute("/en/accessibility")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: Page,
});

function Page() {
  const phone = useSetting("phone");
  const phoneIntl = useSetting("phone_intl");
  const orgNumber = useSetting("org_number");
  const wa = useWhatsAppLink();
  return (
    <PageShell title="accessibility statement" en>
      <div className="a11y-doc" dir="ltr">
        <p>
          The <b>Ohr Chadash</b> association (registered NPO {orgNumber}), which runs the{" "}
          <b>Tefillin Tie Initiative</b>, is committed to serving the whole public equally and
          works to keep this website usable for people with disabilities.
        </p>

        <h2>Level of accessibility</h2>
        <p>
          This site was made accessible according to Israeli Standard 5568, which is based on
          the W3C WCAG 2.1 guidelines, level AA. The work was done in the site's own code, and
          an accessibility toolbar is available from every page.
        </p>

        <h2>What has been implemented</h2>
        <ul>
          <li>Semantic structure: navigation, main content and page heading exposed to screen readers.</li>
          <li>A "skip to content" link at the top of every page.</li>
          <li>Alternative text on every image.</li>
          <li>Labels on every form field.</li>
          <li>An accessible name for every link and button, including icon-only buttons.</li>
          <li>A correct heading hierarchy, with a single main heading per page.</li>
          <li>Full keyboard navigation, including opening the photo gallery with Enter and Space.</li>
          <li>Correct language and text direction markup in both Hebrew and English.</li>
          <li>Colour contrast that meets the standard for body text and action buttons.</li>
          <li>Respect for the system's reduced-motion preference.</li>
          <li>Responsive layout for mobile and varying screen sizes, and support for zooming.</li>
        </ul>

        <h2>Known limitations</h2>
        <p>Despite our efforts, some parts of the site are not yet fully accessible:</p>
        <ul>
          <li>
            PDF files and scanned images of letters and certificates shown on the site are not
            readable by screen readers. Their content is available by phone on request.
          </li>
          <li>
            Videos embedded from external platforms (YouTube, Vimeo) depend on those platforms'
            accessibility and do not include captions.
          </li>
        </ul>
        <p>We continue to work on improving accessibility across the site.</p>

        <h2>Accessibility contact</h2>
        <p>
          If you encounter an accessibility problem on this site we would like to hear about it.
          Your message helps us improve.
        </p>
        <ul className="a11y-contact">
          <li>
            <b>Responsible for accessibility:</b> Rabbi Amichai Eyal, Chairman of Ohr Chadash
          </li>
          <li>
            <b>Phone:</b> <a href={`tel:${phoneIntl.replace(/[^\d+]/g, "")}`}>{phoneIntl}</a>
          </li>
          <li>
            <b>WhatsApp:</b>{" "}
            <a href={wa} target="_blank" rel="noopener noreferrer">
              {phoneIntl}
            </a>
          </li>
          <li>
            <b>Address:</b> Eretz Chemda 33, Beit El, Israel
          </li>
        </ul>

        <p className="a11y-updated">This statement was last updated on 8 August 2026.</p>
      </div>
    </PageShell>
  );
}
