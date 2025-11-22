import { useEffect, useMemo, useState } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AdminLogin from './Login';
import AdminDashboard from './Dashboard';

function AdminApp() {
  const [authUser, setAuthUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthUser(user || null);
      setAuthChecked(true);
      // brief delay to show a professional loading state
      setTimeout(() => setVerifying(false), 350);
    });
    return () => unsub();
  }, []);

  const content = useMemo(() => {
    if (!authChecked || verifying) {
      return (
        <div className="min-h-screen grid place-items-center bg-gradient-to-b from-gray-50 to-white">
          <div className="relative h-14 w-14">
            <span className="absolute inset-0 rounded-full border-4 border-gray-200"></span>
            <span className="absolute inset-0 rounded-full border-4 border-gray-900 border-t-transparent animate-spin [animation-duration:900ms]"></span>
          </div>
        </div>
      );
    }
    if (authUser) {
      return <AdminDashboard />;
    }
    return <AdminLogin />;
  }, [authChecked, verifying, authUser]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {content}
    </div>
  );
}

export default AdminApp;


