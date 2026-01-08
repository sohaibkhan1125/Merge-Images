import { useState, useEffect } from 'react';
import { Calendar, User, ArrowLeft, Loader2 } from 'lucide-react';
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

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = blogService.subscribeToBlogs((blogs) => {
      setBlogs(blogs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      <Header />

      {/* Spacer to offset fixed header */}
      <div aria-hidden="true" className="h-20 md:h-24" />

      <div className="relative z-10 pb-16 px-6">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <a
              href="/"
              onClick={(e) => navigate(e, '/')}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </a>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
              Our Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover insights, tutorials, and updates from our team.
            </p>
          </div>

          {/* Blog Posts Grid */}
          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No blog posts yet</h3>
              <p className="text-gray-600">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <a
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer block"
                  onClick={(e) => navigate(e, `/blog/${blog.slug}`)}
                >
                  {blog.thumbnailUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={blog.thumbnailUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(blog.createdAt?.toDate?.() || blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h2>
                    {blog.description && (
                      <p className="text-gray-600 line-clamp-3 mb-4">
                        {blog.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-600 font-medium group-hover:text-blue-800">
                        Read more →
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Blog;
