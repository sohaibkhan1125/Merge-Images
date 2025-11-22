import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';

// Social item shape: { id: string, name: string, url: string, icon: 'facebook'|'twitter'|'instagram'|'github'|'mail' }

const FooterContext = createContext({ socials: [], saveSocials: async () => {} });

export function FooterProvider({ children }) {
  const [socials, setSocials] = useState([]);

  useEffect(() => {
    const ref = doc(db, 'settings', 'footer');
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setSocials(Array.isArray(data.socials) ? data.socials : []);
      } else {
        setSocials([]);
      }
    });
    return () => unsub();
  }, []);

  async function saveSocials(nextSocials) {
    const ref = doc(db, 'settings', 'footer');
    await setDoc(ref, { socials: nextSocials }, { merge: true });
  }

  const value = useMemo(() => ({ socials, saveSocials }), [socials]);
  return <FooterContext.Provider value={value}>{children}</FooterContext.Provider>;
}

export function useFooterSettings() {
  return useContext(FooterContext);
}


