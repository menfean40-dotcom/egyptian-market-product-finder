import { useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { Link } from "react-router";
import gsap from "gsap";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split H1 into words
      const h1 = h1Ref.current;
      if (h1) {
        const text = h1.textContent ?? "";
        const words = text.split(" ");
        h1.innerHTML = words.map((w) => `<span class="inline-block overflow-hidden"><span class="word inline-block">${w}</span></span>`).join(" ");

        gsap.fromTo(
          h1.querySelectorAll(".word"),
          { y: 50, opacity: 0, skewY: -3 },
          {
            y: 0,
            opacity: 1,
            skewY: 0,
            stagger: 0.12,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.3,
          }
        );
      }

      gsap.fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.8 }
      );

      gsap.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 1.2 }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-end"
      style={{ zIndex: 1, paddingBottom: "6vh", paddingLeft: "6vw", paddingRight: "6vw" }}
    >
      <div className="max-w-[600px]">
        <h1
          ref={h1Ref}
          className="text-[#EAEAEF] text-[48px] sm:text-[64px] lg:text-[80px] font-light leading-[1.0] tracking-[-0.04em] mb-6"
          style={{ textWrap: "balance" }}
        >
          Find Winning Products for the Egyptian Market
        </h1>
        <p
          ref={subtitleRef}
          className="text-[#9494A8] text-[16px] sm:text-[18px] font-normal leading-[1.6] max-w-[420px] mb-8 opacity-0"
        >
          AI-powered product research, ad creatives, and landing pages — all in one tool.
        </p>
        <div ref={ctaRef} className="flex items-center gap-4 flex-wrap opacity-0">
          <Link to="/login" className="btn-primary text-[16px] px-7 py-3.5">
            Start Free Trial
          </Link>
          <button
            onClick={() => {
              const el = document.getElementById("products");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-2 text-[#9494A8] hover:text-[#EAEAEF] transition-colors text-[16px] font-normal group"
          >
            <span className="w-10 h-10 rounded-full border border-[rgba(255,255,255,0.12)] flex items-center justify-center group-hover:border-[#9D8CFF] transition-colors">
              <Play className="w-4 h-4 ml-0.5" />
            </span>
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );
}
