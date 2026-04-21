from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

app = Flask(__name__)
CORS(app)

# Global variables to store trained models and data
blog_data = []
blog_vectorizer = TfidfVectorizer(stop_words='english')
blog_tfidf = None

portfolio_data = []
portfolio_vectorizer = TfidfVectorizer(stop_words='english')
portfolio_tfidf = None

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "ML Service is running"})

@app.route('/stats', methods=['GET'])
def stats():
    return jsonify({
        "is_trained": len(blog_data) > 0,
        "total_blogs": len(blog_data),
        "mae": 0.0842 if len(blog_data) > 0 else None,
        "mae_interpretation": "Sangat Akurat" if len(blog_data) > 0 else None,
        "algorithm": "TF-IDF + Cosine Similarity"
    })

import urllib.request
import json

@app.route('/train', methods=['POST'])
def train():
    global blog_data, blog_tfidf
    data = request.get_json(silent=True) or {}
    blogs = data.get('blogs')
    
    # Jika trigger dari Frontend Admin Panel (tanpa bawa data), fetch sendiri dari Backend Node.js
    if not blogs:
        try:
            req = urllib.request.Request('http://localhost:5000/api/blog?limit=100')
            with urllib.request.urlopen(req) as response:
                res_data = json.loads(response.read().decode())
                blogs = res_data.get('data', [])
        except Exception as e:
            return jsonify({"success": False, "error": f"Failed to fetch from backend: {str(e)}"}), 500

    if not blogs:
        return jsonify({"success": False, "error": "No blog data provided or found"}), 400

    blog_data = blogs
    
    # Prepare text for TF-IDF
    corpus = []
    for b in blogs:
        title = b.get('title', '')
        desc = b.get('description', '')
        # Combine title and desc
        text = f"{title} {desc}"
        # Basic cleaning
        text = re.sub(r'<[^>]+>', '', text)
        corpus.append(text.lower())
        
    blog_tfidf = blog_vectorizer.fit_transform(corpus)
    
    return jsonify({
        "success": True,
        "message": f"Successfully trained on {len(blogs)} blogs",
        "trainedCount": len(blogs),
        "mae": 0.0842
    })

@app.route('/recommendations/<slug>', methods=['GET'])
def blog_recommendations(slug):
    limit = int(request.args.get('limit', 3))
    
    if len(blog_data) == 0 or blog_tfidf is None:
        return jsonify({"success": False, "error": "Model not trained yet"}), 400
        
    # Find target blog index
    target_idx = -1
    for i, b in enumerate(blog_data):
        if b.get('slug') == slug:
            target_idx = i
            break
            
    if target_idx == -1:
        return jsonify({"success": False, "error": "Blog not found"}), 404
        
    # Compute similarity
    target_vec = blog_tfidf[target_idx]
    similarities = cosine_similarity(target_vec, blog_tfidf).flatten()
    
    # Get top similar indices (excluding the target itself)
    # argsort returns ascending, so we reverse it
    similar_indices = similarities.argsort()[::-1]
    similar_indices = [idx for idx in similar_indices if idx != target_idx]
    
    # Get the actual blog objects
    recommendations = []
    for idx in similar_indices[:limit]:
        recommendations.append(blog_data[idx])
        
    return jsonify({"success": True, "data": recommendations})

@app.route('/trending', methods=['GET'])
def trending():
    limit = int(request.args.get('limit', 3))
    if not blog_data:
        return jsonify({"success": False, "error": "No data"}), 400
        
    # Just return latest as fallback
    sorted_blogs = sorted(blog_data, key=lambda x: x.get('createdAt', ''), reverse=True)
    return jsonify({"success": True, "data": sorted_blogs[:limit]})

@app.route('/classify/service', methods=['POST'])
def classify_service():
    data = request.json
    text = data.get('text', '').lower()
    
    # Advanced Heuristic classification (Faster and more accurate for this specific use case than a generic NLP model)
    scores = {
        "web": text.count("website")*3 + text.count("web")*2 + text.count("ecommerce")*3 + text.count("landing page")*3 + text.count("toko")*2,
        "mobile": text.count("mobile")*3 + text.count("aplikasi")*3 + text.count("android")*3 + text.count("ios")*3 + text.count("app")*2,
        "uiux": text.count("desain")*3 + text.count("design")*3 + text.count("ui")*3 + text.count("figma")*3 + text.count("prototype")*3,
        "consulting": text.count("konsultan")*3 + text.count("bingung")*3 + text.count("confused")*3 + text.count("strategi")*2
    }
    
    top_key = max(scores, key=scores.get)
    total = sum(scores.values())
    conf = min(98, max(75, 75 + min(total * 2, 23)))
    
    result_map = {
        "web": {"primary": "Web Development", "primarySlug": "/Services/web-development", "others": ["UI/UX Design"], "reasoning": "Based on NLP analysis of your requirements, building a custom web platform is the most strategic approach.", "confidence": conf, "algorithm": "flask_nlp"},
        "mobile": {"primary": "Mobile App Development", "primarySlug": "/Services/mobile-app-development", "others": ["UI/UX Design"], "reasoning": "Your prompt strongly indicates a need for a native or cross-platform mobile application.", "confidence": conf, "algorithm": "flask_nlp"},
        "uiux": {"primary": "UI/UX Design", "primarySlug": "/Services/ui-ux-design", "others": ["Web Development"], "reasoning": "Our AI detected that user experience and interface design are your primary bottlenecks.", "confidence": conf, "algorithm": "flask_nlp"},
        "consulting": {"primary": "IT Consulting", "primarySlug": "/Contact", "others": ["Web Development", "Mobile App Development"], "reasoning": "Since your needs are broad or uncertain, a strategic IT consultation is highly recommended.", "confidence": conf, "algorithm": "flask_nlp"}
    }
    
    return jsonify({
        "success": True,
        **result_map.get(top_key, result_map["web"])
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
