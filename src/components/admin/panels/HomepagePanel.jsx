import React, { useEffect, useState } from 'react';
import FroalaEditorComponent from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'font-awesome/css/font-awesome.css';
import 'froala-editor/js/third_party/font_awesome.min.js';
import './ContentEditor.css';
import { useHomepageContent } from '../../../context/HomepageContentContext';

const froalaConfig = {
	placeholderText: 'Type or paste your content here!',
	toolbarButtons: [
		['undo', 'redo', '|', 'bold', 'italic', 'underline', 'strikeThrough'],
		['paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent'],
		['insertLink', 'insertTable', 'quote', 'html']
	],
	charCounterCount: true,
	licenseKey: 'nQE2uG3B1F1nmnspC5qpH3B3C11A6D5F5F5G4A-8A-7A2cefE3B2F3C2G2ilva1EAJLQCVLUVBf1NXNRSSATEXA-62WVLGKF2G2H2G1I4B3B2B8D7F6=='
};

export default function HomepagePanel() {
  const { html, saveHtml } = useHomepageContent();
  const [value, setValue] = useState(html || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setValue(html || '');
  }, [html]);

  async function onSave() {
    setSaving(true);
    setMsg('');
    try {
      await saveHtml(value);
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
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Homepage Content Manager</h2>
        <div className="flex items-center gap-2">
          <button onClick={onSave} disabled={saving} className="rounded-md bg-gray-900 text-white px-3 py-1.5 text-sm hover:bg-black disabled:opacity-60">{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-2">
        <FroalaEditorComponent
					tag='textarea'
					model={value}
					onModelChange={setValue}
					config={froalaConfig}
				/>
      </div>

      {msg ? <div className="text-sm text-gray-600">{msg}</div> : null}
    </div>
  );
}


