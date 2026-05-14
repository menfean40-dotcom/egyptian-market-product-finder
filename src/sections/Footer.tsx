import { Link } from "react-router";
import { Sparkles } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "API", "Integrations"],
  Resources: ["Blog", "Guides", "Case Studies", "Help Center"],
  Company: ["About", "Careers", "Contact", "Legal"],
};

export default function Footer() {
  return (
    <footer
      className="relative"
      style={{ zIndex: 1, background: "rgba(12, 12, 26, 0.95)" }}
    >
      <div
        className="max-w-[1280px] mx-auto"
        style={{ padding: "60px 6vw 40px" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#9D8CFF]" />
              <span className="text-[18px] font-medium text-[#EAEAEF]">
                Genie
              </span>
            </Link>
            <p className="text-[#9494A8] text-[14px] leading-[1.6]">
              AI-powered product discovery for Egyptian e-commerce entrepreneurs.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[#EAEAEF] text-[14px] font-medium mb-4">
                {category}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <span className="text-[#9494A8] text-[15px] hover:text-[#EAEAEF] transition-colors cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-[rgba(255,255,255,0.06)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[#9494A8] text-[14px]">
            &copy; 2025 Genie. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            {["X", "LinkedIn", "YouTube", "Instagram"].map((social) => (
              <span
                key={social}
                className="text-[#9494A8] text-[14px] hover:text-[#EAEAEF] transition-colors cursor-pointer"
              >
                {social}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
