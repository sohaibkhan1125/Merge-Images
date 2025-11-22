import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 transition-opacity duration-300">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 animate-in fade-in zoom-in duration-300">
        <h1 className="text-2xl font-bold text-center mb-2">Admin Login</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Sign in to the dashboard</p>
        <form onSubmit={handleLogin} className="space-y-4">
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
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;


