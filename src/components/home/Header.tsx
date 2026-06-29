import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const navItems: NavItem[] = [
  { label: "סיפורים", href: "https://tefilin.or-hadash.org.il/stories/" },
  { label: "כתבות בתקשורת", href: "https://tefilin.or-hadash.org.il/in-news/" },
  {
    label: "מכתבים",
    href: "#",
    children: [
      {
        label: "מכתבי תודה",
        href: "https://tefilin.or-hadash.org.il/%d7%9e%d7%9b%d7%aa%d7%91%d7%99-%d7%aa%d7%95%d7%93%d7%94/",
      },
      { label: "הסכמות הרבנים", href: "https://tefilin.or-hadash.org.il/agreements/" },
    ],
  },
  { label: "בקשת תפילין", href: "https://tefilin.or-hadash.org.il/request/" },
  { label: "מסירת/תרומת תפילין", href: "https://tefilin.or-hadash.org.il/give/" },
  { label: "תרומה", href: "https://tefilin.or-hadash.org.il/donate/" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      dir="rtl"
      role="banner"
      className={`fixed top-0 inset-x-0 z-50 h-20 transition-colors duration-300 ${
        scrolled ? "bg-[#2D2E83]/95 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto h-full max-w-[1400px] px-4 lg:px-8 flex flex-row-reverse items-center justify-between gap-4">
        {/* ===== Left side (visually): logos ===== */}
        <div className="flex flex-row-reverse items-center gap-4 lg:gap-6 shrink-0 h-full">
          {/* Tefilin circle logo — hangs below the header line, larger and bolder */}
          <a
            href="/"
            aria-label="קשר של תפילין - דף הבית"
            className="relative block shrink-0"
            style={{ width: 140, height: 140, marginTop: 0 }}
          >
            <span
              className="absolute inset-0 bg-white"
              style={{
                borderRadius: "0 0 200px 200px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                padding: 6,
              }}
            />
            <img
              src="/wp/img/לוגו-קשר-של-תפילין-01.svg"
              alt="קשר של תפילין"
              width={128}
              height={128}
              className="relative block w-[128px] h-[128px] m-[6px]"
            />
          </a>

          {/* Or Hadash wordmark */}
          <a
            href="https://or-hadash.org.il/"
            aria-label="אור חדש"
            className="hidden md:inline-flex items-center shrink-0"
          >
            <img
              src="/wp/img/אור-חדש-לוגו-13.svg"
              alt="אור חדש"
              width={117}
              height={30}
              className="block h-[30px] w-auto"
            />
          </a>
        </div>

        {/* ===== Left: desktop nav ===== */}
        <nav
          aria-label="תפריט ראשי"
          className="hidden lg:flex items-center gap-7 xl:gap-9 h-full"
        >
          {navItems.map((item) => (
            <div key={item.label} className="relative group h-full flex items-center">
              <a
                href={item.href}
                className="flex items-center gap-1 text-white text-[16px] font-semibold leading-none hover:text-[#67FFD1] transition-colors"
              >
                {item.label}
                {item.children && <ChevronDown className="size-3.5 mt-0.5" />}
              </a>
              {item.children && (
                <div className="absolute top-full right-0 min-w-[200px] bg-white shadow-xl rounded-md overflow-hidden opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                  {item.children.map((c) => (
                    <a
                      key={c.label}
                      href={c.href}
                      className="block px-5 py-3 text-[#2D2E83] hover:bg-[#67FFD1]/25 text-[15px] font-medium"
                    >
                      {c.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a
            href="https://tefilin.or-hadash.org.il/en/the-tefillin-tie-initiative/"
            lang="en"
            dir="ltr"
            className="text-white text-[16px] font-semibold leading-none hover:text-[#67FFD1] transition-colors"
          >
            English
          </a>
        </nav>

        {/* ===== Mobile toggle ===== */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="lg:hidden text-white p-2 -ml-2"
          aria-label={open ? "סגור תפריט" : "פתח תפריט"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="size-7" /> : <Menu className="size-7" />}
        </button>
      </div>

      {/* ===== Mobile menu ===== */}
      {open && (
        <nav
          id="mobile-menu"
          aria-label="תפריט נייד"
          className="lg:hidden absolute top-20 inset-x-0 bg-[#2D2E83] border-t border-white/10 shadow-lg max-h-[calc(100vh-5rem)] overflow-y-auto"
        >
          <div className="px-6 py-4 space-y-1">
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-white/10 last:border-0">
                <a
                  href={item.href}
                  className="block text-white font-semibold py-3 text-base"
                >
                  {item.label}
                </a>
                {item.children && (
                  <div className="pb-3 pr-4 space-y-1">
                    {item.children.map((c) => (
                      <a
                        key={c.label}
                        href={c.href}
                        className="block text-white/85 py-2 text-sm"
                      >
                        {c.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a
              href="https://tefilin.or-hadash.org.il/en/the-tefillin-tie-initiative/"
              lang="en"
              dir="ltr"
              className="block text-white font-semibold py-3 text-base"
            >
              English
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
