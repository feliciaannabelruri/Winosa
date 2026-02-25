import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Tag,
  User,
  Globe,
  CheckCircle2,
  XCircle,
  Edit2,
} from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { Portfolio } from '../types';
import toast from 'react-hot-toast';

const PortfolioDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const data = await portfolioService.getBySlug(slug);
        setPortfolio(data.data ?? null);
      } catch {
        toast.error('Portfolio not found');
        navigate('/portfolio');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [slug, navigate]);

  /* ─── Loading Skeleton ─── */
  if (loading) {
    return (
      <div className="max-w-4xl space-y-6 animate-pulse">
        <div className="w-28 h-8 bg-gray-200 rounded-full" />
        <div className="w-full h-80 bg-gray-200 rounded-3xl" />
        <div className="flex gap-3">
          <div className="w-24 h-7 bg-gray-200 rounded-full" />
          <div className="w-24 h-7 bg-gray-200 rounded-full" />
        </div>
        <div className="w-2/3 h-9 bg-gray-200 rounded-full" />
        <div className="w-full h-5 bg-gray-100 rounded-full" />
        <div className="w-4/5 h-5 bg-gray-100 rounded-full" />
        <div className="grid grid-cols-2 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!portfolio) return null;

  const formattedDate = new Date(portfolio.createdAt).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const updatedDate = new Date(portfolio.updatedAt).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  /* ─── Metadata rows ─── */
  const meta = [
    { icon: Tag, label: 'Category', value: portfolio.category || '—' },
    { icon: User, label: 'Client', value: portfolio.client || '—' },
    { icon: Calendar, label: 'Created', value: formattedDate },
    { icon: Calendar, label: 'Updated', value: updatedDate },
  ];

  return (
    <div className="max-w-4xl space-y-8">

      {/* ── Back Button ── */}
      <button
        onClick={() => navigate('/portfolio')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Portfolio
      </button>

      {/* ── Hero Image ── */}
      {portfolio.image ? (
        <div className="w-full h-80 rounded-3xl overflow-hidden border-2 border-gray-100 shadow-sm">
          <img
            src={portfolio.image}
            alt={portfolio.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-80 rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
          <p className="text-gray-300 text-sm italic">No image uploaded</p>
        </div>
      )}

      {/* ── Badges Row ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status */}
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full border ${
            portfolio.isActive
              ? 'bg-green-50 text-green-600 border-green-200'
              : 'bg-gray-100 text-gray-500 border-gray-200'
          }`}
        >
          {portfolio.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
          {portfolio.isActive ? 'Published' : 'Draft'}
        </span>

        {/* Category Badge */}
        {portfolio.category && (
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full border border-gray-200">
            <Tag size={11} />
            {portfolio.category}
          </span>
        )}

        {/* Project URL */}
        {portfolio.projectUrl && (
          <a
            href={portfolio.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-yellow-700 bg-yellow-50 px-4 py-1.5 rounded-full border border-yellow-200 hover:bg-yellow-100 transition-colors"
          >
            <Globe size={11} />
            Visit Project
            <ExternalLink size={10} />
          </a>
        )}
      </div>

      {/* ── Title + Description ── */}
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-dark leading-tight">
          {portfolio.title}
        </h1>
        {portfolio.description && (
          <p className="text-gray-500 text-sm leading-relaxed">{portfolio.description}</p>
        )}
      </div>

      {/* ── Metadata Grid ── */}
      <div className="grid grid-cols-2 gap-4">
        {meta.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 flex items-start gap-3"
          >
            <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon size={14} className="text-gray-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className="text-sm text-dark font-semibold mt-0.5 truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => navigate(`/portfolio/edit/${portfolio._id}`)}
          className="flex items-center gap-2 bg-dark text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <Edit2 size={14} />
          Edit Portfolio
        </button>
        {portfolio.projectUrl && (
          <a
            href={portfolio.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-primary text-dark text-sm font-semibold px-6 py-3 rounded-full hover:bg-primary-dark transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <ExternalLink size={14} />
            Open Project
          </a>
        )}
      </div>

    </div>
  );
};

export default PortfolioDetailPage;