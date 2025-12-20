import React, { useState, useEffect } from 'react';
import QuillEditor from './QuillEditor';
import { fetchContent, saveContent as saveContentToSupabase } from '../../../services/contentService';

const ContentManagement = () => {
	const [content, setContent] = useState('');
	const [loading, setLoading] = useState(true);
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

	const handleSave = async (newContent) => {
		// Update local state
		setContent(newContent);

		try {
			const success = await saveContentToSupabase(newContent);
			if (!success) {
				setError('Failed to save content to Supabase.');
				return false;
			}
			return true;
		} catch (error) {
			console.error('Error saving content:', error);
			setError('Error saving content: ' + error.message);
			return false;
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

			{error && (
				<div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm mb-4">
					{error}
				</div>
			)}

			{/* Render QueryEditor. The editor itself handles the save button UI */}
			<div className="quill-integration-container">
				<QuillEditor
					initialContent={content}
					onSave={handleSave}
				/>
			</div>
		</div>
	);
};

export default ContentManagement;

