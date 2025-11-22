import React, { useState, useEffect } from 'react';
import { useHeroSection } from '../../../context/HeroSectionContext';

export default function HeroSectionPanel() {
  const { title, description, saveHero } = useHeroSection();
  const [localTitle, setLocalTitle] = useState(title || '');
  const [localDescription, setLocalDescription] = useState(description || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Sync with context when it changes
  useEffect(() => {
    setLocalTitle(title || '');
    setLocalDescription(description || '');
  }, [title, description]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (!localTitle.trim()) {
        setError('Title is required');
        setSaving(false);
        return;
      }

      if (!localDescription.trim()) {
        setError('Description is required');
        setSaving(false);
        return;
      }

      await saveHero(localTitle.trim(), localDescription.trim());
      setSuccess('Hero section updated successfully! Changes are visible immediately.');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error saving hero section: ' + err.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setLocalTitle(title || '');
    setLocalDescription(description || '');
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hero Section Management</h2>
        <p className="text-gray-600">
          Update the hero section title and description that appears at the top of your homepage. 
          Changes are saved to localStorage and update in real-time.
        </p>
      </div>

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Title Input */}
        <div>
          <label htmlFor="hero-title" className="block text-sm font-medium text-gray-700 mb-2">
            Hero Title *
          </label>
          <input
            id="hero-title"
            type="text"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            placeholder="Enter hero title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <p className="mt-1 text-xs text-gray-500">
            This is the main heading displayed in the hero section
          </p>
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="hero-description" className="block text-sm font-medium text-gray-700 mb-2">
            Hero Description *
          </label>
          <textarea
            id="hero-description"
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
            placeholder="Enter hero description"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-y"
          />
          <p className="mt-1 text-xs text-gray-500">
            This is the descriptive text displayed below the title
          </p>
        </div>

        {/* Preview */}
        <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Preview</h3>
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
              {localTitle || 'Enter a title'}
            </h1>
            <p className="text-gray-600 max-w-prose">
              {localDescription || 'Enter a description'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}



