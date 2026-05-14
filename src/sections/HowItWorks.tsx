import { useEffect, useRef } from "react";
import { Search, BarChart3, Palette, Rocket } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "01",
    title: "Search Products",
    desc: "Discover winning products with AI-powered filtering",
    icon: Search,
  },
  {
    num: "02",
    title: "Analyze Market",
    desc: "Get demand analysis, competitor insights, and pricing suggestions",
    icon: BarChart3,
  },
  {
    num: "03",
    title: "Generate Creatives",
    desc: "Auto-create Egyptian-market ad images and video scripts",
    icon: Palette,
  },
  {
    num: "04",
    title: "Launch & Scale",
    desc: "Build landing pages and start selling with confidence",
    icon: Rocket,
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll(".animate-in");
      if (els) {
        gsap.fromTo(
          els,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative" style={{ zIndex: 1, marginTop: "40vh" }}>
      <div
        ref={sectionRef}
        id="how-it-works"
        className="content-band max-w-[1280px] mx-auto"
        style={{ padding: "100px 6vw" }}
      >
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left */}
          <div className="lg:w-[55%]">
            <h2 className="animate-in text-[#EAEAEF] text-[36px] sm:text-[48px] font-normal leading-[1.1] tracking-[-0.02em] mb-6">
              Research, Analyze{" "}
              <span className="text-gradient">&amp; Launch</span>
            </h2>
            <p className="animate-in text-[#9494A8] text-[16px] sm:text-[18px] font-normal leading-[1.6]">
              Genie automates product research for Egyptian dropshippers. Search trending products, analyze market demand, generate ad creatives, and build high-converting landing pages — all in minutes.
            </p>
          </div>

          {/* Right */}
          <div className="lg:w-[45%] flex flex-col gap-6">
            {steps.map((step) => (
              <div key={step.num} className="animate-in flex items-start gap-5 group">
                <div className="relative">
                  <span className="text-[48px] sm:text-[72px] font-extralight leading-none text-[rgba(157,140,255,0.15)] select-none">
                    {step.num}
                  </span>
                </div>
                <div className="pt-3 sm:pt-5">
                  <div className="flex items-center gap-2 mb-1">
                    <step.icon className="w-4 h-4 text-[#9D8CFF]" />
                    <h3 className="text-[#EAEAEF] text-[16px] font-medium">{step.title}</h3>
                  </div>
                  <p className="text-[#9494A8] text-[14px] sm:text-[16px] font-normal leading-[1.4]">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
