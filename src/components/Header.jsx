import React, { useState, useEffect } from "react";
import { useBranding } from "../context/BrandingContext";
import { Menu, X, ChevronDown } from "lucide-react";

function Logo({ className = "h-8 w-8" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="MergeImages logo"
    >
      {/* back card */}
      <rect x="10" y="8" rx="6" ry="6" width="28" height="22" fill="url(#g1)" />
      {/* front card */}
      <rect x="6" y="18" rx="6" ry="6" width="28" height="22" fill="url(#g2)" />
      {/* sun */}
      <circle cx="32" cy="18" r="3" fill="#fff" fillOpacity="0.9" />
      {/* mountain */}
      <path d="M12 34l6-6 4 4 6-8 6 10H12z" fill="#0ea5e9" fillOpacity="0.8" />
      <defs>
        <linearGradient id="g1" x1="10" y1="8" x2="38" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
        <linearGradient id="g2" x1="6" y1="18" x2="34" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a5b4fc" />
          <stop offset="1" stopColor="#bae6fd" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Header({ setConversionType }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { title, logoUrl } = useBranding();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const menuItems = [
    { label: "Merge JPG to PNG", value: "jpg-to-png" },
    { label: "Merge JPG to JPEG", value: "jpg-to-jpeg" },
    { label: "Merge JPG to PDF", value: "jpg-to-pdf" },
    { label: "Merge PNG to JPG", value: "png-to-jpg" },
  ];

  const handleSelect = (type) => {
    setConversionType(type);
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled
          ? "backdrop-blur-xl bg-white/70 ring-1 ring-black/5 shadow-sm"
          : "backdrop-blur-sm bg-white/40"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-8 w-8 rounded" />
            ) : (
              <Logo className="h-8 w-8" />
            )}
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight theme-hero-text">
              {title || 'MergeImages'}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={() => handleSelect(item.value)}
                className="px-3 py-2 rounded-xl text-sm font-medium text-blue-900/80 hover:text-blue-900 hover:bg-blue-50 transition"
              >
                {item.label}
              </button>
            ))}
            <div className="ml-2">
              <a
                href="#workspace"
                className="inline-flex items-center gap-1.5 rounded-xl theme-button px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
              >
                Start now <ChevronDown className="w-4 h-4 opacity-90" />
              </a>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden theme-icon hover:opacity-90 p-2 rounded-lg hover:bg-blue-50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${isOpen ? "max-h-80" : "max-h-0"
          }`}
      >
        <nav className="bg-white/80 backdrop-blur-xl ring-1 ring-black/5 shadow-sm px-6 pb-4 pt-2 space-y-2">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSelect(item.value)}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm text-blue-900/80 hover:text-blue-900 hover:bg-blue-50"
            >
              {item.label}
            </button>
          ))}
          <a
            href="#workspace"
            className="inline-flex items-center justify-center w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:from-blue-700 hover:to-indigo-700"
          >
            Start now
          </a>
        </nav>
      </div>
    </header>
  );
}

export default React.memo(Header);
