
"use client";
import HeroSection from "@/components/marketing/sections/Hero";
import Features from "@/components/marketing/sections/Features";
import Testimonials from "@/components/marketing/sections/Testimonials";
import CTA from "@/components/marketing/sections/CTA";
import HowItWorks from "@/components/marketing/sections/HowItWorks";
import WhoItsFor from "@/components/marketing/sections/WhoItsFor";
import MagicBento from "@/components/marketing/sections/ServicesAndBenefits";
import { useEffect } from "react";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";

export default function Home() {
  useEffect(() => {
    tokenStorage.clearAll();
  }, []);
  return (
    <>
      <HeroSection />
      <WhoItsFor />
      <HowItWorks />
      <Features />
      <MagicBento />
      {/* <AboutUs /> */}
      {/* <BrowseProjects /> */}
      {/* <AppFeatures /> */}
      {/* <DownloadApp /> */}
      <Testimonials />
      <CTA />
    </>
  );
}
