"""
Blog Recommendation System
===========================
Algoritma: Content-Based Filtering menggunakan TF-IDF + Cosine Similarity
Evaluasi  : Mean Absolute Error (MAE) pada prediksi views/relevance

Cara kerja:
  1. Setiap blog diubah jadi vector menggunakan TF-IDF dari title + tags
  2. Cosine similarity dihitung antar semua blog (seberapa "mirip" kontennya)
  3. Model regresi (Ridge) dilatih untuk memprediksi views_normalized
     dari similarity score → hasilnya kita ukur MAE-nya
  4. Rekomendasi = blog dengan similarity score tertinggi terhadap blog saat ini
"""

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.linear_model import Ridge
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from datetime import datetime, timezone
import requests
import json
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

_semantic_model = None
SEMANTIC_ERROR = None

def get_semantic_model():
    global _semantic_model, SEMANTIC_ERROR

    if _semantic_model is None:
        try:
            from sentence_transformers import SentenceTransformer

            logger.info("Loading semantic model...")
            _semantic_model = SentenceTransformer(
                "paraphrase-multilingual-MiniLM-L12-v2"
            )

            SEMANTIC_ERROR = None
            logger.info("Semantic model loaded successfully")

        except Exception as e:
            SEMANTIC_ERROR = str(e)
            _semantic_model = None
            logger.warning(f"Semantic model gagal load: {e}")

    return _semantic_model

