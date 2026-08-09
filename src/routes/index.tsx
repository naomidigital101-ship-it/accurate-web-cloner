import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { HeroSection } from "@/components/home/HeroSection";

import { AboutTefilinSection } from "@/components/home/AboutTefilinSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { AboutMitzvaSection } from "@/components/home/AboutMitzvaSection";
import { FormTabsSection } from "@/components/home/FormTabsSection";
import { DonationBanner } from "@/components/home/DonationBanner";
import { MiKamchaSection } from "@/components/home/MiKamchaSection";
import { StoriesSection } from "@/components/home/StoriesSection";
import { PressSection } from "@/components/home/PressSection";
import { PressStoriesSection } from "@/components/home/PressStoriesSection";
import { InterviewSection } from "@/components/home/InterviewSection";

import { FaqSection } from "@/components/home/FaqSection";
import { FounderSection } from "@/components/home/FounderSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { MobileDonateFab } from "@/components/home/MobileDonateFab";
import { readFaqs, readGallery } from "@/lib/content";

const HOME_TITLE = "קשר של תפילין - תרומה והשאלת תפילין לכל יהודי | אור חדש";
const HOME_DESC = "מיזם קשר של תפילין של עמותת אור חדש מחבר בין תורמי תפילין שאינן בשימוש ליהודים שרוצים להתחיל להניח. מעל 1,300 זוגות חולקו - בקשו או תרמו תפילין עוד היום.";
const HOME_URL = "https://accurate-web-cloner.lovable.app/";

export const faqs: { q: string; a: string }[] = [
  { q: "מה בדיוק אתם עושים ומה המטרה של הפרויקט ?", a: "מיזם 'קשר של תפילין' של עמותת אור חדש מקבל תפילין משומשות, מחדש אותן על ידי סופרי סת\"ם מומחים, ומוסר אותן ליהודים שרוצים להניח תפילין ואין להם משלהם." },
  { q: "זה בתשלום? כמה?", a: "מקבל התפילין מתבקש לשלם רק את עלויות העבודה - כרבע ממחיר השוק. מי שאינו יכול לשלם - מקבל בכל מקרה." },
  { q: "יש לי תפילין בבית, אבל אני לא יודע אם הן כשרות, זה יכול לעזור?", a: "בהחלט. כל התפילין שמגיעות אלינו עוברות בדיקה מקצועית של סופר סת\"ם, ובמרבית המקרים ניתן לתקן ולחדש אותן." },
  { q: "אין לי זוג תפילין לתת אבל אני רוצה להשתתף במצווה.", a: "אפשר להשתתף בזיכוי הרבים בתרומה כספית למיזם דרך עמוד התרומות באתר." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: HOME_TITLE },
      { name: "description", content: HOME_DESC },
      { property: "og:title", content: HOME_TITLE },
      { property: "og:description", content: HOME_DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: HOME_URL },
    ],
    links: [{ rel: "canonical", href: HOME_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  loader: async () => ({ faqs: await readFaqs("he"), gallery: await readGallery() }),
  component: Index,
});

function Index() {
  const { faqs: dbFaqs, gallery } = Route.useLoaderData();
  const faqItems = dbFaqs?.map((f) => ({ q: f.question, a: f.answer }));
  return (
    <div dir="rtl" lang="he" className="min-h-screen bg-background">
      <Header />
      <main id="content">
        <HeroSection />
        <FormTabsSection />
        <InterviewSection />
        <StoriesSection />
        <PressStoriesSection />
        <PressSection />
        <AboutTefilinSection />
        <HowItWorksSection />
        <AboutMitzvaSection />
        <MiKamchaSection />
        <DonationBanner />
        <FounderSection />
        <FaqSection items={faqItems} />
        <ServicesSection />
      </main>
      <Footer images={gallery ?? undefined} />
      <MobileDonateFab />
    </div>
  );
}

