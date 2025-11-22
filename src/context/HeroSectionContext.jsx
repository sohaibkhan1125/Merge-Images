import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const HeroSectionContext = createContext({ 
  title: '', 
  description: '', 
  saveHero: async () => {} 
});

const STORAGE_KEY = 'hero_section_data';
const DEFAULT_TITLE = 'Merge Images Beautifully';
const DEFAULT_DESCRIPTION = 'Upload two or more images, choose layout and format, and create a single, polished image with one click.';

export function HeroSectionProvider({ children }) {
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);

  // Load from localStorage on mount
  useEffect(() => {
    const loadHeroData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          setTitle(data.title || DEFAULT_TITLE);
          setDescription(data.description || DEFAULT_DESCRIPTION);
        }
      } catch (error) {
        console.warn('Error loading hero section data:', error);
      }
    };

    loadHeroData();

    // Listen for storage changes (for real-time updates across tabs)
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        loadHeroData();
      }
    };

    // Listen for custom event (for same-tab updates)
    const handleCustomEvent = () => {
      loadHeroData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('heroSectionUpdated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('heroSectionUpdated', handleCustomEvent);
    };
  }, []);

  async function saveHero(newTitle, newDescription) {
    const heroData = {
      title: newTitle || DEFAULT_TITLE,
      description: newDescription || DEFAULT_DESCRIPTION
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(heroData));
      setTitle(heroData.title);
      setDescription(heroData.description);
      
      // Dispatch custom event for same-tab real-time updates
      window.dispatchEvent(new CustomEvent('heroSectionUpdated'));
    } catch (error) {
      console.error('Error saving hero section data:', error);
      throw error;
    }
  }

  const value = useMemo(() => ({ title, description, saveHero }), [title, description]);
  return <HeroSectionContext.Provider value={value}>{children}</HeroSectionContext.Provider>;
}

export function useHeroSection() {
  return useContext(HeroSectionContext);
}



