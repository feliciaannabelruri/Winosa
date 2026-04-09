"""
ML Recommendation Microservice — Winosa
========================================
Flask API: blog recommendation + service/plan classifier

Endpoints:
  GET  /health
  POST /train
  GET  /recommendations/<slug>?limit=3
  GET  /trending?limit=5
  GET  /stats
  POST /classify/service   ← BARU: ganti HF API di SectionServiceRecommend.tsx
  POST /classify/plan      ← BARU: ganti HF API di SmartRecommend.tsx

Run:
  pip install -r requirements.txt
  python app.py
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from recommendation_model import BlogRecommendationModel
import requests
import os
import logging
import numpy as np
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# ── CONFIG ────────────────────────────────────────────────────────────────────
BACKEND_API_URL = os.getenv("BACKEND_API_URL", "http://localhost:5000/api")
ML_PORT         = int(os.getenv("PORT", os.getenv("ML_PORT", 7860)))
AUTO_TRAIN      = os.getenv("AUTO_TRAIN", "true").lower() == "true"

# Singleton blog recommendation model
model = BlogRecommendationModel()


# ══════════════════════════════════════════════════════════════════════════════
#  CLASSIFIER DATA
#  Keyword scoring — menggantikan HF API (facebook/bart-large-mnli)
#  Keunggulan: cepat (<5ms), tidak perlu GPU, tidak perlu internet, offline-ready
# ══════════════════════════════════════════════════════════════════════════════

SERVICE_LABELS = {
    "web-development": {
        "name": "Web Development",
        "slug": "/Services/web-development",
        "keywords": [
            # EN
            "website", "web", "company profile", "landing page", "ecommerce",
            "online shop", "portal", "cms", "corporate website", "e-commerce",
            "blog website", "news website", "web application",
            # ID
            "toko online", "website toko", "marketplace", "profil perusahaan",
            "website perusahaan", "situs web", "halaman web",
        ],
    },
    "mobile-app-development": {
        "name": "Mobile App Development",
        "slug": "/Services/mobile-app-development",
        "keywords": [
            # EN
            "mobile", "android", "ios", "app", "flutter",
            "react native", "cross platform", "push notification",
            "booking app", "delivery app", "fintech app", "mobile application",
            "smartphone app", "apk",
            # ID
            "aplikasi", "aplikasi mobile", "notifikasi",
        ],
    },
    "ui-ux-design": {
        "name": "UI/UX Design",
        "slug": "/Services/ui-ux-design",
        "keywords": [
            # EN
            "ui", "ux", "figma", "prototype", "wireframe",
            "interface", "mockup", "design system", "redesign",
            "user interface", "user experience", "branding", "visual design",
            # ID
            "desain", "tampilan", "design",
        ],
    },
    "it-consulting": {
        "name": "IT Consulting",
        "slug": "/Contact",
        "keywords": [
            # EN
            "consulting", "strategy", "roadmap", "audit", "advise",
            "digital transformation", "tech strategy", "confused", "not sure",
            # ID
            "konsultan", "konsultasi", "strategi", "bingung",
            "tidak yakin", "belum tahu", "saran", "panduan",
        ],
    },
}

PLAN_LABELS = {
    "starter": {
        "keywords": [
            # EN
            "small", "basic", "limited", "begin", "simple", "mvp",
            "1-3 pages", "few features", "low budget", "cheap",
            # ID
            "baru mulai", "startup", "budget terbatas", "murah", "sederhana",
            "pertama", "umkm", "kecil", "awal", "landing page",
            "1 sampai 3", "sedikit fitur", "coba-coba",
        ],
    },
    "business": {
        "keywords": [
            # EN
            "growing", "scale", "ecommerce", "payment", "cms", "analytics",
            "dashboard", "multi user", "team", "medium",
            "design system", "prototype",
            # ID
            "berkembang", "menengah", "tumbuh", "bisnis aktif",
            "sudah berjalan", "android ios",
        ],
    },
    "enterprise": {
        "keywords": [
            # EN
            "enterprise", "large", "corporation", "high traffic",
            "dedicated", "sla", "ux research", "custom integration",
            "complex api", "thousands", "multinational",
            # ID
            "skala besar", "ribuan", "custom integrasi", "multinasional",
            "integrasi kompleks", "api custom", "perusahaan besar",
            "roadmap teknis",
        ],
    },
}

REASONING_MAP = {
    "web-development":        "Berdasarkan kebutuhan kamu, membangun website profesional adalah langkah paling strategis dan efektif.",
    "mobile-app-development": "Kebutuhan kamu mengarah ke pengembangan aplikasi mobile. Kami rekomendasikan mulai dari UI/UX untuk pengalaman pengguna yang solid.",
    "ui-ux-design":           "Desain yang matang adalah kunci produk digital yang sukses. Mulai dari riset dan wireframing untuk fondasi yang kuat.",
    "it-consulting":          "Konsultasi dulu adalah langkah paling bijak. Tim kami siap membantu memetakan kebutuhan teknismu bersama.",
}


# ── Helpers ───────────────────────────────────────────────────────────────────

def keyword_score(text: str, keywords: list) -> int:
    """Hitung berapa keyword yang cocok dalam teks."""
    t = text.lower()
    return sum(1 for kw in keywords if kw in t)


def run_classify_service(text: str) -> dict:
    scores = {k: keyword_score(text, v["keywords"]) for k, v in SERVICE_LABELS.items()}
    best   = max(scores, key=scores.get)
    total  = sum(scores.values()) or 1
    conf   = round(min(97, 65 + (scores[best] / total) * 32))

    others = [
        SERVICE_LABELS[k]["name"]
        for k, s in sorted(scores.items(), key=lambda x: -x[1])
        if k != best and s > 0
    ][:2]

    return {
        "primary":     SERVICE_LABELS[best]["name"],
        "primarySlug": SERVICE_LABELS[best]["slug"],
        "others":      others,
        "confidence":  conf,
        "reasoning":   REASONING_MAP[best],
        "algorithm":   "keyword_classifier_v1",
    }


def run_classify_plan(text: str, service_type: str = "web") -> dict:
    scores = {k: keyword_score(text, v["keywords"]) for k, v in PLAN_LABELS.items()}
    total  = sum(scores.values())

    if total == 0:
        best = "business"
        conf = 73
    else:
        best = max(scores, key=scores.get)
        conf = round(min(97, 73 + (scores[best] / total) * 24))

    return {
        "tier":       best,
        "confidence": conf,
        "algorithm":  "keyword_classifier_v1",
    }


# ══════════════════════════════════════════════════════════════════════════════
#  BLOG RECOMMENDATION HELPERS
# ══════════════════════════════════════════════════════════════════════════════

def train_model() -> dict:
    if not blogs:
        return {"success": False, "error": "No blogs fetched from backend"}
    return model.train(blogs)


# ══════════════════════════════════════════════════════════════════════════════
#  ROUTES — Blog Recommendation (existing, tidak diubah)
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"service": "winosa-ml-service", "status": "ok", **model.get_stats()})


@app.route("/train", methods=["POST"])
def train():
    data = request.get_json(silent=True) or {}
    blogs = data.get("blogs", [])

    if not blogs:
        return jsonify({
            "success": False,
            "error": "No blogs provided"
        }), 400

    result = model.train(blogs)

    return jsonify(result), (200 if result.get("success") else 500)


@app.route("/stats", methods=["GET"])
def stats():
    return jsonify(model.get_stats())


@app.route("/trending", methods=["GET"])
def trending():
    if not model.is_trained:
        result = train_model()
        if not result.get("success"):
            return jsonify({"success": False, "error": "Model training failed", "data": []}), 500

    limit          = int(request.args.get("limit", 5))
    indices        = np.argsort(model.hot_scores)[::-1][:limit]
    output_cols    = ["title", "slug", "excerpt", "image", "author", "tags", "views", "readTime", "createdAt"]
    available_cols = [c for c in output_cols if c in model.blogs_df.columns]
    result         = model.blogs_df.iloc[indices][available_cols].to_dict("records")

    for i, rec in enumerate(result):
        rec["_hot_score"] = round(float(model.hot_scores[indices[i]]), 4)

    return jsonify({
        "success":   True,
        "algorithm": "Hot Score (views × recency decay)",
        "count":     len(result),
        "data":      result,
    })


@app.route("/recommendations/<slug>", methods=["GET"])
def recommendations(slug):
    if not model.is_trained:
        result = train_model()
        if not result.get("success"):
            return jsonify({"success": False, "error": "Model training failed", "data": []}), 500

    limit = int(request.args.get("limit", 3))
    recs  = model.get_recommendations(slug, n=limit)

    return jsonify({
        "success":          True,
        "algorithm":        "Hybrid: TF-IDF + Semantic + Hot Score",
        "semantic_enabled": model.semantic_available,
        "mae":              round(model.mae, 4) if model.mae else None,
        "count":            len(recs),
        "data":             recs,
    })


# ══════════════════════════════════════════════════════════════════════════════
#  ROUTES — Service & Plan Classifier  ← BARU
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/classify/service", methods=["POST"])
def classify_service_route():
    """
    Rekomendasiin layanan Winosa dari teks kebutuhan user.

    Request:
      POST /classify/service
      { "text": "saya butuh website toko online dengan pembayaran" }

    Response:
      {
        "success": true,
        "primary": "Web Development",
        "primarySlug": "/Services/web-development",
        "others": ["UI/UX Design"],
        "confidence": 82,
        "reasoning": "...",
        "algorithm": "keyword_classifier_v1"
      }

    Dipakai oleh  : SectionServiceRecommend.tsx
    Menggantikan  : HF API (facebook/bart-large-mnli) — cold start 10-30 detik
    Response time : <5ms
    """
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()

    if len(text) < 3:
        return jsonify({"success": False, "error": "Text too short (min 3 chars)"}), 400

    result = run_classify_service(text)
    logger.info(f"[/classify/service] '{text[:60]}' → {result['primary']} ({result['confidence']}%)")
    return jsonify({"success": True, **result})


@app.route("/classify/plan", methods=["POST"])
def classify_plan_route():
    """
    Rekomendasiin pricing tier dari teks kebutuhan user.

    Request:
      POST /classify/plan
      { "text": "startup baru budget terbatas mvp", "service_type": "web" }

    Response:
      {
        "success": true,
        "tier": "starter",
        "confidence": 85,
        "algorithm": "keyword_classifier_v1"
      }

    Dipakai oleh  : SmartRecommend.tsx, SectionPlanWithRecommend.tsx
    Menggantikan  : HF API (facebook/bart-large-mnli)
    Response time : <5ms
    """
    data         = request.get_json(silent=True) or {}
    text         = (data.get("text") or "").strip()
    service_type = data.get("service_type", "web")

    if len(text) < 3:
        return jsonify({"success": False, "error": "Text too short (min 3 chars)"}), 400

    result = run_classify_plan(text, service_type)
    logger.info(f"[/classify/plan] '{text[:60]}' → tier={result['tier']} ({result['confidence']}%)")
    return jsonify({"success": True, **result})


# ══════════════════════════════════════════════════════════════════════════════
#  ERROR HANDLERS
# ══════════════════════════════════════════════════════════════════════════════

@app.errorhandler(404)
def not_found(e):
    return jsonify({"success": False, "error": "Endpoint not found"}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({"success": False, "error": str(e)}), 500


# ══════════════════════════════════════════════════════════════════════════════
#  MAIN
# ══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    logger.info("=" * 55)
    logger.info("🤖 Winosa ML Service")
    logger.info(f"   Backend API : {BACKEND_API_URL}")
    logger.info(f"   ML Port     : {ML_PORT}")
    logger.info("   Endpoints:")
    logger.info("     GET  /health")
    logger.info("     POST /train")
    logger.info("     GET  /recommendations/<slug>")
    logger.info("     GET  /trending")
    logger.info("     GET  /stats")
    logger.info("     POST /classify/service  ← NEW")
    logger.info("     POST /classify/plan     ← NEW")
    logger.info("=" * 55)

    if AUTO_TRAIN:
        logger.info("Skipping auto-train, waiting for backend trigger...")
        result = train_model()
        if result.get("success"):
            logger.info(f"Training done! MAE = {result.get('mae', 'N/A')}")
        else:
            logger.warning(f"Blog training skipped: {result.get('error')}")

    app.run(host="0.0.0.0", port=ML_PORT, debug=False)