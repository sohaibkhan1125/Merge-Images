import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

// Define 10 modern color schemes
export const COLOR_SCHEMES = [
  { key: 'ocean', name: 'Ocean', primary: '#1d4ed8', accent: '#7c3aed', buttonFrom: '#2563eb', buttonTo: '#4f46e5', heroText: '#1e3a8a', text: '#0f172a' },
  { key: 'emerald', name: 'Emerald', primary: '#059669', accent: '#10b981', buttonFrom: '#059669', buttonTo: '#047857', heroText: '#065f46', text: '#0b1f1a' },
  { key: 'sunset', name: 'Sunset', primary: '#f97316', accent: '#ef4444', buttonFrom: '#fb923c', buttonTo: '#ef4444', heroText: '#9a3412', text: '#1f1720' },
  { key: 'rose', name: 'Rose', primary: '#e11d48', accent: '#f43f5e', buttonFrom: '#fb7185', buttonTo: '#e11d48', heroText: '#9f1239', text: '#1e0b12' },
  { key: 'violet', name: 'Violet', primary: '#7c3aed', accent: '#a78bfa', buttonFrom: '#7c3aed', buttonTo: '#4c1d95', heroText: '#4c1d95', text: '#140b25' },
  { key: 'teal', name: 'Teal', primary: '#0d9488', accent: '#14b8a6', buttonFrom: '#0d9488', buttonTo: '#0f766e', heroText: '#115e59', text: '#0b1918' },
  { key: 'amber', name: 'Amber', primary: '#d97706', accent: '#f59e0b', buttonFrom: '#f59e0b', buttonTo: '#d97706', heroText: '#92400e', text: '#1f1506' },
  { key: 'indigo', name: 'Indigo', primary: '#4f46e5', accent: '#6366f1', buttonFrom: '#4f46e5', buttonTo: '#4338ca', heroText: '#3730a3', text: '#0f122a' },
  { key: 'cyan', name: 'Cyan', primary: '#06b6d4', accent: '#22d3ee', buttonFrom: '#06b6d4', buttonTo: '#0891b2', heroText: '#164e63', text: '#0b1620' },
  { key: 'slate', name: 'Slate', primary: '#0ea5e9', accent: '#64748b', buttonFrom: '#0ea5e9', buttonTo: '#0369a1', heroText: '#0f172a', text: '#0f172a' },
];

const ThemeContext = createContext({ schemeKey: 'ocean', setSchemeRemote: async () => {} });

function applyCssVars(scheme) {
  const root = document.documentElement;
  root.style.setProperty('--primary', scheme.primary);
  root.style.setProperty('--accent', scheme.accent);
  root.style.setProperty('--button-from', scheme.buttonFrom);
  root.style.setProperty('--button-to', scheme.buttonTo);
  root.style.setProperty('--hero-text', scheme.heroText);
  root.style.setProperty('--text-main', scheme.text);
}

export function ThemeProvider({ children }) {
  const [schemeKey, setSchemeKey] = useState('ocean');

  useEffect(() => {
    const ref = doc(db, 'settings', 'theme');
    const unsub = onSnapshot(ref, (snap) => {
      const key = snap.exists() && snap.data()?.schemeKey ? snap.data().schemeKey : 'ocean';
      setSchemeKey(key);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const scheme = COLOR_SCHEMES.find((s) => s.key === schemeKey) || COLOR_SCHEMES[0];
    applyCssVars(scheme);
  }, [schemeKey]);

  async function setSchemeRemote(nextKey) {
    const ref = doc(db, 'settings', 'theme');
    await setDoc(ref, { schemeKey: nextKey }, { merge: true });
  }

  const value = useMemo(() => ({ schemeKey, setSchemeRemote }), [schemeKey]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}


