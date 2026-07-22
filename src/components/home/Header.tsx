import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const navItems: NavItem[] = [
  { label: "סיפורים", href: "/stories/" },
  { label: "כתבות בתקשורת", href: "/in-news/" },
  {
    label: "מכתבים",
    href: "#",
    children: [
      { label: "מכתבי תודה", href: "/letters/" },
      { label: "הסכמות הרבנים", href: "/agreements/" },
    ],
  },
  { label: "בקשת תפילין", href: "/request/" },
  { label: "מסירת/תרומת תפילין", href: "/give/" },
  { label: "תרומה", href: "/donate/" },
];

function CaretDown() {
  return (
    <svg viewBox="0 0 320 512" width="10" height="10" fill="currentColor" aria-hidden="true">
      <path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z" />
    </svg>
  );
}

export function Header({ en = false, dark = false }: { en?: boolean; dark?: boolean } = {}) {
  const [open, setOpen] = useState(false);
  const [bgT, setBgT] = useState(0);

  const heNav: NavItem[] = navItems;
  const enNav: NavItem[] = [
    { label: "stories", href: "/en/stories-2/" },
    { label: "media", href: "/en/articles-in-the-media/" },
    {
      label: "letters",
      href: "#",
      children: [
        { label: "Thank you letters", href: "/en/thank-you-letters/" },
        { label: "Rabbis agreements", href: "/en/rabbis-agreements/" },
      ],
    },
    { label: "Request for Tefillin", href: "/en/request-for-tefillin/" },
    { label: "Donate Tefillin", href: "/en/request-to-donate-tefillin/" },
    { label: "support and donation", href: "/en/support-and-donation/" },
  ];
  const items = en ? enNav : heNav;

  // Per-page language switcher (WPML-style mapping)
  const location = useLocation();
  const pathname = location.pathname.replace(/\/+$/, "") || "/";
  const heToEn: Record<string, string> = {
    "/": "/en/the-tefillin-tie-initiative/",
    "/stories": "/en/stories-2/",
    "/in-news": "/en/articles-in-the-media/",
    "/letters": "/en/thank-you-letters/",
    "/agreements": "/en/rabbis-agreements/",
    "/request": "/en/request-for-tefillin/",
    "/give": "/en/request-to-donate-tefillin/",
    "/donate": "/en/support-and-donation/",
  };
  const enToHe: Record<string, string> = {
    "/en": "/",
    "/en/the-tefillin-tie-initiative": "/",
    "/en/stories-2": "/stories/",
    "/en/articles-in-the-media": "/in-news/",
    "/en/thank-you-letters": "/letters/",
    "/en/rabbis-agreements": "/agreements/",
    "/en/request-for-tefillin": "/request/",
    "/en/request-to-donate-tefillin": "/give/",
    "/en/support-and-donation": "/donate/",
  };
  const switcherLabel = en ? "עברית" : "English";
  const switcherHref = en ? (enToHe[pathname] ?? "/") : (heToEn[pathname] ?? "/en/the-tefillin-tie-initiative/");
  const homeHref = en ? "/en/the-tefillin-tie-initiative/" : "/";
  const dir = en ? "ltr" : "rtl";

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const range = Math.max((doc.scrollHeight - window.innerHeight) * 0.1, 1);
      setBgT(Math.min(window.scrollY / range, 1));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header dir={dir} role="banner" className="fixed top-0 inset-x-0 z-[99]" style={{ paddingInline: "5%" }}>
      {/* רקע motion-fx: ‎#060633 בשקיפות 46% שמופיע בהדרגה על פני 10% הראשונים של הגלילה */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: "#060633", opacity: 0.4588 * bgT }} />
      {/* overlay קבוע: גרדיאנט כהה מלמעלה בשקיפות 50% */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(180deg, #060633B5 0%, #06063300 100%)", opacity: 0.5 }} />

      <div className="relative flex flex-row flex-nowrap items-stretch" style={{ minHeight: 80 }}>
        {/* עמודת תפריט - 70%, מוצמד לימין */}
        <div className="flex flex-col justify-center items-start" style={{ width: "70%" }}>
          <nav aria-label="תפריט" className="hidden lg:block">
            <ul className="flex flex-row items-center m-0 p-0 list-none">
              {items.map((item) => {
                const isActive = item.href !== "#" && (item.href.replace(/\/+$/, "") || "/") === pathname;
                return (
                <li key={item.label} className="relative group">
                  <a href={item.href} className={`e-nav-link${isActive ? " e-nav-active" : ""}`}>
                    {item.label}
                    {item.children && <CaretDown />}
                  </a>
                  {item.children && (
                    <div className={`e-dropdown opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 absolute top-full ${en ? "left-0" : "right-0"}`}>
                      {item.children.map((c) => (
                        <a key={c.label} href={c.href} className="e-dropdown-item">{c.label}</a>
                      ))}
                    </div>
                  )}
                </li>
                );
              })}
              <li>
                <a href={switcherHref} lang={en ? undefined : "en-US"} className="e-nav-link">{switcherLabel}</a>
              </li>
            </ul>
          </nav>

          {/* כפתור המבורגר - מובייל/טאבלט */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="nav-toggle lg:hidden"
            aria-label={open ? "כפתור סגירת תפריט" : "כפתור פתיחת תפריט"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? (
              <svg viewBox="0 0 1000 1000" aria-hidden="true"><path d="M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z" /></svg>
            ) : (
              <svg viewBox="0 0 1000 1000" aria-hidden="true"><path d="M104 333H896C929 333 958 304 958 271S929 208 896 208H104C71 208 42 237 42 271S71 333 104 333ZM104 583H896C929 583 958 554 958 521S929 458 896 458H104C71 458 42 487 42 521S71 583 104 583ZM104 833H896C929 833 958 804 958 771S929 708 896 708H104C71 708 42 737 42 771S71 833 104 833Z" /></svg>
            )}
          </button>
        </div>

        {/* עמודת לוגואים - 30%, מוצמדת לשמאל */}
        <div className="flex flex-row justify-end items-start" style={{ width: "30%" }}>
          <a href="https://or-hadash.org.il/" aria-label="אור חדש" className="logo-or hidden md:block">
            <img src={dark ? "/wp/img/אור-חדש-לוגו-01.svg" : "/wp/img/אור-חדש-לוגו-13.svg"} alt="אור חדש" width={444} height={113} />
          </a>
          <a href={homeHref} aria-label={en ? "The Tefillin Tie Initiative - Home" : "קשר של תפילין - דף הבית"} className="logo-badge">
            <span className="logo-badge-box">
              <img src="/wp/img/לוגו-קשר-של-תפילין-01.svg" alt="קשר של תפילין" width={100} height={100} />
            </span>
          </a>
        </div>
      </div>

      {/* תפריט מובייל */}
      {open && (
        <nav id="mobile-menu" aria-label="תפריט נייד" className="lg:hidden e-mobile-menu">
          {items.map((item) => (
            <div key={item.label}>
              <a href={item.href} className="e-dropdown-item">{item.label}</a>
              {item.children && (
                <div className="pr-4">
                  {item.children.map((c) => (
                    <a key={c.label} href={c.href} className="e-dropdown-item">{c.label}</a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a href={switcherHref} className="e-dropdown-item">{switcherLabel}</a>
        </nav>
      )}
    </header>
  );
}
