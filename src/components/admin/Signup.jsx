import { useState } from 'react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

function AdminSignup({ onSeeded }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignup(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const metaRef = doc(collection(db, 'meta'), 'admin');
      await setDoc(metaRef, { createdAt: serverTimestamp(), uid: cred.user.uid, email });
      await signOut(auth); // force login flow afterwards
      if (onSeeded) onSeeded(true);
    } catch (err) {
      setError(err?.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-2">Admin Setup</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Create your one-time admin account</p>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="you@example.com"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="••••••••"/>
          </div>
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-900 text-white py-2.5 hover:bg-black transition disabled:opacity-60">
            {loading ? <span className="animate-pulse h-2 w-2 rounded-full bg-white"></span> : null}
            {loading ? 'Creating…' : 'Create Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminSignup;


