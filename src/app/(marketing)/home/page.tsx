import HeroSection from "@/components/marketing/sections/Hero";
import Features from "@/components/marketing/sections/Features";
import Testimonials from "@/components/marketing/sections/Testimonials";
import CTA from "@/components/marketing/sections/CTA";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Features />
      <Testimonials />
      <CTA />
    </>
  );
}
