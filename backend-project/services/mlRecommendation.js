/**
 * mlRecommendation.js — Blog Recommendation Service (Pure JavaScript)
 * =====================================================================
 * Algoritma: Content-Based Filtering
 *   1. TF-IDF (natural)          — content similarity dari title + tags
 *   2. Semantic Similarity        — @xenova/transformers (paraphrase-multilingual-MiniLM-L12-v2)
 *   3. Hot Score                  — views_normalized × recency decay
 *
 * Weights:
 *   - Semantic AVAILABLE : TF-IDF 40% + Semantic 40% + Hot Score 20%
 *   - Semantic UNAVAILABLE: TF-IDF 80% + Hot Score 20%
 *
 * Menggantikan: Python Flask ML service (port 5001)
 * Cara pakai  : require('./services/mlRecommendation')
 */

const natural = require('natural');
const { similarity: cosineSim } = require('ml-distance');

// ── Lazy-load Xenova transformer (agar startup tidak lambat) ──────────────────
let _pipeline = null;
let _semanticLoading = false;

async function getSemanticPipeline() {
  if (_pipeline) return _pipeline;
  if (_semanticLoading) return null; // sedang loading, skip dulu

  _semanticLoading = true;
  try {
    // Dynamic import karena @xenova/transformers adalah ESM
    const { pipeline } = await import('@xenova/transformers');
    _pipeline = await pipeline(
      'feature-extraction',
      'Xenova/paraphrase-multilingual-MiniLM-L12-v2'
    );
    console.log('✅ Semantic model loaded');
    return _pipeline;
  } catch (e) {
    console.warn('⚠️  Semantic model unavailable:', e.message);
    _pipeline = null;
    return null;
  } finally {
    _semanticLoading = false;
  }
}

// ── TF-IDF Helper ─────────────────────────────────────────────────────────────
function buildTfIdfMatrix(texts) {
  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();
  texts.forEach(t => tfidf.addDocument(t));

  // Kumpulkan semua term unik
  const termSet = new Set();
  texts.forEach((_, i) => {
    tfidf.listTerms(i).forEach(item => termSet.add(item.term));
  });
  const terms = [...termSet];

  // Bangun matrix (N x V)
  const matrix = texts.map((_, i) => {
    const termMap = {};
    tfidf.listTerms(i).forEach(item => { termMap[item.term] = item.tfidf; });
    return terms.map(t => termMap[t] || 0);
  });

  return matrix;
}

function cosineMatrix(matrix) {
  const n = matrix.length;
  const result = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) { result[i][j] = 1; continue; }
      try {
        result[i][j] = cosineSim.cosine(matrix[i], matrix[j]);
      } catch {
        result[i][j] = 0;
      }
    }
  }
  return result;
}

// ── Semantic Helper ───────────────────────────────────────────────────────────
async function computeSemanticMatrix(texts) {
  const pipe = await getSemanticPipeline();
  if (!pipe) return null;

  try {
    console.log(`   Encoding ${texts.length} texts semantically...`);
    const embeddings = [];
    for (const text of texts) {
      const output = await pipe(text, { pooling: 'mean', normalize: true });
      embeddings.push(Array.from(output.data));
    }
    return cosineMatrix(embeddings);
  } catch (e) {
    console.warn('⚠️  Semantic encoding failed:', e.message);
    return null;
  }
}

