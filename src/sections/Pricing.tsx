import { useEffect, useRef } from "react";
import { Check, Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "10 searches/day, basic analysis",
    features: [
      "10 product searches per day",
      "Basic demand scoring",
      "View trending products",
      "Community support",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "EGP 299",
    period: "/mo",
    description: "Unlimited searches, full analysis, ad creatives, landing pages",
    features: [
      "Unlimited product searches",
      "Full AI market analysis",
      "Ad creative generation",
      "Landing page builder",
      "Pricing calculator",
      "Marketing hooks",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Agency",
    price: "EGP 799",
    period: "/mo",
    description: "Everything in Pro + team seats, white-label, API access",
    features: [
      "Everything in Pro",
      "5 team member seats",
      "White-label exports",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
    ],
    highlighted: false,
  },
];

export default function Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".pricing-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
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
        id="pricing"
        className="content-band max-w-[1280px] mx-auto"
        style={{ padding: "80px 6vw" }}
      >
        <div className="text-center mb-12">
          <h2 className="text-[#EAEAEF] text-[36px] sm:text-[48px] font-normal leading-[1.1] tracking-[-0.02em] mb-4">
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-[#9494A8] text-[16px] sm:text-[18px] max-w-[500px] mx-auto">
            Start free, upgrade when you are ready to scale
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`pricing-card relative p-10 rounded-2xl flex flex-col ${
                plan.highlighted
                  ? "border border-[#9D8CFF] bg-[rgba(18,18,42,0.9)]"
                  : "card-glow"
              }`}
              style={plan.highlighted ? { transform: "translateY(-8px)" } : {}}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 right-6">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#9D8CFF] text-[#0C0C1A] text-[12px] font-medium">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-[#9494A8] text-[16px] font-medium mb-3">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-[#EAEAEF] text-[48px] font-light">
                  {plan.price}
                </span>
                <span className="text-[#9494A8] text-[16px]">{plan.period}</span>
              </div>
              <p className="text-[#9494A8] text-[14px] mb-8">{plan.description}</p>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#9D8CFF] mt-0.5 shrink-0" />
                    <span className="text-[#9494A8] text-[14px]">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-full text-[16px] font-medium transition-all ${
                  plan.highlighted
                    ? "bg-[#9D8CFF] text-[#0C0C1A] hover:bg-[#B8AEFF]"
                    : "border border-[rgba(255,255,255,0.12)] text-[#EAEAEF] hover:border-[#9D8CFF] hover:text-[#9D8CFF]"
                }`}
              >
                {plan.name === "Starter" ? "Get Started" : "Start Free Trial"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
