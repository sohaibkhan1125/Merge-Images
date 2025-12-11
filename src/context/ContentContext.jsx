import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { fetchContent, subscribeToContentChanges } from '../services/contentService';

const ContentContext = createContext({ content: '' });

export function ContentProvider({ children }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    // Load content from Supabase on mount
    const loadContent = async () => {
      try {
        const fetchedContent = await fetchContent();
        setContent(fetchedContent);
      } catch (error) {
        console.error('Error loading content from Supabase:', error);
      }
    };

    loadContent();

    // Subscribe to real-time content changes from Supabase
    const subscription = subscribeToContentChanges((newContent) => {
      setContent(newContent);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => ({ content }), [content]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}

