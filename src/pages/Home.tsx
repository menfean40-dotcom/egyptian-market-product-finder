import LightRibbon from "@/components/LightRibbon";
import Navigation from "@/components/Navigation";
import Hero from "@/sections/Hero";
import HowItWorks from "@/sections/HowItWorks";
import WhyGenie from "@/sections/WhyGenie";
import ProductShowcase from "@/sections/ProductShowcase";
import Pricing from "@/sections/Pricing";
import Testimonials from "@/sections/Testimonials";
import FAQContact from "@/sections/FAQContact";
import Footer from "@/sections/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen" style={{ background: "#0C0C1A" }}>
      <LightRibbon />
      <Navigation />
      <div className="relative" style={{ zIndex: 1 }}>
        <Hero />
        <HowItWorks />
        <WhyGenie />
        <ProductShowcase />
        <Pricing />
        <Testimonials />
        <FAQContact />
        <Footer />
      </div>
    </div>
  );
}
