import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  Menu,
  X,
  LogOut,
  User,
  Sparkles,
  LayoutDashboard,
  Package,
  CreditCard,
  Newspaper,
  Mail,
} from "lucide-react";

const navLinks = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Products", href: "/#products", icon: Package },
  { label: "Pricing", href: "/#pricing", icon: CreditCard },
  { label: "Blog", href: "/#how-it-works", icon: Newspaper },
  { label: "Contact", href: "/#contact", icon: Mail },
];

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const scrollToSection = (href: string) => {
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(12,12,26,0.8)] backdrop-blur-[16px] border-b border-[rgba(255,255,255,0.06)]"
          : "bg-transparent"
      }`}
      style={{ height: 56 }}
    >
      <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between" style={{ padding: "0 6vw" }}>
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#9D8CFF]" />
          <span className="text-[18px] font-medium text-[#EAEAEF]">Genie</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className="relative px-3 py-1.5 text-[16px] font-normal text-[#9494A8] hover:text-[#EAEAEF] transition-colors duration-200 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#9D8CFF] transition-all duration-200 group-hover:w-full" />
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[rgba(157,140,255,0.2)] flex items-center justify-center">
                  <User className="w-4 h-4 text-[#9D8CFF]" />
                </div>
                <span className="text-sm text-[#EAEAEF]">{user?.name ?? "User"}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#9494A8] hover:text-[#EAEAEF] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-primary text-sm px-5 py-2"
            >
              Start Free Trial
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[#EAEAEF] p-2"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[rgba(12,12,26,0.95)] backdrop-blur-[16px] border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="flex items-center gap-2 px-4 py-3 text-[#9494A8] hover:text-[#EAEAEF] hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors text-left"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </button>
            ))}
            <div className="border-t border-[rgba(255,255,255,0.06)] pt-3 mt-1">
              {isAuthenticated ? (
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[rgba(157,140,255,0.2)] flex items-center justify-center">
                      <User className="w-4 h-4 text-[#9D8CFF]" />
                    </div>
                    <span className="text-sm text-[#EAEAEF]">{user?.name ?? "User"}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#9494A8] hover:text-[#EAEAEF]"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn-primary w-full text-center block">
                  Start Free Trial
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
