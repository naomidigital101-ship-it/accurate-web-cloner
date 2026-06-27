import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/home/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { RequestForm } from "@/components/home/RequestForm";
import { InterviewSection } from "@/components/home/InterviewSection";
import { FeatureCards } from "@/components/home/FeatureCards";
import { StoriesSection } from "@/components/home/StoriesSection";
import { PressSection } from "@/components/home/PressSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { AboutTefilinSection } from "@/components/home/AboutTefilinSection";
import { MiKamchaSection } from "@/components/home/MiKamchaSection";
import { DonateTefilinForm } from "@/components/home/DonateTefilinForm";
import { DonationBanner } from "@/components/home/DonationBanner";
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
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <RequestForm />
        <InterviewSection />
        <FeatureCards />
        <StoriesSection />
        <PressSection />
        <HowItWorksSection />
        <AboutTefilinSection />
        <MiKamchaSection />
        <DonateTefilinForm />
        <DonationBanner />
        <FounderSection />
        <FaqSection />
      </main>
      <Footer />
      <Toaster position="top-center" dir="rtl" />
    </div>
  );
}
