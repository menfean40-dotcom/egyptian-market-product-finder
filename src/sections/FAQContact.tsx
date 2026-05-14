import { useState, useEffect, useRef } from "react";
import { Plus, Minus, Send, CheckCircle } from "lucide-react";
import { trpc } from "@/providers/trpc";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "How does Genie find winning products?",
    a: "Genie analyzes multiple data sources including AliExpress trending data, Egyptian social media trends, and local market demand signals. Our AI cross-references demand indicators with competition levels to identify products with the highest profit potential for Egyptian sellers.",
  },
  {
    q: "Can I use Genie for markets outside Egypt?",
    a: "Currently, Genie is optimized for the Egyptian market with local pricing in EGP, Egyptian consumer behavior data, and market-specific insights. We plan to expand to other MENA markets soon.",
  },
  {
    q: "What is the 5x pricing model?",
    a: "The 5x pricing model means selling products at 5 times your total cost (wholesale + shipping + packaging + fees). This ensures healthy profit margins while keeping prices competitive. Genie's calculator factors in all your costs and suggests optimal pricing.",
  },
  {
    q: "How accurate is the market analysis?",
    a: "Our demand scores are based on real search volume, social media engagement, and sales data from multiple sources. While no prediction is 100% certain, our AI has been trained on thousands of successful Egyptian e-commerce products.",
  },
  {
    q: "Do I need technical skills?",
    a: "Not at all. Genie is designed for non-technical entrepreneurs. Everything from product research to landing page creation is handled through a simple, intuitive interface. If you can use Facebook, you can use Genie.",
  },
];

export default function FAQContact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    contactMutation.mutate({
      name: formData.name,
      email: formData.email,
      subject: formData.subject || undefined,
      content: formData.message,
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll(".faq-item");
      if (items) {
        gsap.fromTo(
          items,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          }
        );
      }
      const form = sectionRef.current?.querySelector(".contact-form");
      if (form) {
        gsap.fromTo(
          form,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
            delay: 0.3,
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
        id="contact"
        className="content-band max-w-[1280px] mx-auto"
        style={{ padding: "80px 6vw" }}
      >
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left — FAQ */}
          <div className="lg:w-[60%]">
            <h2 className="text-[#EAEAEF] text-[36px] sm:text-[48px] font-normal leading-[1.1] tracking-[-0.02em] mb-8">
              Frequently Asked{" "}
              <span className="text-gradient">Questions</span>
            </h2>

            <div className="flex flex-col">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="faq-item border-b border-[rgba(255,255,255,0.06)]"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center justify-between py-5 text-left group"
                  >
                    <span className="text-[#EAEAEF] text-[16px] sm:text-[18px] font-medium pr-4 group-hover:text-[#9D8CFF] transition-colors">
                      {faq.q}
                    </span>
                    <span
                      className="shrink-0 text-[#9494A8] transition-transform duration-300"
                      style={{
                        transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      {openIndex === i ? (
                        <Minus className="w-5 h-5" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight: openIndex === i ? "300px" : "0px",
                      opacity: openIndex === i ? 1 : 0,
                    }}
                  >
                    <p className="text-[#9494A8] text-[14px] sm:text-[16px] leading-[1.6] pb-5">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Contact */}
          <div className="lg:w-[40%]">
            <div className="contact-form card-glow p-8">
              <h3 className="text-[#EAEAEF] text-[24px] font-medium mb-6">
                Get in Touch
              </h3>

              {submitted ? (
                <div className="flex flex-col items-center gap-4 py-8">
                  <CheckCircle className="w-12 h-12 text-[#4ADE80]" />
                  <p className="text-[#EAEAEF] text-[18px] font-medium">Message Sent!</p>
                  <p className="text-[#9494A8] text-[14px] text-center">
                    We will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-[#9D8CFF] text-[14px] hover:text-[#B8AEFF] transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[rgba(18,18,42,0.6)] border border-[rgba(255,255,255,0.06)] rounded-md px-4 py-3.5 text-[#EAEAEF] text-[15px] placeholder:text-[#9494A8] focus:border-[#9D8CFF] focus:outline-none transition-colors"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[rgba(18,18,42,0.6)] border border-[rgba(255,255,255,0.06)] rounded-md px-4 py-3.5 text-[#EAEAEF] text-[15px] placeholder:text-[#9494A8] focus:border-[#9D8CFF] focus:outline-none transition-colors"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Subject (optional)"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[rgba(18,18,42,0.6)] border border-[rgba(255,255,255,0.06)] rounded-md px-4 py-3.5 text-[#EAEAEF] text-[15px] placeholder:text-[#9494A8] focus:border-[#9D8CFF] focus:outline-none transition-colors"
                  />
                  <textarea
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full bg-[rgba(18,18,42,0.6)] border border-[rgba(255,255,255,0.06)] rounded-md px-4 py-3.5 text-[#EAEAEF] text-[15px] placeholder:text-[#9494A8] focus:border-[#9D8CFF] focus:outline-none transition-colors resize-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {contactMutation.isPending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
