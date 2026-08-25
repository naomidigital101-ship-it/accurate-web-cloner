import { Header } from "@/components/home/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { InnerPageFx } from "@/components/InnerPageFx";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";

import { track } from "@/lib/analytics";

type NavItem = { slug: string; title: string };

export type StoryShellProps = {
  title: string;
  subtitle?: string;
  name?: string;
  place?: string;
  img: string;
  extraImg?: string;
  paragraphs: string[];
  prev?: NavItem;
  next?: NavItem;
  en?: boolean;
};

export function StoryShell({
  title,
  subtitle,
  name,
  place,
  img,
  extraImg,
  paragraphs,
  prev,
  next,
  en = false,
}: StoryShellProps) {
  const linkTo = en ? "/en/tefilin/$slug" : "/tefilin/$slug";

  // כניסה לעמוד סיפור - הסלאג נלקח מהכתובת כדי לא לשנות את חוזה הפרופס
  useEffect(() => {
    const parts = window.location.pathname.replace(/\/+$/, "").split("/");
    const slug = decodeURIComponent(parts[parts.length - 1] ?? "");
    if (slug) track("story_read", { slug });
  }, [title]);
  return (
    <div dir={en ? "ltr" : "rtl"} lang={en ? "en" : "he"} className={en ? "story-shell story-shell-en" : "story-shell"}>
      <Header en={en} dark />

      <section className="story-hero" aria-hidden={false}>
        <div className="story-hero-bg" style={{ backgroundImage: `url('${img}')` }} />
        <div className="story-hero-inner">
          <div className="story-hero-dome" style={{ backgroundImage: `url('${img}')` }} role="img" aria-label={title} />
          <div className="story-hero-title">
            <h1>{title}</h1>
            <img
              src="/wp/assets/כוכבית-כחולה-16.svg"
              alt=""
              width={50}
              height={50}
              className="story-hero-star"
              aria-hidden="true" decoding="async" />
          </div>
        </div>
        <svg className="story-hero-curve" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,60 C480,0 960,0 1440,60 L1440,60 L0,60 Z" fill="#ffffff" />
        </svg>
      </section>

      <main className="story-body">
        <div className="story-body-inner">
          <aside className="story-meta-col" aria-label={en ? "story info" : "פרטי הסיפור"}>
            {(name || place) && (
              <div className="story-meta-row">
                <span className="story-meta-arrow" aria-hidden="true">◂</span>
                <span className="story-meta-text">
                  {name && <b>{name}</b>}
                  {place && <span>{place}</span>}
                </span>
              </div>
            )}
            {subtitle && <h2 className="story-subtitle">{subtitle}</h2>}
          </aside>
          <article className="story-text-col">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="story-par"
                dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") }}
              />
            ))}
            {extraImg && <img src={extraImg} alt={title} className="story-extra-img" loading="lazy" decoding="async" />}
          </article>
        </div>

        <nav className="story-nav-bar" aria-label={en ? "Story navigation" : "ניווט בין סיפורים"}>
          <div className="story-nav-inner">
            {prev ? (
              <Link to={linkTo} params={{ slug: prev.slug }} className="story-nav-item story-nav-prev">
                <span className="story-nav-chev" aria-hidden="true">‹</span>
                <span className="story-nav-txt">
                  <span className="story-nav-label">סיפור קודם</span>
                  <b className="story-nav-title">{prev.title}</b>
                </span>
              </Link>
            ) : (
              <span className="story-nav-item story-nav-empty" />
            )}
            <span className="story-nav-sep" aria-hidden="true" />
            {next ? (
              <Link to={linkTo} params={{ slug: next.slug }} className="story-nav-item story-nav-next">
                <span className="story-nav-txt">
                  <span className="story-nav-label">הבא</span>
                  <b className="story-nav-title">{next.title}</b>
                </span>
                <span className="story-nav-chev" aria-hidden="true">›</span>
              </Link>
            ) : (
              <span className="story-nav-item story-nav-empty" />
            )}
          </div>
        </nav>
      </main>

      <SiteFooter en={en} />
      <InnerPageFx />
    </div>
  );
}
