import { useState } from "react";

type Quote = {
  text: string;
  name: string;
  city?: string;
  img?: string;
  href?: string;
};

const quotes: Quote[] = [
  {
    "text": "היי, מה שלומך הרב עמיחי ? 🙂\nהרבה התקדם מאז שקיבלתי ממך את התפילין לפני שנתיים.\nאני מתפלל 3 תפילות ביום (ביחיד כרגע), ציצית מתחת לבגד, כיפה.\nאפילו מצאתי בחור ללמוד איתו מרחוק.\nתודה רבה על התפילין שעזרו לפתוח את הדרך הזאת.",
    "name": "א.",
    "city": "מחריש"
  },
  {
    "text": "לכבוד הרב עמיחי, ברגע שהייתי צריך תפילין קיבלתי את הטלפון שלך דרך הודעות ווטסאפ שרצו ברשת.\nשלחתי לך הודעה ובלי שום היסוס ישר דיברת איתי ושאל את כל הפרטים, ולאורך כל הדרך עזרת והתעניינת, שלחת הודעות ורצית לדעת מה קורה איתי ומה קורה עם התפילין ועדכנת אותי לאורך כל הדרך.\nאני לא מוצא מספיק מילים להודות לך על החסד, על המצווה, על הדבר העצום שעשית עבורי.\nשהקדוש ברוך הוא ימלא ימיך בטוב ושנותיך בנעימים.\nישפיע עליך שפע ברכה והצלחה, בריאות איתנה ונחת מכל מעשי ידיך.\nותמיד תזכה להפיץ אור, אהבה וחסד לכל מי שסביבך.\nתודה רבה לך הרב עמיחי,\nלא אשכח לך זאת לעולם,",
    "name": "ג.",
    "city": "מבאר שבע"
  },
  {
    "text": "כל יום אני מניח תפילין בזכותך לא מפספס הנחת תפילין וטלית כהלכה כל בוקר 🙌🏼\nאין מאושר ממני אני מאד שמח לפתוח את היום בהודייה לקדוש ברוך הוא ❤️\nהמון המון תודה על העזרה החמה ועל הזכות שהענקת לי בכך שהבאת לי תפילין, מצווה כל כך גדולה. זיכית אותי וגרמת לי להיות בן אדם יותר טוב.\nתודה רבה.",
    "name": "ת.",
    "city": "מבית שמש"
  },
  {
    "text": "אין לי מילים כדי להביע את תודתי העמוקה לרב ולעבודתו המדהימה בעזרה לאנשים לקבל תפילין. החלום שלי היה שאוכל להניח תפילין מהודרות, אך לצערי לא הייתה לי אפשרות כלכלית לרכוש אותם. פניתי לרב שלי שחיבר אותי אליך ובזכות ה' ובזכות נדיבותך, היום קיבלתי ממך תפילין מהודרות ברמה גבוהה ואני רוצה להודות לך על הזכות שהענקת לי.",
    "name": "ע.",
    "city": "מירושלים"
  },
  {
    "text": "כבוד הרב עמיחי, תודה רבה לך על מצווה ענקית, על העזרה, על הפרויקט המדהים הזה, שמשנה את חייהם של כל כך הרבה אנשים.\nשאלוהים יזכה אותך בכל הטוב שבעולם, כמו שאתה עושה לכולם.🙏",
    "name": "ג.",
    "city": "מקרית טבעון"
  },
  {
    "text": "תודה רבה הרב עמיחי על התפילין. אין לי מילים. עשית אותי האדם המאושר בעולם כרגע. שירבו אנשים כמוך.\nבאמת אחרי שדיברנו, תוך יום דאגת שיביאו לי תפילין. הופתעתי ולא ציפיתי שהיה כזה מהר.\nבזכותך אוכל להניח תפילין בכל בוקר.\nא.\nפרדסיה",
    "name": "א.",
    "city": "מפרדסיה"
  },
  {
    "text": "אני רוצה לשתף בסיפור האישי המרגש שלנו עם הרב עמיחי.\nהבן שלנו ב', שגדל בבית חילוני מתעניין לאחרונה יותר ויותר בהתקרבות לדת ולבורא עולם. בזכותו התחלנו לעשות קידוש בשישי והחלו שיחות מעניינות ועמוקות בנושא היהדות.\nהוא הפציר וביקש שוב ושוב מאיתנו לאחרונה שנקנה לו תפילין ומכיוון שאנחנו במצב כלכלי מעורער כרגע לא יכולנו להרשות לעצמנו וזה ציער אותנו וכמובן אותו מאד.\nואז צץ במוחי רעיון לכתוב בצ'אט gpt שאלה-\nבמידה והבן שלי רוצה לקנות תפילין ואין ביכולתי לקנות לו, מי יכול לעזור לי?\nהשם ומס' הטלפון של עמיחי עלו לי ראשונים בחיפוש וכשיצרתי איתו קשר היתה לי ואח\"כ לבן שלי שיחה ארוכה ולבבית עם הרב עמיחי ולאחר מכן, ממש ימים ספורים לאחר השיחה, התפילין כבר היו אצלנו.\nב' מאושר כל כך מניח תפילין כל בוקר כולנו מודים מאד לעמיחי על השירות המדהים והמחבר.\nיערה כ.",
    "name": "ב.",
    "city": "מתל אביב"
  },
  {
    "text": "תודה ענקית על שהבאת לי את התפילין, זה מאוד ריגש אותי. אין לי מילים להודות – תזכה למצוות!\nאנשים כמוך וכמו המיזם הזה מרגשים אותי כל פעם מחדש וגורמים לקול הפנימי שברגעים של ירידה להיעלם ולהפוך לסימני קריאה של שמחה ואמונה בצדקת הדרך\nאשריכם ישראל.\nאשרי העם שאלו הם האנשים בתוכו ❤️\nתודה רבה❤️",
    "name": "י.",
    "city": "מחדרה"
  },
  {
    "text": "היי, רציתי להגיד תודה רבה על כל העזרה. היום קיבלתי את התפילין ואני באמת מעריך את כל מה שעשיתם בשבילי.\nבתור חייל בודד זה באמת לא מובן מאליו, וזה אומר לי המון. אני מבטיח להשתמש בתפילין כל יום ולשמור עליהן כמו שצריך.\nמה שאתם עושים זה פשוט מדהים, ואני ממש מעריך את כל ההשקעה והעזרה לאורך כל הדרך.\nתודה רבה על הכל, ובעזרת ה' אשתמש בהן לעוד הרבה שנים.",
    "name": "ע.ק.",
    "city": "מאשדוד"
  },
  {
    "text": "",
    "name": "ע.",
    "city": "מקריית אונו",
    "img": "/wp/img/AdobeStock_93382125-min.webp",
    "href": "/tefilin/%D7%95%D6%B0%D7%A8%D6%B8%D7%90%D7%95%D6%BC-%D7%9B%D6%B8%D6%BC%D7%9C-%D7%A2%D6%B7%D7%9E%D6%B5%D6%BC%D7%99-%D7%94%D6%B8%D7%90%D6%B8%D7%A8%D6%B6%D7%A5-%D7%9B%D6%B4%D6%BC%D7%99-%D7%A9%D6%B5%D7%81%D7%9D-2"
  }
];

