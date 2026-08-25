import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { SITE_URL } from "@/lib/site";

const URL = `${SITE_URL}/en/terms`;
const TITLE = "Terms of Use | The Tefillin Tie Initiative";
const DESC =
  "Terms of use for the Tefillin Tie Initiative website of Ohr Chadash - how the project works, requesting and donating tefillin, donations, intellectual property and liability.";

export const Route = createFileRoute("/en/terms")({
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
    <PageShell title="terms of use" en>
      <div className="a11y-doc" dir="ltr">
        <p>
          This site is operated by the <b>Ohr Chadash</b> association (registered NPO 580703965) as
          part of the <b>Tefillin Tie Initiative</b>. Use of the site is subject to the terms below,
          and browsing the site means you accept them.
        </p>

        <h2>What the project is</h2>
        <p>
          The project connects people who own tefillin that are no longer in use with people who
          wish to begin putting on tefillin and have none of their own. Donated tefillin are checked
          and proofread by expert scribes, refurbished as needed, and handed on to the recipient.
        </p>

        <h2>Requesting tefillin</h2>
        <ul>
          <li>Submitting the form does not commit the association to providing tefillin.</li>
          <li>
            Delivery depends on availability, on suitability for the recipient (writing hand, rite)
            and on the discretion of the association.
          </li>
          <li>
            Recipients are asked to contribute towards the labour costs only. Anyone unable to pay
            receives tefillin regardless.
          </li>
          <li>Turnaround times vary with demand and scribe availability and are not guaranteed.</li>
          <li>Home delivery carries an additional charge and is arranged in advance.</li>
        </ul>

        <h2>Donating tefillin</h2>
        <ul>
          <li>
            The donor confirms that the tefillin are theirs to give and that no third party has a
            claim to them.
          </li>
          <li>
            On handover, ownership passes to the association for refurbishment and transfer to a
            recipient. The donor does not choose the recipient unless agreed in advance.
          </li>
          <li>
            Tefillin found to be invalid and beyond repair are laid to rest according to halacha and
            are not returned.
          </li>
        </ul>

        <h2>Monetary donations</h2>
        <ul>
          <li>
            Donations cover the checking, refurbishment, proofreading, packaging and distribution of
            the tefillin, and the running of the project.
          </li>
          <li>
            Payments are processed on external payment platforms. Payment details never pass through
            this site and are not stored on it.
          </li>
          <li>
            To cancel a donation or correct an amount, contact us by phone and we will handle it in
            accordance with the law and with the procedures of the payment provider.
          </li>
        </ul>

        <h2>Site content and intellectual property</h2>
        <ul>
          <li>
            All content on the site - text, images, video, logos and design - belongs to the
            association or to those who licensed it to us, and is protected by copyright.
          </li>
          <li>
            Content may not be copied, reproduced, distributed or used commercially without written
            permission.
          </li>
          <li>
            Personal stories are published with permission, sometimes under shortened names to
            protect the privacy of those involved.
          </li>
          <li>Media logos are shown solely to reference published coverage.</li>
        </ul>

        <h2>Liability</h2>
        <ul>
          <li>
            Content on the site, including Torah and halachic material, is offered for general
            information. It is not a halachic ruling or professional advice. For a halachic question,
            consult a rabbi.
          </li>
          <li>
            We make an effort to keep information current and accurate, but are not liable for
            errors, omissions or inaccuracies.
          </li>
          <li>
            The site may link to external sites. We have no control over their content and are not
            responsible for it.
          </li>
          <li>
            We do not guarantee uninterrupted availability and may change or discontinue the site at
            any time.
          </li>
        </ul>

        <h2>Privacy and accessibility</h2>
        <p>
          Use of personal information is governed by our <a href="/en/privacy">privacy policy</a>.
          Details of the accessibility work on this site appear in the{" "}
          <a href="/en/accessibility">accessibility statement</a>.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed solely by the laws of the State of Israel. Exclusive jurisdiction
          lies with the competent courts of the Jerusalem district.
        </p>

        <h2>Contact</h2>
        <p>
          Ohr Chadash, Eretz Chemda 33, Beit El, Israel · Phone{" "}
          <a href="tel:+972546713966">+972-54-6713966</a>
        </p>

        <p className="a11y-updated">Last updated on 8 August 2026.</p>
      </div>
    </PageShell>
  );
}
