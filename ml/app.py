from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import re, json, math, random, urllib.request
from datetime import datetime, timezone

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
        "buat website custom untuk perusahaan logistik",
        "bikin platform e-learning dengan video streaming",
        "website portal berita dan artikel online",
        "need a web portal for my real estate business",
        "toko online fashion dengan filter produk",
        "website wedding organizer dengan galeri foto",
        "sistem pemesanan tiket berbasis web",
        "web portal HR dengan absensi dan payroll",
        "platform belajar online seperti coursera",
        "web app klinik dengan rekam medis digital",
        "website property listing seperti rumah123",
        "create a web app for project management",
        "build a SaaS billing and invoicing platform",
        "web system for hospital appointment booking",
        "enterprise resource planning ERP web system",
        "web based point of sale system for retail",
        "multi vendor marketplace with seller dashboard",
        "news aggregator portal with admin moderation",
        "customer support ticket system web app",
        "website travel agent dengan booking hotel",
        "platform lelang online dengan real time bidding",
        "web app monitoring karyawan remote",
        "web portal untuk distributor dan reseller",
        "website donation platform dengan tracking",
        "create corporate website with multilingual support",
        "website gym dengan fitur membership dan jadwal",
        "sistem antrian online untuk klinik gigi",
        "web app rekrutmen dengan ATS dan interview scheduler",
        "platform crowdfunding untuk proyek sosial",
        "create a web dashboard for fleet management",
        "build online examination system for university",
        "web app laundry management dengan notifikasi SMS",
        "website untuk jasa cleaning service dengan booking",
        "online course platform with quiz and certificate",
        "web admin panel untuk manage konten aplikasi",
        "website toko buku dengan rekomendasi AI",
        "ik heb een website nodig voor mijn bedrijf",
        "bouw een e-commerce winkel met winkelmandje",
        "maak een webplatform voor mijn startup",
        "online winkel met productcatalogus",
        "bedrijfswebsite met blogsectie",
        "webdashboard voor analyse dan rapportage",
        "boekingswebsite voor restaurant",
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
        "bikin aplikasi mobile untuk kasir restoran",
        "build an ios and android app for dating",
        "aplikasi kasir POS mobile bluetooth printer",
        "app logistik untuk tracking pengiriman paket",
        "mobile app for loyalty program and coupons",
        "mobiele app voor eten bezorgen",
        "maak een fitness-tracker app voor ios",
        "mobiele app voor e-commerce winkel",
        "app voor online eten bestellen",
        "mobiele app met GPS-trackingfunctie",
        "kassa-app voor de detailhandel",
        "eenvoudige app voor mobiel bankieren",
        "mobile app presensi guru dan siswa",
        "aplikasi mobile untuk petani mencatat panen",
        "build a meditation and mental health mobile app",
        "mobile app for event ticketing with QR code",
        "aplikasi pelacak pengeluaran keuangan pribadi",
        "food delivery app like grab food",
        "mobile crypto wallet app for trading",
        "app for real estate property browsing",
        "social media app for local community",
        "mobile app gym booking dan personal trainer",
        "aplikasi mobile untuk pemesanan laundry",
        "app kendaraan listrik dengan stasiun pengisian",
        "mobile learning app dengan gamification",
        "marketplace app for freelancers and clients",
        "mobile app reseller dengan katalog dan harga",
        "build a telemedicine app for doctor consultation",
        "mobile app pengelolaan kos-kosan",
        "app pemantauan gula darah dan diet",
        "parking slot finder mobile application",
        "app donasi online dengan laporan transparan",
        "mobile app absensi dengan face recognition",
        "app review produk dengan sistem poin reward",
        "build field service management mobile app",
        "mobile app untuk bengkel motor servis",
        "app raport siswa untuk orang tua",
        "grocery delivery app with subscription",
        "mobile app wedding planner checklist",
        "child safety monitoring app for parents",
        "app fleet driver management with route tracking",
        "mobile app reservasi meja restoran fine dining",
        "employee task management mobile application",
        "app bluetooth scanner untuk gudang",
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
        "butuh ui designer untuk merapikan figma",
        "redesign UX flow pendaftaran agar lebih mudah",
        "bikin animasi transisi UI yang mulus",
        "need a complete brand identity package",
        "create onboarding screens for mobile app",
        "design a dark mode version of our app",
        "UI audit and component library creation",
        "user journey mapping dan persona research",
        "desain dashboard admin yang clean dan informatif",
        "high conversion landing page visual design",
        "ontwerp van gebruikersinterface UI UX",
        "modern webdesign voor mijn merk",
        "verbeter het ontwerp van mijn mobiele app",
        "ontwerp van gebruikerservaring voor SaaS",
        "visueel ontwerp voor e-commerce platform",
        "prototyping en wireframing voor nieuwe app",
        "redesign van bestaande website interface",
        "buat design guideline untuk tim developer",
        "mau redesign logo dan visual identity bisnis",
        "create UI kit for design team collaboration",
        "desain presentasi pitch deck yang menarik",
        "improve checkout flow UX untuk toko online",
        "butuh illustrator untuk halaman empty state",
        "design notification center UI for app",
        "create responsive design for tablet and mobile",
        "UX research untuk aplikasi fintech kami",
        "butuh desain banner iklan digital yang keren",
        "create a professional email template design",
        "redesign halaman profil dan setting aplikasi",
        "buat style guide tipografi dan warna brand",
        "UI design for smartwatch companion app",
        "accessibility improvement untuk pengguna difabel",
        "create animation storyboard for app intro",
        "desain UI chat interface seperti whatsapp",
        "need UX designer for fintech onboarding flow",
        "create wireframes for marketplace checkout flow",
        "information architecture untuk portal berita",
        "visual design for company annual report",
        "revamp homepage dengan hero section yang bold",
        "buat moodboard dan direction visual untuk rebranding",
        "design interactive dashboard with charts and graphs",
        "redesign menu navigasi yang lebih intuitif",
        "membuat skeleton loading screen untuk app",
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
        "ingin merapikan arsitektur server yang sering down",
        "butuh IT konsultan untuk scale up bisnis",
        "mau migrasi dari sistem lama ke cloud",
        "butuh advice soal keamanan data pelanggan",
        "need help defining MVP for my startup",
        "ingin tahu apakah perlu microservice atau monolith",
        "evaluasi performa sistem yang lambat",
        "konsultasi untuk pilih antara native vs cross platform",
        "need technology partner for long term project",
        "apakah data kami sudah aman dari serangan hacker",
        "mau buat SOP digitalisasi untuk tim internal",
        "need a CTO on demand for my startup",
        "konsultasi migrasi database dari MySQL ke PostgreSQL",
        "ingin tau cara optimalkan biaya server cloud",
        "apakah sistem kami sudah siap scale ke 100k users",
        "butuh analisis kompetitor teknologi",
        "need gap analysis on current IT infrastructure",
        "mau tau apa yang perlu diperbaiki di sistem saya",
        "looking for a digital strategy consultant",
        "need advice on data privacy and compliance",
        "want to understand blockchain for my use case",
        "ingin implementasi AI tapi tidak tahu mulai dari mana",
        "butuh pendampingan teknis untuk tim non-IT",
        "mau evaluasi apakah perlu rebuild atau refactor",
        "konsultasi arsitektur API untuk integrasi pihak ketiga",
        "technical feasibility study for new venture",
        "IT-advies nodig voor mijn bedrijf",
        "strategische sessie voor technologie",
        "consultancy voor digitale transformatie",
        "roadmap voor softwareontwikkeling",
        "technisch advies voor schaalbaarheid",
        "beveiligingsaudit voor webapplicaties",
        "cloud-migratie strategie advies",
        "need a feasibility study for digital product",
        "ingin tahu best practice deployment CI CD",
        "apakah perlu buat PWA atau native app",
        "mau konsultasi soal database design yang optimal",
        "need advice choosing between AWS Azure GCP",
        "butuh review code dan security audit",
        "ingin tahu roadmap modernisasi legacy system",
        "konsultasi penerapan metodologi agile di tim",
        "apakah saya butuh software custom atau pakai SaaS",
        "need a technology assessment for my company",
        "mau diskusi dulu sebelum memutuskan bikin apa",
    ],
}


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

    def _jaccard(self, tags_a, tags_b):
        a = set(t.lower() for t in (tags_a or []))
        b = set(t.lower() for t in (tags_b or []))
        if not a and not b:
            return 0.0
        return len(a & b) / len(a | b)

    def _recency(self, created_at):
        try:
            dt = datetime.fromisoformat((created_at or "").replace("Z", "+00:00"))
            age = (datetime.now(timezone.utc) - dt).days
            return math.exp(-age / 180)
        except Exception:
            return 0.5

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


