import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const HomepageContentContext = createContext({ html: '', saveHtml: async () => {} });

export function HomepageContentProvider({ children }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    const ref = doc(db, 'settings', 'homepage');
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setHtml(typeof data.html === 'string' ? data.html : '');
      } else {
        setHtml('');
      }
    });
    return () => unsub();
  }, []);

  async function saveHtml(nextHtml) {
    const ref = doc(db, 'settings', 'homepage');
    await setDoc(ref, { html: nextHtml ?? '' }, { merge: true });
  }

  const value = useMemo(() => ({ html, saveHtml }), [html]);
  return <HomepageContentContext.Provider value={value}>{children}</HomepageContentContext.Provider>;
}

export function useHomepageContent() {
  return useContext(HomepageContentContext);
}


