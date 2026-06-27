import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { label: "סיפורים", href: "https://tefilin.or-hadash.org.il/stories/" },
  { label: "כתבות בתקשורת", href: "https://tefilin.or-hadash.org.il/in-news/" },
  {
    label: "מכתבים",
    href: "#",
    children: [
      { label: "מכתבי תודה", href: "https://tefilin.or-hadash.org.il/%d7%9e%d7%9b%d7%aa%d7%91%d7%99-%d7%aa%d7%95%d7%93%d7%94/" },
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
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#2D2E83]/95 backdrop-blur shadow-md py-1" : "bg-transparent py-2"
      }`}
      dir="rtl"
    >
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8 flex items-center justify-between gap-4">
        {/* Right: logos */}
        <div className="flex items-center gap-3 lg:gap-5 shrink-0">
          <a href="/" aria-label="קשר של תפילין - דף הבית" className="block">
            <img
              src="/wp/img/לוגו-קשר-של-תפילין-01.svg"
              alt="קשר של תפילין"
              className={`transition-all duration-300 ${
                scrolled ? "h-14 lg:h-16" : "h-16 lg:h-20"
              } w-auto`}
            />
          </a>
          <img
            src="/wp/img/אור-חדש-לוגו-13.svg"
            alt="אור חדש"
            className={`hidden md:block transition-all duration-300 ${
              scrolled ? "h-7 lg:h-9" : "h-9 lg:h-11"
            } w-auto`}
          />
        </div>

        {/* Left: nav (desktop) */}
        <nav aria-label="תפריט ראשי" className="hidden lg:flex items-center gap-6 xl:gap-8 text-white font-medium">
          {navItems.map((item) => (
            <div key={item.label} className="relative group">
              <a
                href={item.href}
                className="flex items-center gap-1 py-2 hover:text-[#67FFD1] transition-colors text-[15px]"
              >
                {item.label}
                {item.children && <ChevronDown className="size-3.5" />}
              </a>
              {item.children && (
                <div className="absolute top-full right-0 mt-1 min-w-[180px] bg-white shadow-xl rounded-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {item.children.map((c) => (
                    <a
                      key={c.label}
                      href={c.href}
                      className="block px-4 py-3 text-[#2D2E83] hover:bg-[#67FFD1]/20 text-sm"
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
            className="py-2 hover:text-[#67FFD1] transition-colors text-[15px]"
          >
            English
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-white p-2"
          aria-label={open ? "סגור תפריט" : "פתח תפריט"}
          aria-expanded={open}
        >
          {open ? <X className="size-7" /> : <Menu className="size-7" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          aria-label="תפריט נייד"
          className="lg:hidden bg-[#2D2E83]/98 backdrop-blur border-t border-white/10 px-6 py-4 space-y-1"
        >
          {navItems.map((item) => (
            <div key={item.label}>
              <a href={item.href} className="block text-white font-medium py-2.5 text-base">
                {item.label}
              </a>
              {item.children && (
                <div className="pr-4 space-y-1">
                  {item.children.map((c) => (
                    <a key={c.label} href={c.href} className="block text-white/80 py-1.5 text-sm">
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
            className="block text-white font-medium py-2.5 text-base"
          >
            English
          </a>
        </nav>
      )}
    </header>
  );
}
