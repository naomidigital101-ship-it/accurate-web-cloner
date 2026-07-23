type HoverCardProps = {
  title: string;
  href: string;
  img: string;
  bg: string;
};

function HoverCard({ title, href, img, bg }: HoverCardProps) {
  return (
    <a href={href} className="iv-card" style={{ backgroundColor: bg }} aria-label={title}>
      <span className="iv-card-overlay" aria-hidden="true" />
      <span className="iv-card-img">
        <img src={img} alt="" loading="lazy" aria-hidden="true" />
      </span>
      <h2 className="iv-card-title">{title}</h2>
    </a>
  );
}

export function InterviewSection() {
  return (
    <section dir="rtl" className="iv-e">
      <div className="iv-video-col">
        <p className="iv-intro">צפו בראיון של הרב עמיחי איל שמציג את המיזם "קשר של תפילין":</p>
        <div className="iv-video">
          <iframe
            src="https://www.youtube.com/embed/aQYiyBfycrc"
            title='הרב עמיחי אייל מציג את המיזם "קשר של תפילין" - ערוץ 7'
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
      <div className="iv-cards-col">
        <HoverCard
          title="הסכמות רבנים"
          href="/agreements"
          img="/wp/img/מכתב-הסכמה-מהרב-זילברשטיין-212x300.webp"
          bg="#2D2E83"
        />
        <HoverCard
          title="מכתבי תודה"
          href="/מכתבי-תודה/"
          img="/wp/img/-תודה-אמא-לחייל-e1712736869916-218x300.webp"
          bg="#009FE3"
        />
      </div>
    </section>
  );
}
