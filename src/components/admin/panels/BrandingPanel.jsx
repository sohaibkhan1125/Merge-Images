import { useState } from 'react';
import { useBranding } from '../../../context/BrandingContext';

export default function BrandingPanel() {
  const { title, saveBranding } = useBranding();
  const [nextTitle, setNextTitle] = useState(title || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function onSave(e) {
    e.preventDefault();
    setMessage('');
    setSaving(true);
    try {
      await saveBranding({ nextTitle });
      setMessage('Saved successfully');
    } catch (err) {
      setMessage(err?.message || 'Failed to save');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 2000);
    }
  }

  return (
    <form onSubmit={onSave} className="p-6 grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website Title</label>
          <input value={nextTitle} onChange={(e)=>setNextTitle(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="Enter website title" />
        </div>

        <div className="pt-2">
          <button type="submit" disabled={saving} className="rounded-lg bg-gray-900 text-white px-4 py-2 text-sm hover:bg-black transition disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          {message ? <span className="ml-3 text-sm text-gray-600">{message}</span> : null}
        </div>
      </div>

      <aside className="space-y-3">
        <div className="rounded-lg border bg-white p-4">
          <h3 className="text-sm font-semibold mb-1">Preview</h3>
          <p className="text-xs text-gray-500 mb-3">How it looks in the header</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{nextTitle || 'Untitled'}</span>
          </div>
        </div>
      </aside>
    </form>
  );
}


