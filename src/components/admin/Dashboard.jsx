import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useBranding } from '../../context/BrandingContext';
import BrandingPanel from './panels/BrandingPanel';
import FooterPanel from './panels/FooterPanel';
import HomepagePanel from './panels/HomepagePanel';
import AppearancePanel from './panels/AppearancePanel';
import GeneralPanel from './panels/GeneralPanel';
import BlogPanel from './panels/BlogPanel';
import HeroSectionPanel from './panels/HeroSectionPanel';
import ContentManagement from './panels/ContentManagement';

function Logo({ className = "h-7 w-7" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="MergeImages logo"
    >
      <rect x="10" y="8" rx="6" ry="6" width="28" height="22" fill="url(#g1)" />
      <rect x="6" y="18" rx="6" ry="6" width="28" height="22" fill="url(#g2)" />
      <circle cx="32" cy="18" r="3" fill="#fff" fillOpacity="0.9" />
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

function AdminDashboard() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState('branding');
  const { title, logoUrl } = useBranding();
  return (
    <div className="min-h-screen flex animate-in fade-in duration-300">
      {/* Sidebar */}
      <aside className={`transition-all duration-300 border-r bg-white/80 backdrop-blur ${open ? 'w-64' : 'w-16'} overflow-hidden`}>
        <div className="h-14 flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            {logoUrl ? <img src={logoUrl} alt="Logo" className="h-7 w-7 rounded"/> : <Logo className="h-7 w-7" />}
            {open ? <span className="font-semibold text-sm truncate">{title || 'Admin'}</span> : null}
          </div>
          <button onClick={()=>setOpen(!open)} className="text-gray-600 hover:text-gray-900 rounded p-1">{open ? '⟨⟨' : '⟩⟩'}</button>
        </div>
        <nav className="px-2 py-2 space-y-1">
          <button onClick={()=>setActive('branding')} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${active==='branding'?'bg-gray-900 text-white shadow':'hover:bg-gray-100 text-gray-800'}`}>
            {open ? 'Logo & Title Management' : ''}
          </button>
          <button onClick={()=>setActive('general')} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${active==='general'?'bg-gray-900 text-white shadow':'hover:bg-gray-100 text-gray-800'}`}>
            {open ? 'General Settings' : ''}
          </button>
          <button onClick={()=>setActive('appearance')} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${active==='appearance'?'bg-gray-900 text-white shadow':'hover:bg-gray-100 text-gray-800'}`}>
            {open ? 'Appearance' : ''}
          </button>
          <button onClick={()=>setActive('footer')} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${active==='footer'?'bg-gray-900 text-white shadow':'hover:bg-gray-100 text-gray-800'}`}>
            {open ? 'Footer Management' : ''}
          </button>
          <button onClick={()=>setActive('hero')} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${active==='hero'?'bg-gray-900 text-white shadow':'hover:bg-gray-100 text-gray-800'}`}>
            {open ? 'Hero Section Management' : ''}
          </button>
          <button onClick={()=>setActive('homepage')} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${active==='homepage'?'bg-gray-900 text-white shadow':'hover:bg-gray-100 text-gray-800'}`}>
            {open ? 'Homepage Content Manager' : ''}
          </button>
          <button onClick={()=>setActive('blogs')} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${active==='blogs'?'bg-gray-900 text-white shadow':'hover:bg-gray-100 text-gray-800'}`}>
            {open ? 'Blog Management' : ''}
          </button>
          <button onClick={()=>setActive('content')} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${active==='content'?'bg-gray-900 text-white shadow':'hover:bg-gray-100 text-gray-800'}`}>
            {open ? 'Content Editor' : ''}
          </button>
        </nav>
      </aside>
      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b bg-white/70 backdrop-blur flex items-center justify-between px-4">
          <h1 className="text-sm font-semibold">Admin Dashboard</h1>
          <button onClick={() => signOut(auth)} className="rounded-md bg-gray-900 text-white px-3 py-1.5 text-sm hover:bg-black transition">Sign out</button>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-xl border bg-white p-0 shadow-sm overflow-hidden">
              <section className="animate-in fade-in duration-300">
                {active === 'branding' ? <BrandingPanel/> :
                 active === 'appearance' ? <AppearancePanel/> :
                 active === 'footer' ? <FooterPanel/> :
                 active === 'general' ? <GeneralPanel/> :
                 active === 'hero' ? <HeroSectionPanel/> :
                 active === 'homepage' ? <HomepagePanel/> :
                 active === 'blogs' ? <BlogPanel/> :
                 active === 'content' ? <ContentManagement/> : (
                  <div className="p-6 text-gray-600">Coming soon…</div>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;


