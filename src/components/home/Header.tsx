import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "סיפורים", href: "#stories" },
  { label: "כתבות בתקשורת", href: "#press" },
  { label: "מכתבים", href: "#letters", hasMenu: true },
  { label: "בקשת תפילין", href: "#request" },
  { label: "מסירת/תרומת תפילין", href: "#donate" },
  { label: "תרומה", href: "#contribute" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-4 flex items-center justify-between gap-6">
        {/* Right side: logos */}
        <div className="flex items-center gap-3">
          <a href="/" aria-label="קשר של תפילין - דף הבית" className="block">
            <div className="size-20 lg:size-24 rounded-full bg-white shadow-soft flex items-center justify-center p-2">
              <img src="/logo.svg" alt="קשר של תפילין" className="w-full h-full object-contain" />
            </div>
          </a>
          <div className="hidden sm:flex items-baseline gap-0.5 text-white font-display font-bold text-2xl">
            <span className="text-orange">אור</span>
            <span>חדש</span>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7 text-white font-medium">
          <a href="#english" className="hover:text-orange transition-colors">English</a>
          {navItems.slice().reverse().map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:text-orange transition-colors flex items-center gap-1"
            >
              {item.label}
              {item.hasMenu && <ChevronDown className="size-4" />}
            </a>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-white p-2"
          aria-label="פתח תפריט"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-teal-dark/95 backdrop-blur px-6 py-4 space-y-3">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="block text-white font-medium py-1">
              {item.label}
            </a>
          ))}
          <a href="#english" className="block text-white font-medium py-1">English</a>
        </div>
      )}
    </header>
  );
}
