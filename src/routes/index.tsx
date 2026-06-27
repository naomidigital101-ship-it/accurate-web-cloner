import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/home/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCards } from "@/components/home/FeatureCards";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { RequestForm } from "@/components/home/RequestForm";
import { AboutTefilinSection } from "@/components/home/AboutTefilinSection";
import { MiKamchaSection } from "@/components/home/MiKamchaSection";
import { DonateTefilinForm } from "@/components/home/DonateTefilinForm";
import { InterviewSection } from "@/components/home/InterviewSection";
import { DonationBanner } from "@/components/home/DonationBanner";
import { StoriesSection } from "@/components/home/StoriesSection";
import { PressSection } from "@/components/home/PressSection";
import { FounderSection } from "@/components/home/FounderSection";
import { FaqSection } from "@/components/home/FaqSection";
import { Footer } from "@/components/home/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "קשר של תפילין | מיזם אור חדש - ערבות הדדית וזיכוי הרבים" },
      { name: "description", content: "מיזם של ערבות הדדית וזיכוי הרבים. חילקנו מעל 1,300 זוגות תפילין. מבקשים תפילין? יש לכם תפילין לתרומה? פנו אלינו." },
      { property: "og:title", content: "קשר של תפילין | מיזם אור חדש" },
      { property: "og:description", content: "מיזם של ערבות הדדית וזיכוי הרבים - חילקנו מעל 1,300 זוגות תפילין." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeatureCards />
        <HowItWorksSection />
        <RequestForm />
        <AboutTefilinSection />
        <MiKamchaSection />
        <DonateTefilinForm />
        <InterviewSection />
        <DonationBanner />
        <StoriesSection />
        <PressSection />
        <FounderSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
