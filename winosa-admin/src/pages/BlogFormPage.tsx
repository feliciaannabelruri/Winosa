import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, ImageIcon, Plus, X, Tag, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { blogService } from '../services/blogService';
import RichTextEditor from '../components/editor/RichTextEditor';

const BLOG_CATEGORIES = ['Insight', 'Design', 'Tech', 'Tutorial', 'News', 'Case Study'];

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-5 space-y-4">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
    {children}
  </div>
);

const Field: React.FC<{
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, required, hint, children }) => (
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

/* Page */
const BlogFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id }   = useParams<{ id: string }>();
  const isEdit   = !!id;
  const fileRef  = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title:    '',
    slug:     '',
    excerpt:  '',
    content:  '',
    author:   '',
    category: 'Insight',
    tags:     [] as string[],
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });

  const [imageUrl,      setImageUrl]      = useState('');
  const [imagePreview,  setImagePreview]  = useState<string | null>(null);
  const [tagInput,      setTagInput]      = useState('');
  const [slugManual,    setSlugManual]    = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [fetching,      setFetching]      = useState(isEdit);
  const [imageUploading, setImageUploading] = useState(false);

  /* Fetch (edit mode) */
  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      try {
        const res = await blogService.getById(id);
        const b   = res.data;
        if (!b) throw new Error('Data tidak ditemukan');

        const rawTags: string[] = Array.isArray(b.tags) ? b.tags : [];
        const [cat, ...restTags] = rawTags;

        setForm({
          title:    b.title   || '',
          slug:     b.slug    || '',
          excerpt:  b.excerpt || '',
          content:  b.content || '',
          author:   b.author  || '',
          category: cat       || 'Insight',
          tags:     restTags,
          metaTitle: b.metaTitle || '',
          metaDescription: b.metaDescription || '',
          metaKeywords: b.metaKeywords || '',
        });
        setImageUrl(b.image    || '');
        setImagePreview(b.image || null);
        setSlugManual(true);
      } catch {
        toast.error('Gagal memuat data blog');
        navigate('/blogs');
      } finally {
        setFetching(false);
      }
    };
    fetchBlog();
  }, [id, navigate]);

  /* Image upload */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setImageUploading(true);

    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/admin/upload?folder=blog', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data.data?.url;
      setImageUrl(url);
      toast.success('Gambar berhasil diunggah');
    } catch {
      toast.error('Gagal mengunggah gambar');
      setImagePreview(null);
    } finally {
      setImageUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setImagePreview(null);
  };

  /* Tags */
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, t] }));
    }
    setTagInput('');
  };

  const removeTag = (tag: string) =>
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));

  const validate = (isPublished: boolean): boolean => {
    if (!form.title.trim())   { toast.error('Judul wajib diisi');   return false; }
    if (!form.slug.trim())    { toast.error('Slug wajib diisi');    return false; }
    if (!form.author.trim())  { toast.error('Penulis wajib diisi'); return false; }
    if (!form.content.trim() || form.content === '<p></p>' || form.content === '<p><br></p>') {
      toast.error('Konten wajib diisi'); return false;
    }
    if (isPublished && !imageUrl) {
      toast.error('Gambar utama wajib diisi sebelum dipublikasi'); return false;
    }
    return true;
  };

  /* Submit */
  const handleSubmit = async (isPublished: boolean) => {
    if (!validate(isPublished)) return;

    const allTags = [form.category, ...form.tags].filter(Boolean);

    const fd = new FormData();
    fd.append('title',       form.title.trim());
    fd.append('slug',        form.slug.trim());
    fd.append('content',     form.content);
    fd.append('excerpt',     form.excerpt.trim());
    fd.append('author',      form.author.trim());
    fd.append('tags',        JSON.stringify(allTags));
    fd.append('isPublished', String(isPublished));
    fd.append('metaTitle',       form.metaTitle.trim());
    fd.append('metaDescription', form.metaDescription.trim());
    fd.append('metaKeywords',    form.metaKeywords.trim());
    if (imageUrl) fd.append('image', imageUrl);

    setLoading(true);
    try {
      if (isEdit && id) {
        await blogService.update(id, fd);
        toast.success(isPublished ? 'Blog berhasil diperbarui & dipublikasi!' : 'Draf berhasil diperbarui!');
      } else {
        await blogService.create(fd);
        toast.success(isPublished ? 'Blog berhasil dipublikasi!' : 'Tersimpan sebagai draf!');
      }
      navigate('/blogs');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan blog');
    } finally {
      setLoading(false);
    }
  };

  /* Skeleton */
  if (fetching) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="w-32 h-6 bg-gray-200 rounded-full" />
        <div className="w-1/3 h-10 bg-gray-200 rounded-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full h-12 bg-gray-100 rounded-2xl" />
            ))}
            <div className="w-full h-64 bg-gray-100 rounded-2xl" />
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full h-12 bg-gray-100 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-dark">
          {isEdit ? 'Edit Blog' : 'Add Blog'}
        </h1>
        <p className="text-gray-400 text-sm mt-1 italic">
          {isEdit
            ? 'Perbarui postingan blog yang sudah ada'
            : 'Tulis dan publikasikan postingan blog baru'}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <div className="lg:col-span-2 space-y-5">

          <Card title="Basic Info">
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-2.5">
              <span className="text-xs text-amber-600 font-medium">⚠ Semua konten harus ditulis dalam bahasa Inggris.</span>
            </div>
            <Field label="Title" required>
              <input
                type="text"
                placeholder="cth. Cara Kami Membangun Winosa"
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
                placeholder="cara-kami-membangun-winosa"
                value={form.slug}
                onChange={e => {
                  setSlugManual(true);
                  setForm(prev => ({ ...prev, slug: e.target.value }));
                }}
                className={inputClass}
              />
            </Field>

            <Field
              label="Ringkasan"
              hint={`${form.excerpt.length} / 200 karakter direkomendasikan`}
            >
              <textarea
                placeholder="Ringkasan singkat yang tampil di daftar blog..."
                value={form.excerpt}
                onChange={e => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </Field>
          </Card>

          <Card title="Content">
            <Field label="Content" required>
              <RichTextEditor
                content={form.content}
                onChange={html => setForm(prev => ({ ...prev, content: html }))}
                minHeight="450px"
              />
            </Field>
          </Card>

          <Card title="SEO Settings (Search Engines)">
            <div className="grid grid-cols-1 gap-5">
              <Field 
                label="Meta Title" 
                hint="Judul yang muncul di Google. Disarankan 50-60 karakter."
              >
                <input
                  type="text"
                  placeholder="cth. 10 Cara Membangun Website Cepat | Winosa"
                  value={form.metaTitle}
                  onChange={e => setForm(prev => ({ ...prev, metaTitle: e.target.value }))}
                  className={inputClass}
                />
              </Field>

              <Field 
                label="Meta Description" 
                hint="Deskripsi singkat di Google. Disarankan 150-160 karakter."
              >
                <textarea
                  placeholder="Pelajari cara membangun website dengan performa tinggi..."
                  value={form.metaDescription}
                  onChange={e => setForm(prev => ({ ...prev, metaDescription: e.target.value }))}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </Field>

              <Field 
                label="Meta Keywords" 
                hint="Kata kunci dipisahkan dengan koma."
              >
                <input
                  type="text"
                  placeholder="web development, agency lampung, nextjs, react"
                  value={form.metaKeywords}
                  onChange={e => setForm(prev => ({ ...prev, metaKeywords: e.target.value }))}
                  className={inputClass}
                />
              </Field>
            </div>
          </Card>

        </div>

        <div className="space-y-5 lg:sticky lg:top-6">

          <Card title="Publish">
            <Field label="Author" required>
              <input
                type="text"
                placeholder="Nama penulis"
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

            <Field label="Tags">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tambah tag..."
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
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

          <Card title="Thumbnail">
            <Field
              label="Thumbnail"
              hint={imageUrl ? undefined : 'Wajib diisi sebelum dipublikasi'}
            >
              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 group">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                    {imageUploading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                          title="Ganti gambar"
                        >
                          <Upload size={16} className="text-dark" />
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
                          title="Remove image"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => !imageUploading && fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-dark transition-colors group"
                >
                  <div className="flex flex-col items-center gap-3 text-gray-400 group-hover:text-dark transition-colors py-8 px-4">
                    <ImageIcon size={28} />
                    <p className="text-xs italic text-center">Gambar utama untuk postingan blog</p>
                    <span className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs flex items-center gap-1.5">
                      <Upload size={11} />
                      Upload Image
                    </span>
                  </div>
                </div>
              )}
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
                  Gambar siap digunakan
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