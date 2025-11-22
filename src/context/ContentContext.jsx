import { createContext, useContext, useEffect, useState, useMemo } from 'react';

const ContentContext = createContext({ content: '' });

export function ContentProvider({ children }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    // Load content from localStorage on mount
    const loadContent = () => {
      try {
        const savedSettings = localStorage.getItem('admin_settings');
        if (savedSettings) {
          const data = JSON.parse(savedSettings);
          setContent(data.content || '');
        }
      } catch (error) {
        console.warn('Error loading content:', error);
      }
    };

    loadContent();

    // Listen for custom event when content is updated
    const handleSettingsUpdate = (event) => {
      if (event.detail && event.detail.content !== undefined) {
        setContent(event.detail.content || '');
      }
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate);

    // Also listen for storage changes (in case of multiple tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'admin_settings') {
        try {
          const data = JSON.parse(e.newValue || '{}');
          setContent(data.content || '');
        } catch (error) {
          console.warn('Error parsing storage change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value = useMemo(() => ({ content }), [content]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}

