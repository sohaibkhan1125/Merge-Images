import { useState, useEffect } from 'react';
import { Calendar, User, ArrowLeft, Share2, Loader2 } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import blogService from '../services/blogService';

const navigate = (e, to) => {
  if (!to) return;
  e.preventDefault();
  if (window.location.pathname !== to) {
    window.history.pushState({}, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
};

function BlogPost() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    const slug = path.split('/blog/')[1];

    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const loadBlog = async () => {
      try {
        const foundBlog = await blogService.getBlogBySlug(slug);

        if (foundBlog) {
          setBlog(foundBlog);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Failed to load blog:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.description,
          url: window.location.href,
        });
      } catch (err) {
        // Silently fail share or use native fallback
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
        <Header />
        <div aria-hidden="true" className="h-20 md:h-24" />

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={(e) => navigate(e, '/blog')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      <Header />

      {/* Spacer to offset fixed header */}
      <div aria-hidden="true" className="h-20 md:h-24" />

      <div className="relative z-10 pb-16 px-6">
        <div className="mx-auto max-w-4xl">
          {/* Navigation */}
          <div className="mb-8">
            <button
              onClick={(e) => navigate(e, '/blog')}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </button>
          </div>

          {/* Article */}
          <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Featured Image */}
            {blog.thumbnailUrl && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={blog.thumbnailUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8 md:p-12">
              {/* Article Header */}
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {blog.title}
                </h1>

                {blog.description && (
                  <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                    {blog.description}
                  </p>
                )}

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(blog.createdAt?.toDate?.() || blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                      <div className="flex items-center gap-2">
                        <span>Updated: {new Date(blog.updatedAt?.toDate?.() || blog.updatedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </header>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </div>
            </div>
          </article>

          {/* Related Posts or Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enjoyed this post?</h3>
              <p className="text-gray-600 mb-6">
                Check out more articles on our blog for more insights and updates.
              </p>
              <button
                onClick={(e) => navigate(e, '/blog')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                View All Posts
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default BlogPost;
