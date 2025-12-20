import React, { useEffect, useState } from 'react';
import QuillEditor from './QuillEditor';
import { useHomepageContent } from '../../../context/HomepageContentContext';

export default function HomepagePanel() {
  const { html, saveHtml } = useHomepageContent();
  const [value, setValue] = useState(html || '');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setValue(html || '');
  }, [html]);

  const handleSave = async (newContent) => {
    setValue(newContent);
    setMsg('');
    try {
      await saveHtml(newContent);
      setMsg('Saved');
      setTimeout(() => setMsg(''), 1500);
      return true;
    } catch (e) {
      setMsg('Failed');
      setTimeout(() => setMsg(''), 2000);
      return false;
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Homepage Content Manager</h2>
      </div>

      <div className="quill-integration-container">
        <QuillEditor
          initialContent={value}
          onSave={handleSave}
        />
      </div>

      {msg ? <div className="text-sm text-gray-600">{msg}</div> : null}
    </div>
  );
}


