type Story = {
  title: string;
  href: string;
  img: string;
};

const stories: Story[] = [
  {
    title: "\"וְרָאוּ כָּל עַמֵּי הָאָרֶץ כִּי שֵׁם ה' נִקְרָא עָלֶיךָ, וְיָרְאוּ מִמֶּךָּ\"",
    href: "/tefilin/%d7%95%d6%b0%d7%a8%d6%b8%d7%90%d7%95%d6%bc-%d7%9b%d6%b8%d6%bc%d7%9c-%d7%a2%d6%b7%d7%9e%d6%b5%d6%bc%d7%99-%d7%94%d6%b8%d7%90%d6%b8%d7%a8%d6%b6%d7%a5-%d7%9b%d6%b4%d6%bc%d7%99-%d7%a9%d6%b5%d7%81%d7%9d-2",
    img: "/wp/img/AdobeStock_93382125-min.webp",
  },
  {
    title: "ביקשת סימן? קיבלת",
    href: "/tefilin/%d7%91%d7%99%d7%a7%d7%a9%d7%aa-%d7%a1%d7%99%d7%9e%d7%9f-%d7%a7%d7%99%d7%91%d7%9c%d7%aa",
    img: "/wp/img/glitter-min.webp",
  },
  {
    title: "שלוחי מצווה",
    href: "/tefilin/%d7%a9%d7%9c%d7%95%d7%97%d7%99-%d7%9e%d7%a6%d7%95%d7%95%d7%94",
    img: "/wp/img/6-1.png",
  },
  {
    title: "סוף סוף יש לי תפילין! סוף סוף אני יודע להניח תפילין",
    href: "/tefilin/%d7%a1%d7%95%d7%a3-%d7%a1%d7%95%d7%a3-%d7%99%d7%a9-%d7%9c%d7%99-%d7%aa%d7%a4%d7%99%d7%9c%d7%99%d7%9f-%d7%a1%d7%95%d7%a3-%d7%a1%d7%95%d7%a3-%d7%90%d7%a0%d7%99-%d7%99%d7%95%d7%93%d7%a2-%d7%9c%d7%94",
    img: "/wp/img/5.png",
  },
  {
    title: "\"וְרָאוּ כָּל עַמֵּי הָאָרֶץ כִּי שֵׁם ה' נִקְרָא עָלֶיךָ, וְיָרְאוּ מִמֶּךָּ\"",
    href: "/tefilin/%d7%95%d6%b0%d7%a8%d6%b8%d7%90%d7%95%d6%bc-%d7%9b%d6%b8%d6%bc%d7%9c-%d7%a2%d6%b7%d7%9e%d6%b5%d6%bc%d7%99-%d7%94%d6%b8%d7%90%d6%b8%d7%a8%d6%b6%d7%a5-%d7%9b%d6%b4%d6%bc%d7%99-%d7%a9%d6%b5%d7%81%d7%9d-2",
    img: "/wp/img/חצי-פנים-6.png",
  },
];

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 448 512" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
    </svg>
  );
}

type PressItem = {
  title?: string;
  source: string;
  date: string;
  img: string;
  href: string;
};

const pressItems: PressItem[] = [
  {
    title: "ארגון 'קשר של תפילין' – ככה זה עובד בשטח",
    source: "הידברות",
    date: "28.9.25",
    img: "/wp/img/לוגו-הידברות.webp",
    href: "https://www.hidabroot.org/article/1214439",
  },
  {
    source: "מגזין אתנחתא",
    date: "ג' תשרי תשפ\"ן 25.09.25",
    img: "/wp/img/אתנחתא.png",
    href: "https://tefilin.or-hadash.org.il/wp-content/uploads/2025/10/yedidya_1164-1.pdf",
  },
  {
    title: "כתבה על קשר של תפילין בעיתון של כפר חב\"ד",
    source: "עיתון כפר חב\"ד",
    date: "21/05/2025",
    img: "/wp/img/כפר-חבד.jpg",
    href: "https://tefilin.or-hadash.org.il/wp-content/uploads/2025/05/%D7%AA%D7%9E%D7%95%D7%A0%D7%94-%D7%A9%D7%9C-WhatsApp%E2%80%8F-2025-05-18-%D7%91%D7%A9%D7%A2%D7%94-15.22.07_3aeb7c27.jpg",
  },
  {
    title: "גם לזוג התפילין הישנות שלכם יש ייעוד חשוב | מיזם 'קשר של תפילין' – כסף אנושי, פרק 5",
    source: "103FM",
    date: "21/04/2025",
    img: "/wp/img/103FM.jpg",
    href: "/wp/uploads/2025/05/103FM.jpg",
  },
];

export function StoriesSection() {
  return (
    <section dir="rtl" className="st-e">
      <div className="st-wrap">
        <div className="st-main">
          <div className="st-head">
            <h2 className="st-title">הסיפורים</h2>
            <div className="st-subrow">
              <h2 className="st-subtitle">שמאחורי התפילין</h2>
              <a href="/stories" className="st-all-btn">
                <span>לכל הסיפורים</span>
                <ArrowLeftIcon />
              </a>
            </div>
          </div>
          <div className="st-grid">
            {stories.map((s, i) => (
              <a
                key={i}
                href={s.href}
                className={i === 0 ? "st-card st-card-big" : "st-card"}
                style={{ backgroundImage: `url('${s.img}')` }}
              >
                <span className="st-card-panel">
                  <h3 className="st-card-title">{s.title}</h3>
                </span>
              </a>
            ))}
          </div>
        </div>
        <aside className="press-col">
          <h2 className="press-title">כתבות בתקשורת</h2>
          {pressItems.map((p, i) => (
            <a key={i} href={p.href} target="_blank" rel="noopener" className="press-item">
              <span className="press-item-logo" style={{ backgroundImage: `url('${p.img}')` }} />
              <span className="press-item-body">
                {p.title && <span className="press-item-title">{p.title}</span>}
                <span className="press-item-meta">
                  <b>{p.source}</b>
                  <span>{p.date}</span>
                </span>
              </span>
            </a>
          ))}
        </aside>
      </div>
    </section>
  );
}
