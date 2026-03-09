import React, { useRef, useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import api from '../../../services/api';

interface Props {
  value: string;           // current image URL
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  aspectRatio?: string;    // e.g. "16/9", "1/1", default free
  folder?: string;         // ImageKit folder, default 'general'
}

const ImageUpload: React.FC<Props> = ({
  value, onChange, label, hint, aspectRatio, folder = 'general',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran maksimal 5MB');
      return;
    }

    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file); // ← field name harus match multer di backend

      const res = await api.post(
        `admin/upload?folder=${folder}`,
        formData,
        {
          headers: {
            'Content-Type': undefined,
          },
        }
      );

      // backend returns: { success, message, data: { url, fileId, ... } }
      const url = res.data?.data?.url;
      if (!url) throw new Error('No URL returned');
      onChange(url);
    } catch {
      setError('Upload gagal. Coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      {label && (
        <div className="mb-2">
          <label className="block text-sm font-semibold text-dark">{label}</label>
          {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
        </div>
      )}

      {value ? (
        /* Preview */
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
          <img
            src={value}
            alt="preview"
            className="w-full object-cover"
            style={{ aspectRatio: aspectRatio || 'auto', maxHeight: 240 }}
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center opacity-0 hover:opacity-100 gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 bg-white text-dark text-sm font-semibold rounded-xl shadow-sm hover:bg-gray-100 transition-colors"
            >
              Ganti
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 bg-white text-red-500 rounded-xl shadow-sm hover:bg-red-50 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center gap-3 hover:border-dark hover:bg-gray-50/50 transition-all"
        >
          {uploading ? (
            <div className="w-6 h-6 border-2 border-dark border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                <ImageIcon size={22} className="text-gray-300" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-dark">
                  Klik atau drag & drop gambar
                </p>
                <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WebP — maks 5MB</p>
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2 bg-dark text-white text-xs font-semibold rounded-xl">
                <Upload size={13} />
                Upload Gambar
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
};

export default ImageUpload;