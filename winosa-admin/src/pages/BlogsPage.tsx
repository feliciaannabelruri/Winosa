import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Trash2, Edit2, FileText, Eye, EyeOff, Save, LayoutTemplate, MessageCircle } from 'lucide-react';
import { blogService } from '../services/blogService';
import { Blog } from '../types';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import { useTranslation } from 'react-i18next'; 

type FilterType  = 'all' | 'draft' | 'published';
type SectionType = 'articles' | 'hero';

interface BlogPageContent {
  heroLabel: string; heroTitle: string; heroDescription: string;
}

const DEFAULT_BLOG_CONTENT: BlogPageContent = {
  heroLabel: 'Our Blog', heroTitle: 'Insights & Digital Ideas',
  heroDescription: 'Explore articles, insights, and updates from our team.',
};

const LIMITS: Record<keyof BlogPageContent, number> = {
  heroLabel: 40, heroTitle: 80, heroDescription: 220,
};

const truncateWords = (str: string, n = 5): string => {
  const w = str.trim().split(/\s+/);
  return w.length > n ? w.slice(0, n).join(' ') + '...' : str;
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

const BlogsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); 

  const [blogs, setBlogs]             = useState<Blog[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [filter, setFilter]           = useState<FilterType>('all');
  const [section, setSection]         = useState<SectionType>('articles');
  const [totalStats, setTotalStats]   = useState({ total: 0, published: 0, draft: 0 });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null; loading: boolean }>({ open: false, id: null, loading: false });
  const [blogContent, setBlogContent]     = useState<BlogPageContent>(DEFAULT_BLOG_CONTENT);
  const [savedHero, setSavedHero]         = useState<BlogPageContent>(DEFAULT_BLOG_CONTENT);
  const [savingContent, setSavingContent] = useState(false);
  const [heroErrors, setHeroErrors]       = useState<Record<string, boolean>>({});

  const isDirty =
    blogContent.heroLabel !== savedHero.heroLabel ||
    blogContent.heroTitle !== savedHero.heroTitle ||
    blogContent.heroDescription !== savedHero.heroDescription;

  const filteredBlogs = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    (b.author || '').toLowerCase().includes(search.toLowerCase())
  );

  const getCategory = (blog: Blog) => blog.tags?.[0] || '—';

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {};
      if (filter === 'published') params.isPublished = true;
      if (filter === 'draft')     params.isPublished = false;
      const data = await blogService.getAll({ ...params, limit: 100 });
      setBlogs(data.data);
      setTotalStats({
        total: data.total,
        published: data.data.filter((b: any) =>  b.isPublished).length,
        draft:     data.data.filter((b: any) => !b.isPublished).length,
      });
    } catch {
      toast.error(t('blog_load_error')); 
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);
  useEffect(() => { const id = setInterval(fetchBlogs, 30_000); return () => clearInterval(id); }, [fetchBlogs]);

  useEffect(() => {
    const fetchBlogContent = async () => {
      try {
        const res = await blogService.getBlogPageContent();
        if (res) { const merged = { ...DEFAULT_BLOG_CONTENT, ...res }; setBlogContent(merged); setSavedHero(merged); }
      } catch {
        toast.error(t('blog_content_load_error')); 
      }
    };
    fetchBlogContent();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    setDeleteModal(prev => ({ ...prev, loading: true }));
    try {
      await blogService.delete(deleteModal.id);
      toast.success(t('blog_delete_success')); 
      setDeleteModal({ open: false, id: null, loading: false });
      fetchBlogs();
    } catch {
      toast.error(t('blog_delete_error')); 
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleSaveContent = async () => {
    const errors: Record<string, boolean> = {};
    if (!blogContent.heroLabel.trim())       errors.heroLabel       = true;
    if (!blogContent.heroTitle.trim())       errors.heroTitle       = true;
    if (!blogContent.heroDescription.trim()) errors.heroDescription = true;
    setHeroErrors(errors);
    if (Object.keys(errors).length) { toast.error(t('validation_required')); return; } 
    setSavingContent(true);
    try {
      await blogService.updateBlogPageContent(blogContent);
      setSavedHero(blogContent);
      toast.success(t('blog_hero_updated')); 
    } catch {
      toast.error(t('blog_hero_update_error')); 
    } finally {
      setSavingContent(false);
    }
  };

  const onHeroChange = (key: keyof BlogPageContent, val: string) => {
    if (val.length > LIMITS[key]) return;
    if (val.trim()) setHeroErrors(p => ({ ...p, [key]: false }));
    setBlogContent(prev => ({ ...prev, [key]: val }));
  };

  const FILTER_LABELS: Record<FilterType, string> = {
    all: t('blog_filter_all'), published: t('published'), draft: t('draft'),
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-dark">{t('blog')}</h1> 
        <p className="text-gray-400 text-sm mt-1 italic">{t('blog_subtitle')}</p> 
      </div>

      {/* Tabs */}
      <div className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-1.5 shadow-sm">
        {([
          { id: 'articles', label: t('blog_articles'), icon: FileText },     
          { id: 'hero',     label: t('blog_page_hero'), icon: LayoutTemplate }, 
        ] as const).map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setSection(id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${section === id ? 'bg-dark text-white shadow-sm' : 'text-gray-500 hover:text-dark'}`}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {section === 'articles' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: t('blog_total'),     value: totalStats.total,                         color: 'bg-gray-100 text-gray-700'    }, 
              { label: t('published'),      value: blogs.filter(b =>  b.isPublished).length, color: 'bg-green-50 text-green-700'   }, 
              { label: t('draft'),          value: blogs.filter(b => !b.isPublished).length, color: 'bg-yellow-50 text-yellow-700' }, 
            ].map(s => (
              <div key={s.label} className={`rounded-2xl px-5 py-4 ${s.color}`}>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs font-medium opacity-70 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button onClick={() => navigate('/blogs/new')} className="flex sm:hidden items-center gap-2 bg-primary hover:bg-primary-dark text-dark font-semibold px-6 py-3 rounded-full transition-all duration-200 text-sm w-fit">
              <Plus size={16} /> {t('blog_add')} {/* ← GANTI */}
            </button>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder={t('blog_search_placeholder')} value={search} 
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm outline-none focus:border-primary bg-white transition-colors" />
            </div>
            <div className="flex flex-wrap gap-2">
              {(['all', 'published', 'draft'] as FilterType[]).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${filter === f ? 'bg-dark border-dark text-white shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                  {FILTER_LABELS[f]}
                </button>
              ))}
            </div>
            <button onClick={() => navigate('/blogs/new')} className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-dark text-dark font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md text-sm w-fit ml-auto">
              <Plus size={16} /> {t('blog_add')} {/* ← GANTI */}
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {/* ← GANTI header tabel */}
                    {['No.', t('image'), t('title'), t('blog_author'), t('blog_category'), t('status'), t('blog_comments_col'), t('date'), t('actions')].map(h => (
                      <th key={h} className="text-left text-[11px] font-semibold text-gray-500 py-3.5 px-4 first:pl-6 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={9} className="text-center py-16"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
                  ) : filteredBlogs.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-16 text-gray-400 text-sm">
                        {/* ← GANTI */}
                        {search ? `${t('blog_no_results')} "${search}"` : t('blog_empty')}
                      </td>
                    </tr>
                  ) : (
                    filteredBlogs.map((blog, idx) => (
                      <tr key={blog._id} className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'}`}>
                        <td className="py-4 px-4 pl-6 text-sm text-gray-400">{idx + 1}.</td>
                        <td className="py-4 px-4">
                          {blog.image ? <img src={blog.image} alt={blog.title} className="w-12 h-12 object-cover rounded-xl" /> : <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center"><FileText size={14} className="text-gray-300" /></div>}
                        </td>
                        <td className="py-4 px-4 max-w-[260px]">
                          <p className="text-sm font-semibold text-dark" title={blog.title}>{truncateWords(blog.title, 5)}</p>
                          {blog.excerpt && <p className="text-xs text-gray-400 truncate mt-1 max-w-[240px]">{blog.excerpt}</p>}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">{blog.author || '—'}</td>
                        <td className="py-4 px-4"><span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">{getCategory(blog)}</span></td>
                        <td className="py-4 px-4">
                          <span className={`flex items-center gap-1 w-fit px-2.5 py-1 rounded-full text-xs font-semibold ${blog.isPublished ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                            {blog.isPublished ? <Eye size={10} /> : <EyeOff size={10} />}
                            {blog.isPublished ? t('published') : t('draft')} {/* ← GANTI */}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button onClick={() => navigate(`/blogs/${blog._id}/comments`)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors">
                            <MessageCircle size={12} />{(blog as any).commentsCount ?? 0}
                          </button>
                        </td>
                        <td className="py-4 px-4 text-xs text-gray-500 whitespace-nowrap">{fmtDate(blog.createdAt)}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setDeleteModal({ open: true, id: blog._id, loading: false })} className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors"><Trash2 size={14} /></button>
                            <button onClick={() => navigate(`/blogs/edit/${blog._id}`)} className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-primary hover:bg-primary/10 hover:border-primary/30 transition-colors"><Edit2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Hero Section */}
      {section === 'hero' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-dark">{t('blog_hero_content')}</h2> {/* ← GANTI */}
            <p className="text-sm text-gray-400 mt-1">{t('blog_hero_subtitle')}</p> {/* ← GANTI */}
          </div>
          <div className="space-y-5">
            {[
              { key: 'heroLabel',       label: t('blog_hero_label'),       placeholder: 'e.g. Our Blog' },
              { key: 'heroTitle',       label: t('blog_hero_title'),       placeholder: 'e.g. Insights & Digital Ideas' },
              { key: 'heroDescription', label: t('blog_hero_description'), placeholder: 'e.g. Explore articles...' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
                  <span className={`text-xs ${blogContent[key as keyof BlogPageContent].length >= LIMITS[key as keyof BlogPageContent] ? 'text-red-400' : 'text-gray-400'}`}>
                    {blogContent[key as keyof BlogPageContent].length}/{LIMITS[key as keyof BlogPageContent]}
                  </span>
                </div>
                {key === 'heroDescription' ? (
                  <textarea rows={4} value={blogContent[key as keyof BlogPageContent]}
                    onChange={e => onHeroChange(key as keyof BlogPageContent, e.target.value)}
                    placeholder={placeholder}
                    className={`w-full border rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary resize-none transition-colors ${heroErrors[key] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                ) : (
                  <input type="text" value={blogContent[key as keyof BlogPageContent]}
                    onChange={e => onHeroChange(key as keyof BlogPageContent, e.target.value)}
                    placeholder={placeholder}
                    className={`w-full border rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors ${heroErrors[key] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                )}
                {heroErrors[key] && <p className="text-xs text-red-400 mt-1">{t('validation_field_required')}</p>} {/* ← GANTI */}
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <button onClick={handleSaveContent} disabled={!isDirty || savingContent}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all ${isDirty && !savingContent ? 'bg-dark text-white hover:bg-gray-800 cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                <Save size={15} />
                {savingContent ? t('saving') : t('blog_save_changes')} {/* ← GANTI */}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        title={t('blog_delete_title')} 
        message={t('blog_delete_message')} 
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, loading: false })}
        loading={deleteModal.loading}
      />
    </div>
  );
};

export default BlogsPage;