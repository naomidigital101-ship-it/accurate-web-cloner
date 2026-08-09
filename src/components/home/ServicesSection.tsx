import { useWhatsAppLink } from "@/lib/settings";

type Service = {
  title: string;
  more: string;
  img: string;
  height: number;
  back: string;
  backTitle?: string;
  href?: string;
  waText?: string;
  solid?: boolean;
};


export const services: Service[] = [
  {
    title: "הקמת גמ\"ח לקהילות",
    more: "לפרטים נוספים >>",
    img: "/wp/assets/tallit-tefillin-white-background-min.webp",
    height: 250,
    back: "רוצים להקים / לחדש גמ\"ח תפילין בבית הכנסת או בקהילה? יש כמה דברים שחשוב לדעת. נשמח לעזור לכם להקים את הגמ\"ח מ א' עד ת' מתוך הניסיון שלנו בקהילות רבות.",
    waText: decodeURIComponent("%D7%A9%D7%9C%D7%95%D7%9D%20%D7%A2%D7%9E%D7%99%D7%97%D7%99%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A4%D7%A8%D7%98%D7%99%D7%9D%20%D7%A0%D7%95%D7%A1%D7%A4%D7%99%D7%9D%20%D7%91%D7%A2%D7%A0%D7%99%D7%99%D7%9F%20%D7%94%D7%A7%D7%9E%D7%AA%20%D7%92%D7%9E%22%D7%97%20%D7%AA%D7%A4%D7%99%D7%9C%D7%99%D7%9F"),
  },
  {
    title: "הרצאות בנושא תפילין",
    more: "לפרטים נוספים >>",
    img: "/wp/assets/הרצאה.jpg",
    height: 300,

    back: "רוצים לשמוע הרצאה מרתקת בנושא התפילין בליווי פריטי תפילין אותנטיים, לקראת בר מצווה או לשם היכרות ראשונית עם התפילין ? רוצים לקבל דגשים חשובים לקראת רכישת תפילין וללמוד איך לקנות תפילין בצורה מושכלת ?",
    waText: decodeURIComponent("%D7%A9%D7%9C%D7%95%D7%9D%20%D7%A2%D7%9E%D7%99%D7%97%D7%99%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%91%D7%A4%D7%A8%D7%98%D7%99%D7%9D%20%D7%90%D7%95%D7%93%D7%95%D7%AA%20%D7%94%D7%A8%D7%A6%D7%90%D7%94%20%D7%A9%D7%9C%D7%9A%20%D7%91%D7%A0%D7%95%D7%A9%D7%90%20%D7%AA%D7%A4%D7%99%D7%9C%D7%99%D7%9F"),

  },
  {
    title: "שו\"ת תפילין",
    more: "קרא עוד >>",
    img: "/wp/assets/tallit-tefillin-white-background-min.webp",
    height: 250,
    back: "",
    backTitle: "בקרוב",
  },
];

export function ServicesSection() {
  const wa = useWhatsAppLink();
  return (
    <section dir="rtl" className="svc-e">
      <h2 className="e-h2-navy svc-title">שירותים נוספים</h2>
      <div className="svc-row">
        {services.map((s) => (
          <div key={s.title} className="svc-flip" style={{ height: s.height }}>
            <div className="svc-flip-inner">
              <div
                className={`svc-front ${s.solid ? "svc-front-solid" : ""}`}
                style={s.solid ? undefined : { backgroundImage: `url('${s.img}')` }}
              >

                <div className="svc-front-overlay">
                  <h3 className="svc-front-title">{s.title}</h3>
                  <p className="svc-front-more">{s.more}</p>
                </div>
              </div>
              <div className="svc-back">
                {s.backTitle && <h3 className="svc-back-title">{s.backTitle}</h3>}
                {s.back && <p className="svc-back-text">{s.back}</p>}
                {(s.href || s.waText) && (
                  <a href={s.waText ? `${wa}&text=${encodeURIComponent(s.waText)}` : s.href} target="_blank" rel="noopener" className="svc-back-btn">ליצירת קשר</a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="svc-shape" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <path d="M500,97C126.7,96.3,0.8,19.8,0,0v100l1000,0V1C1000,19.4,873.3,97.8,500,97z" />
        </svg>
      </div>
    </section>
  );
}