const letterImages: Record<string, string> = {
  "א.|מחריש": "/wp/img/glitter-min.webp",
  "ג.|מבאר שבע": "/wp/img/midsection-woman-with-tape-rolled-hand-holding-book-min.webp",
  "ת.|מבית שמש": "/wp/img/לפני-1-min.webp",
  "ע.|מירושלים": "/wp/img/cropped-hand-wrapped-tefillin-min.webp",
  "א.|מפרדסיה": "/wp/img/AdobeStock_229166376-min.webp",
  "ב.|מתל אביב": "/wp/img/tallit-tefillin-white-background-min.webp",
  "י.|מחדרה": "/wp/img/תפילין-1-חתוך-min-1.webp",
  "ע.ק.|מאשדוד": "/wp/img/AdobeStock_817584046-min.webp",
  "מיכאל|מירושלים": "/wp/img/unfocused-people-walking-min.webp",
};

const fallbackLetterImages = [
  "/wp/img/glitter-min.webp",
  "/wp/img/cropped-hand-wrapped-tefillin-min.webp",
  "/wp/img/tallit-tefillin-white-background-min.webp",
  "/wp/img/unfocused-people-walking-min.webp",
];

function letterImageFor(q: Quote, i: number): string {
  return encodeURI(letterImages[`${q.name}|${q.city ?? ""}`] ?? fallbackLetterImages[i % fallbackLetterImages.length]);
}

function Chevron({ dir }: { dir: "next" | "prev" }) {
  return (
    <svg viewBox="0 0 180 180" width="28" height="28" fill="currentColor" aria-hidden="true" style={{ transform: dir === "next" ? "scaleX(-1)" : undefined }}>
      <path d="M119 47.3c0 .9-.3 1.6-1 2.3L77.7 90l40.3 40.4c.7.7 1 1.4 1 2.3 0 .9-.3 1.6-1 2.3l-5 5c-.7.7-1.4 1-2.3 1-.9 0-1.6-.3-2.3-1L62 93.3c-.7-.7-1-1.4-1-2.3 0-.9.3-1.6 1-2.3l46.4-46.7c.7-.7 1.4-1 2.3-1 .9 0 1.6.3 2.3 1l5 5c.7.7 1 1.5 1 2.3z" />
    </svg>
  );
}

export function PressSection() {
  const [start, setStart] = useState(0);
  const n = quotes.length;
  const perView = 3;
  const maxStart = Math.max(0, n - perView);
  const go = (d: number) => setStart((s) => Math.min(maxStart, Math.max(0, s + d)));
  return (
    <section dir="rtl" className="qc-e qc-e-wa" aria-label="ציטוטים ממקבלי תפילין">
      <button type="button" className="qc-arrow" aria-label="הקודם" onClick={() => go(-1)} disabled={start === 0}>
        <Chevron dir="prev" />
      </button>
      <div className="qc-track">
        <div className="qc-strip" style={{ ["--qc-i" as string]: String(start) }}>
        {quotes.map((q, i) => (
          <article key={i} className="qc-card">
            {q.img && <span className="qc-img" style={{ backgroundImage: `url('${q.img}')` }} />}
            <span className="qc-letter" aria-hidden="true" />
            <div className="qc-body">
              {q.text && <p className="qc-text">{q.text}</p>}
              <div className="qc-meta">
                <span>{q.name}</span>
                {q.city && <span>{q.city}</span>}
              </div>
              {q.href && (
                <a href={q.href} className="qc-more">
                  לסיפור המלא
                  <svg viewBox="0 0 448 512" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" /></svg>
                </a>
              )}
            </div>
          </article>
        ))}
        </div>
      </div>
      <button type="button" className="qc-arrow" aria-label="הבא" onClick={() => go(1)} disabled={start >= maxStart}>
        <Chevron dir="next" />
      </button>
    </section>
  );
}
