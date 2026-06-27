

const stories = [
  {
    title: '"וְרָאוּ כָּל עַמֵּי הָאָרֶץ כִּי שֵׁם ה\' נִקְרָא עָלֶיךָ, וְיָרְאוּ מִמֶּךָּ"',
    img: "https://tefilin.or-hadash.org.il/wp-content/uploads/2024/01/קשת-9-min-e1706093310964.webp",
  },
  {
    title: "ביקשת סימן? קיבלת",
    img: "https://tefilin.or-hadash.org.il/wp-content/uploads/2024/01/קשת-3-min.webp",
  },
  {
    title: "שלוחי מצווה",
    img: "https://tefilin.or-hadash.org.il/wp-content/uploads/2024/01/קשת-4-min.webp",
  },
  {
    title: "סוף סוף יש לי תפילין! סוף סוף אני יודע להניח תפילין",
    img: "https://tefilin.or-hadash.org.il/wp-content/uploads/2024/01/קשת-7-min-e1706093189536.webp",
  },
  {
    title: '"וְרָאוּ כָּל עַמֵּי הָאָרֶץ כִּי שֵׁם ה\' נִקְרָא עָלֶיךָ, וְיָרְאוּ מִמֶּךָּ"',
    img: "https://tefilin.or-hadash.org.il/wp-content/uploads/2024/01/קשת-2-min.webp",
  },
  {
    title: "ע. מקריית אונו",
    img: "https://tefilin.or-hadash.org.il/wp-content/uploads/2024/01/קשת-5-min.webp",
  },
  {
    title: "א' מפתח תקוה",
    img: "https://tefilin.or-hadash.org.il/wp-content/uploads/2024/01/פתח-תקוה.jpg",
  },
  {
    title: "מאיר מירושלים",
    text: 'בע"ה אני אהיה בעוד כמה שבועות בן 90. היום קיבלתי תפילין, ולא יכולתי לבקש מתנה יותר מיוחדת ומרגשת לכבוד יום ההולדת שלי. בברית מילה שעשו לי כשהייתי בן 8 ימים קיבלתי את השם: מאיר. כל החיים קראו לי בשם הרוסי: מיכאל. אבל מעכשיו – אחרי שהתחלתי להניח תפילין – אני מבקש שתקראו לי בשם היהודי שלי: מאיר!',
  },
];

export function StoriesSection() {
  return (
    <section id="stories" className="py-20 px-4 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <h2 className="font-display font-black text-6xl md:text-7xl text-link-sky leading-none">הסיפורים</h2>
            <p className="font-display font-bold text-2xl md:text-3xl text-ink mt-2">שמאחורי התפילין</p>
          </div>
          <a href="#all-stories" className="font-display font-bold text-[var(--e-link-sky)] hover:text-[var(--e-primary)] transition-colors">
            לכל הסיפורים ←
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stories.map((s, i) => (
            <article
              key={i}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-card bg-ink hover:-translate-y-1 transition-transform"
            >
              {s.img ? (
                <>
                  <img src={s.img} alt={s.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
                  <h3 className="absolute bottom-0 inset-x-0 p-4 text-white font-display font-bold text-base leading-tight">
                    {s.title}
                  </h3>
                </>
              ) : (
                <div className="absolute inset-0 p-5 overflow-auto text-white text-xs leading-relaxed bg-gradient-to-br from-teal-dark to-teal-deep">
                  <p>{s.text}</p>
                  <p className="mt-3 font-bold text-teal">| {s.title}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
