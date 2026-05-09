import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import { blogService } from '../services/blogService';
import { useTranslation } from 'react-i18next'; 

interface Comment {
  _id: string;
  blogId: string;
  name: string;
  message: string;
  createdAt: string;
}

const BlogCommentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation(); 

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: '', loading: false });

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await blogService.getComments(id!);
      setComments(res.data || []);
    } catch (err) {
      toast.error(t('comments_load_error')); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) fetchComments(); }, [id]);

  const handleDelete = async () => {
    try {
      setDeleteModal(prev => ({ ...prev, loading: true }));
      await blogService.deleteComment(deleteModal.id);
      toast.success(t('comments_deleted')); 
      setDeleteModal({ open: false, id: '', loading: false });
      fetchComments();
    } catch (err) {
      toast.error(t('comments_delete_error')); 
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/blogs')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-3"
          >
            <ArrowLeft size={16} />
            {t('back_to_blogs')} {/* ← GANTI */}
          </button>
          <h1 className="text-4xl font-display font-bold text-dark">
            {t('blog_comments')} {/* ← GANTI */}
          </h1>
          <p className="text-gray-400 text-sm mt-1 italic">
            {t('comments_subtitle')} {/* ← GANTI */}
          </p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
          <MessageCircle className="text-blue-500" size={28} />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
          <p className="text-3xl font-bold text-dark">{comments.length}</p>
          <p className="text-sm text-gray-400 mt-1">{t('comments_total')}</p> {/* ← GANTI */}
        </div>
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
          <p className="text-3xl font-bold text-red-500">{comments.length}</p>
          <p className="text-sm text-gray-400 mt-1">{t('comments_active')}</p> {/* ← GANTI */}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['No.', t('name'), t('comments_comment'), t('date'), t('actions')].map(h => ( 
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 py-4 px-6 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : comments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-sm text-gray-400">
                    {t('comments_empty')} {/* ← GANTI */}
                  </td>
                </tr>
              ) : (
                comments.map((comment, idx) => (
                  <tr key={comment._id} className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'}`}>
                    <td className="py-5 px-6 text-sm text-gray-400">{idx + 1}.</td>
                    <td className="py-5 px-4">
                      <span className="font-semibold text-dark text-sm">{comment.name}</span>
                    </td>
                    <td className="py-5 px-4 max-w-[400px]">
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{comment.message}</p>
                    </td>
                    <td className="py-5 px-4 text-xs text-gray-500 whitespace-nowrap">{formatDate(comment.createdAt)}</td>
                    <td className="py-5 px-4">
                      <button
                        onClick={() => setDeleteModal({ open: true, id: comment._id, loading: false })}
                        className="w-10 h-10 rounded-xl border border-red-100 text-red-400 hover:bg-red-50 transition-colors flex items-center justify-center"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE MODAL */}
      <ConfirmModal
        isOpen={deleteModal.open}
        title={t('comments_delete_title')} 
        message={t('comments_delete_message')} 
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: '', loading: false })}
        loading={deleteModal.loading}
      />
    </div>
  );
};

export default BlogCommentsPage;