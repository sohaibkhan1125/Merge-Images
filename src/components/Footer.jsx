import React from "react";
import { useBranding } from "../context/BrandingContext";
import { useFooterSettings } from "../context/FooterContext";
import { Facebook, Twitter, Instagram, Mail, Github, Heart } from "lucide-react";

function Logo({ className = "h-8 w-8" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="MergeImages logo"
    >
      <rect x="10" y="8" rx="6" ry="6" width="28" height="22" fill="url(#fg1)" />
      <rect x="6" y="18" rx="6" ry="6" width="28" height="22" fill="url(#fg2)" />
      <circle cx="32" cy="18" r="3" fill="#fff" fillOpacity="0.9" />
      <path d="M12 34l6-6 4 4 6-8 6 10H12z" fill="#0ea5e9" fillOpacity="0.8" />
      <defs>
        <linearGradient id="fg1" x1="10" y1="8" x2="38" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
        <linearGradient id="fg2" x1="6" y1="18" x2="34" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a5b4fc" />
          <stop offset="1" stopColor="#bae6fd" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const navigate = (e, to) => {
  if (!to) return;
  e.preventDefault();
  if (window.location.pathname !== to) {
    window.history.pushState({}, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
};

const Footer = () => {
  const { title, logoUrl } = useBranding();
  const { socials } = useFooterSettings();
  return (
    <footer className="relative mt-20">
      {/* Top wave / gradient accent */}
      <div className="absolute -top-16 inset-x-0 h-24 bg-gradient-to-b from-transparent to-blue-50/80 pointer-events-none" />

      <div className="relative z-10 bg-white/70 backdrop-blur-xl ring-1 ring-black/5">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-8 w-8 rounded" />
                ) : (
                  <Logo className="h-8 w-8" />
                )}
                <span className="text-lg font-extrabold tracking-tight theme-hero-text">{title || 'MergeImages'}</span>
              </div>
              <p className="mt-3 text-sm text-gray-600 max-w-xs">
                Merge JPG, PNG and more into a single polished output. Free, secure, and fast.
              </p>
              <div className="mt-4 flex items-center gap-3 text-gray-600 text-sm">
                <Heart className="w-4 h-4 text-rose-500" /> Built for creators
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-sm font-semibold text-blue-900/80">Product</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li><a className="hover:text-blue-800" href="/features" onClick={(e) => navigate(e, "/features")}>Features</a></li>
                <li><a className="hover:text-blue-800" href="/roadmap" onClick={(e) => navigate(e, "/roadmap")}>Roadmap</a></li>
                <li><a className="hover:text-blue-800" href="/changelog" onClick={(e) => navigate(e, "/changelog")}>Changelog</a></li>
                <li><a className="hover:text-blue-800" href="/status" onClick={(e) => navigate(e, "/status")}>Status</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-blue-900/80">Resources</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li><a className="hover:text-blue-800" href="/blog" onClick={(e) => navigate(e, "/blog")}>Blog</a></li>
                <li><a className="hover:text-blue-800" href="/docs" onClick={(e) => navigate(e, "/docs")}>Documentation</a></li>
                <li><a className="hover:text-blue-800" href="/tutorials" onClick={(e) => navigate(e, "/tutorials")}>Tutorials</a></li>
                <li><a className="hover:text-blue-800" href="/support" onClick={(e) => navigate(e, "/support")}>Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-blue-900/80">Company</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li><a className="hover:text-blue-800" href="/about" onClick={(e) => navigate(e, "/about")}>About</a></li>
                <li><a className="hover:text-blue-800" href="/contact" onClick={(e) => navigate(e, "/contact")}>Contact</a></li>
                <li><a className="hover:text-blue-800" href="/privacy" onClick={(e) => navigate(e, "/privacy")}>Privacy</a></li>
                <li><a className="hover:text-blue-800" href="/terms" onClick={(e) => navigate(e, "/terms")}>Terms</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-blue-900/80">Connect</h3>
              <div className="mt-3 flex items-center gap-3">
                {(socials || []).map((it) => {
                  const common = "p-2 rounded-lg bg-white/80 ring-1 ring-gray-200 hover:bg-white text-blue-700";
                  const icon = it.icon;
                  const url = it.url || '#';
                  return (
                    <a key={it.id} href={url} target="_blank" rel="noreferrer" className={common}>
                      {icon === 'facebook' ? <Facebook size={18} /> :
                       icon === 'twitter' ? <Twitter size={18} /> :
                       icon === 'instagram' ? <Instagram size={18} /> :
                       icon === 'github' ? <Github size={18} /> :
                       <Mail size={18} />}
                    </a>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-gray-500">bestmergejpg@gmail.com</p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-3 border-t border-gray-200 pt-4 text-xs text-gray-500">
            <div>© {new Date().getFullYear()} MergeImages. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <a href="/cookies" onClick={(e) => navigate(e, "/cookies")} className="hover:text-blue-800">Cookies</a>
              <a href="/security" onClick={(e) => navigate(e, "/security")} className="hover:text-blue-800">Security</a>
              <a href="/docs" onClick={(e) => navigate(e, "/docs")} className="hover:text-blue-800">Docs</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
