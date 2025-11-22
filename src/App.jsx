import './App.css';
import MainPage from './components/Main';
import About from './components/About';
import Contact from './components/Contact';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import { useEffect, useMemo, useState } from 'react';
import AdminApp from './components/admin/AdminApp';
import { useMaintenance } from './context/MaintenanceContext';
import MaintenanceScreen from './components/MaintenanceScreen';

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
    <div className="App">
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
    </div>
  );
}

export default App;
