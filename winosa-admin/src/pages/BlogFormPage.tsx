import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Image, Plus, X, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { blogService } from '../services/blogService';
import RichTextEditor from '../components/editor/RichTextEditor';

const BLOG_CATEGORIES = [
  'Insight',
  'Design',
  'Tech',
  'Tutorial',
  'News',
  'Case Study',
];

const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// ─── Shared UI ────────────────────────────────────────────────────────────────

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-5 space-y-4">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
    {children}
  </div>
);

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode; hint?: string }> = ({
  label, required, children, hint,
}) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-dark">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
);

const inputClass =
  'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors';

// ─── Main Component ───────────────────────────────────────────────────────────

const BlogFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Insight',
    tags: [] as string[],
  });

  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [imageUploading, setImageUploading] = useState(false);

  // ── Fetch existing blog ──────────────────────────────────────────────────

  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      try {
        const res = await blogService.getById(id);
        const b = res.data;
        if (!b) throw new Error('No data');

        const rawTags: string[] = Array.isArray(b.tags) ? b.tags : [];
        const [cat, ...restTags] = rawTags;

        setForm({
          title: b.title || '',
          slug: b.slug || '',
          excerpt: b.excerpt || '',
          content: b.content || '',
          author: b.author || '',
          category: cat || 'Insight',
          tags: restTags,
        });
        setImageUrl(b.image || '');
        setImagePreview(b.image || null);
        setSlugManual(true);
      } catch {
        toast.error('Failed to load blog');
        navigate('/blogs');
      } finally {
        setFetching(false);
      }
    };
    fetchBlog();
  }, [id, navigate]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setImageUploading(true);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('admin/upload', fd);
      const url = res.data.data?.url || res.data.url;
      setImageUrl(url);
      toast.success('Image uploaded');
    } catch {
      toast.error('Image upload failed');
      setImagePreview(null);
    } finally {
      setImageUploading(false);
      e.target.value = '';
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, t] }));
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  // ── Validation ───────────────────────────────────────────────────────────

  const validate = (isPublished: boolean): boolean => {
    if (!form.title.trim()) {
      toast.error('Title wajib diisi');
      return false;
    }
    if (!form.slug.trim()) {
      toast.error('Slug wajib diisi');
      return false;
    }
    if (!form.author.trim()) {
      toast.error('Author wajib diisi');
      return false;
    }
    if (!form.content.trim() || form.content === '<p></p>' || form.content === '<p><br></p>') {
      toast.error('Content wajib diisi');
      return false;
    }
    if (isPublished && !imageUrl) {
      toast.error('Featured image wajib diisi sebelum publish');
      return false;
    }
    return true;
  };

  const handleSubmit = async (isPublished: boolean) => {
    if (!validate(isPublished)) return;

    const allTags = [form.category, ...form.tags].filter(Boolean);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      content: form.content,
      excerpt: form.excerpt.trim(),
      author: form.author.trim(),
      tags: allTags,
      image: imageUrl,
      isPublished,
    };

    setLoading(true);
    try {
      if (isEdit && id) {
        await blogService.update(id, payload);
        toast.success(isPublished ? 'Blog updated & published!' : 'Draft updated!');
      } else {
        await blogService.create(payload);
        toast.success(isPublished ? 'Blog published!' : 'Saved as draft!');
      }
      navigate('/blogs');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────

  if (fetching) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="w-32 h-6 bg-gray-200 rounded-full" />
        <div className="w-1/3 h-10 bg-gray-200 rounded-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="w-full h-12 bg-gray-100 rounded-2xl" />)}
            <div className="w-full h-64 bg-gray-100 rounded-2xl" />
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => <div key={i} className="w-full h-12 bg-gray-100 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/blogs')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark transition-colors group mb-4"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Blogs
        </button>
        <h1 className="text-4xl font-display font-bold text-dark">
          {isEdit ? 'Edit Blog' : 'Add Blog'}
        </h1>
        <p className="text-gray-400 text-sm mt-1 italic">
          {isEdit ? 'Update existing blog post' : 'Write and publish a new blog post'}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ── Left: 2/3 ──────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          <Card title="Basic Info">
            <Field label="Title" required>
              <input
                type="text"
                placeholder="e.g. How We Built Winosa"
                value={form.title}
                onChange={e => {
                  const title = e.target.value;
                  setForm(prev => ({
                    ...prev,
                    title,
                    slug: slugManual ? prev.slug : generateSlug(title),
                  }));
                }}
                className={inputClass}
              />
            </Field>

            <Field label="Slug" required>
              <input
                type="text"
                placeholder="how-we-built-winosa"
                value={form.slug}
                onChange={e => {
                  setSlugManual(true);
                  setForm(prev => ({ ...prev, slug: e.target.value }));
                }}
                className={inputClass}
              />
            </Field>

            <Field label="Excerpt" hint={`${form.excerpt.length} / 200 chars recommended`}>
              <textarea
                placeholder="Short summary shown on blog list..."
                value={form.excerpt}
                onChange={e => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className={inputClass + ' resize-none'}
              />
            </Field>
          </Card>

          <Card title="Content">
            <Field label="Body" required>
              <RichTextEditor
                content={form.content}
                onChange={html => setForm(prev => ({ ...prev, content: html }))}
                minHeight="450px"
              />
            </Field>
          </Card>

        </div>

        {/* ── Right: 1/3 ─────────────────────────────────────────────── */}
        <div className="space-y-5 lg:sticky lg:top-6">

          <Card title="Publishing">
            <Field label="Author" required>
              <input
                type="text"
                placeholder="Author name"
                value={form.author}
                onChange={e => setForm(prev => ({ ...prev, author: e.target.value }))}
                className={inputClass}
              />
            </Field>

            <Field label="Category">
              <select
                value={form.category}
                onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                className={inputClass}
              >
                {BLOG_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </Field>

            <Field label="Additional Tags">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') { e.preventDefault(); addTag(); }
                  }}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="w-12 h-12 border border-gray-200 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
                >
                  <Plus size={14} />
                </button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.tags.map(tag => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                    >
                      <Tag size={10} />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-0.5 text-gray-400 hover:text-red-500"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </Field>
          </Card>

          <Card title="Featured Image">
            <Field label="Thumbnail" hint={imageUrl ? undefined : 'Wajib diisi saat publish'}>
              <div
                onClick={() => !imageUploading && fileRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:border-dark transition-colors group"
              >
                {imagePreview ? (
                  <div>
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="w-full h-40 object-cover"
                    />
                    <div className="px-3 py-2 bg-gray-50">
                      {imageUploading ? (
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                          <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          Uploading...
                        </div>
                      ) : (
                        <p className="text-xs text-center text-gray-400 italic">Click to change</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-gray-400 group-hover:text-dark transition-colors py-8 px-4">
                    <Image size={28} />
                    <p className="text-xs italic text-center">Featured image for the blog post</p>
                    <span className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs flex items-center gap-1.5">
                      <Upload size={11} />
                      Upload Image
                    </span>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {imageUrl && !imageUploading && (
                <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Image ready
                </p>
              )}
            </Field>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading || imageUploading}
              className="w-full py-3 bg-dark text-white rounded-2xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Post' : 'Publish'}
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="w-full py-3 bg-gray-100 text-gray-600 rounded-2xl text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Save as Draft
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BlogFormPage;