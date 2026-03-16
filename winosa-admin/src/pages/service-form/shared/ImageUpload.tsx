import React, { useRef, useState } from 'react';
import { Upload, Trash2, ImageIcon } from 'lucide-react';
import api from '../../../services/api';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  aspectRatio?: string;
  folder?: string;
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
      formData.append('image', file);
      const res = await api.post(
        `admin/upload?folder=${folder}`,
        formData,
        { headers: { 'Content-Type': undefined } }
      );
      const url = res.data?.data?.url;
      if (!url) throw new Error('Tidak ada URL yang dikembalikan');
      onChange(url);
    } catch {
      setError('Unggah gagal. Coba lagi.');
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
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
          <img
            src={value}
            alt="preview"
            className="w-full object-cover"
            style={{ aspectRatio: aspectRatio || 'auto', maxHeight: 240 }}
          />
          {/* Action buttons — pojok kanan atas, selalu terlihat */}
          <div className="absolute top-2 right-2 flex gap-1.5">
            {uploading ? (
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                  title="Ganti gambar"
                >
                  <Upload size={14} className="text-dark" />
                </button>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
                  title="Hapus gambar"
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
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
                <p className="text-sm font-medium text-dark">Klik atau seret gambar ke sini</p>
                <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WebP — maks 5MB</p>
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2 bg-dark text-white text-xs font-semibold rounded-xl">
                <Upload size={13} />
                Upload Image
              </div>
            </>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

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