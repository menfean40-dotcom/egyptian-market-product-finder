import { useParams, Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import { trpc } from "@/providers/trpc";
import Navigation from "@/components/Navigation";
import {
  ArrowLeft,
  TrendingUp,
  Target,
  Users,
  ShoppingCart,
  BarChart3,
  Shield,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Image,
  FileText,
  Video,
  Sparkles,
  Zap,
  ThumbsUp,
  DollarSign,
  Package,
  Globe,
  Heart,
  Wind,
  Moon,
  Activity,
  Smartphone,
  BatteryMedium,
  Truck,
  Gauge,
  Usb,
  Plane,
  Headphones,
  Battery,
  Mic,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Headphones: Headphones,
  Battery: Battery,
  Zap: Zap,
  Target: Target,
  Smartphone: Smartphone,
  Mic: Mic,
  Truck: Truck,
  Heart: Heart,
  Wind: Wind,
  Moon: Moon,
  Activity: Activity,
  BatteryMedium: BatteryMedium,
  Gauge: Gauge,
  Usb: Usb,
  Plane: Plane,
  Shield: Shield,
  FileText: FileText,
  DollarSign: DollarSign,
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"analysis" | "creatives" | "landing" | "pricing" | "marketing">("analysis");

  const { data: product } = trpc.product.getById.useQuery({ id: productId });
  const { data: analysis } = trpc.analysis.getByProductId.useQuery({ productId });
  const { data: creatives } = trpc.creative.getByProductId.useQuery({ productId });
  const { data: landingPage } = trpc.landingPage.getByProductId.useQuery({ productId });
  const { data: hooks } = trpc.marketing.getHooksByProductId.useQuery({ productId });
  const { data: angles } = trpc.marketing.getAngles.useQuery({ productId });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".detail-animate",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [activeTab]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0C0C1A" }}>
        <div className="text-[#9494A8] text-[18px]">Loading product...</div>
      </div>
    );
  }

  const adImages = creatives?.filter((c) => c.creativeType === "image") ?? [];
  const adCopy = creatives?.filter((c) => c.creativeType === "headline") ?? [];
  const videoScript = creatives?.find((c) => c.creativeType === "video_script");

  const features = landingPage?.featuresJson ? JSON.parse(landingPage.featuresJson) : [];
  const testimonials = landingPage?.testimonialsJson ? JSON.parse(landingPage.testimonialsJson) : [];
  const faqs = landingPage?.faqJson ? JSON.parse(landingPage.faqJson) : [];

  return (
    <div className="min-h-screen" style={{ background: "#0C0C1A" }}>
      <Navigation />

      <div ref={sectionRef} className="max-w-[1280px] mx-auto" style={{ padding: "80px 6vw 40px" }}>
        {/* Breadcrumb */}
        <div className="detail-animate flex items-center gap-2 mb-8">
          <Link to="/" className="text-[#9494A8] hover:text-[#EAEAEF] text-[14px] flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>

        {/* Product Header */}
        <div className="detail-animate flex flex-col lg:flex-row gap-8 mb-10">
          <div className="lg:w-[40%]">
            <div className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.06)]">
              <img
                src={product.imageUrl ?? "/img-product-1.jpg"}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          <div className="lg:w-[60%] flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              {product.isHot && (
                <span className="px-2.5 py-1 rounded-full bg-[#4ADE80] text-[#0C0C1A] text-[12px] font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Hot
                </span>
              )}
              {product.isTrending && (
                <span className="px-2.5 py-1 rounded-full bg-[#9D8CFF] text-[#0C0C1A] text-[12px] font-medium">
                  Trending
                </span>
              )}
              <span className="px-2.5 py-1 rounded-full bg-[rgba(157,140,255,0.15)] text-[#9D8CFF] text-[12px] font-medium">
                {product.category}
              </span>
            </div>

            <h1 className="text-[#EAEAEF] text-[32px] sm:text-[48px] font-normal leading-[1.1] tracking-[-0.02em] mb-4">
              {product.name}
            </h1>
            <p className="text-[#9494A8] text-[16px] leading-[1.6] mb-6">
              {product.description}
            </p>

            <div className="flex flex-wrap gap-6 mb-6">
              <div>
                <div className="text-[#9494A8] text-[12px] uppercase tracking-wider mb-1">
                  Wholesale
                </div>
                <div className="text-[#EAEAEF] text-[20px] font-medium">
                  EGP {product.wholesalePriceEgp}
                </div>
              </div>
              <div>
                <div className="text-[#9494A8] text-[12px] uppercase tracking-wider mb-1">
                  Suggested Price
                </div>
                <div className="text-[#9D8CFF] text-[20px] font-medium">
                  EGP {product.suggestedPriceEgp}
                </div>
              </div>
              <div>
                <div className="text-[#9494A8] text-[12px] uppercase tracking-wider mb-1">
                  Margin
                </div>
                <div className="text-[#4ADE80] text-[20px] font-medium">
                  {product.profitMargin}%
                </div>
              </div>
              <div>
                <div className="text-[#9494A8] text-[12px] uppercase tracking-wider mb-1">
                  Demand Score
                </div>
                <div className="text-[#EAEAEF] text-[20px] font-medium flex items-center gap-1">
                  <BarChart3 className="w-4 h-4 text-[#FFD700]" />
                  {product.demandScore}/100
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(18,18,42,0.8)] border border-[rgba(255,255,255,0.06)] text-[13px] text-[#9494A8]">
                <Users className="w-3.5 h-3.5" />
                {product.targetAudience?.slice(0, 60)}...
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(18,18,42,0.8)] border border-[rgba(255,255,255,0.06)] text-[13px] text-[#9494A8]">
                <ShoppingCart className="w-3.5 h-3.5" />
                {product.competitionLevel} competition
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(18,18,42,0.8)] border border-[rgba(255,255,255,0.06)] text-[13px] text-[#9494A8]">
                <TrendingUp className="w-3.5 h-3.5" />
                {product.trendDirection} trend
              </div>
            </div>

            <a
              href={product.aliexpressUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary self-start inline-flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              View on AliExpress
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="detail-animate flex gap-1 mb-8 overflow-x-auto scrollbar-hide p-1 rounded-xl bg-[rgba(18,18,42,0.5)] border border-[rgba(255,255,255,0.06)]">
          {[
            { key: "analysis" as const, label: "Analysis", icon: BarChart3 },
            { key: "creatives" as const, label: "Ad Creatives", icon: Image },
            { key: "landing" as const, label: "Landing Page", icon: FileText },
            { key: "pricing" as const, label: "Pricing Calculator", icon: DollarSign },
            { key: "marketing" as const, label: "Marketing Hooks", icon: Sparkles },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px] font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-[#9D8CFF] text-[#0C0C1A]"
                  : "text-[#9494A8] hover:text-[#EAEAEF]"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="detail-animate">
          {activeTab === "analysis" && analysis && (
            <ProductAnalysis analysis={analysis} />
          )}
          {activeTab === "creatives" && (
            <AdCreativeGallery
              images={adImages}
              copy={adCopy}
              videoScript={videoScript}
              onCopy={copyToClipboard}
              copiedText={copiedText}
            />
          )}
          {activeTab === "landing" && landingPage && (
            <LandingPagePreview
              landingPage={landingPage}
              features={features}
              testimonials={testimonials}
              faqs={faqs}
            />
          )}
          {activeTab === "pricing" && (
            <PricingCalculator product={product} />
          )}
          {activeTab === "marketing" && (
            <MarketingHooks
              hooks={hooks ?? []}
              angles={angles}
              onCopy={copyToClipboard}
              copiedText={copiedText}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────── */

function ProductAnalysis({ analysis }: { analysis: { swotStrengths: string | null; swotWeaknesses: string | null; swotOpportunities: string | null; swotThreats: string | null; marketAnalysis: string | null; competitorAnalysis: string | null; customerPersona: string | null; pricingStrategy: string | null; riskAssessment: string | null; recommendationScore: number | null } }) {
  const swotItems = [
    { label: "Strengths", content: analysis.swotStrengths, icon: ThumbsUp, color: "#4ADE80" },
    { label: "Weaknesses", content: analysis.swotWeaknesses, icon: AlertTriangle, color: "#FFD700" },
    { label: "Opportunities", content: analysis.swotOpportunities, icon: Sparkles, color: "#9D8CFF" },
    { label: "Threats", content: analysis.swotThreats, icon: Shield, color: "#FF6B6B" },
  ];

  const sections = [
    { label: "Market Analysis", content: analysis.marketAnalysis, icon: Globe },
    { label: "Competitor Analysis", content: analysis.competitorAnalysis, icon: Target },
    { label: "Customer Persona", content: analysis.customerPersona, icon: Users },
    { label: "Pricing Strategy", content: analysis.pricingStrategy, icon: DollarSign },
    { label: "Risk Assessment", content: analysis.riskAssessment, icon: Shield },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* SWOT */}
      <div>
        <h2 className="text-[#EAEAEF] text-[24px] font-medium mb-6">SWOT Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {swotItems.map((item) => (
            <div key={item.label} className="card-glow p-6">
              <div className="flex items-center gap-2 mb-3">
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
                <h3 className="text-[#EAEAEF] text-[16px] font-medium">{item.label}</h3>
              </div>
              <div className="text-[#9494A8] text-[14px] leading-[1.6] whitespace-pre-line">
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score */}
      <div className="card-glow p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full border-4 border-[#9D8CFF] flex items-center justify-center">
          <span className="text-[#9D8CFF] text-[28px] font-medium">{analysis.recommendationScore}</span>
        </div>
        <div>
          <h3 className="text-[#EAEAEF] text-[18px] font-medium mb-1">Recommendation Score</h3>
          <p className="text-[#9494A8] text-[14px]">
            {analysis.recommendationScore && analysis.recommendationScore >= 90
              ? "Excellent — Strongly recommended for immediate launch"
              : analysis.recommendationScore && analysis.recommendationScore >= 80
              ? "Good — Solid product with strong potential"
              : "Moderate — Consider with caution"}
          </p>
        </div>
      </div>

      {/* Analysis Sections */}
      <div className="flex flex-col gap-4">
        {sections.map((s) => (
          <div key={s.label} className="card-glow p-6">
            <div className="flex items-center gap-2 mb-3">
              <s.icon className="w-5 h-5 text-[#9D8CFF]" />
              <h3 className="text-[#EAEAEF] text-[18px] font-medium">{s.label}</h3>
            </div>
            <p className="text-[#9494A8] text-[14px] sm:text-[16px] leading-[1.6]">
              {s.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdCreativeGallery({
  images,
  copy,
  videoScript,
  onCopy,
  copiedText,
}: {
  images: Array<{ id: number; title: string | null; targetPlatform: string | null }>;
  copy: Array<{ id: number; headline: string | null; bodyCopy: string | null; callToAction: string | null; targetPlatform: string | null }>;
  videoScript: { content: string | null; targetPlatform: string | null } | undefined;
  onCopy: (text: string) => void;
  copiedText: string | null;
}) {
  const [showScript, setShowScript] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      {/* Ad Images */}
      <div>
        <h2 className="text-[#EAEAEF] text-[24px] font-medium mb-6 flex items-center gap-2">
          <Image className="w-5 h-5 text-[#9D8CFF]" />
          Generated Ad Images
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div key={img.id} className="card-glow overflow-hidden group">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={`/img-product-${(i % 3) + 1}.jpg`}
                  alt={img.title ?? "Ad Creative"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-[rgba(12,12,26,0.8)] text-[#9494A8] text-[11px] capitalize">
                  {img.targetPlatform}
                </div>
              </div>
              <div className="p-3">
                <p className="text-[#9494A8] text-[12px]">{img.title ?? `Creative ${i + 1}`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ad Copy */}
      <div>
        <h2 className="text-[#EAEAEF] text-[24px] font-medium mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#9D8CFF]" />
          Ad Copy Variations
        </h2>
        <div className="flex flex-col gap-4">
          {copy.map((c) => (
            <div key={c.id} className="card-glow p-6 relative group">
              <button
                onClick={() => onCopy(`${c.headline}\n\n${c.bodyCopy}\n\n${c.callToAction}`)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-[rgba(18,18,42,0.8)] border border-[rgba(255,255,255,0.06)] text-[#9494A8] hover:text-[#9D8CFF] transition-colors opacity-0 group-hover:opacity-100"
              >
                {copiedText === `${c.headline}\n\n${c.bodyCopy}\n\n${c.callToAction}` ? (
                  <Check className="w-4 h-4 text-[#4ADE80]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded-full bg-[rgba(157,140,255,0.15)] text-[#9D8CFF] text-[11px] capitalize">
                  {c.targetPlatform}
                </span>
              </div>
              <h3 className="text-[#EAEAEF] text-[18px] font-medium mb-2">{c.headline}</h3>
              <p className="text-[#9494A8] text-[14px] leading-[1.6] mb-3">{c.bodyCopy}</p>
              <span className="text-[#9D8CFF] text-[14px] font-medium">{c.callToAction}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Video Script */}
      {videoScript && (
        <div>
          <h2 className="text-[#EAEAEF] text-[24px] font-medium mb-6 flex items-center gap-2">
            <Video className="w-5 h-5 text-[#9D8CFF]" />
            Video Script
          </h2>
          <div className="card-glow p-6">
            <button
              onClick={() => setShowScript(!showScript)}
              className="w-full flex items-center justify-between mb-4"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[rgba(157,140,255,0.15)] text-[#9D8CFF] text-[11px] capitalize">
                  {videoScript.targetPlatform}
                </span>
                <span className="text-[#9494A8] text-[14px]">30-second script</span>
              </div>
              {showScript ? (
                <ChevronUp className="w-5 h-5 text-[#9494A8]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#9494A8]" />
              )}
            </button>
            {showScript && (
              <div className="text-[#9494A8] text-[14px] leading-[1.8] whitespace-pre-line border-t border-[rgba(255,255,255,0.06)] pt-4">
                {videoScript.content}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LandingPagePreview({
  landingPage,
  features,
  testimonials,
  faqs,
}: {
  landingPage: { headline: string | null; subheadline: string | null; productDescription: string | null; originalPrice: string | null; salePrice: string | null; discountPercentage: number | null; ctaText: string | null };
  features: Array<{ icon: string; title: string; description: string }>;
  testimonials: Array<{ name: string; location: string; text: string }>;
  faqs: Array<{ q: string; a: string }>;
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-[#EAEAEF] text-[24px] font-medium flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#9D8CFF]" />
          Landing Page Preview
        </h2>
        <span className="text-[#9494A8] text-[14px]">Template: Modern</span>
      </div>

      {/* Simulated Landing Page */}
      <div className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.06)] bg-white">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-[#0C0C1A] to-[#12122A] p-8 sm:p-12 text-center">
          <h1 className="text-[#EAEAEF] text-[28px] sm:text-[40px] font-light leading-[1.1] tracking-[-0.02em] mb-4">
            {landingPage.headline}
          </h1>
          <p className="text-[#9494A8] text-[16px] max-w-[500px] mx-auto mb-6">
            {landingPage.subheadline}
          </p>
          <div className="flex items-center justify-center gap-4 mb-6">
            {landingPage.originalPrice && (
              <span className="text-[#9494A8] text-[18px] line-through">
                EGP {landingPage.originalPrice}
              </span>
            )}
            {landingPage.salePrice && (
              <span className="text-[#9D8CFF] text-[32px] font-medium">
                EGP {landingPage.salePrice}
              </span>
            )}
            {landingPage.discountPercentage && (
              <span className="px-3 py-1 rounded-full bg-[#4ADE80] text-[#0C0C1A] text-[14px] font-medium">
                -{landingPage.discountPercentage}%
              </span>
            )}
          </div>
          <button className="btn-primary px-8 py-4 text-[18px]">
            {landingPage.ctaText}
          </button>
        </div>

        {/* Description */}
        <div className="p-8 sm:p-12 border-b border-gray-100">
          <p className="text-gray-600 text-[16px] leading-[1.6] max-w-[600px] mx-auto text-center">
            {landingPage.productDescription}
          </p>
        </div>

        {/* Features */}
        <div className="p-8 sm:p-12 border-b border-gray-100">
          <h3 className="text-gray-900 text-[24px] font-medium text-center mb-8">
            Key Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f: { icon: string; title: string; description: string }, i: number) => {
              const IconComp = iconMap[f.icon] ?? Package;
              return (
                <div key={i} className="flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-[rgba(157,140,255,0.1)] flex items-center justify-center mb-3">
                    <IconComp className="w-5 h-5 text-[#9D8CFF]" />
                  </div>
                  <h4 className="text-gray-900 text-[16px] font-medium mb-1">{f.title}</h4>
                  <p className="text-gray-500 text-[14px]">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="p-8 sm:p-12 border-b border-gray-100 bg-gray-50">
          <h3 className="text-gray-900 text-[24px] font-medium text-center mb-8">
            What Our Customers Say
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t: { name: string; location: string; text: string }, i: number) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-gray-600 text-[14px] italic mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="text-gray-900 text-[14px] font-medium">{t.name}</div>
                <div className="text-gray-400 text-[12px]">{t.location}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="p-8 sm:p-12">
          <h3 className="text-gray-900 text-[24px] font-medium text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="max-w-[600px] mx-auto flex flex-col gap-3">
            {faqs.map((f: { q: string; a: string }, i: number) => (
              <div key={i} className="border-b border-gray-100">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="text-gray-900 text-[15px] font-medium pr-4">{f.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <p className="text-gray-500 text-[14px] pb-4">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Footer */}
        <div className="p-8 sm:p-12 bg-gradient-to-br from-[#0C0C1A] to-[#12122A] text-center">
          <h3 className="text-[#EAEAEF] text-[24px] font-medium mb-4">
            Ready to Get Started?
          </h3>
          <button className="btn-primary px-8 py-4 text-[18px]">
            {landingPage.ctaText}
          </button>
        </div>
      </div>
    </div>
  );
}

function PricingCalculator({
  product,
}: {
  product: { wholesalePriceEgp: string | null; suggestedPriceEgp: string | null };
}) {
  const [wholesale, setWholesale] = useState(Number(product.wholesalePriceEgp) || 0);
  const [shipping, setShipping] = useState(25);
  const [packaging, setPackaging] = useState(15);
  const [platformFees, setPlatformFees] = useState(30);
  const [marketing, setMarketing] = useState(50);
  const [markup, setMarkup] = useState(5);
  const [monthlyVolume, setMonthlyVolume] = useState(100);

  const calculateMutation = trpc.pricing.calculate.useMutation();

  const handleCalculate = () => {
    calculateMutation.mutate({
      wholesalePriceEgp: wholesale,
      shippingCostEgp: shipping,
      packagingCostEgp: packaging,
      platformFeesEgp: platformFees,
      marketingCostEgp: marketing,
      markupMultiplier: markup,
      monthlyVolume,
    });
  };

  const result = calculateMutation.data;

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-[#EAEAEF] text-[24px] font-medium flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-[#9D8CFF]" />
        5x Markup Pricing Calculator
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="card-glow p-6 flex flex-col gap-5">
          <h3 className="text-[#EAEAEF] text-[18px] font-medium mb-2">Cost Breakdown</h3>

          {[
            { label: "Wholesale Price (EGP)", value: wholesale, setter: setWholesale },
            { label: "Shipping Cost (EGP)", value: shipping, setter: setShipping },
            { label: "Packaging Cost (EGP)", value: packaging, setter: setPackaging },
            { label: "Platform Fees (EGP)", value: platformFees, setter: setPlatformFees },
            { label: "Marketing Cost (EGP)", value: marketing, setter: setMarketing },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-[#9494A8] text-[13px] mb-1.5 block">
                {field.label}
              </label>
              <input
                type="number"
                value={field.value}
                onChange={(e) => field.setter(Number(e.target.value))}
                className="w-full bg-[rgba(18,18,42,0.6)] border border-[rgba(255,255,255,0.06)] rounded-md px-4 py-2.5 text-[#EAEAEF] text-[15px] focus:border-[#9D8CFF] focus:outline-none transition-colors"
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#9494A8] text-[13px] mb-1.5 block">
                Markup Multiplier
              </label>
              <input
                type="number"
                value={markup}
                onChange={(e) => setMarkup(Number(e.target.value))}
                min={1}
                max={20}
                step={0.5}
                className="w-full bg-[rgba(18,18,42,0.6)] border border-[rgba(255,255,255,0.06)] rounded-md px-4 py-2.5 text-[#EAEAEF] text-[15px] focus:border-[#9D8CFF] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[#9494A8] text-[13px] mb-1.5 block">
                Monthly Volume
              </label>
              <input
                type="number"
                value={monthlyVolume}
                onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                min={1}
                className="w-full bg-[rgba(18,18,42,0.6)] border border-[rgba(255,255,255,0.06)] rounded-md px-4 py-2.5 text-[#EAEAEF] text-[15px] focus:border-[#9D8CFF] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={calculateMutation.isPending}
            className="btn-primary w-full mt-2 disabled:opacity-50"
          >
            {calculateMutation.isPending ? "Calculating..." : "Calculate Pricing"}
          </button>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-4">
          {result ? (
            <>
              <div className="card-glow p-6">
                <h3 className="text-[#EAEAEF] text-[18px] font-medium mb-4">Pricing Results</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[rgba(157,140,255,0.1)]">
                    <div className="text-[#9494A8] text-[12px] mb-1">Suggested Price</div>
                    <div className="text-[#9D8CFF] text-[28px] font-medium">
                      EGP {Math.round(result.suggestedPriceEgp).toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[rgba(74,222,128,0.1)]">
                    <div className="text-[#9494A8] text-[12px] mb-1">Profit Per Unit</div>
                    <div className="text-[#4ADE80] text-[28px] font-medium">
                      EGP {Math.round(result.profitPerUnitEgp).toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[rgba(255,215,0,0.1)]">
                    <div className="text-[#9494A8] text-[12px] mb-1">Profit Margin</div>
                    <div className="text-[#FFD700] text-[28px] font-medium">
                      {result.profitMarginPercent.toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.05)]">
                    <div className="text-[#9494A8] text-[12px] mb-1">Total Cost</div>
                    <div className="text-[#EAEAEF] text-[28px] font-medium">
                      EGP {result.totalCostEgp.toFixed(0)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-glow p-6">
                <h3 className="text-[#EAEAEF] text-[18px] font-medium mb-4">Projections</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#9494A8] text-[14px]">Breakeven Units</span>
                    <span className="text-[#EAEAEF] text-[16px] font-medium">{result.breakevenUnits} units</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#9494A8] text-[14px]">Monthly Revenue</span>
                    <span className="text-[#9D8CFF] text-[16px] font-medium">
                      EGP {Math.round(result.monthlyRevenueProjection).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#9494A8] text-[14px]">Monthly Profit</span>
                    <span className="text-[#4ADE80] text-[16px] font-medium">
                      EGP {Math.round(result.monthlyProfitProjection).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="card-glow p-12 flex flex-col items-center justify-center text-center h-full">
              <DollarSign className="w-12 h-12 text-[rgba(157,140,255,0.3)] mb-4" />
              <p className="text-[#9494A8] text-[16px]">
                Enter your costs and click Calculate to see your pricing breakdown
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MarketingHooks({
  hooks,
  angles,
  onCopy,
  copiedText,
}: {
  hooks: Array<{ id: number; hookAngle: string | null; hookText: string | null; hookType: string | null; targetPlatform: string | null; estimatedCtr: string | null }>;
  angles: { angles: string[]; insights: string[] } | undefined;
  onCopy: (text: string) => void;
  copiedText: string | null;
}) {
  const hookColors: Record<string, string> = {
    emotional: "#FF6B9D",
    urgency: "#FFD700",
    social_proof: "#4ADE80",
    curiosity: "#9D8CFF",
    fear: "#FF6B6B",
    desire: "#60A5FA",
    value: "#34D399",
  };

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-[#EAEAEF] text-[24px] font-medium flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-[#9D8CFF]" />
        Marketing Hooks & Angles
      </h2>

      {/* Angles */}
      {angles && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-glow p-6">
            <h3 className="text-[#EAEAEF] text-[18px] font-medium mb-4">Suggested Angles</h3>
            <ul className="flex flex-col gap-2">
              {angles.angles.map((a, i) => (
                <li key={i} className="flex items-center gap-2 text-[#9494A8] text-[14px]">
                  <span className="w-5 h-5 rounded-full bg-[rgba(157,140,255,0.15)] text-[#9D8CFF] text-[11px] flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="card-glow p-6">
            <h3 className="text-[#EAEAEF] text-[18px] font-medium mb-4">Market Insights</h3>
            <ul className="flex flex-col gap-2">
              {angles.insights.map((insight, i) => (
                <li key={i} className="flex items-start gap-2 text-[#9494A8] text-[14px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] mt-1.5 shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Hooks */}
      <div className="flex flex-col gap-4">
        {hooks.map((hook) => (
          <div key={hook.id} className="card-glow p-6 relative group">
            <button
              onClick={() => onCopy(hook.hookText ?? "")}
              className="absolute top-4 right-4 p-2 rounded-lg bg-[rgba(18,18,42,0.8)] border border-[rgba(255,255,255,0.06)] text-[#9494A8] hover:text-[#9D8CFF] transition-colors opacity-0 group-hover:opacity-100"
            >
              {copiedText === hook.hookText ? (
                <Check className="w-4 h-4 text-[#4ADE80]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            <div className="flex items-center gap-3 mb-3">
              <span
                className="px-2.5 py-1 rounded-full text-[11px] font-medium capitalize"
                style={{
                  background: `${hookColors[hook.hookType ?? "curiosity"]}20`,
                  color: hookColors[hook.hookType ?? "curiosity"],
                }}
              >
                {hook.hookType?.replace("_", " ")}
              </span>
              <span className="text-[#9494A8] text-[12px] capitalize">
                {hook.targetPlatform}
              </span>
              {hook.estimatedCtr && (
                <span className="ml-auto text-[#4ADE80] text-[12px] font-medium">
                  Est. CTR: {hook.estimatedCtr}%
                </span>
              )}
            </div>

            <h4 className="text-[#EAEAEF] text-[15px] font-medium mb-2">{hook.hookAngle}</h4>
            <p className="text-[#9494A8] text-[14px] leading-[1.6] italic">
              &ldquo;{hook.hookText}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
