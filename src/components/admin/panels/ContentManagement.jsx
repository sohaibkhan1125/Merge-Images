import React, { useState, useEffect } from 'react';
import FroalaEditorComponent from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'font-awesome/css/font-awesome.css';
import 'froala-editor/js/third_party/font_awesome.min.js';
import './ContentEditor.css';
import { fetchContent, saveContent as saveContentToSupabase } from '../../../services/contentService';

const FROALA_TRIAL_KEY = 'nQE2uG3B1F1nmnspC5qpH3B3C11A6D5F5F5G4A-8A-7A2cefE3B2F3C2G2ilva1EAJLQCVLUVBf1NXNRSSATEXA-62WVLGKF2G2H2G1I4B3B2B8D7F6==';

const froalaConfig = {
	key: FROALA_TRIAL_KEY,
	placeholderText: 'Type or paste your content here!',
	toolbarButtons: [
		['undo', 'redo', '|', 'bold', 'italic', 'underline', 'strikeThrough'],
		['paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent'],
		['insertLink', 'insertTable', 'quote', 'html']
	],
	charCounterCount: true
};

const ContentManagement = () => {
	const [content, setContent] = useState('');
	const [saving, setSaving] = useState(false);
	const [loading, setLoading] = useState(true);
	const [success, setSuccess] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		loadContent();
	}, []);

	const loadContent = async () => {
		try {
			setLoading(true);
			setError(null);
			const fetchedContent = await fetchContent();
			setContent(fetchedContent);
		} catch (error) {
			console.error('Error loading content:', error);
			setError('Failed to load content from Supabase');
		} finally {
			setLoading(false);
		}
	};

	const saveContent = async () => {
		setSaving(true);
		setError(null);
		setSuccess(null);

		try {
			const success = await saveContentToSupabase(content);

			if (success) {
				setSuccess('Content saved to Supabase successfully!');
				// Clear success message after 3 seconds
				setTimeout(() => setSuccess(null), 3000);
			} else {
				setError('Failed to save content to Supabase. Please try again.');
			}
		} catch (error) {
			console.error('Error saving content:', error);
			setError('Error saving content: ' + error.message);
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="p-6 flex items-center justify-center">
				<div className="text-gray-600">Loading content...</div>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-sm font-semibold text-gray-900">Content Management</h2>
					<p className="text-xs text-gray-600 mt-1">Create and manage content that will be displayed on your website.</p>
				</div>
			</div>

			{success && (
				<div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm">
					{success}
				</div>
			)}

			{error && (
				<div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
					{error}
				</div>
			)}

			<div className="rounded-lg border bg-white p-2 main-container">
				<FroalaEditorComponent
					tag='textarea'
					model={content}
					onModelChange={setContent}
					config={froalaConfig}
				/>
			</div>

			<div className="flex items-center justify-end gap-2">
				<button
					onClick={loadContent}
					disabled={loading}
					className="px-3 py-1.5 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
				>
					Reset
				</button>

				<button
					onClick={saveContent}
					disabled={saving}
					className="rounded-md bg-gray-900 text-white px-3 py-1.5 text-sm hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
				>
					{saving ? 'Saving…' : 'Save Content'}
				</button>
			</div>
		</div>
	);
};

export default ContentManagement;

