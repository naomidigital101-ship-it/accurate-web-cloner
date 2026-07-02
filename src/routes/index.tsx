import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCards } from "@/components/home/FeatureCards";
import { AboutTefilinSection } from "@/components/home/AboutTefilinSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { FormTabsSection } from "@/components/home/FormTabsSection";
import { DonationBanner } from "@/components/home/DonationBanner";
import { MiKamchaSection } from "@/components/home/MiKamchaSection";
import { StoriesSection } from "@/components/home/StoriesSection";
import { InterviewSection } from "@/components/home/InterviewSection";
import { PressSection } from "@/components/home/PressSection";
import { FaqSection } from "@/components/home/FaqSection";
import { FounderSection } from "@/components/home/FounderSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "קשר של תפילין | מיזם אור חדש - ערבות הדדית וזיכוי הרבים" },
      {
        name: "description",
        content:
          "מיזם 'קשר של תפילין' של עמותת אור חדש - מחלקים תפילין מהודרות לכל יהודי שמבקש. מעל 1,300 זוגות חולקו.",
      },
      { property: "og:title", content: "קשר של תפילין | מיזם אור חדש" },
      {
        property: "og:description",
        content: "מיזם של ערבות הדדית וזיכוי הרבים. חילקנו מעל 1,300 זוגות תפילין.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div dir="rtl" lang="he" className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FormTabsSection />
        <InterviewSection />
        <FeatureCards />
        <StoriesSection />
        <PressSection />
        <AboutTefilinSection />
        <HowItWorksSection />
        <MiKamchaSection />
        <DonationBanner />
        <FounderSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
