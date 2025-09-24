import HeroSection from "@/components/marketing/sections/Hero";
import Features from "@/components/marketing/sections/Features";
import Testimonials from "@/components/marketing/sections/Testimonials";
import CTA from "@/components/marketing/sections/CTA";
import AboutUs from "@/components/marketing/sections/AboutUs";
import HowItWorks from "@/components/marketing/sections/HowItWorks";
import BrowseProjects from "@/components/marketing/sections/BrowseProjects";
import AppFeatures from "@/components/marketing/sections/AppFeatures";
import DownloadApp from "@/components/marketing/sections/DownloadApp";
import WhoItsFor from "@/components/marketing/sections/WhoItsFor";
import MagicBento from "@/components/marketing/sections/ServicesAndBenefits";

export default function Home() {
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
