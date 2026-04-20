require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Blog = require('../models/Blog');

const blogs = [
  // THE 5 ORIGINAL ONES (WITH BEAUTIFUL UNSPLASH IMAGES)
  {
    title: 'Getting Started with React',
    slug: 'getting-started-with-react',
    content: 'React is a JavaScript library for building user interfaces. In this guide, we will cover the basics...',
    excerpt: 'Learn the fundamentals of React development',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    author: 'John Doe',
    tags: ['react', 'javascript', 'frontend'],
    isPublished: true,
    views: 100
  },
  {
    title: 'Node.js Best Practices',
    slug: 'nodejs-best-practices',
    content: 'Node.js is a powerful runtime for building scalable applications. Here are some best practices...',
    excerpt: 'Essential tips for Node.js developers',
    image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800',
    author: 'Jane Smith',
    tags: ['nodejs', 'backend', 'javascript'],
    isPublished: true,
    views: 120
  },
  {
    title: 'MongoDB Tutorial',
    slug: 'mongodb-tutorial',
    content: 'MongoDB is a NoSQL database that stores data in flexible documents. Learn how to use it...',
    excerpt: 'Complete guide to MongoDB',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800',
    author: 'Mike Johnson',
    tags: ['mongodb', 'database', 'nosql'],
    isPublished: true,
    views: 90
  },
  {
    title: 'CSS Grid Layout',
    slug: 'css-grid-layout',
    content: 'CSS Grid is a powerful layout system. Master it with this comprehensive guide...',
    excerpt: 'Master CSS Grid in 2024',
    image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=800',
    author: 'Sarah Lee',
    tags: ['css', 'frontend', 'design'],
    isPublished: true,
    views: 150
  },
  {
    title: 'RESTful API Design',
    slug: 'restful-api-design',
    content: 'Learn how to design clean and scalable RESTful APIs following industry standards...',
    excerpt: 'Build better APIs',
    image: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&q=80&w=800',
    author: 'Tom Brown',
    tags: ['api', 'rest', 'backend'],
    isPublished: true,
    views: 200
  },

  // THE NEW SEO BLOGS (WITHOUT SEO 101, REPLACED)
  {
    title: "Mengapa Website Profesional Lebih Penting dari Sekadar Sosial Media di 2026",
    slug: "pentingnya-website-profesional-vs-sosial-media",
    excerpt: "Sosial media memang bagus untuk jangkauan, tetapi website adalah aset digital sejati Anda. Pelajari mengapa bisnis yang sukses membutuhkan keduanya untuk SEO dan kredibilitas.",
    content: "<h2>Pentingnya Identitas Digital Mandiri</h2><p>Banyak UMKM yang merasa cukup dengan Instagram atau TikTok. Padahal, algoritma bisa berubah kapan saja. Website memberikan Anda kendali penuh atas brand, data pelanggan, dan SEO. Google adalah tempat pertama pelanggan potensial Anda mencari solusi.</p><h3>1. Kredibilitas dan Profesionalisme</h3><p>Website dengan domain sendiri (.com atau .id) langsung meningkatkan kepercayaan pelanggan hingga 80%.</p><h3>2. Aset yang Tidak Bergantung pada Algoritma</h3><p>Sosial media adalah tanah pinjaman. Website adalah rumah Anda sendiri.</p>",
    author: "Tim Winosa",
    tags: ["Web Development", "Business Growth"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    views: 1250,
    isPublished: true
  },
  {
    title: "Panduan Lengkap Memilih Tech Stack untuk Startup Anda",
    slug: "panduan-memilih-tech-stack-startup",
    excerpt: "React, Vue, Node.js, Python? Jangan bingung! Artikel ini membedah cara memilih teknologi yang tepat (Tech Stack) berdasarkan budget, skalabilitas, dan waktu rilis.",
    content: "<h2>Bukan Tentang yang Paling Populer</h2><p>Memilih bahasa pemrograman atau framework bukan sekadar tren. Pertimbangkan ketersediaan talenta (developer), kecepatan rilis (Time to Market), dan skalabilitas.</p><h3>Frontend: React vs Vue vs Svelte</h3><p>React mendominasi pasar kerja, menjadikannya pilihan aman. Namun Vue lebih cepat dipelajari.</p><h3>Backend: Node.js vs Python vs Go</h3><p>Gunakan Node.js jika tim Anda sudah menguasai Javascript. Gunakan Python jika produk Anda sarat dengan AI/Machine Learning.</p>",
    author: "Tim Winosa",
    tags: ["Web Development", "Startup", "Tech Stack"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    views: 840,
    isPublished: true
  },
  {
    title: "Mengenal Prinsip Dasar UI/UX Design yang Meningkatkan Konversi Penjualan",
    slug: "prinsip-ui-ux-tingkatkan-konversi",
    excerpt: "Desain bukan hanya soal cantik, tapi soal fungsionalitas. Temukan 5 rahasia UX yang terbukti secara psikologis mampu meningkatkan klik dan penjualan aplikasi Anda.",
    content: "<h2>Desain adalah Bagaimana Ia Bekerja</h2><p>Mengutip Steve Jobs, desain bukan sekadar tampilan. UX yang baik memandu pengguna dari halaman beranda hingga ke tombol pembayaran tanpa gesekan (friction).</p><ul><li><strong>Hukum Hick:</strong> Semakin banyak pilihan, semakin lama orang mengambil keputusan. Sederhanakan menu Anda.</li><li><strong>Kontras Tombol CTA:</strong> Pastikan warna tombol 'Beli' atau 'Daftar' sangat mencolok dan kontras dengan background.</li><li><strong>Microinteractions:</strong> Beri umpan balik visual saat pengguna menekan tombol.</li></ul>",
    author: "Tim Winosa",
    tags: ["UI/UX Design", "Conversion", "Business"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
    views: 2100,
    isPublished: true
  },
  {
    title: "Native vs Cross-Platform (Flutter/React Native): Mana yang Terbaik untuk Mobile App?",
    slug: "native-vs-cross-platform-mobile-app",
    excerpt: "Mau buat aplikasi mobile tapi bingung pilih Native (Swift/Kotlin) atau Cross-Platform? Kami bahas kelebihan, kekurangan, serta pertimbangan biayanya.",
    content: "<h2>Satu Kode, Dua Platform?</h2><p>Cross-platform seperti Flutter dan React Native menghemat waktu dan biaya hingga 40%. Anda hanya butuh satu tim developer untuk Android dan iOS.</p><h3>Kapan Harus Pakai Native?</h3><p>Jika aplikasi Anda membutuhkan performa grafis super tinggi (seperti game 3D) atau akses hardware spesifik yang rumit, Native adalah rajanya.</p><h3>Kesimpulan</h3><p>Bagi 90% bisnis dan startup, Flutter atau React Native sudah lebih dari cukup dan sangat menguntungkan secara bisnis.</p>",
    author: "Tim Winosa",
    tags: ["Mobile App", "Startup"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
    views: 1560,
    isPublished: true
  },
  
  // NEW ARTICLE REPLACING "SEO 101"
  {
    title: "5 Bahasa Pemrograman Paling Dicari Perusahaan Multinasional",
    slug: "bahasa-pemrograman-paling-dicari",
    excerpt: "Ingin berkarir sebagai developer dengan gaji tinggi? Ini adalah 5 bahasa pemrograman yang paling banyak diminati oleh perusahaan teknologi besar tahun ini.",
    content: "<h2>Fundamental adalah Kunci</h2><p>Teknologi terus berubah, tapi beberapa bahasa pemrograman tetap menjadi fondasi kuat di dunia enterprise.</p><h3>1. JavaScript (TypeScript)</h3><p>Tidak ada web modern tanpa JavaScript. Dengan ekosistem React dan Node.js, JS adalah raja.</p><h3>2. Python</h3><p>Dengan meledaknya tren Artificial Intelligence (AI) dan Data Science, Python menjadi bahasa yang wajib dikuasai untuk mengolah data besar.</p><h3>3. Go (Golang)</h3><p>Diciptakan oleh Google, Go sangat populer di kalangan perusahaan yang membutuhkan sistem backend yang sangat cepat, efisien, dan bisa menangani jutaan request per detik.</p>",
    author: "Tim Winosa",
    tags: ["Web Development", "Tech Stack", "Career"],
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800",
    views: 3500,
    isPublished: true
  },

  {
    title: "Mengapa Transformasi Digital Bukan Pilihan, Melainkan Kewajiban",
    slug: "transformasi-digital-kewajiban-bisnis",
    excerpt: "Bisnis yang tidak mendigitalisasi proses internalnya akan tertinggal. Pelajari studi kasus bagaimana digitalisasi menyelamatkan perusahaan dari kebangkrutan.",
    content: "<h2>Lebih dari Sekadar Punya Website</h2><p>Transformasi digital berarti mengubah cara kerja perusahaan Anda dari akar menggunakan teknologi. Mulai dari sistem ERP, absensi online, hingga pembukuan otomatis.</p><p>Perusahaan yang berani berinvestasi pada custom software internal melaporkan efisiensi operasional naik hingga 30% pada tahun pertama.</p>",
    author: "Tim Winosa",
    tags: ["IT Consulting", "Business Growth"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    views: 920,
    isPublished: true
  },
  {
    title: "Pentingnya Menjaga Keamanan Data Pengguna di Aplikasi Anda",
    slug: "pentingnya-keamanan-data-aplikasi",
    excerpt: "Kebocoran data bisa menghancurkan reputasi bisnis Anda dalam semalam. Simak praktik terbaik enkripsi dan otentikasi (seperti JWT dan 2FA) untuk developer.",
    content: "<h2>Kepercayaan Pengguna adalah Mata Uang Utama</h2><p>Di era di mana UU Pelindungan Data Pribadi (PDP) sudah berlaku ketat, keamanan bukan lagi fitur opsional.</p><h3>Praktik Standar</h3><ul><li>Selalu gunakan HTTPS/SSL.</li><li>Hash password pengguna dengan Bcrypt (jangan pernah simpan teks asli).</li><li>Gunakan otentikasi ganda (2FA) untuk akses krusial.</li></ul>",
    author: "Tim Winosa",
    tags: ["Security", "Web Development"],
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800",
    views: 1100,
    isPublished: true
  },
  {
    title: "Apa Itu Minimum Viable Product (MVP) dan Mengapa Startup Membutuhkannya?",
    slug: "apa-itu-mvp-startup",
    excerpt: "Jangan habiskan dana ratusan juta untuk fitur yang belum teruji. MVP adalah kunci untuk menguji pasar dengan risiko finansial paling minimal.",
    content: "<h2>Cepat, Murah, Teruji</h2><p>MVP (Minimum Viable Product) adalah versi produk dengan fitur paling dasar yang cukup untuk menyelesaikan masalah utama pengguna.</p><p>Contoh: Gojek dulunya hanya dimulai dari call center sederhana sebelum punya aplikasi kompleks. Jangan terjebak membangun fitur 'nice to have'. Fokus pada 'must have'.</p>",
    author: "Tim Winosa",
    tags: ["Startup", "IT Consulting"],
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800",
    views: 2800,
    isPublished: true
  },
  {
    title: "Tren Desain UI/UX Paling Populer di Tahun 2026",
    slug: "tren-desain-ui-ux-2026",
    excerpt: "Dari Neumorphism hingga Glassmorphism, dunia desain terus berubah. Apa gaya desain yang akan mendominasi dan membuat aplikasi Anda terlihat modern?",
    content: "<h2>Minimalis Berpadu dengan Kedalaman (Depth)</h2><p>Tahun ini, antarmuka yang bersih (clean UI) dengan elemen yang terlihat seperti kaca (Glassmorphism) masih menjadi primadona.</p><h3>Micro-Interactions</h3><p>Animasi super halus saat pengguna menekan tombol atau berpindah halaman memberikan kesan bahwa aplikasi tersebut mahal dan premium.</p><h3>Dark Mode</h3><p>Mode gelap bukan lagi sekadar tren, melainkan standar kewajiban untuk kenyamanan mata pengguna.</p>",
    author: "Tim Winosa",
    tags: ["UI/UX Design", "Trends"],
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=800",
    views: 3100,
    isPublished: true
  },
  {
    title: "Masa Depan AI dalam Pengembangan Perangkat Lunak",
    slug: "masa-depan-ai-software-development",
    excerpt: "Apakah AI seperti ChatGPT atau Copilot akan menggantikan developer? Tidak. AI akan memberdayakan mereka menjadi 10x lebih cepat. Inilah realitanya.",
    content: "<h2>Augmented Coding, Bukan Penggantian</h2><p>AI saat ini bertindak sebagai asisten yang luar biasa. Ia mampu menulis boilerplate, menemukan bug, dan memberi saran optimasi.</p><p>Developer yang tidak menggunakan AI akan digantikan oleh developer yang menggunakan AI. Di Winosa, kami menggunakan AI untuk mempercepat *delivery* project klien kami hingga 30%.</p>",
    author: "Tim Winosa",
    tags: ["AI", "Web Development", "Trends"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    views: 5200,
    isPublished: true
  },
  {
    title: "Berapa Sebenarnya Biaya Pembuatan Website Toko Online?",
    slug: "biaya-pembuatan-website-toko-online",
    excerpt: "Sering bingung kenapa ada yang menawarkan website 500 ribu dan ada yang 50 juta? Kami bongkar rahasia perhitungan biaya *Web Development*.",
    content: "<h2>Harga Mencerminkan Kualitas dan Customization</h2><p>Website murah biasanya menggunakan template siap pakai seperti WordPress/WooCommerce yang dibagikan ke ribuan orang lain.</p><p>Website *custom* bernilai puluhan juta karena dibangun dari nol (React/Next.js), memiliki desain UI eksklusif, performa sangat cepat, dan arsitektur database yang mampu menampung ribuan transaksi tanpa *down*.</p>",
    author: "Tim Winosa",
    tags: ["Web Development", "Business", "E-commerce"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
    views: 4100,
    isPublished: true
  },
  {
    title: "Pentingnya Cloud Hosting (AWS/GCP) untuk Skalabilitas Bisnis",
    slug: "pentingnya-cloud-hosting-skalabilitas",
    excerpt: "Jangan biarkan website Anda lumpuh (down) saat sedang banyak pengunjung. Mengenal Cloud Hosting dan kapan saatnya Anda beralih dari Shared Hosting.",
    content: "<h2>Mati Kutu Saat Viral</h2><p>Kasus terburuk bagi bisnis adalah ketika marketing berhasil mendatangkan ribuan pengunjung, tapi server website Anda mati (Down 500/502). Itulah mengapa Shared Hosting tidak cukup.</p><p>Teknologi seperti Amazon Web Services (AWS) atau Vercel memungkinkan website Anda membesar otomatis (auto-scaling) menyesuaikan beban server.</p>",
    author: "Tim Winosa",
    tags: ["Web Development", "IT Consulting", "Startup"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
    views: 1800,
    isPublished: true
  },
  {
    title: "Super App vs Standalone App: Strategi Mana yang Pas untuk Perusahaan Anda?",
    slug: "super-app-vs-standalone-app",
    excerpt: "Gojek dan Grab sukses dengan model Super App. Tapi apakah perusahaan Anda juga harus menggabungkan semua fitur di satu aplikasi?",
    content: "<h2>Jangan Paksakan Semua Masuk</h2><p>Super App sangat mahal untuk dikembangkan dan dirawat. Ukuran aplikasi (*app size*) juga membengkak.</p><p>Jika layanan Anda sangat spesifik, Standalone App jauh lebih baik. Pengalaman pengguna lebih fokus, pengembangan lebih murah, dan ukuran aplikasi lebih kecil sehingga orang tidak segan mengunduh.</p>",
    author: "Tim Winosa",
    tags: ["Mobile App", "IT Consulting"],
    image: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80&w=800",
    views: 1350,
    isPublished: true
  },
  {
    title: "Mengapa Desain Sistem (Design System) Menghemat Waktu dan Biaya Jangka Panjang",
    slug: "design-system-menghemat-waktu-dan-biaya",
    excerpt: "Jika Anda membangun produk digital jangka panjang, Design System adalah investasi wajib. Apa itu dan bagaimana cara membuatnya?",
    content: "<h2>Keseragaman adalah Kunci Profesionalisme</h2><p>Design System adalah kumpulan komponen UI (tombol, input, font, warna) yang dibakukan. Daripada membuat tombol dari nol setiap kali, developer tinggal menggunakan komponen yang sudah disetujui desainer.</p><p>Ini menghilangkan inkonsistensi (seperti warna biru yang berbeda-beda di tiap halaman) dan mempercepat pekerjaan developer secara masif.</p>",
    author: "Tim Winosa",
    tags: ["UI/UX Design", "Tech Stack"],
    image: "https://images.unsplash.com/photo-1561070791-36c11767b26a?auto=format&fit=crop&q=80&w=800",
    views: 990,
    isPublished: true
  },
  {
    title: "Studi Kasus: Bagaimana Website Cepat Menaikkan Penjualan 20%",
    slug: "website-cepat-menaikkan-penjualan",
    excerpt: "Tahukah Anda bahwa penundaan 1 detik pada loading website dapat mengurangi kepuasan pelanggan sebesar 16%? Ini adalah data nyata.",
    content: "<h2>Kecepatan Berarti Uang</h2><p>Amazon menemukan bahwa kelambatan 100ms berdampak pada penurunan pendapatan sebesar 1%. Di era di mana *attention span* sangat pendek, website Anda harus memuat (load) di bawah 3 detik.</p><ul><li>Optimasi gambar Anda (Gunakan format WebP).</li><li>Gunakan CDN (Content Delivery Network).</li><li>Gunakan kerangka modern seperti Next.js yang mendukung Server-Side Rendering (SSR).</li></ul>",
    author: "Tim Winosa",
    tags: ["Web Development", "Conversion"],
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&q=80&w=800",
    views: 3100,
    isPublished: true
  },
  {
    title: "Peran Agile dan Scrum dalam IT Agency: Kenapa Penting untuk Klien?",
    slug: "peran-agile-dan-scrum-it-agency",
    excerpt: "Klien sering kecewa karena hasil akhir aplikasi tidak sesuai ekspektasi. Metode Agile & Scrum menyelesaikan masalah komunikasi ini.",
    content: "<h2>Transparansi Penuh Setiap Minggu</h2><p>Metode *Waterfall* klasik (klien memberi dokumen, menunggu 3 bulan, lalu melihat hasil akhir) sering berujung pada kekecewaan.</p><p>Melalui *Agile/Scrum*, proses dibagi menjadi *sprint* (1-2 minggu). Klien dapat melihat hasil setengah jadi secara bertahap dan memberi *feedback* lebih awal, sehingga aplikasi 100% sesuai dengan kebutuhan bisnis di lapangan.</p>",
    author: "Tim Winosa",
    tags: ["IT Consulting", "Business Growth"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
    views: 850,
    isPublished: true
  },
  {
    title: "Progressive Web App (PWA): Gabungan Terbaik Antara Website dan Aplikasi",
    slug: "pwa-gabungan-terbaik-web-dan-aplikasi",
    excerpt: "Ingin aplikasi yang bisa di-install di HP tanpa harus lewat Playstore atau Appstore? Kenalan dengan teknologi PWA.",
    content: "<h2>Hemat Biaya, Jangkauan Luas</h2><p>PWA adalah website yang berperilaku seperti aplikasi *native*. Ia bisa di-install ke *homescreen*, memiliki notifikasi (*push notification*), dan bahkan bekerja saat sinyal internet putus (offline mode).</p><p>Bagi bisnis dengan budget terbatas yang ingin mencakup pengguna web dan mobile sekaligus, PWA adalah opsi emas yang sering kami rekomendasikan.</p>",
    author: "Tim Winosa",
    tags: ["Web Development", "Mobile App", "Tech Stack"],
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=800",
    views: 1950,
    isPublished: true
  },
  {
    title: "5 Kesalahan Fatal Saat Merancang User Interface (UI)",
    slug: "5-kesalahan-fatal-merancang-ui",
    excerpt: "Hindari kesalahan amatir ini! Mulai dari teks yang sulit dibaca hingga tombol yang tak terlihat, pastikan aplikasi Anda tidak mengulang dosa UI ini.",
    content: "<h2>Jangan Biarkan Pengguna Berpikir (Don't Make Me Think)</h2><ol><li><strong>Kontras yang Buruk:</strong> Teks abu-abu muda di atas putih sangat menyiksa mata.</li><li><strong>Tap Target Terlalu Kecil:</strong> Tombol di layar HP harus minimal berukuran 44x44 pixel agar tidak susah ditekan jari.</li><li><strong>Navigasi Tersembunyi:</strong> Jangan sembunyikan menu penting di balik menu *hamburger* jika layar desktop cukup luas.</li><li><strong>Terlalu Banyak Pop-up:</strong> Pengguna benci gangguan saat sedang membaca atau bertransaksi.</li></ol>",
    author: "Tim Winosa",
    tags: ["UI/UX Design", "Conversion"],
    image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=800",
    views: 2600,
    isPublished: true
  },
  {
    title: "Membangun Sistem Manajemen Karyawan (HRIS) Kustom untuk Perusahaan Anda",
    slug: "membangun-sistem-hris-kustom",
    excerpt: "Apakah software HR siap pakai tidak cocok dengan aturan unik perusahaan Anda? Mungkin sudah saatnya membangun sistem HRIS custom Anda sendiri.",
    content: "<h2>Lepas dari Keterbatasan SaaS Siap Pakai</h2><p>Software langganan (SaaS) bagus untuk memulai. Namun saat perusahaan membesar, aturan lembur, KPI khusus, dan struktur hierarki seringkali tidak bisa ditampung sistem standar.</p><p>Dengan membangun HRIS (Human Resources Information System) kustom, Anda memiliki IP (Kekayaan Intelektual) sendiri dan sistem dibentuk *mengikuti* cara kerja Anda, bukan sebaliknya.</p>",
    author: "Tim Winosa",
    tags: ["Web Development", "IT Consulting", "Business Growth"],
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    views: 1120,
    isPublished: true
  },
  {
    title: "Langkah-Langkah Mengamankan Data Perusahaan Pasca Kebocoran Data (Ransomware)",
    slug: "langkah-mengamankan-data-dari-ransomware",
    excerpt: "Indonesia sering dilanda kasus ransomware. Pelajari langkah strategis dan infrastruktur IT apa saja yang wajib dimiliki untuk pencegahan.",
    content: "<h2>Pencegahan Lebih Murah Daripada Penebusan</h2><p>Serangan *Ransomware* (virus penyandera data) telah menghancurkan banyak instansi. Terapkan strategi <strong>Backup 3-2-1</strong>:</p><ul><li>3 Salinan Data (1 utama, 2 cadangan)</li><li>2 Media Berbeda (cloud dan disk lokal)</li><li>1 Lokasi *Off-site* (di server terpisah/fisik)</li></ul><p>Konsultasikan arsitektur keamanan server Anda dengan ahlinya sebelum menjadi korban berikutnya.</p>",
    author: "Tim Winosa",
    tags: ["Security", "IT Consulting"],
    image: "https://images.unsplash.com/photo-1614064641913-a530a50f1a66?auto=format&fit=crop&q=80&w=800",
    views: 3250,
    isPublished: true
  }
];

async function seedFinalBlogs() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("No MONGODB_URI found in environment.");
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Clearing all existing blogs to replace with clean data...");
    await Blog.deleteMany({});

    console.log(`Inserting ${blogs.length} clean, Unsplash-optimized blogs...`);
    await Blog.insertMany(blogs);
    
    console.log("✅ Successfully seeded 20 final blogs with reliable Unsplash images!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding blogs:", error);
    process.exit(1);
  }
}

seedFinalBlogs();