// ── Hot Score ─────────────────────────────────────────────────────────────────
function computeHotScores(blogs) {
  const maxViews = Math.max(...blogs.map(b => b.views || 0), 1);
  const now = Date.now();

  const scores = blogs.map(b => {
    const viewsNorm = (b.views || 0) / maxViews;

    let recency = 0.5;
    try {
      const ageDays = (now - new Date(b.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      recency = Math.exp(-ageDays / 30);
    } catch {}

    return 0.6 * viewsNorm + 0.4 * recency;
  });

  const maxHot = Math.max(...scores, 1);
  return scores.map(s => s / maxHot);
}

// ── MAE Evaluation ────────────────────────────────────────────────────────────
function computeMAE(simMatrix, viewsNorm) {
  const n = simMatrix.length;
  // Prediksi views setiap blog = rata-rata weighted similarity × views blog lain
  const predicted = simMatrix.map((row, i) => {
    let num = 0, den = 0;
    row.forEach((sim, j) => {
      if (i !== j) { num += sim * viewsNorm[j]; den += sim; }
    });
    return den > 0 ? Math.min(Math.max(num / den, 0), 1) : 0;
  });

  const mae = viewsNorm.reduce((sum, v, i) => sum + Math.abs(v - predicted[i]), 0) / n;
  return Math.round(mae * 10000) / 10000;
}

function interpretMAE(mae) {
  if (mae < 0.1) return 'Excellent — prediksi sangat akurat';
  if (mae < 0.2) return 'Good — prediksi cukup akurat';
  if (mae < 0.3) return 'Fair — prediksi lumayan';
  return 'Poor — butuh lebih banyak data';
}

// ══════════════════════════════════════════════════════════════════════════════
//  BlogRecommendationModel
// ══════════════════════════════════════════════════════════════════════════════
class BlogRecommendationModel {
  constructor() {
    this.isTrained        = false;
    this.blogs            = [];
    this.tfidfMatrix      = null;   // cosine similarity matrix (TF-IDF)
    this.semanticMatrix   = null;   // cosine similarity matrix (semantic)
    this.hotScores        = null;   // array of hot scores
    this.semanticAvailable = false;
    this.mae              = null;
  }

  // ── TRAIN ──────────────────────────────────────────────────────────────────
  async train(blogs) {
    if (!blogs || blogs.length < 2) {
      return { success: false, error: 'Not enough blog data (min 2)' };
    }

    console.log(`\nTraining ML model with ${blogs.length} blogs...`);
    this.blogs = blogs;

    // Step 1: TF-IDF
    const texts = blogs.map(b =>
      `${b.title || ''} ${Array.isArray(b.tags) ? b.tags.join(' ') : ''}`
    );
    const tfidfVectors = buildTfIdfMatrix(texts);
    this.tfidfMatrix = cosineMatrix(tfidfVectors);
    console.log(`   TF-IDF matrix: ${blogs.length}×${blogs.length}`);

    // Step 2: Semantic (async, non-blocking jika gagal)
    const semanticTexts = blogs.map(b =>
      `${b.title || ''}. ${b.excerpt || ''}`
    );
    this.semanticMatrix = await computeSemanticMatrix(semanticTexts);
    this.semanticAvailable = this.semanticMatrix !== null;

    // Step 3: Hot Score
    this.hotScores = computeHotScores(blogs);

    // Step 4: MAE
    const maxViews = Math.max(...blogs.map(b => b.views || 0), 1);
    const viewsNorm = blogs.map(b => (b.views || 0) / maxViews);
    this.mae = computeMAE(this.tfidfMatrix, viewsNorm);

    this.isTrained = true;

    const result = {
      success: true,
      total_blogs: blogs.length,
      mae: this.mae,
      mae_interpretation: interpretMAE(this.mae),
      semantic_enabled: this.semanticAvailable,
      algorithm: 'Hybrid: TF-IDF + Semantic + Hot Score',
      weights: this.semanticAvailable
        ? { tfidf: 0.4, semantic: 0.4, hot_score: 0.2 }
        : { tfidf: 0.8, semantic: 0.0, hot_score: 0.2 },
    };

    console.log(`✅ Model trained! MAE=${this.mae} | Semantic=${this.semanticAvailable}`);
    return result;
  }

  // ── RECOMMENDATIONS ────────────────────────────────────────────────────────
  getRecommendations(slug, n = 3) {
    if (!this.isTrained) return [];

    const idx = this.blogs.findIndex(b => b.slug === slug);
    if (idx === -1) return [];

    const n_total = this.blogs.length;
    const wTfidf    = this.semanticAvailable ? 0.4 : 0.8;
    const wSemantic = this.semanticAvailable ? 0.4 : 0.0;
    const wHot      = 0.2;

    const scores = this.blogs.map((_, i) => {
      if (i === idx) return -1;
      const tfidf    = this.tfidfMatrix[idx][i];
      const semantic = this.semanticAvailable ? this.semanticMatrix[idx][i] : 0;
      const hot      = this.hotScores[i];
      return wTfidf * tfidf + wSemantic * semantic + wHot * hot;
    });

    const ranked = scores
      .map((score, i) => ({ i, score }))
      .filter(x => x.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, n);

    return ranked.map(({ i, score }) => {
      const blog = this.blogs[i];
      return {
        title      : blog.title,
        slug       : blog.slug,
        excerpt    : blog.excerpt,
        image      : blog.image,
        author     : blog.author,
        tags       : blog.tags,
        views      : blog.views,
        readTime   : blog.readTime,
        createdAt  : blog.createdAt,
        _similarity: Math.round(score * 10000) / 10000,
      };
    });
  }

  // ── TRENDING ───────────────────────────────────────────────────────────────
  getTrending(n = 5) {
    if (!this.isTrained) return [];

    return this.hotScores
      .map((score, i) => ({ i, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, n)
      .map(({ i, score }) => {
        const blog = this.blogs[i];
        return {
          title     : blog.title,
          slug      : blog.slug,
          excerpt   : blog.excerpt,
          image     : blog.image,
          author    : blog.author,
          tags      : blog.tags,
          views     : blog.views,
          readTime  : blog.readTime,
          createdAt : blog.createdAt,
          _hot_score: Math.round(score * 10000) / 10000,
        };
      });
  }

  // ── STATS ──────────────────────────────────────────────────────────────────
  getStats() {
    return {
      is_trained        : this.isTrained,
      total_blogs       : this.blogs.length,
      mae               : this.mae,
      mae_interpretation: this.mae ? interpretMAE(this.mae) : null,
      semantic_enabled  : this.semanticAvailable,
      algorithm         : 'Hybrid: TF-IDF + Semantic + Hot Score',
      weights           : this.semanticAvailable
        ? { tfidf: 0.4, semantic: 0.4, hot_score: 0.2 }
        : { tfidf: 0.8, semantic: 0.0, hot_score: 0.2 },
    };
  }
}

// Singleton instance
const model = new BlogRecommendationModel();
module.exports = model;