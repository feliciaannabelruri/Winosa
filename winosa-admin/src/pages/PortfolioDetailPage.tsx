import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar, Tag } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="max-w-4xl space-y-6 animate-pulse">
        <div className="w-24 h-8 bg-gray-200 rounded-full" />
        <div className="w-full h-72 bg-gray-200 rounded-3xl" />
        <div className="w-1/2 h-8 bg-gray-200 rounded-full" />
      </div>
    );
  }

  if (!portfolio) return null;

  return (
    <div className="max-w-4xl space-y-8">

      <button
        onClick={() => navigate('/portfolio')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark transition-colors group"
      >
        <ArrowLeft size={16} />
        Back to Portfolio
      </button>

      {portfolio.image && (
        <div className="w-full h-72 rounded-3xl overflow-hidden border-2 border-gray-100">
          <img src={portfolio.image} alt={portfolio.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div>
        <h1 className="text-3xl font-display font-bold text-dark">{portfolio.title}</h1>
        {portfolio.description && (
          <p className="text-gray-400 text-sm mt-1">{portfolio.description}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {portfolio.category && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
            <Tag size={13} />
            <span>{portfolio.category}</span>
          </div>
        )}
        {portfolio.createdAt && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
            <Calendar size={13} />
            <span>{new Date(portfolio.createdAt).toLocaleDateString('id-ID')}</span>
          </div>
        )}
        {portfolio.projectUrl && (
          
           <a href={portfolio.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-primary bg-yellow-50 px-4 py-2 rounded-full"
          >
            <ExternalLink size={13} />
            <span>Visit Project</span>
          </a>
        )}
      </div>

    </div>
  );
};

export default PortfolioDetailPage;