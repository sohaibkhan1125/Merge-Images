import { useMemo, useState } from 'react';
import { useFooterSettings } from '../../../context/FooterContext';

const ICONS = ['facebook','twitter','instagram','github','mail'];

export default function FooterPanel() {
  const { socials, saveSocials } = useFooterSettings();
  const [items, setItems] = useState(socials);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // keep local state in sync when firestore updates externally
  useMemo(() => setItems(socials), [socials]);

  function addItem() {
    const id = Math.random().toString(36).slice(2, 9);
    setItems([...(items || []), { id, name: 'facebook', url: '', icon: 'facebook' }]);
  }

  function updateItem(id, patch) {
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, ...patch } : it));
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  async function onSave() {
    setSaving(true);
    setMsg('');
    try {
      await saveSocials(items);
      setMsg('Saved');
      setTimeout(()=>setMsg(''), 1500);
    } catch (e) {
      setMsg('Failed');
      setTimeout(()=>setMsg(''), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">Footer Management</h2>
        <div className="flex items-center gap-2">
          <button onClick={addItem} className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">Add</button>
          <button onClick={onSave} disabled={saving} className="rounded-md bg-gray-900 text-white px-3 py-1.5 text-sm hover:bg-black disabled:opacity-60">{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>

      <div className="grid gap-3">
        {(items || []).length === 0 ? (
          <div className="text-sm text-gray-500">No social links. Click Add to create one.</div>
        ) : null}

        {(items || []).map((it) => (
          <div key={it.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center rounded-lg border p-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Icon</label>
              <select value={it.icon} onChange={(e)=>updateItem(it.id,{ icon: e.target.value })} className="w-full rounded-md border border-gray-300 px-2 py-2 text-sm">
                {ICONS.map((n)=> <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">URL</label>
              <input value={it.url} onChange={(e)=>updateItem(it.id,{ url: e.target.value })} placeholder="https://..." className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-3 flex items-center justify-end">
              <button onClick={()=>removeItem(it.id)} className="text-sm text-red-600 hover:underline">Remove</button>
            </div>
          </div>
        ))}
      </div>

      {msg ? <div className="mt-3 text-sm text-gray-600">{msg}</div> : null}
    </div>
  );
}


