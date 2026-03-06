import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Trash2, Edit2, FileText } from 'lucide-react';
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
    open: false, id: null, loading: false,
  });
  const [formModal, setFormModal] = useState<{ open: boolean; blog: Blog | null }>({
    open: false, blog: null,
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

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-dark">Blog</h1>
          <p className="text-gray-400 text-sm mt-1 italic">Manage Winosa blog content</p>
        </div>
        <button
          onClick={() => setFormModal({ open: true, blog: null })}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-dark font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md text-sm w-fit"
        >
          <Plus size={16} />
          Add Blog
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search Blog Title"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm outline-none focus:border-primary bg-white transition-colors"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'draft', 'published'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 capitalize ${
              filter === f
                ? 'bg-dark border-dark text-white shadow-sm'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table — scrollable on mobile */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-sm font-semibold text-dark py-4 px-4 pl-6 w-10">No.</th>
                <th className="text-left text-sm font-semibold text-dark py-4 px-4 w-16">Image</th>
                <th className="text-left text-sm font-semibold text-dark py-4 px-4">Title</th>
                <th className="text-left text-sm font-semibold text-dark py-4 px-4">Category</th>
                <th className="text-left text-sm font-semibold text-dark py-4 px-4">Date</th>
                <th className="text-left text-sm font-semibold text-dark py-4 px-4">Author</th>
                <th className="text-left text-sm font-semibold text-dark py-4 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400 text-sm">
                    No blogs found
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog, idx) => (
                  <tr
                    key={blog._id}
                    className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="py-4 px-4 pl-6 text-sm text-gray-500">{idx + 1}.</td>
                    <td className="py-4 px-4">
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-12 h-10 object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-12 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                          <FileText size={14} className="text-gray-300" />
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-dark font-medium max-w-[180px]">
                      <p className="truncate">{blog.title}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">
                      {blog.tags?.[0] || 'Insight'}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(blog.createdAt)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">
                      {blog.author || '—'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDeleteModal({ open: true, id: blog._id, loading: false })}
                          className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button
                          onClick={() => setFormModal({ open: true, blog })}
                          className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-primary hover:bg-primary/10 hover:border-primary/30 transition-colors"
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