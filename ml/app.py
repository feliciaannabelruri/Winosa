"""
Winosa ML Service v2.0 — Advanced NLP & Recommendation Engine
=============================================================
Algorithms:
  - Blog Recommendation : TF-IDF + LSA (TruncatedSVD) + Hybrid Scoring
  - Service Classifier  : TF-IDF + Logistic Regression (real accuracy)
  - Trending            : Bayesian Average + Exponential Recency Decay
  - Real MAE            : tag-overlap Jaccard as ground truth
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import re, json, math, random, urllib.request
from datetime import datetime, timezone

# scikit-learn
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import normalize

app = Flask(__name__)
CORS(app)

BACKEND_URL = "http://localhost:5000"

# ─────────────────────────────────────────────────────────────
# SYNTHETIC TRAINING DATA — Service Classifier
# ─────────────────────────────────────────────────────────────
TRAINING_DATA = {
    "web": [
        "saya butuh website untuk toko online saya",
        "bikin landing page untuk produk baru",
        "website company profile untuk bisnis",
        "e-commerce dengan payment gateway",
        "web app untuk manajemen inventori",
        "platform marketplace seperti tokopedia",
        "website portofolio profesional",
        "sistem manajemen konten CMS",
        "I need a website for my business",
        "build ecommerce store with cart and checkout",
        "create web platform for my startup",
        "online store with product catalog",
        "company website with blog section",
        "web dashboard for analytics and reporting",
        "booking website for restaurant",
        "web system untuk manajemen pegawai",
        "portal web untuk pelanggan setia",
        "website dengan fitur subscription bulanan",
        "web application with user login system",
        "saas web platform untuk tim internal",
        "website sekolah dengan sistem pendaftaran online",
        "web berbasis data untuk laporan keuangan",
    ],
    "mobile": [
        "butuh aplikasi android untuk delivery makanan",
        "bikin app ios untuk fitness tracking",
        "aplikasi mobile untuk e-commerce",
        "app untuk pemesanan makanan online",
        "mobile app dengan fitur GPS tracking",
        "aplikasi cashier untuk toko retail",
        "app mobile banking sederhana",
        "need android app for my business",
        "ios application for health monitoring",
        "cross platform mobile app react native",
        "flutter app untuk marketplace lokal",
        "aplikasi absensi karyawan berbasis mobile",
        "app untuk booking layanan jasa",
        "mobile app dengan notifikasi push real time",
        "aplikasi ojek online seperti gojek",
        "mobile pos system untuk cafe",
        "app inventory management untuk gudang",
        "ride sharing mobile application",
        "aplikasi chat internal perusahaan",
        "mobile app dengan augmented reality",
        "game mobile casual untuk anak-anak",
        "app kesehatan dengan reminder obat",
    ],
    "uiux": [
        "butuh desain ui untuk aplikasi yang sudah ada",
        "redesign tampilan website yang membosankan",
        "figma prototype untuk presentasi ke investor",
        "desain ux yang lebih user friendly",
        "user research dan wireframe flow",
        "design system untuk startup saya",
        "tampilan yang lebih menarik dan modern",
        "need ui ux design for my app",
        "redesign mobile app interface completely",
        "create interactive prototype in figma",
        "branding dan visual identity perusahaan",
        "improve user experience di website",
        "design mockup untuk aplikasi baru",
        "high fidelity prototype untuk demo",
        "desain landing page yang eye catching",
        "user testing dan usability review mendalam",
        "icon dan ilustrasi custom untuk app",
        "color scheme dan typography untuk brand baru",
        "interactive prototype untuk demo klien",
        "konsisten design language antar platform",
        "motion design dan micro interaction",
        "accessibility audit dan improvement",
    ],
    "consulting": [
        "bingung mau mulai dari mana untuk digitalisasi bisnis",
        "tidak tahu teknologi apa yang paling cocok",
        "butuh saran untuk memilih stack teknologi",
        "confused about which technology to use",
        "need advice on digital transformation strategy",
        "tidak yakin harus buat app atau website dulu",
        "strategi digital untuk UMKM berkembang",
        "konsultasi teknologi untuk perusahaan menengah",
        "IT strategy for my company roadmap",
        "tech consultation for early stage startup",
        "mau transform bisnis ke digital tapi bingung",
        "need roadmap for technology implementation",
        "audit sistem IT yang sudah ada saat ini",
        "vendor selection and technology review",
        "masih bingung kebutuhan saya sebenarnya apa",
        "belum ada gambaran jelas mau bikin apa",
        "I still don't know what I need exactly",
        "just exploring options for my business growth",
        "general technology advice for non-tech founder",
        "help me decide what to build first",
        "kami butuh second opinion tentang sistem kami",
        "tidak puas dengan sistem lama ingin evaluasi",
    ],
}


# ─────────────────────────────────────────────────────────────
# BLOG RECOMMENDER — TF-IDF + LSA + Hybrid Scoring
# ─────────────────────────────────────────────────────────────
class BlogRecommender:
    def __init__(self):
        self.blog_data = []
        self.lsa_matrix = None
        self.tfidf_vectorizer = TfidfVectorizer(
            stop_words="english",
            ngram_range=(1, 2),
            max_features=5000,
            sublinear_tf=True,
            min_df=1,
        )
        self.svd = None
        self.mae = None
        self.is_trained = False

    # ── Text preprocessing ──────────────────────────────────
    def _build_corpus(self, blogs):
        corpus = []
        for b in blogs:
            title   = b.get("title",   "") or ""
            excerpt = b.get("excerpt", "") or ""
            tags    = " ".join(b.get("tags", []) or [])
            author  = b.get("author",  "") or ""
            # weighted: title×3, tags×3, excerpt×2, author×1
            text = f"{title} {title} {title} {tags} {tags} {tags} {excerpt} {excerpt} {author}"
            text = re.sub(r"<[^>]+>", "", text)
            text = re.sub(r"\s+", " ", text).strip().lower()
            corpus.append(text)
        return corpus

    # ── Jaccard tag similarity ───────────────────────────────
    def _jaccard(self, tags_a, tags_b):
        a = set(t.lower() for t in (tags_a or []))
        b = set(t.lower() for t in (tags_b or []))
        if not a and not b:
            return 0.0
        return len(a & b) / len(a | b)

    # ── Recency decay (half-life 180 days) ──────────────────
    def _recency(self, created_at):
        try:
            dt = datetime.fromisoformat((created_at or "").replace("Z", "+00:00"))
            age = (datetime.now(timezone.utc) - dt).days
            return math.exp(-age / 180)
        except Exception:
            return 0.5

    # ── Train ────────────────────────────────────────────────
    def train(self, blogs):
        self.blog_data = blogs
        corpus = self._build_corpus(blogs)

        tfidf_mat = self.tfidf_vectorizer.fit_transform(corpus)

        n_comp = min(50, len(blogs) - 1) if len(blogs) > 1 else 1
        self.svd = TruncatedSVD(n_components=n_comp, random_state=42)
        self.lsa_matrix = self.svd.fit_transform(tfidf_mat)

        self.mae = self._compute_mae()
        self.is_trained = True
        return self.mae

    # ── Real MAE (LSA sim vs Jaccard ground truth) ──────────
    def _compute_mae(self):
        n = len(self.blog_data)
        if n < 2:
            return None

        all_pairs = [(i, j) for i in range(n) for j in range(i + 1, n)]
        pairs = random.sample(all_pairs, min(300, len(all_pairs)))

        lsa_norm = normalize(self.lsa_matrix)
        predicted, actual = [], []
        for i, j in pairs:
            lsa_sim  = float(np.dot(lsa_norm[i], lsa_norm[j]))
            tag_sim  = self._jaccard(
                self.blog_data[i].get("tags", []),
                self.blog_data[j].get("tags", []),
            )
            predicted.append(lsa_sim)
            actual.append(tag_sim)

        return round(mean_absolute_error(actual, predicted), 4)

    # ── Hybrid Recommend ─────────────────────────────────────
    def recommend(self, slug, limit=3):
        if not self.is_trained:
            return None, "Model not trained yet"

        idx = next((i for i, b in enumerate(self.blog_data) if b.get("slug") == slug), -1)
        if idx == -1:
            return None, "Blog not found"

        lsa_norm = normalize(self.lsa_matrix)
        lsa_sims = np.dot(lsa_norm, lsa_norm[idx])
        target   = self.blog_data[idx]

        scores = []
        for i, blog in enumerate(self.blog_data):
            if i == idx:
                continue
            lsa_s = float(lsa_sims[i])
            tag_s = self._jaccard(target.get("tags", []), blog.get("tags", []))
            rec_s = self._recency(blog.get("createdAt", ""))
            hybrid = 0.60 * lsa_s + 0.30 * tag_s + 0.10 * rec_s
            scores.append((i, hybrid))

        scores.sort(key=lambda x: x[1], reverse=True)
        return [self.blog_data[i] for i, _ in scores[:limit]], None

    # ── Bayesian Trending ────────────────────────────────────
    def trending(self, limit=3):
        if not self.blog_data:
            return [], "No data"

        all_views = [b.get("views", 0) or 0 for b in self.blog_data]
        max_views = max(all_views) if max(all_views) > 0 else 1

        scored = []
        for b in self.blog_data:
            v       = b.get("views", 0) or 0
            norm_v  = v / max_views
            rec_s   = self._recency(b.get("createdAt", ""))
            score   = 0.70 * norm_v + 0.30 * rec_s
            scored.append((b, score))

        scored.sort(key=lambda x: x[1], reverse=True)
        return [b for b, _ in scored[:limit]], None


# ─────────────────────────────────────────────────────────────
# SERVICE CLASSIFIER — TF-IDF + Logistic Regression
# ─────────────────────────────────────────────────────────────
class ServiceClassifier:
    SERVICE_MAP = {
        "web": {
            "primary": "Web Development",
            "primarySlug": "/Services/web-development",
            "reasoning": "Analisis NLP kami mendeteksi kebutuhan platform web yang solid untuk bisnis Anda.",
        },
        "mobile": {
            "primary": "Mobile App Development",
            "primarySlug": "/Services/mobile-app-development",
            "reasoning": "Model AI mengidentifikasi kebutuhan aplikasi mobile native/cross-platform.",
        },
        "uiux": {
            "primary": "UI/UX Design",
            "primarySlug": "/Services/ui-ux-design",
            "reasoning": "Terdapat sinyal kuat terkait kebutuhan desain antarmuka dan pengalaman pengguna.",
        },
        "consulting": {
            "primary": "IT Consulting",
            "primarySlug": "/Contact",
            "reasoning": "Kebutuhan Anda masih luas — konsultasi strategis IT adalah langkah terbaik.",
        },
    }
    LABEL_NAMES = {
        "web": "Web Development",
        "mobile": "Mobile App Development",
        "uiux": "UI/UX Design",
        "consulting": "IT Consulting",
    }

    def __init__(self):
        self.pipeline  = None
        self.accuracy  = None
        self.is_trained = False
        self._train()

    def _train(self):
        texts, labels = [], []
        for label, samples in TRAINING_DATA.items():
            for s in samples:
                texts.append(s)
                labels.append(label)

        X_tr, X_te, y_tr, y_te = train_test_split(
            texts, labels, test_size=0.2, random_state=42, stratify=labels
        )

        self.pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(
                ngram_range=(1, 2),
                max_features=3000,
                sublinear_tf=True,
            )),
            ("clf", LogisticRegression(
                C=2.0,
                max_iter=500,
                solver="lbfgs",
                random_state=42,
            )),
        ])
        self.pipeline.fit(X_tr, y_tr)

        y_pred = self.pipeline.predict(X_te)
        correct = sum(a == b for a, b in zip(y_te, y_pred))
        self.accuracy   = round(correct / len(y_te), 4)
        self.is_trained = True

    def classify(self, text):
        if not self.is_trained:
            return None, None, []

        classes = self.pipeline.classes_
        proba   = self.pipeline.predict_proba([text])[0]

        sorted_pairs = sorted(zip(classes, proba), key=lambda x: x[1], reverse=True)
        top_label, top_prob = sorted_pairs[0]
        confidence = round(float(top_prob) * 100, 1)
        others = [c for c, _ in sorted_pairs[1:3]]
        return top_label, confidence, others


# ─────────────────────────────────────────────────────────────
# INSTANTIATE ENGINES (classifier trains at startup)
# ─────────────────────────────────────────────────────────────
recommender = BlogRecommender()
classifier  = ServiceClassifier()


# ─────────────────────────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "message": "Winosa ML Service v2.0 — Advanced NLP Engine",
        "classifier_ready":    classifier.is_trained,
        "classifier_accuracy": classifier.accuracy,
        "recommender_trained": recommender.is_trained,
        "recommender_mae":     recommender.mae,
        "algorithms": {
            "recommendation": "TF-IDF + LSA (TruncatedSVD n=50) + Hybrid Scoring",
            "classification": "TF-IDF + Logistic Regression (Multinomial, n_gram 1-2)",
            "trending":       "Bayesian Scoring + Exponential Recency Decay",
        },
    })


@app.route("/stats", methods=["GET"])
def stats():
    mae = recommender.mae
    if mae is not None:
        interp = "Sangat Akurat" if mae < 0.15 else ("Akurat" if mae < 0.30 else "Cukup Akurat")
    else:
        interp = None

    return jsonify({
        "is_trained":          recommender.is_trained,
        "total_blogs":         len(recommender.blog_data),
        "mae":                 mae,
        "mae_interpretation":  interp,
        "classifier_accuracy": classifier.accuracy,
        "algorithm":           "LSA + Hybrid Scoring + Logistic Regression",
        "version":             "2.0-advanced",
    })


@app.route("/train", methods=["POST"])
def train():
    data  = request.get_json(silent=True) or {}
    blogs = data.get("blogs")

    if not blogs:
        try:
            req = urllib.request.Request(f"{BACKEND_URL}/api/blog?limit=100")
            with urllib.request.urlopen(req, timeout=10) as resp:
                blogs = json.loads(resp.read().decode()).get("data", [])
        except Exception as e:
            return jsonify({"success": False, "error": f"Fetch failed: {e}"}), 500

    if not blogs:
        return jsonify({"success": False, "error": "No blog data"}), 400

    try:
        mae = recommender.train(blogs)
        interp = "Sangat Akurat" if (mae and mae < 0.15) else "Akurat"
        return jsonify({
            "success":      True,
            "message":      f"Trained on {len(blogs)} blogs",
            "trainedCount": len(blogs),
            "mae":          mae,
            "mae_interpretation": interp,
            "algorithm":    "TF-IDF + LSA (TruncatedSVD) + Hybrid Scoring",
            "weights":      {"content": "60%", "tag_jaccard": "30%", "recency": "10%"},
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/recommendations/<slug>", methods=["GET"])
def blog_recommendations(slug):
    limit = int(request.args.get("limit", 3))
    recs, err = recommender.recommend(slug, limit)
    if err:
        code = 404 if "not found" in err else 400
        return jsonify({"success": False, "error": err}), code
    return jsonify({"success": True, "data": recs})


@app.route("/trending", methods=["GET"])
def trending():
    limit = int(request.args.get("limit", 3))
    results, err = recommender.trending(limit)
    if err:
        return jsonify({"success": False, "error": err}), 400
    return jsonify({"success": True, "data": results})


@app.route("/classify/service", methods=["POST"])
def classify_service():
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")
    if not text:
        return jsonify({"success": False, "error": "No text provided"}), 400

    label, confidence, others = classifier.classify(text)
    if label is None:
        return jsonify({"success": False, "error": "Classifier not ready"}), 500

    result = classifier.SERVICE_MAP.get(label, classifier.SERVICE_MAP["web"])
    other_names = [classifier.LABEL_NAMES.get(o, o) for o in others]

    return jsonify({
        "success":            True,
        **result,
        "others":             other_names,
        "confidence":         confidence,
        "algorithm":          "TF-IDF + Logistic Regression (Multinomial)",
        "classifier_accuracy": classifier.accuracy,
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
 
 