class BlogRecommendationModel:
    """
    Content-Based Recommendation dengan evaluasi MAE.

    Attributes
    ----------
    mae : float
        Mean Absolute Error hasil evaluasi model — semakin kecil semakin baik.
    similarity_matrix : ndarray
        Matrix cosine similarity antar blog (N x N).
    """

    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=500,
            stop_words="english",
            ngram_range=(1, 2),   # unigram + bigram supaya lebih kaya
        )
        self.regression_model = Ridge(alpha=1.0)
        self.similarity_matrix: np.ndarray = None
        self.blogs_df: pd.DataFrame = None
        self.mae: float = None
        self.is_trained: bool = False
        self.semantic_matrix    = None
        self.hot_scores         = None
        self.semantic_available = False

    # DATA PREPARATION
    def _prepare_features(self, blogs: list) -> pd.DataFrame:
        df = pd.DataFrame(blogs)

        for col in ["title", "tags", "views", "slug", "createdAt"]:
            if col not in df.columns:
                df[col] = "" if col in ["title", "slug"] else ([] if col == "tags" else (0 if col == "views" else datetime.now(timezone.utc).isoformat()))

        df["text_features"] = df.apply(
            lambda row: str(row.get("title", "")) + " " +
                        " ".join(row.get("tags", []) if isinstance(row.get("tags", []), list) else []),
            axis=1,
        )

        df["semantic_text"] = df.apply(
            lambda row: str(row.get("title", "")) + ". " + str(row.get("excerpt", "")),
            axis=1,
        )

        max_views = df["views"].max() if df["views"].max() > 0 else 1
        df["views_normalized"] = df["views"].fillna(0) / max_views

        return df

    def _compute_hot_scores(self, df):
        now = datetime.now(timezone.utc)
        recency_scores = []
        for ts in df["createdAt"]:
            try:
                ts_clean = ts.replace("Z", "+00:00")
                published = datetime.fromisoformat(ts_clean)
                if published.tzinfo is None:
                    published = published.replace(tzinfo=timezone.utc)
                age_days = (now - published).days
                recency = np.exp(-age_days / 30)
            except Exception:
                recency = 0.5
            recency_scores.append(recency)
        recency = np.array(recency_scores)
        hot = 0.6 * df["views_normalized"].values + 0.4 * recency
        max_hot = hot.max() if hot.max() > 0 else 1
        return hot / max_hot

    def _compute_semantic_matrix(self, df):
        model = get_semantic_model()
        if model is None:
            return None
        try:
            texts = df["semantic_text"].tolist()
            logger.info(f"Encoding {len(texts)} blog texts semantically...")
            embeddings = model.encode(texts, show_progress_bar=False, batch_size=32)
            matrix = cosine_similarity(embeddings)
            logger.info(f"✅ Semantic matrix shape: {matrix.shape}")
            return matrix
        except Exception as e:
            logger.warning(f"⚠️  Semantic encoding gagal: {e}")
            return None

    def _build_hybrid_matrix(self):
        n = len(self.blogs_df)
        tfidf = self.similarity_matrix
        if self.semantic_available:
            semantic = self.semantic_matrix
            w_tfidf, w_semantic, w_hot = 0.4, 0.4, 0.2
        else:
            semantic = np.zeros((n, n))
            w_tfidf, w_semantic, w_hot = 0.8, 0.0, 0.2
        hot_matrix = np.tile(self.hot_scores, (n, 1))
        return w_tfidf * tfidf + w_semantic * semantic + w_hot * hot_matrix

    # TRAINING & EVALUASI MAE
    def train(self, blogs: list) -> dict:
        """
        Latih model dan hitung MAE.

        Parameter
        ---------
        blogs : list of dict
            Data blog dari API/MongoDB.

        Return
        ------
        dict berisi status training dan nilai MAE.
        """
        if len(blogs) < 2:
            logger.warning("Data blog terlalu sedikit untuk training (minimal 2)")
            return {"success": False, "error": "Not enough blog data (min 2)"}

        df = self._prepare_features(blogs)
        self.blogs_df = df

        # === Step 1: TF-IDF Vectorization ===
        tfidf_matrix = self.vectorizer.fit_transform(df["text_features"])
        logger.info(f"TF-IDF matrix shape: {tfidf_matrix.shape}")

        # === Step 2: Cosine Similarity Matrix ===
        self.similarity_matrix = cosine_similarity(tfidf_matrix)
        self.semantic_matrix = self._compute_semantic_matrix(df)
        self.semantic_available = self.semantic_matrix is not None
        self.hot_scores = self._compute_hot_scores(df)
        logger.info(f"Similarity matrix shape: {self.similarity_matrix.shape}")

        # === Step 3: MAE Evaluation ===
        # Gunakan similarity score setiap blog terhadap rata-rata semua blog
        # sebagai fitur X, dan views_normalized sebagai target y.
        # Ini menunjukkan seberapa akurat model memprediksi "popularitas"
        # berdasarkan konten (bukan secara acak).

        X = self.similarity_matrix          # (N x N)
        y = df["views_normalized"].values   # (N,)

        if len(blogs) >= 5:
            # Split train/test jika data cukup
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            self.regression_model.fit(X_train, y_train)
            y_pred = self.regression_model.predict(X_test)
        else:
            # Data kecil: pakai semua untuk train & test (leave-one-out style)
            self.regression_model.fit(X, y)
            y_pred = self.regression_model.predict(X)
            y_test = y

        # Clip prediction supaya tetap dalam rentang [0, 1]
        y_pred = np.clip(y_pred, 0, 1)
        self.mae = mean_absolute_error(y_test, y_pred)

        self.is_trained = True
        logger.info(f"✅ Model trained. MAE = {self.mae:.4f}")

        return {
            "success": True,
            "total_blogs": len(blogs),
            "mae": round(self.mae, 4),
            "mae_interpretation": self._interpret_mae(self.mae),
        }

    def _interpret_mae(self, mae: float) -> str:
        """Interpretasi MAE supaya mudah dipahami."""
        if mae < 0.1:
            return "Excellent — prediksi sangat akurat"
        elif mae < 0.2:
            return "Good — prediksi cukup akurat"
        elif mae < 0.3:
            return "Fair — prediksi lumayan"
        else:
            return "Poor — butuh lebih banyak data"

    # INFERENCE / REKOMENDASI
    def get_recommendations(self, slug: str, n: int = 3) -> list:
        """
        Dapatkan top-N rekomendasi blog berdasarkan similarity.

        Parameter
        ---------
        slug : str   — Slug blog yang sedang dibaca
        n    : int   — Jumlah rekomendasi

        Return
        ------
        list of dict berisi data blog rekomendasi.
        """
        if not self.is_trained or self.blogs_df is None:
            logger.warning("Model belum dilatih!")
            return []

        # Cari index blog yang diminta
        matching = self.blogs_df[self.blogs_df["slug"] == slug]
        if matching.empty:
            logger.warning(f"Slug '{slug}' tidak ditemukan dalam data training")
            return []

        idx = matching.index[0]

        n_total = len(self.blogs_df)
        tfidf_scores = self.similarity_matrix[idx]

        if self.semantic_available:
            semantic_scores = self.semantic_matrix[idx]
            w_tfidf, w_semantic, w_hot = 0.4, 0.4, 0.2
        else:
            semantic_scores = np.zeros(n_total)
            w_tfidf, w_semantic, w_hot = 0.8, 0.0, 0.2

        hybrid_scores = (
            w_tfidf    * tfidf_scores +
            w_semantic * semantic_scores +
            w_hot      * self.hot_scores
        )

        sim_scores = [
            (i, float(hybrid_scores[i]))
            for i in range(n_total) if i != idx
        ]
        sim_scores.sort(key=lambda x: x[1], reverse=True)

        # Ambil top N
        top_indices = [i for i, _ in sim_scores[:n]]
        top_scores  = [round(s, 4) for _, s in sim_scores[:n]]

        # Kolom yang dikembalikan ke frontend
        output_cols = ["title", "slug", "excerpt", "image", "author",
                       "tags", "views", "readTime", "createdAt"]
        available_cols = [c for c in output_cols if c in self.blogs_df.columns]

        result = self.blogs_df.iloc[top_indices][available_cols].to_dict("records")

        # Tambahkan similarity score (opsional, untuk debugging)
        for i, rec in enumerate(result):
            rec["_similarity"] = top_scores[i]
            # Hapus nilai NaN / None agar JSON bersih
            rec = {k: (v if not (isinstance(v, float) and np.isnan(v)) else None)
                   for k, v in rec.items()}
            result[i] = rec

        return result

    # UTILITY
    # UTILITY
    def get_stats(self) -> dict:
        semantic_status = "enabled" if self.semantic_available else "fallback_mode"

        return {
            "is_trained": self.is_trained,
            "total_blogs": len(self.blogs_df) if self.blogs_df is not None else 0,
            "mae": round(self.mae, 4) if self.mae is not None else None,
            "mae_interpretation": (
                self._interpret_mae(self.mae)
                if self.mae is not None
                else None
            ),
            "algorithm": "Hybrid: TF-IDF + Semantic + Hot Score",

            "semantic_enabled": self.semantic_available,
            "semantic_status": semantic_status,
            "semantic_model": (
                "paraphrase-multilingual-MiniLM-L12-v2"
                if self.semantic_available
                else None
            ),
            "semantic_error": SEMANTIC_ERROR,
            "fallback_mode": not self.semantic_available,

            "weights": {
                "tfidf": 0.4 if self.semantic_available else 0.8,
                "semantic": 0.4 if self.semantic_available else 0.0,
                "hot_score": 0.2
            }
        }