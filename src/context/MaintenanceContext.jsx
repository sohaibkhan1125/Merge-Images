import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const MaintenanceContext = createContext({ enabled: false, setEnabledRemote: async () => {} });

export function MaintenanceProvider({ children }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const ref = doc(db, 'settings', 'maintenance');
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setEnabled(Boolean(data.enabled));
      } else {
        setEnabled(false);
      }
    });
    return () => unsub();
  }, []);

  async function setEnabledRemote(next) {
    const ref = doc(db, 'settings', 'maintenance');
    await setDoc(ref, { enabled: Boolean(next) }, { merge: true });
  }

  const value = useMemo(() => ({ enabled, setEnabledRemote }), [enabled]);
  return <MaintenanceContext.Provider value={value}>{children}</MaintenanceContext.Provider>;
}

export function useMaintenance() {
  return useContext(MaintenanceContext);
}


