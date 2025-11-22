import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const BrandingContext = createContext({ title: 'MergeImages', logoUrl: null, loading: true, saveBranding: async () => {} });

export function BrandingProvider({ children }) {
  const [title, setTitle] = useState('MergeImages');
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const brandingRef = doc(db, 'settings', 'branding');
    const unsub = onSnapshot(brandingRef, async (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setTitle(data.title || 'MergeImages');
        setLogoUrl(data.logoUrl || null);
      }
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, []);

  async function saveBranding({ nextTitle }) {
    const brandingRef = doc(db, 'settings', 'branding');
    await setDoc(brandingRef, { title: nextTitle ?? title }, { merge: true });
  }

  const value = useMemo(() => ({ title, logoUrl, loading, saveBranding }), [title, logoUrl, loading]);
  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>;
}

export function useBranding() {
  return useContext(BrandingContext);
}


