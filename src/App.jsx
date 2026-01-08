import { useEffect, useMemo, useState, lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { useMaintenance } from './context/MaintenanceContext';
import MaintenanceScreen from './components/MaintenanceScreen';
import MainPage from './components/Main';
import SEO from './components/SEO';

// Lazy load other page components for better code splitting
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const Privacy = lazy(() => import('./components/Privacy'));
const Terms = lazy(() => import('./components/Terms'));
const Blog = lazy(() => import('./components/Blog'));
const BlogPost = lazy(() => import('./components/BlogPost'));
const AdminApp = lazy(() => import('./components/admin/AdminApp'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const { enabled } = useMaintenance();

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const route = useMemo(() => {
    const clean = (path || '').trim();
    if (clean.startsWith('/admin')) return 'admin';
    if (clean.startsWith('/about')) return 'about';
    if (clean.startsWith('/contact')) return 'contact';
    if (clean.startsWith('/privacy')) return 'privacy';
    if (clean.startsWith('/terms')) return 'terms';
    if (clean.startsWith('/blog/')) return 'blogpost';
    if (clean.startsWith('/blog')) return 'blog';
    return 'home';
  }, [path]);

  return (
    <HelmetProvider>
      <div className="App">
        <Suspense fallback={<PageLoader />}>
          {route === 'home' && <SEO />}
          {route === 'blog' && (
            <SEO
              title="Blog"
              description="Read our latest articles about image editing, optimization, and more."
              canonical="/blog"
            />
          )}
          {route === 'about' && <SEO title="About Us" canonical="/about" />}
          {route === 'contact' && <SEO title="Contact Us" canonical="/contact" />}
          {route === 'privacy' && <SEO title="Privacy Policy" canonical="/privacy" />}
          {route === 'terms' && <SEO title="Terms of Service" canonical="/terms" />}

          {enabled && route !== 'admin' ? (
            <MaintenanceScreen />
          ) : route === 'admin'
            ? <AdminApp />
            : route === 'about'
              ? <About />
              : route === 'contact'
                ? <Contact />
                : route === 'privacy'
                  ? <Privacy />
                  : route === 'terms'
                    ? <Terms />
                    : route === 'blog'
                      ? <Blog />
                      : route === 'blogpost'
                        ? <BlogPost />
                        : <MainPage />}
        </Suspense>
      </div>
    </HelmetProvider>
  );
}

export default App;
