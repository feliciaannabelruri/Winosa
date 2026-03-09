import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Edit2, Globe } from 'lucide-react';
import { portfolioService, Portfolio } from '../services/portfolioService';
import toast from 'react-hot-toast';

const PortfolioDetailPage: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const portfolioId = id || slug;
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!portfolioId) return;
    portfolioService.getById(portfolioId)
      .then(res => setPortfolio(res.data ?? null))
      .catch(() => { toast.error('Portfolio not found'); navigate('/portfolio'); })
      .finally(() => setLoading(false));
  }, [portfolioId, navigate]);

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="w-28 h-8 bg-gray-200 rounded-full" />
        <div className="w-full h-64 bg-gray-200 rounded-3xl" />
        <div className="w-2/3 h-8 bg-gray-200 rounded-full" />
        {[...Array(4)].map((_, i) => <div key={i} className="w-full h-14 bg-gray-100 rounded-2xl" />)}
      </div>
    );
  }

  if (!portfolio) return null;

  const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 space-y-4">
      <h2 className="text-base font-bold text-dark">{title}</h2>
      {children}
    </div>
  );

  const InfoRow: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    value ? (
      <div className="flex flex-col gap-0.5">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm text-dark font-semibold">{value}</p>
      </div>
    ) : null
  );

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Back */}
      <button onClick={() => navigate('/portfolio')}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-dark transition-colors group">
        <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Portfolio
      </button>

      {/* Hero Image */}
      {portfolio.heroImage ? (
        <div className="w-full h-72 rounded-3xl overflow-hidden border-2 border-gray-100">
          <img src={portfolio.heroImage} alt={portfolio.title} className="w-full h-full object-cover" />
        </div>
      ) : portfolio.thumbnail || portfolio.image ? (
        <div className="w-full h-72 rounded-3xl overflow-hidden border-2 border-gray-100">
          <img src={portfolio.thumbnail || portfolio.image} alt={portfolio.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full h-72 rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
          <p className="text-gray-300 text-sm italic">No hero image</p>
        </div>
      )}

      {/* Title + Status */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border mb-2 ${
            portfolio.isActive
              ? 'bg-green-50 text-green-600 border-green-200'
              : 'bg-gray-100 text-gray-500 border-gray-200'
          }`}>
            {portfolio.isActive ? 'Published' : 'Draft'}
          </span>
          {portfolio.category && (
            <span className="ml-2 inline-block text-xs font-semibold px-3 py-1 rounded-full border bg-gray-100 text-gray-500 border-gray-200">
              {portfolio.category}
            </span>
          )}
          <h1 className="text-3xl font-display font-bold text-dark mt-2">{portfolio.title}</h1>
          {(portfolio.shortDesc || portfolio.description) && (
            <p className="text-gray-500 text-sm mt-1">
              {portfolio.shortDesc || portfolio.description}
            </p>
          )}
        </div>
        <button onClick={() => navigate(`/portfolio/edit/${portfolio._id}`)}
          className="flex items-center gap-2 bg-dark text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all flex-shrink-0">
          <Edit2 size={13} />
          Edit
        </button>
      </div>

      {/* Long Description */}
      {portfolio.longDesc && (
        <SectionCard title="Description">
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{portfolio.longDesc}</p>
        </SectionCard>
      )}

      {/* Project Info */}
      <SectionCard title="Project Information">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoRow label="Client"   value={portfolio.client} />
          <InfoRow label="Year"     value={portfolio.year} />
          <InfoRow label="Duration" value={portfolio.duration} />
          <InfoRow label="Role"     value={portfolio.role} />
        </div>

        {portfolio.techStack?.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {portfolio.techStack.map((tech, i) => (
                <span key={i} className="px-3 py-1.5 bg-gray-100 text-dark text-xs font-semibold rounded-full">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      {/* Case Study */}
      <SectionCard title="Case Study">
        {portfolio.challenge && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">The Challenge</p>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{portfolio.challenge}</p>
          </div>
        )}
        {portfolio.solution && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">The Solution</p>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{portfolio.solution}</p>
          </div>
        )}
        {portfolio.result && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">The Result</p>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{portfolio.result}</p>
          </div>
        )}
      </SectionCard>

      {/* Key Metrics */}
      {portfolio.metrics?.length > 0 && (
        <SectionCard title="Key Metrics">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {portfolio.metrics.map((m, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl px-4 py-5 text-center">
                <p className="text-2xl font-bold text-dark">{m.value}</p>
                <p className="text-xs text-gray-400 mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Gallery */}
      {portfolio.gallery?.length > 0 && (
        <SectionCard title="Project Gallery">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {portfolio.gallery.map((url, i) => (
              <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-gray-100">
                <img src={url} alt={`gallery-${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Project URL */}
      {portfolio.projectUrl && (
        <SectionCard title="Project URL">
          <a href={portfolio.projectUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-dark bg-gray-100 px-5 py-2.5 rounded-full hover:bg-gray-200 transition-colors">
            <Globe size={14} />
            {portfolio.projectUrl}
            <ExternalLink size={12} className="text-gray-400" />
          </a>
        </SectionCard>
      )}

    </div>
  );
};

export default PortfolioDetailPage;