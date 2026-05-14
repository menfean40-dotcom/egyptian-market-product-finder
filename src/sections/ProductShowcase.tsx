import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { TrendingUp, Package, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { data: trendingData } = trpc.product.getTrending.useQuery({ limit: 6 });
  const products = trendingData ?? [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const leftCard = sectionRef.current?.querySelector(".showcase-card");
      const rightText = sectionRef.current?.querySelectorAll(".showcase-text");

      if (leftCard) {
        gsap.fromTo(
          leftCard,
          { scale: 0.92, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          }
        );
      }

      if (rightText) {
        gsap.fromTo(
          rightText,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
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
  }, [products]);

  return (
    <div className="relative" style={{ zIndex: 1, marginTop: "40vh" }}>
      <div
        ref={sectionRef}
        id="products"
        className="content-band max-w-[1280px] mx-auto"
        style={{ padding: "80px 6vw" }}
      >
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left — Product Grid */}
          <div className="lg:w-[60%]">
            <div className="showcase-card grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.slice(0, 4).map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="card-glow overflow-hidden group cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.imageUrl ?? "/img-product-1.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
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
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-[#EAEAEF] text-[15px] font-medium mb-1 group-hover:text-[#9D8CFF] transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-[#9494A8] text-[13px] line-clamp-2 mb-3">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#9D8CFF] text-[16px] font-medium">
                        EGP {product.suggestedPriceEgp ?? "—"}
                      </span>
                      <span className="text-[#9494A8] text-[12px]">
                        {product.demandScore ?? 0}/100 demand
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                onClick={() => {
                  const el = document.getElementById("product-grid");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 text-[#9D8CFF] hover:text-[#B8AEFF] text-[16px] font-medium transition-colors"
              >
                Explore All Products
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right — Text */}
          <div className="lg:w-[40%] flex flex-col justify-center">
            <div className="showcase-text flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-[#9D8CFF]" />
              <span className="text-[#9D8CFF] text-[14px] font-medium uppercase tracking-wider">
                Product Database
              </span>
            </div>
            <h2 className="showcase-text text-[#EAEAEF] text-[36px] sm:text-[48px] font-normal leading-[1.1] tracking-[-0.02em] mb-6">
              Trending Products,{" "}
              <span className="text-gradient">Delivered Daily</span>
            </h2>
            <p className="showcase-text text-[#9494A8] text-[16px] sm:text-[18px] font-normal leading-[1.6] mb-8">
              Get access to a curated database of winning products with complete market analysis, Egyptian consumer insights, and competitor breakdowns.
            </p>
            <div className="showcase-text flex flex-wrap gap-8">
              <div>
                <div className="text-[#EAEAEF] text-[24px] font-medium">
                  5,000+
                </div>
                <div className="text-[#9494A8] text-[14px]">Products</div>
              </div>
              <div>
                <div className="text-[#EAEAEF] text-[24px] font-medium">
                  EGP 2M+
                </div>
                <div className="text-[#9494A8] text-[14px]">
                  Potential Revenue
                </div>
              </div>
              <div>
                <div className="text-[#EAEAEF] text-[24px] font-medium">
                  80%
                </div>
                <div className="text-[#9494A8] text-[14px]">Avg. Margin</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
