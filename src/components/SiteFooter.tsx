import { CookieSettingsLink } from "@/components/CookieConsent";
import { useSetting, useWhatsAppLink } from "@/lib/settings";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 512 512" width="16" height="16" fill="#67ffd1" aria-hidden="true">
      <path d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z" />
    </svg>
  );
}

function HouseIcon() {
  return (
    <svg viewBox="0 0 576 512" width="16" height="16" fill="#67ffd1" aria-hidden="true">
      <path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z" />
    </svg>
  );
}

/**
 * הפוטר המלא של האתר - לוגו, פרטי קשר, טקסט מסביר, נתוני מפתח, ניווט וקרדיטים.
 *
 * נבנה במקור לעמוד הבית בלבד (קומיט f952e43, "rebuild the footer for entity SEO"),
 * ומוגש מכאן כדי שכל עמודי האתר יקבלו את אותם קישורים פנימיים. הגלריה נשארה
 * בחוץ ב-FooterGallery, כי היא שייכת לעמודי הבית ולא ל-83 העמודים.
 */
export function SiteFooter({ en = false }: { en?: boolean } = {}) {
  const phone = useSetting("phone");
  const address = useSetting("address");
  const orgName = useSetting("org_name");
  const orgNumber = useSetting("org_number");
  const tagline = useSetting("org_tagline");
  const facebook = useSetting("facebook_url");
  const pairs = useSetting("pairs_delivered");
  const rabbisCount = useSetting("rabbi_letters_count");
  const wa = useWhatsAppLink();

  return (
    <footer dir={en ? "ltr" : "rtl"} className="footer-e footer-brand-only">
      <a href={en ? "/en/the-tefillin-tie-initiative" : "/"} aria-label={en ? "Ohr Chadash - home" : "אור חדש - דף הבית"} className="footer-brand-logo">
        <img src="/wp/img/אור-חדש-לוגו-13.svg" alt={en ? "Ohr Chadash" : "אור חדש"} />
      </a>
      <h2 className="footer-tagline">
        {en ? "Advancing and empowering baalei teshuva and those drawing closer to Judaism" : tagline}
        <br />
        {en ? `Registered NGO: ${orgNumber}` : `ע"ר: ${orgNumber}`}
      </h2>
      <div className="footer-contact-row">
        <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} aria-label={en ? `Call us: ${phone}` : `התקשרו אלינו: ${phone}`}>
          <PhoneIcon />
          {phone}
        </a>
        <a
          href={`https://waze.com/ul?q=${encodeURIComponent(address)}&z=10&navigate=yes`}
          target="_blank"
          rel="noopener"
          aria-label={en ? `Navigate with Waze to: ${address}` : `ניווט בוויז לכתובת: ${address}`}
        >
          <HouseIcon />
          {address}
        </a>
      </div>

      {en ? (
        <p className="footer-about">
          A project of <b>Ohr Chadash</b> for mutual responsibility and collective benefit: connecting a Jew
          who wishes to begin wearing tefillin with one who has tefillin that are not in use. The tefillin are
          checked and proofread by expert scribes, renewed and delivered - and whoever cannot pay receives
          them all the same.
        </p>
      ) : (
        <p className="footer-about">
          מיזם של <b>{orgName}</b> לערבות הדדית וזיכוי הרבים: מחברים בין יהודי שברשותו
          תפילין שאינן בשימוש לבין יהודי שרוצה להתחיל להניח. התפילין נבדקות ומוגהות אצל סופרי
          סת"ם, מחודשות ונמסרות - ומי שאינו יכול לשלם מקבל בכל מקרה.
        </p>
      )}

      <ul className="footer-facts">
        {en ? (
          <>
            <li><b>Over {pairs}</b><span>sets of tefillin delivered</span></li>
            <li><b>{rabbisCount}</b><span>rabbinic endorsements</span></li>
            <li><b>Across Israel</b><span>collection, renewal and delivery</span></li>
          </>
        ) : (
          <>
            <li><b>מעל {pairs}</b><span>זוגות תפילין חולקו</span></li>
            <li><b>{rabbisCount}</b><span>הסכמות מגדולי הרבנים</span></li>
            <li><b>כל הארץ</b><span>איסוף, חידוש ומסירה</span></li>
          </>
        )}
      </ul>

      <nav className="footer-sitemap" aria-label={en ? "Footer navigation" : "ניווט בפוטר"}>
        {en ? (
          <>
            <div>
              <h3>The project</h3>
              <a href="/en/stories-2">Stories</a>
              <a href="/en/articles-in-the-media">Articles in the media</a>
              <a href="/en/rabbis-agreements">Rabbis agreements</a>
              <a href="/en/thank-you-letters">Thank you letters</a>
            </div>
            <div>
              <h3>Actions</h3>
              <a href="/en/request-for-tefillin">Request for Tefillin</a>
              <a href="/en/request-to-donate-tefillin">Donate Tefillin</a>
              <a href="/en/support-and-donation">Support and donation</a>
              <a href={wa} target="_blank" rel="noopener">Chat on WhatsApp</a>
            </div>
            <div>
              <h3>Information</h3>
              <a href="/en/accessibility">Accessibility</a>
              <a href="/en/privacy">Privacy policy</a>
              <a href="/en/terms">Terms of use</a>
              <CookieSettingsLink en />
            </div>
            <div>
              <h3 lang="he">עברית</h3>
              <a href="/" lang="he">קשר של תפילין</a>
              <a href="/stories" lang="he">סיפורים</a>
              <a href="/donate" lang="he">תרומה למיזם</a>
            </div>
          </>
        ) : (
          <>
            <div>
              <h3>המיזם</h3>
              <a href="/stories">סיפורים שמאחורי התפילין</a>
              <a href="/in-news">כתבות בתקשורת</a>
              <a href="/agreements">הסכמות הרבנים</a>
              <a href="/מכתבי-תודה">מכתבי תודה</a>
            </div>
            <div>
              <h3>פעולות</h3>
              <a href="/request">בקשת תפילין</a>
              <a href="/give">מסירת תפילין</a>
              <a href="/donate">תרומה למיזם</a>
              <a href={wa} target="_blank" rel="noopener">שיחה בוואטסאפ</a>
            </div>
            <div>
              <h3>מידע</h3>
              <a href="/accessibility">הצהרת נגישות</a>
              <a href="/privacy">מדיניות פרטיות</a>
              <a href="/terms">תקנון ותנאי שימוש</a>
              <a href="/certificates">אישורי העמותה</a>
              <CookieSettingsLink />
            </div>
            <div>
              <h3>English</h3>
              <a href="/en/the-tefillin-tie-initiative" lang="en">The Tefillin Tie Initiative</a>
              <a href="/en/stories-2" lang="en">Stories</a>
              <a href="/en/support-and-donation" lang="en">Support &amp; donate</a>
            </div>
          </>
        )}
      </nav>

      <div className="footer-social">
        <a
          href={facebook}
          target="_blank"
          rel="noopener"
          aria-label={en ? "Kesher Shel Tefillin on Facebook" : "קשר של תפילין בפייסבוק"}
        >
          <svg viewBox="0 0 320 512" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" /></svg>
          <span>{en ? "Facebook" : "פייסבוק"}</span>
        </a>
      </div>
      <a href="https://kavnekuda.com" target="_blank" rel="noopener" aria-label="אפיון, בניה ופיתוח: KAV" className="footer-credit-link">
        <img src="/wp/img/קרדיט-45.svg" alt="אפיון, בניה ופיתוח: KAV" />
      </a>
      <a
        href="https://move-geo.ai/"
        target="_blank"
        rel="noopener"
        dir="ltr"
        className="move-credit"
        aria-label="Built for AI Search — by MOVE"
      >
        <span>Built for AI Search — by </span>
        <span className="move-credit-chip">
          <img src="/branding/move-logo.png" alt="MOVE" />
        </span>
      </a>
    </footer>
  );
}
