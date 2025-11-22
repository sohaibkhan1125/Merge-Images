import React, { useState, useEffect } from 'react';

import FroalaEditorComponent from 'react-froala-wysiwyg';

import 'froala-editor/css/froala_style.min.css';

import 'froala-editor/css/froala_editor.pkgd.min.css';

import 'froala-editor/js/plugins.pkgd.min.js';

import 'font-awesome/css/font-awesome.css';

import 'froala-editor/js/third_party/font_awesome.min.js';

import './ContentEditor.css';

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

	const [success, setSuccess] = useState(null);

	const [error, setError] = useState(null);

	useEffect(() => {

		loadContent();

	}, []);

	const loadContent = async () => {

		try {

			const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

			const isDevelopment = process.env.NODE_ENV === 'development';

			

			if (!isDevelopment || process.env.REACT_APP_API_URL) {

				const response = await fetch(`${API_BASE_URL}/api/settings`);

				if (response.ok) {

					const data = await response.json();

					setContent(data.content || '');

					return;

				}

			}

			

			const savedSettings = localStorage.getItem('admin_settings');

			if (savedSettings) {

				const data = JSON.parse(savedSettings);

				setContent(data.content || '');

			}

		} catch (error) {

			console.warn('Error loading content:', error);

		}

	};

	const saveContent = async () => {

		setSaving(true);

		setError(null);

		setSuccess(null);

		try {

			const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

			const isDevelopment = process.env.NODE_ENV === 'development';

			

			const settingsData = {

				maintenance: false,

				title: "PixelArt Converter",

				content: content

			};

			if (!isDevelopment || process.env.REACT_APP_API_URL) {

				const response = await fetch(`${API_BASE_URL}/api/settings`, {

					method: 'POST',

					headers: {

						'Content-Type': 'application/json',

					},

					body: JSON.stringify(settingsData),

				});

				if (response.ok) {

					setSuccess('Content saved successfully!');

					localStorage.setItem('admin_settings', JSON.stringify(settingsData));

					window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: settingsData }));

				} else {

					throw new Error('Failed to save content');

				}

			} else {

				localStorage.setItem('admin_settings', JSON.stringify(settingsData));

				setSuccess('Content saved to localStorage!');

				window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: settingsData }));

			}

		} catch (error) {

			setError('Error saving content: ' + error.message);

		} finally {

			setSaving(false);

		}

	};

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

					className="px-3 py-1.5 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm"

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

