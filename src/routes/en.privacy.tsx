import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { CookieSettingsLink } from "@/components/CookieConsent";

const URL = "https://accurate-web-cloner.lovable.app/en/privacy/";
const TITLE = "Privacy Policy | The Tefillin Tie Initiative";
const DESC =
  "Privacy policy of the Tefillin Tie Initiative, Ohr Chadash - what we collect, what it is used for, cookies and your rights.";

export const Route = createFileRoute("/en/privacy")({
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
  return (
    <PageShell title="privacy policy" en>
      <div className="a11y-doc" dir="ltr">
        <p>
          This policy describes how the <b>Ohr Chadash</b> association (registered NPO 580703965),
          which runs the <b>Tefillin Tie Initiative</b>, collects and uses information on this site.
          Using the site and its forms means you accept this policy.
        </p>

        <h2>What we collect</h2>
        <p>
          <b>Information you give us.</b> The site has two forms - requesting tefillin and donating
          tefillin. They collect: first and last name, phone, email address, delivery or collection
          address, city, details of the request (who the tefillin are for, writing hand, delivery
          method, condition of the tefillin) and a dedication text if you write one. Providing these
          details is not a legal obligation, but without them we cannot handle your request.
        </p>
        <p>
          <b>Technical information.</b> As with any website, the hosting servers record technical
          access data for operation and security.
        </p>
        <p>
          <b>What we do not collect.</b> There are no advertising systems, marketing pixels or
          behavioural tracking tools on this site, and we do not sell or rent information to third
          parties.
        </p>

        <h2>What it is used for</h2>
        <ul>
          <li>Contacting you and handling the request you submitted.</li>
          <li>Arranging collection or delivery of the tefillin.</li>
          <li>Internal administration and the reporting duties of a registered NPO.</li>
        </ul>
        <p>We do not use your details for marketing mail without separate, explicit consent.</p>

        <h2>Cookies and local storage</h2>
        <p>The site uses three kinds only:</p>
        <ul>
          <li>
            <b>Necessary</b> - session identifiers set by the hosting service, required for
            operation and security. These cannot be switched off.
          </li>
          <li>
            <b>Preferences</b> - your accessibility toolbar settings and your cookie choice, stored
            in your own browser. This is not sent to our servers.
          </li>
          <li>
            <b>Embedded content</b> - YouTube videos. They are not loaded at all until you allow
            them, so without your consent no data reaches YouTube. The background video on the home
            page is served from Vimeo in Do Not Track mode.
          </li>
        </ul>
        <p>
          You can change your choice at any time: <CookieSettingsLink en className="a11y-inline-btn" />.
        </p>

        <h2>Third-party services</h2>
        <ul>
          <li>The hosting service the site runs on.</li>
          <li>Google Fonts - font delivery.</li>
          <li>YouTube and Vimeo - video playback, subject to the above.</li>
          <li>
            External payment processors on the donation page. Payments take place on their sites;
            card details never pass through this site and are not stored by us.
          </li>
        </ul>

        <h2>Retention and security</h2>
        <p>
          Information is kept for as long as it is needed to handle your request and to meet the
          obligations that apply to the association. The site is served over an encrypted connection
          (HTTPS). We take reasonable security measures, though no system offers absolute
          protection.
        </p>

        <h2>Your rights</h2>
        <p>
          Under the Israeli Protection of Privacy Law, 5741-1981, you may review the information held
          about you and ask for it to be corrected or deleted. To do so, contact us at{" "}
          <a href="tel:+972546713966">+972-54-6713966</a>.
        </p>

        <h2>Children</h2>
        <p>
          This site is not intended to collect information from children under 14. A request for a
          minor should be submitted by a parent or guardian.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          This policy may be updated from time to time. The binding version is the one published on
          this page.
        </p>

        <p className="a11y-updated">Last updated on 8 August 2026.</p>
      </div>
    </PageShell>
  );
}
