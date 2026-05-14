import { useEffect, useRef } from "react";
import { Quote } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Ahmed Hassan",
    role: "Dropshipper, Cairo",
    avatar: "/img-avatar-1.jpg",
    quote:
      "Genie completely changed how I find products. The demand scores are incredibly accurate for the Egyptian market. I found my first winning product within a week and made EGP 45,000 in my first month.",
  },
  {
    name: "Sara Khalil",
    role: "E-commerce Store Owner, Alexandria",
    avatar: "/img-avatar-2.jpg",
    quote:
      "The ad creative generator is a game-changer. I used to spend hours writing ad copy. Now I get 5 different angles in seconds, and they actually convert better than what I wrote myself.",
  },
  {
    name: "Omar Fathy",
    role: "Digital Marketing Agency",
    avatar: "/img-avatar-3.jpg",
    quote:
      "We manage 12 client stores and Genie has become our secret weapon. The landing page builder alone saves us 10+ hours per week. The pricing calculator ensures we never miss our margin targets.",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".testimonial-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { x: 40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.8,
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
        className="content-band max-w-[1280px] mx-auto"
        style={{ padding: "80px 6vw" }}
      >
        <div className="text-center mb-12">
          <h2 className="text-[#EAEAEF] text-[36px] sm:text-[48px] font-normal leading-[1.1] tracking-[-0.02em] mb-4">
            Trusted by <span className="text-gradient">Egyptian Sellers</span>
          </h2>
          <p className="text-[#9494A8] text-[16px] sm:text-[18px] max-w-[500px] mx-auto">
            See what dropshippers and store owners are saying
          </p>
        </div>

        <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="testimonial-card shrink-0 w-[360px] p-8 rounded-2xl bg-[rgba(18,18,42,0.8)] border border-[rgba(255,255,255,0.06)]"
            >
              <Quote className="w-6 h-6 text-[rgba(157,140,255,0.3)] mb-4" />
              <p className="text-[#9494A8] text-[16px] italic leading-[1.6] mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="text-[#EAEAEF] text-[16px] font-medium">
                    {t.name}
                  </div>
                  <div className="text-[#9494A8] text-[14px]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
