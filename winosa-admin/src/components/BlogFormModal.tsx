import React, { useState, useEffect, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { Blog } from '../types';
import { blogService } from '../services/blogService';
import toast from 'react-hot-toast';

interface BlogFormModalProps {
  isOpen: boolean;
  blog: Blog | null;
  onClose: () => void;
  onSuccess: () => void;
}

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const BlogFormModal: React.FC<BlogFormModalProps> = ({ isOpen, blog, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: '',
    tags: '',
    isPublished: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (blog) {
      setForm({
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        excerpt: blog.excerpt || '',
        author: blog.author || '',
        tags: blog.tags?.join(', ') || '',
        isPublished: blog.isPublished,
      });
      setImagePreview(blog.image || null);
    } else {
      setForm({ title: '', slug: '', content: '', excerpt: '', author: '', tags: '', isPublished: true });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [blog, isOpen]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm(prev => ({ ...prev, title, slug: !blog ? generateSlug(title) : prev.slug }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (isPublished: boolean) => {
    if (!form.title || !form.slug || !form.content) {
      toast.error('Title, slug, and content are required');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('slug', form.slug);
      fd.append('content', form.content);
      fd.append('excerpt', form.excerpt);
      fd.append('author', form.author);
      fd.append('tags', JSON.stringify(form.tags.split(',').map(t => t.trim()).filter(Boolean)));
      fd.append('isPublished', String(isPublished));
      if (imageFile) fd.append('image', imageFile);

      if (blog) {
        await blogService.update(blog._id, fd);
        toast.success('Blog updated!');
      } else {
        await blogService.create(fd);
        toast.success('Blog created!');
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white h-full w-full max-w-xl overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-display font-bold text-dark">Blog</h2>
            <p className="text-xs text-gray-400 italic">Manage Winosa blog content</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-dark">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Title :</label>
            <input
              type="text"
              placeholder="Enter blog title"
              value={form.title}
              onChange={handleTitleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Slug :</label>
            <input
              type="text"
              placeholder="blog-slug"
              value={form.slug}
              onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50"
            />
          </div>

          {/* Category / Tags */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Category :</label>
            <input
              type="text"
              placeholder="e.g. Insight, Technology (comma separated)"
              value={form.tags}
              onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Thumbnail Image :</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border border-gray-200 rounded-xl p-6 bg-gray-50 cursor-pointer hover:border-primary transition-colors"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-full h-32 object-cover rounded-lg" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <p className="text-xs">Upload blog thumbnail</p>
                  <button type="button" className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs hover:border-primary">
                    <Upload size={12} className="inline mr-1" /> Upload
                  </button>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Content :</label>
            <textarea
              placeholder="Write blog content here..."
              value={form.content}
              onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
              rows={8}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50 resize-none"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Excerpt :</label>
            <textarea
              placeholder="Short description..."
              value={form.excerpt}
              onChange={e => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50 resize-none"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Author :</label>
            <input
              type="text"
              placeholder="Admin"
              value={form.author}
              onChange={e => setForm(prev => ({ ...prev, author: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary bg-gray-50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="flex-1 py-3 bg-gray-200 text-gray-600 rounded-xl text-sm font-medium italic hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Draft
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="flex-1 py-3 bg-green-500 text-white rounded-xl text-sm font-medium italic hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Published'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogFormModal;