from sklearn.calibration import CalibratedClassifierCV
from sklearn.svm import LinearSVC

class ServiceClassifier:
    SERVICE_MAP = {
        "web": {
            "primary": "Web Development",
            "primarySlug": "/Services/web-development",
            "reasoning": "Dari deskripsi kamu, membangun platform web adalah langkah paling tepat saat ini.",
        },
        "mobile": {
            "primary": "Mobile App Development",
            "primarySlug": "/Services/mobile-app-development",
            "reasoning": "Kebutuhanmu mengarah ke aplikasi mobile yang bisa langsung dipakai pengguna dari genggaman.",
        },
        "uiux": {
            "primary": "UI/UX Design",
            "primarySlug": "/Services/ui-ux-design",
            "reasoning": "Produk yang bagus butuh tampilan yang intuitif — desain yang kuat adalah fondasi utamanya.",
        },
        "consulting": {
            "primary": "IT Consulting",
            "primarySlug": "/Contact",
            "reasoning": "Sebelum mulai build apapun, ngobrol dulu dengan tim kami untuk petakan kebutuhanmu.",
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
            texts, labels, test_size=0.15, random_state=42, stratify=labels
        )

        tfidf = TfidfVectorizer(
            ngram_range=(1, 3),
            max_features=8000,
            sublinear_tf=True,
            min_df=1,
            analyzer="word",
        )

        svc = LinearSVC(C=1.5, max_iter=2000, random_state=42)
        calibrated_clf = CalibratedClassifierCV(svc, cv=3, method="sigmoid")

        self.pipeline = Pipeline([
            ("tfidf", tfidf),
            ("clf",   calibrated_clf),
        ])
        self.pipeline.fit(X_tr, y_tr)

        y_pred = self.pipeline.predict(X_te)
        correct = sum(a == b for a, b in zip(y_te, y_pred))
        self.accuracy = round(correct / len(y_te), 4)
        self.is_trained = True

    def classify(self, text, lang="en"):
        if not self.pipeline:
            return None, None, [], "", ""

        classes = self.pipeline.classes_
        proba = self.pipeline.predict_proba([text])[0]

        sorted_pairs = sorted(zip(classes, proba), key=lambda x: x[1], reverse=True)
        top_label, top_prob = sorted_pairs[0]
        confidence = round(float(top_prob) * 100, 1)
        others = [c for c, _ in sorted_pairs[1:3]]

        ignore = {"saya", "butuh", "untuk", "bikin", "buat", "ingin", "mau", "aplikasi", "website", "web", "app", "mobile", "yang", "dan", "di", "ke", "dari", "ini", "itu", "seperti", "sebuah", "dengan", "akan", "ada", "karena", "i", "need", "a", "an", "the", "for", "to", "make", "build", "create", "my", "business", "ik", "heb", "een", "nodig", "voor", "mijn", "maken"}
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
        keywords = [w for w in words if w not in ignore]

        features = []
        if any(w in text.lower() for w in ["payment", "bayar", "transaksi", "checkout", "betaling"]): features.append("Payment Gateway")
        if any(w in text.lower() for w in ["admin", "dashboard", "manajemen", "stok", "management", "beheer"]): features.append("Admin Dashboard")
        if any(w in text.lower() for w in ["chat", "notifikasi", "pesan", "bericht"]): features.append("Notifikasi Real-time")
        if any(w in text.lower() for w in ["map", "lokasi", "gps", "tracking", "locatie"]): features.append("GPS & Lokasi")
        if any(w in text.lower() for w in ["seo", "pencarian", "google", "zoekmachine"]): features.append("SEO")

        topic = " ".join(keywords[:3]).title() if keywords else "Digital System"
        
        # Localized strings
        feat_prefix = {
            "id": " dengan fitur ",
            "en": " featuring ",
            "nl": " met functies zoals "
        }.get(lang if lang in ["id", "en", "nl"] else "en")

        feat_str = f"{feat_prefix}{', '.join(features)}" if features else ""
        
        # Localized templates (Enhanced with "Why" and "What for")
        templates = {
            "id": {
                "web": f"Membangun ekosistem web '{topic}' yang terintegrasi{feat_str}. Solusi ini dirancang untuk mengotomatisasi operasional bisnis Anda dan memperluas jangkauan pasar secara digital dengan performa tinggi.",
                "mobile": f"Pengembangan aplikasi mobile '{topic}' native{feat_str}. Fokus utama adalah memberikan pengalaman pengguna yang sangat lancar (seamless) untuk meningkatkan loyalitas pelanggan langsung dari smartphone mereka.",
                "uiux": f"Transformasi total interface '{topic}' dengan pendekatan User-Centric. Kami akan menciptakan desain yang tidak hanya cantik, tapi juga fungsional untuk meningkatkan angka konversi dan kepuasan pengguna.",
                "consulting": f"Audit strategis dan teknis untuk proyek '{topic}'. Kami akan memetakan arsitektur teknologi yang paling efisien agar investasi digital Anda memberikan ROI maksimal dalam jangka panjang.",
                "cta": "Mau eksplorasi lebih dalam? Yuk konsultasi langsung bareng tim ahli kami. Build with us!"
            },
            "en": {
                "web": f"Build a robust '{topic}' web ecosystem{feat_str}. This solution is engineered to automate your business workflows and scale your digital presence with high-performance infrastructure.",
                "mobile": f"Developing a native '{topic}' mobile application{feat_str}. Our focus is on creating a seamless user journey that drives customer engagement and loyalty directly on their mobile devices.",
                "uiux": f"Complete UI/UX overhaul for '{topic}' using a data-driven design approach. We'll create a unique interface that blends aesthetics with high conversion rates to delight your users.",
                "consulting": f"A strategic tech audit for your '{topic}' project. We will map out the most efficient roadmap to ensure your digital investment scales effectively with maximum long-term value.",
                "cta": "Want to dive deeper into this? Let's chat directly with our expert team. Build with us!"
            },
            "nl": {
                "web": f"Bouw een robuust '{topic}' webeccosysteem{feat_str}. Deze oplossing is ontworpen om uw bedrijfsprocessen te automatiseren en uw digitale aanwezigheid te schalen met hoogwaardige technologie.",
                "mobile": f"Ontwikkeling van een native mobiele app '{topic}'{feat_str}. Onze focus ligt op het creëren van een naadloze gebruikerservaring die klantbetrokkenheid en loyaliteit rechtstreeks op hun smartphone stimuleert.",
                "uiux": f"Volledige UI/UX-vernieuwing voor '{topic}' met een User-Centric benadering. We creëren een unieke interface die esthetiek combineert met hoge conversieratio's om uw gebruikers te verrassen.",
                "consulting": f"Een strategische technische audit voor uw project '{topic}'. We stippelen de meest efficiënte roadmap uit om ervoor te zorgen dat uw digitale investering effectief schaalt.",
                "cta": "Wilt u hier dieper op ingaan? Laten we direct praten met ons expertteam. Build with us!"
            }
        }
        
        lang_key = lang if lang in templates else "en"
        idea = templates[lang_key].get(top_label, templates[lang_key]["consulting"])
        cta = templates[lang_key]["cta"]

        return top_label, confidence, others, idea, cta


recommender = BlogRecommender()
classifier  = ServiceClassifier()


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
    lang = data.get("lang", "en") # Default to EN for production stability

    if not text:
        return jsonify({"success": False, "error": "No text provided"}), 400

    label, confidence, others, idea, cta = classifier.classify(text, lang=lang)
    if label is None:
        return jsonify({"success": False, "error": "Classifier not ready"}), 500

    result = classifier.SERVICE_MAP.get(label, classifier.SERVICE_MAP["web"])
    other_names = [classifier.LABEL_NAMES.get(o, o) for o in others]

    return jsonify({
        "success": True,
        **result,
        "others": other_names,
        "confidence": confidence,
        "idea": idea,
        "cta": cta,
        "algorithm": "LinearSVC + CalibratedClassifierCV",
        "classifier_accuracy": classifier.accuracy,
    })


@app.route("/generate-idea", methods=["POST"])
def generate_idea():
    data = request.get_json(silent=True) or {}
    business = data.get("business", "bisnis Anda")
    description = data.get("description", "")
    lang = data.get("lang", "en")
    
    if not description:
        return jsonify({"success": False, "error": "Description required"}), 400
        
    label, confidence, others, idea, cta = classifier.classify(description, lang=lang)
    if label is None:
        return jsonify({"success": False, "error": "Classification failed"}), 500
    
    return jsonify({
        "success": True,
        "business": business,
        "category": classifier.SERVICE_MAP.get(label, classifier.SERVICE_MAP["consulting"])["primary"],
        "confidence": confidence,
        "idea": idea,
        "cta": cta
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
