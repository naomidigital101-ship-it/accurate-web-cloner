import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { RequestForm } from "@/components/home/RequestForm";
import { FeatureCards } from "@/components/home/FeatureCards";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { AboutTefilinSection } from "@/components/home/AboutTefilinSection";
import { MiKamchaSection } from "@/components/home/MiKamchaSection";
import { DonationBanner } from "@/components/home/DonationBanner";
import { DonateTefilinForm } from "@/components/home/DonateTefilinForm";
import { InterviewSection } from "@/components/home/InterviewSection";
import { StoriesSection } from "@/components/home/StoriesSection";
import { FounderSection } from "@/components/home/FounderSection";
import { FaqSection } from "@/components/home/FaqSection";
import { PressSection } from "@/components/home/PressSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "קשר של תפילין | מיזם אור חדש - ערבות הדדית וזיכוי הרבים" },
      {
        name: "description",
        content:
          "מיזם של ערבות הדדית וזיכוי הרבים. חילקנו מעל 1,300 זוגות תפילין ליהודים שמבקשים להתחיל להניח.",
      },
      { property: "og:title", content: "קשר של תפילין | מיזם אור חדש" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div dir="rtl" lang="he" className="bg-background text-ink min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <RequestForm />
        <FeatureCards />
        <HowItWorksSection />
        <AboutTefilinSection />
        <InterviewSection />
        <MiKamchaSection />
        <DonationBanner />
        <DonateTefilinForm />
        <StoriesSection />
        <FounderSection />
        <FaqSection />
        <PressSection />
      </main>
      <Footer />
    </div>
  );
}
