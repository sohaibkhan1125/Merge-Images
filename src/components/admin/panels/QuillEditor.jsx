import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.min.css';
import './QuillEditor.css';
import {
    PenTool,
    Code,
    Sun,
    Moon,
    Minimize,
    Maximize,
    Trash2,
    Save,
    FileCode,
    Copy,
    Download,
    X,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

const QuillEditor = ({ initialContent, onSave }) => {
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [lastSaved, setLastSaved] = useState('Unsaved');
    const [theme, setTheme] = useState('light');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [codeOutput, setCodeOutput] = useState('');
    const [toastMessage, setToastMessage] = useState({ show: false, message: '', type: 'success' });

    // Load Theme Preference and Font Config
    useEffect(() => {
        // Load fonts
        const fontLink = document.createElement('link');
        fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";
        fontLink.rel = "stylesheet";
        document.head.appendChild(fontLink);

        const savedTheme = localStorage.getItem('editor_theme_preference');
        if (savedTheme === 'dark') {
            setTheme('dark');
            document.body.classList.add('dark-mode');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        if (newTheme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('editor_theme_preference', newTheme);
    };

    // Initialize Quill
    useEffect(() => {
        if (!editorRef.current || quillRef.current) return;

        const toolbarOptions = [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            ['clean']
        ];

        const quillInstance = new Quill(editorRef.current, {
            theme: 'snow',
            modules: {
                toolbar: {
                    container: toolbarOptions,
                    handlers: {
                        image: imageHandler
                    }
                },
                history: {
                    delay: 1000,
                    maxStack: 50,
                    userOnly: true
                }
            },
            placeholder: 'Start writing your document here...'
        });

        quillRef.current = quillInstance;

        // Load initial content
        if (initialContent) {
            quillInstance.clipboard.dangerouslyPasteHTML(initialContent);
        }

        quillInstance.on('text-change', () => {
            updateStats();
        });

        updateStats();

    }, []); // Run once on mount

    const updateStats = () => {
        if (!quillRef.current) return;
        const text = quillRef.current.getText();
        const wordCount = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
        const charCount = text.length > 1 ? text.length - 1 : 0;
        setWordCount(wordCount);
        setCharCount(charCount);
    };

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = () => {
            const file = input.files[0];
            if (/^image\//.test(file.type)) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const range = quillRef.current.getSelection(true);
                    quillRef.current.insertEmbed(range.index, 'image', reader.result);
                    quillRef.current.setSelection(range.index + 1);
                    showToast('Image inserted successfully');
                };
            } else {
                showToast('Please select a valid image file', 'error');
            }
        };
    };

    const handleSave = async () => {
        if (!quillRef.current) return;
        const content = quillRef.current.root.innerHTML;

        // Call parent onSave
        if (onSave) {
            const success = await onSave(content);
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (success !== false) {
                setLastSaved(`Saved at ${timeString}`);
                showToast('Document saved successfully');
            } else {
                showToast('Failed to save document', 'error');
            }
        }
    };

    const handleClear = () => {
        if (window.confirm('Are you sure you want to clear the editor? This cannot be undone.')) {
            quillRef.current.setContents([]);
            showToast('Editor cleared');
        }
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const showToast = (msg, type = 'success') => {
        setToastMessage({ show: true, message: msg, type });
        setTimeout(() => {
            setToastMessage((prev) => ({ ...prev, show: false }));
        }, 3000);
    };

    // Text to Code Logic
    const convertToCode = () => {
        if (!quillRef.current) return;
        const html = quillRef.current.root.innerHTML;

        // Basic formatting logic
        const formattedHtml = formatHTML(html);
        setCodeOutput(formattedHtml);
        setShowCodeModal(true);

        // Use timeout to let DOM render before Prism highlight
        setTimeout(() => {
            const codeElement = document.querySelector('#codeOutput code');
            if (codeElement) Prism.highlightElement(codeElement);
        }, 100);
    };

    function formatHTML(html) {
        let formatted = '';
        let indent = '';
        const tab = '    ';
        html.split(/>\s*</).forEach(function (element) {
            if (element.match(/^\/\w/)) {
                indent = indent.substring(tab.length);
            }
            formatted += indent + '<' + element + '>\r\n';
            if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("input") && !element.startsWith("img") && !element.startsWith("br")) {
                indent += tab;
            }
        });
        return formatted.substring(1, formatted.length - 3);
    }

    const copyCode = () => {
        navigator.clipboard.writeText(codeOutput).then(() => {
            showToast('HTML code copied to clipboard');
        });
    };

    const downloadHtml = () => {
        const blob = new Blob([codeOutput], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className={`quill-wrapper ${theme === 'dark' ? 'dark-mode' : ''}`}>

            {/* Header */}
            <header className="editor-header">
                <div className="logo">
                    <PenTool size={20} />
                    Professional Editor
                </div>
                <div className="header-controls">
                    <button className="btn btn-primary" onClick={convertToCode}>
                        <Code size={16} /> Convert Text to Code
                    </button>
                    <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 5px' }}></div>
                    <button className="btn btn-icon" onClick={toggleTheme} title="Toggle Dark Mode">
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button className="btn btn-icon" onClick={toggleFullscreen} title="Fullscreen">
                        {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                    </button>
                    <button className="btn btn-icon" onClick={handleClear} title="Clear All">
                        <Trash2 size={18} />
                    </button>
                    <button className="btn" onClick={handleSave} title="Save Content">
                        <Save size={18} /> Save
                    </button>
                </div>
            </header>

            {/* Editor Container */}
            <div className={`editor-container ${isFullscreen ? 'fullscreen' : ''}`} style={isFullscreen ? { zIndex: 9999 } : {}}>
                <div ref={editorRef} style={{ border: 'none' }}></div>
            </div>

            {/* Status Bar */}
            <div className="stats-bar">
                <div className="stats-group">
                    <span>{wordCount} words</span>
                    <span>{charCount} characters</span>
                </div>
                <div className="stats-group">
                    <span>{lastSaved}</span>
                </div>
            </div>

            {/* View Code Modal */}
            {showCodeModal && (
                <div className="modal-overlay" onClick={(e) => {
                    if (e.target.className === 'modal-overlay') setShowCodeModal(false);
                }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3><FileCode size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Generated HTML Code</h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="btn" onClick={copyCode}>
                                    <Copy size={16} /> Copy HTML
                                </button>
                                <button className="btn" onClick={downloadHtml}>
                                    <Download size={16} /> Download .html
                                </button>
                                <button className="btn btn-icon" onClick={() => setShowCodeModal(false)}>
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body">
                            <pre className="code-output" id="codeOutput" style={{ margin: 0, padding: '20px' }}>
                                <code className="language-html">{codeOutput}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            <div className={`toast ${toastMessage.show ? 'show' : ''}`} style={{
                borderLeftColor: toastMessage.type === 'error' ? 'var(--error-color)' : 'var(--primary-color)'
            }}>
                {toastMessage.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                <span>{toastMessage.message}</span>
            </div>

        </div>
    );
};

export default QuillEditor;
