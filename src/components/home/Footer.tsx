import { InnerPageFx } from "@/components/InnerPageFx";
import { FooterGallery, gallery } from "@/components/FooterGallery";
import { SiteFooter } from "@/components/SiteFooter";

// נשמר לתאימות אחורה - היה מיוצא מכאן לפני שהגלריה הופרדה
export { gallery };

/**
 * הפוטר של עמודי הבית: גלריה + הפוטר המלא.
 * שאר עמודי האתר מרנדרים את SiteFooter ישירות, בלי הגלריה.
 */
export function Footer({
  images,
  en = false,
}: { images?: { url: string; alt: string | null }[]; en?: boolean } = {}) {
  return (
    <>
      <InnerPageFx />
      <FooterGallery images={images} />
      <SiteFooter en={en} />
    </>
  );
}
