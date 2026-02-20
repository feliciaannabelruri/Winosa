import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Trash2, Edit2, Image } from 'lucide-react';
import { blogService } from '../services/blogService';
import { Blog } from '../types';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import BlogFormModal from '../components/BlogFormModal';

type FilterType = 'all' | 'draft' | 'published';

const BlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null; loading: boolean }>({
    open: false, id: null, loading: false
  });
  const [formModal, setFormModal] = useState<{ open: boolean; blog: Blog | null }>({
    open: false, blog: null
  });

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filter === 'published') params.isPublished = true;
      if (filter === 'draft') params.isPublished = false;
      const data = await blogService.getAll(params);
      setBlogs(data.data);
    } catch {
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    setDeleteModal(prev => ({ ...prev, loading: true }));
    try {
      await blogService.delete(deleteModal.id);
      toast.success('Blog deleted');
      setDeleteModal({ open: false, id: null, loading: false });
      fetchBlogs();
    } catch {
      toast.error('Delete failed');
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  const filteredBlogs = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit', month: '2-digit', year: '2-digit'
    });
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark">Blog</h1>
          <p className="text-gray-400 text-sm mt-1 italic">Manage Winosa blog content</p>
        </div>
        <button
          onClick={() => setFormModal({ open: true, blog: null })}
          className="flex items-center gap-2 bg-primary text-dark font-semibold px-5 py-3 rounded-2xl hover:bg-primary-dark transition-colors shadow-sm text-sm"
        >
          <Plus size={16} />
          Add Blog
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            placeholder="Search Blog Title"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm outline-none focus:border-primary w-52 bg-white"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'draft', 'published'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors capitalize ${
                filter === f
                  ? 'border-dark bg-dark text-white'
                  : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['No.', 'Image', 'Title', 'Category', 'Date', 'Author', 'Action'].map(h => (
                <th key={h} className="text-left text-sm font-semibold text-dark py-4 px-5 first:pl-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            ) : filteredBlogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                  No blogs found
                </td>
              </tr>
            ) : (
              filteredBlogs.map((blog, idx) => (
                <tr key={blog._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="py-4 px-5 pl-6 text-sm text-gray-600">{idx + 1}.</td>
                  <td className="py-4 px-5">
                    {blog.image ? (
                      <img src={blog.image} alt={blog.title} className="w-12 h-10 object-cover rounded-lg" />
                    ) : (
                      <div className="w-12 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Image size={14} className="text-gray-300" />
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-5 text-sm text-dark font-medium max-w-[200px] truncate">{blog.title}</td>
                  <td className="py-4 px-5 text-sm text-gray-500">{blog.tags?.[0] || 'Insight'}</td>
                  <td className="py-4 px-5 text-sm text-gray-500">{formatDate(blog.createdAt)}</td>
                  <td className="py-4 px-5 text-sm text-gray-500">{blog.author || '—'}</td>
                  <td className="py-4 px-5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDeleteModal({ open: true, id: blog._id, loading: false })}
                        className="w-8 h-8 border border-red-200 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        onClick={() => setFormModal({ open: true, blog })}
                        className="w-8 h-8 border border-yellow-200 rounded-lg flex items-center justify-center text-yellow-500 hover:bg-yellow-50 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Blog"
        message="Are you sure you want to delete this blog? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, loading: false })}
        loading={deleteModal.loading}
      />

      <BlogFormModal
        isOpen={formModal.open}
        blog={formModal.blog}
        onClose={() => setFormModal({ open: false, blog: null })}
        onSuccess={() => { setFormModal({ open: false, blog: null }); fetchBlogs(); }}
      />
    </div>
  );
};

export default BlogsPage;
