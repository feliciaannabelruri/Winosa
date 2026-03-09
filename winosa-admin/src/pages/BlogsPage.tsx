import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Trash2, Edit2, FileText, Eye, EyeOff } from 'lucide-react';
import { blogService } from '../services/blogService';
import { Blog } from '../types';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

type FilterType = 'all' | 'draft' | 'published';

const BlogsPage: React.FC = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: string | null;
    loading: boolean;
  }>({ open: false, id: null, loading: false });

  // ── Fetch ────────────────────────────────────────────────────────────────

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {};
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

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // ── Delete ───────────────────────────────────────────────────────────────

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

  // ── Filtered ─────────────────────────────────────────────────────────────

  const filteredBlogs = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    (b.author || '').toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  // Category = tags[0]
  const getCategory = (blog: Blog) => blog.tags?.[0] || '—';

  // ── Stats ─────────────────────────────────────────────────────────────────

  const totalPublished = blogs.filter(b => b.isPublished).length;
  const totalDraft = blogs.filter(b => !b.isPublished).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-dark">Blog</h1>
          <p className="text-gray-400 text-sm mt-1 italic">
            Manage Winosa blog content
          </p>
        </div>
        <button
          onClick={() => navigate('/blogs/new')}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-dark font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md text-sm w-fit"
        >
          <Plus size={16} />
          Add Blog
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: blogs.length, color: 'bg-gray-100 text-gray-700' },
          { label: 'Published', value: totalPublished, color: 'bg-green-50 text-green-700' },
          { label: 'Draft', value: totalDraft, color: 'bg-yellow-50 text-yellow-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl px-5 py-4 ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium opacity-70 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm outline-none focus:border-primary bg-white transition-colors"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'published', 'draft'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 capitalize ${
                filter === f
                  ? 'bg-dark border-dark text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 py-3.5 px-4 pl-6 w-10 uppercase tracking-wide">
                  #
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 py-3.5 px-4 w-14 uppercase tracking-wide">
                  Image
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 py-3.5 px-4 uppercase tracking-wide">
                  Title
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 py-3.5 px-4 uppercase tracking-wide">
                  Author
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 py-3.5 px-4 uppercase tracking-wide">
                  Category
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 py-3.5 px-4 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 py-3.5 px-4 uppercase tracking-wide">
                  Date
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 py-3.5 px-4 uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-16 text-gray-400 text-sm"
                  >
                    {search ? `No blogs matching "${search}"` : 'No blogs found'}
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog, idx) => (
                  <tr
                    key={blog._id}
                    className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'
                    }`}
                  >
                    {/* # */}
                    <td className="py-4 px-4 pl-6 text-sm text-gray-400">
                      {idx + 1}.
                    </td>

                    {/* Image */}
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

                    {/* Title + excerpt */}
                    <td className="py-4 px-4 max-w-[220px]">
                      <p className="text-sm font-semibold text-dark truncate">
                        {blog.title}
                      </p>
                      {blog.excerpt && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {blog.excerpt}
                        </p>
                      )}
                    </td>

                    {/* Author */}
                    <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">
                      {blog.author || '—'}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                        {getCategory(blog)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`flex items-center gap-1 w-fit px-2.5 py-1 rounded-full text-xs font-semibold ${
                          blog.isPublished
                            ? 'bg-green-50 text-green-600'
                            : 'bg-yellow-50 text-yellow-600'
                        }`}
                      >
                        {blog.isPublished ? (
                          <Eye size={10} />
                        ) : (
                          <EyeOff size={10} />
                        )}
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(blog.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setDeleteModal({
                              open: true,
                              id: blog._id,
                              loading: false,
                            })
                          }
                          className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button
                          onClick={() => navigate(`/blogs/edit/${blog._id}`)}
                          className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-primary hover:bg-primary/10 hover:border-primary/30 transition-colors"
                          title="Edit"
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
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteModal({ open: false, id: null, loading: false })
        }
        loading={deleteModal.loading}
      />
    </div>
  );
};

export default BlogsPage;