import { useSetting } from "@/lib/settings";

export function DonationBanner() {
  const donate = useSetting("donate_onetime_url");
  return (
    <section dir="rtl" className="partners-e">
      <span className="partners-overlay" aria-hidden="true" />
      <div className="partners-inner">
        <h2 className="partners-title">היו שותפים</h2>
        <p className="partners-text">
          <b>השותפות שלך חשובה לנו!</b> עלויות הפרויקט גבוהות והוא מתקיים הודות לשותפים רבים
          שלוקחים חלק בזיכוי הרבים שאין כמותו. תרום עכשיו, ובזכותך עוד יהודי יניח תפילין!
        </p>
        <p className="partners-note">התרומה מוכרת לצרכי מס</p>
        <div className="partners-btns">
          <a href={donate} target="_blank" rel="noopener" className="btn-e btn-outline-light">לתרומה</a>
        </div>
      </div>
    </section>
  );
}
