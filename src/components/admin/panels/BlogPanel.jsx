import { useState, useEffect, useRef } from 'react';
import QuillEditor from './QuillEditor';
import { FileText, Upload, Save, Trash2, Eye, Edit3, AlertTriangle, Loader2 } from 'lucide-react';
import blogService from '../../../services/blogService';

function BlogPanel() {
  const [blogs, setBlogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    thumbnail: null,
    thumbnailUrl: ''
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const quillEditorKey = useRef(0);

  // Load blogs from Firebase on component mount
  useEffect(() => {
    const unsubscribe = blogService.subscribeToBlogs((blogs) => {
      setBlogs(blogs);
    });

    return () => unsubscribe();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showToast('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.', 'error');
        return;
      }

      // Show compression progress for large files
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setCompressing(true);
        showToast('Large image detected. Compressing for optimal upload...', 'success');
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          thumbnail: file,
          thumbnailUrl: e.target.result
        }));
        setCompressing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast('Blog title is required', 'error');
      return;
    }

    if (!formData.content.trim()) {
      showToast('Blog content is required', 'error');
      return;
    }

    setPublishing(true);

    try {
      const blogData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: formData.content,
        thumbnailFile: formData.thumbnail,
        thumbnailURL: formData.thumbnailUrl
      };

      if (editingBlog) {
        await blogService.updateBlog(editingBlog.id, blogData);
        showToast('Blog updated successfully! Your changes are now live on the website.');
      } else {
        await blogService.createBlog(blogData);
        showToast('Blog published successfully! Your new blog post is now live on the website.');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        content: '',
        thumbnail: null,
        thumbnailUrl: ''
      });
      setIsEditing(false);
      setEditingBlog(null);
      setPreviewMode(false);
      quillEditorKey.current += 1; // Force re-render Quill editor
    } catch (error) {
      console.error('Error saving blog:', error);
      showToast(error.message || 'Failed to save blog post', 'error');
    } finally {
      setPublishing(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      description: blog.description,
      content: blog.content,
      thumbnail: null,
      thumbnailUrl: blog.thumbnailUrl
    });
    setIsEditing(true);
    setPreviewMode(false);
    quillEditorKey.current += 1; // Force re-render Quill editor with new content
  };

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      setLoading(true);
      try {
        await blogService.deleteBlog(blogId);
        showToast('Blog deleted successfully!');
      } catch (error) {
        console.error('Error deleting blog:', error);
        showToast(error.message || 'Failed to delete blog post', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      thumbnail: null,
      thumbnailUrl: ''
    });
    setIsEditing(false);
    setEditingBlog(null);
    setPreviewMode(false);
    quillEditorKey.current += 1; // Force re-render Quill editor
  };

  const handleClearOldBlogs = async () => {
    if (window.confirm('This will delete all but the 10 most recent blog posts. Continue?')) {
      setLoading(true);
      try {
        const recentBlogs = blogs
          .sort((a, b) => new Date(b.createdAt?.toDate?.() || b.createdAt) - new Date(a.createdAt?.toDate?.() || a.createdAt))
          .slice(0, 10);

        // Delete old blogs
        const deletePromises = blogs
          .filter(blog => !recentBlogs.find(recent => recent.id === blog.id))
          .map(blog => blogService.deleteBlog(blog.id));

        await Promise.all(deletePromises);
        showToast('Old blog posts cleared successfully!');
      } catch (error) {
        console.error('Error clearing old blogs:', error);
        showToast(error.message || 'Failed to clear old blog posts', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleQuillSave = async (content) => {
    setFormData(prev => ({ ...prev, content }));
    return true;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog Management</h2>
        <p className="text-gray-600">Create and manage your blog posts with rich text editing. All data is stored securely in Firebase.</p>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}>
          {toast.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  {previewMode ? 'Edit' : 'Preview'}
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Blog Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter blog title..."
                  required
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter a brief description..."
                />
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail Image
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                    id="thumbnail-upload"
                    disabled={compressing}
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg transition-colors ${compressing
                        ? 'bg-gray-100 cursor-not-allowed text-gray-500'
                        : 'hover:bg-gray-50 cursor-pointer'
                      }`}
                  >
                    {compressing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Compressing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Choose Image
                      </>
                    )}
                  </label>
                  {formData.thumbnailUrl && (
                    <div className="relative">
                      <img
                        src={formData.thumbnailUrl}
                        alt="Thumbnail preview"
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      {compressing && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {formData.thumbnail && (
                  <div className="mt-2 text-xs text-gray-500">
                    File size: {(formData.thumbnail.size / 1024 / 1024).toFixed(2)} MB
                    {formData.thumbnail.size > 5 * 1024 * 1024 && (
                      <span className="text-orange-600 ml-2">
                        (Will be compressed automatically)
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Content Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Content *
                  </label>
                  {formData.content && (
                    <span className="text-xs text-gray-500">
                      {Math.round(formData.content.length / 1024)}KB
                    </span>
                  )}
                </div>
                {previewMode ? (
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Content Preview</h4>
                    {formData.content ? (
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: formData.content }}
                      />
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-600 mb-2">No Content Added</h4>
                        <p className="text-gray-500">Switch to Edit Mode to add blog content.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full mt-4 rounded-lg border bg-white">
                    <QuillEditor
                      key={quillEditorKey.current}
                      initialContent={formData.content}
                      onSave={handleQuillSave}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={publishing || compressing}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                >
                  {publishing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Publishing...
                    </>
                  ) : compressing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Compressing Image...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {isEditing ? 'Update Blog' : 'Publish Blog'}
                    </>
                  )}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={publishing || compressing}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Published Blogs</h3>

            {blogs.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No blog posts yet. Create your first blog post!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {blogs.map((blog) => (
                  <div key={blog.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      {blog.thumbnailUrl && (
                        <img
                          src={blog.thumbnailUrl}
                          alt={blog.title}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{blog.title}</h4>
                        {blog.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{blog.description}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Published: {new Date(blog.createdAt?.toDate?.() || blog.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          disabled={loading}
                          className="p-2 text-red-600 hover:bg-red-50 disabled:text-red-300 disabled:cursor-not-allowed rounded-lg transition-colors"
                          title="Delete"
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPanel;
