"""
ML Recommendation Microservice
================================
Flask API yang melayani rekomendasi blog berbasis ML.

Endpoint:
  GET  /health                         → cek status service & MAE
  POST /train                          → latih ulang model
  GET  /recommendations/<slug>?limit=3 → dapatkan rekomendasi
  GET  /stats                          → statistik model

Cara run:
  pip install -r requirements.txt
  python app.py

  (atau dengan env variable)
  BACKEND_API_URL=http://localhost:5000/api python app.py
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from recommendation_model import BlogRecommendationModel
import requests
import os
import logging
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # izinkan request dari backend Node.js


#  CONFIG                                                              
BACKEND_API_URL = os.getenv("BACKEND_API_URL", "http://localhost:5000/api")
ML_PORT         = int(os.getenv("ML_PORT", 5001))
AUTO_TRAIN      = os.getenv("AUTO_TRAIN", "true").lower() == "true"

# Singleton model — satu instance untuk semua request
model = BlogRecommendationModel()

#  HELPER                                                              
def fetch_blogs_from_backend() -> list:
    """Ambil semua blog published dari backend Node.js."""
    try:
        url = f"{BACKEND_API_URL}/blog?limit=100"
        logger.info(f"Fetching blogs from: {url}")
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        blogs = data.get("data", [])
        logger.info(f"Fetched {len(blogs)} blogs")
        return blogs
    except requests.RequestException as e:
        logger.error(f"Failed to fetch blogs: {e}")
        return []


def train_model() -> dict:
    """Fetch data & latih model. Return hasil training."""
    blogs = fetch_blogs_from_backend()
    if not blogs:
        return {"success": False, "error": "No blogs fetched from backend"}
    return model.train(blogs)

#  ROUTES                                                              
@app.route("/health", methods=["GET"])
def health():
    """Health check — juga return MAE supaya bisa ditampilkan di admin."""
    stats = model.get_stats()
    return jsonify({
        "service": "blog-recommendation-ml",
        "status": "ok",
        **stats,
    })


@app.route("/train", methods=["POST"])
def train():
    """
    Latih ulang model. Dipanggil setelah ada blog baru di admin.
    
    Contoh: POST http://localhost:5001/train
    """
    result = train_model()
    status_code = 200 if result.get("success") else 500
    return jsonify(result), status_code


@app.route("/stats", methods=["GET"])
def stats():
    """
    Statistik model — ditampilkan di admin analytics.
    
    Response:
    {
      "is_trained": true,
      "total_blogs": 15,
      "mae": 0.0812,
      "mae_interpretation": "Excellent — prediksi sangat akurat",
      "algorithm": "TF-IDF Cosine Similarity + Ridge Regression"
    }
    """
    return jsonify(model.get_stats())


@app.route("/recommendations/<slug>", methods=["GET"])
def recommendations(slug):
    """
    Dapatkan rekomendasi blog.
    
    Params:
      slug  : slug blog yang sedang dibaca
      limit : jumlah rekomendasi (default 3)
    
    Contoh:
      GET http://localhost:5001/recommendations/getting-started-with-react?limit=3
    
    Response:
    {
      "success": true,
      "algorithm": "TF-IDF Cosine Similarity + Ridge Regression",
      "mae": 0.0812,
      "count": 3,
      "data": [{ "title": "...", "slug": "...", ... }]
    }
    """
    # Auto-train jika belum pernah dilatih
    if not model.is_trained:
        logger.info("Model belum dilatih, mulai training otomatis...")
        result = train_model()
        if not result.get("success"):
            return jsonify({
                "success": False,
                "error": "Model training failed",
                "data": [],
            }), 500

    limit = int(request.args.get("limit", 3))
    recs  = model.get_recommendations(slug, n=limit)

    return jsonify({
        "success": True,
        "algorithm": "TF-IDF Cosine Similarity + Ridge Regression",
        "mae": round(model.mae, 4) if model.mae else None,
        "count": len(recs),
        "data": recs,
    })

#  ERROR HANDLERS                                                      
@app.errorhandler(404)
def not_found(e):
    return jsonify({"success": False, "error": "Endpoint not found"}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({"success": False, "error": str(e)}), 500

#  MAIN                                                                
if __name__ == "__main__":
    logger.info("=" * 50)
    logger.info("🤖 Blog Recommendation ML Service")
    logger.info(f"   Backend API : {BACKEND_API_URL}")
    logger.info(f"   ML Port     : {ML_PORT}")
    logger.info("=" * 50)

    if AUTO_TRAIN:
        logger.info("Auto-training model on startup...")
        result = train_model()
        if result.get("success"):
            logger.info(f"✅ Training done! MAE = {result['mae']}")
        else:
            logger.warning(f"⚠️  Training failed: {result.get('error')}")

    app.run(host="0.0.0.0", port=ML_PORT, debug=False)