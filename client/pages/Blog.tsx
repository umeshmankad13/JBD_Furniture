import { useState, useEffect } from 'react';
import { Footer } from '@/components/Footer';
import { ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';

const categoryIcons = {
  'Care Tips': <span className="text-green-500">🧽</span>,
  'Design Trends': <span className="text-pink-500">🎨</span>,
  'Material Guides': <span className="text-yellow-500">🪵</span>,
};

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        if (data.success) setBlogs(data.blogs);
        else setError(data.error || 'Failed to fetch blogs');
      })
      .catch(() => setError('Failed to fetch blogs'))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = (id) => setExpanded(expanded === id ? null : id);

  // Featured = first blog (if any)
  const featured = blogs.length > 0 ? blogs[0] : null;
  const rest = blogs.length > 1 ? blogs.slice(1) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80" alt="Blog Hero" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-700/60 to-blue-400/60" />
        <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg animate-fade-in-up">JBD Blog & Tips</h1>
          <p className="text-2xl text-blue-100 mb-8 animate-fade-in-up">Furniture care, design inspiration, and material know-how from the experts at JBD Furniture.</p>
          <a href="#posts" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-yellow-400 text-blue-900 font-bold shadow-lg hover:bg-yellow-300 transition-all duration-300 animate-fade-in-up">
            Explore Articles <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 py-12" id="posts">
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-10">
          {loading ? (
            <div className="text-center text-blue-500 py-8">Loading blogs...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : blogs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No blogs found.</div>
          ) : (
            <>
              {/* Featured Post */}
              {featured && (
                <div className="relative bg-gradient-to-br from-yellow-100 via-white to-blue-50 rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 hover:shadow-yellow-300/40 transition-shadow duration-300 border-2 border-yellow-200">
                  <img src={featured.image} alt={featured.title} className="w-full md:w-72 h-56 object-cover rounded-2xl shadow-lg mb-6 md:mb-0" />
                  <div className="flex-1">
                    <div className="text-xs text-yellow-600 mb-2">{featured.date ? new Date(featured.date).toLocaleDateString() : ''}</div>
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">{featured.title}</h2>
                    <p className="text-blue-700 mb-4 text-lg">{featured.summary}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {featured.tags && featured.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-yellow-200 text-yellow-900 text-xs font-semibold">#{tag}</span>
                      ))}
                    </div>
                    <div className={`overflow-hidden transition-all duration-500 ${expanded === featured._id ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                      <div className="text-blue-800 text-base whitespace-pre-line">{featured.content}</div>
                    </div>
                    <button onClick={() => handleToggle(featured._id)} className="mt-4 px-6 py-2 rounded-full bg-blue-900 text-white font-semibold shadow-lg transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center gap-2">
                      {expanded === featured._id ? 'Show Less' : 'Read More'} {expanded === featured._id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}
              {/* Other Posts */}
              <div className="grid md:grid-cols-2 gap-8">
                {rest.map(post => (
                  <div key={post._id} className="relative bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-between hover:shadow-blue-300/40 hover:-translate-y-1 transition-all duration-300 border border-blue-100 group">
                    <img src={post.image} alt={post.title} className="w-full h-40 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-500" />
                    <div className="text-xs text-blue-400 mb-2">{post.date ? new Date(post.date).toLocaleDateString() : ''}</div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">{post.title}</h2>
                    <p className="text-blue-700 mb-4">{post.summary}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags && post.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">#{tag}</span>
                      ))}
                    </div>
                    <div className={`overflow-hidden transition-all duration-500 ${expanded === post._id ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                      <div className="text-blue-800 text-base whitespace-pre-line">{post.content}</div>
                    </div>
                    <button onClick={() => handleToggle(post._id)} className="mt-4 px-6 py-2 rounded-full bg-blue-900 text-white font-semibold shadow-lg transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center gap-2">
                      {expanded === post._id ? 'Show Less' : 'Read More'} {expanded === post._id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        {/* Sidebar for categories/tags */}
        <aside className="w-full md:w-72 bg-gradient-to-br from-blue-50 via-white to-yellow-50 rounded-2xl shadow-xl p-8 h-fit border border-blue-100 flex flex-col gap-6">
          <h3 className="text-xl font-bold text-blue-900 mb-2 flex items-center gap-2">Categories</h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-2 text-blue-700 text-base font-medium">{categoryIcons['Care Tips']} Care Tips</li>
            <li className="flex items-center gap-2 text-blue-700 text-base font-medium">{categoryIcons['Design Trends']} Design Trends</li>
            <li className="flex items-center gap-2 text-blue-700 text-base font-medium">{categoryIcons['Material Guides']} Material Guides</li>
          </ul>
          <div className="mt-8">
            <h4 className="text-blue-900 font-semibold mb-2">About This Blog</h4>
            <p className="text-blue-700 text-sm">Get expert advice, inspiration, and the latest trends in furniture and interiors. Updated monthly by the JBD team.</p>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
} 