# Component Documentation

Dokumen ini menjelaskan struktur dan fungsi komponen utama yang digunakan pada frontend website Winosa. Semua komponen dibuat modular dan reusable supaya lebih mudah dikembangkan dan dirawat ke depannya.

## Animation Components

### FadeUp.tsx  
Komponen ini digunakan untuk memberikan animasi fade dan sedikit pergerakan ke atas saat elemen muncul di layar. Biasanya dipakai di berbagai section untuk membuat tampilan lebih hidup.

### PageTransition.tsx  
Digunakan untuk memberikan efek transisi saat berpindah halaman. Efek yang digunakan berupa perubahan opacity, scale, dan sedikit blur agar perpindahan halaman terasa lebih halus.

## Layout Components

### Navbar.tsx  
Navbar berfungsi sebagai navigasi utama di website. Komponen ini sudah mendukung tampilan responsive, termasuk menu mobile dengan hamburger menu. Selain itu, navbar juga memiliki fitur pergantian bahasa menggunakan Zustand dan perubahan tampilan saat halaman di-scroll.

### Footer.tsx  
Footer digunakan untuk menampilkan informasi tambahan di bagian bawah halaman, seperti link navigasi tambahan, informasi perusahaan, serta link ke sosial media.

### SectionCTA.tsx  
Section ini digunakan untuk mengarahkan user melakukan aksi tertentu, seperti menghubungi atau subscribe. Di dalamnya terdapat form input email, validasi, serta feedback ketika berhasil atau gagal.

## Section Blog

### SectionBlog.tsx  
Digunakan untuk menampilkan daftar artikel blog.

### SectionHero.tsx  
Hero section khusus untuk halaman blog, biasanya berisi judul dan deskripsi utama.

## Section Contact

### SectionContactForm.tsx  
Form yang digunakan untuk menghubungi tim. Komponen ini sudah memiliki validasi input dan feedback untuk user.

### SectionFAQ.tsx  
Menampilkan daftar pertanyaan yang sering diajukan dalam bentuk accordion.

### SectionMap.tsx  
Menampilkan lokasi perusahaan menggunakan Google Maps. Map tidak langsung diload, tetapi muncul setelah user melakukan interaksi untuk menjaga performa.

## Section Service

Bagian ini berisi komponen untuk halaman layanan. Strukturnya dibagi berdasarkan kategori agar lebih rapi.

### Komponen umum

SectionHero.tsx digunakan sebagai hero utama halaman layanan.  
SectionInfo.tsx menampilkan proses kerja dan alasan memilih layanan.  
SectionService.tsx menampilkan daftar layanan dalam bentuk card.  
SectionServiceRecommend.tsx digunakan untuk menampilkan rekomendasi layanan.  
SectionMaintenancePlans.tsx berisi paket maintenance.  
SmartRecommend.tsx digunakan sebagai bagian dari logic rekomendasi layanan.

### Kategori UI/UX

Berisi komponen khusus untuk layanan UI/UX seperti hero, features, tech stack, dan pricing.

### Kategori Mobile

Digunakan untuk halaman mobile app development, dengan struktur komponen yang mirip seperti UI/UX.

### Kategori Web

Digunakan untuk halaman web development, juga memiliki struktur yang sama agar konsisten.

## Sections Homepage

### SectionHero.tsx  
Hero utama halaman homepage.

### SectionGlass.tsx  
Menampilkan informasi perusahaan dengan tampilan visual yang lebih menarik.

### SectionMap.tsx  
Menampilkan lokasi perusahaan.

### SectionMissionVision.tsx  
Menampilkan visi dan misi perusahaan.

### SectionPreview.tsx  
Digunakan untuk menampilkan preview layanan atau konten utama.

### SectionTeam.tsx  
Menampilkan anggota tim dalam bentuk carousel.

## Sections Portfolio

### SectionPortoHero.tsx  
Hero untuk halaman portfolio.

### SectionPortoCards.tsx  
Menampilkan daftar portfolio dalam bentuk card.

### SectionBrige.tsx  
Digunakan sebagai penghubung antar section agar alur tampilan lebih smooth.

### SectionExplanation.tsx  
Menampilkan penjelasan tambahan terkait portfolio.

### Detail Project

Bagian ini digunakan untuk halaman detail project.

CaseStudySection.tsx menampilkan studi kasus project.  
GallerySection.tsx menampilkan gambar project.  
HeroSection.tsx merupakan hero untuk detail project.  
InfoSection.tsx berisi informasi detail project.  
NextProjectSection.tsx digunakan untuk navigasi ke project berikutnya.

## UI Components

### Button.tsx  
Komponen tombol yang bisa digunakan di berbagai bagian website. Sudah memiliki efek hover dan active.

### Card.tsx  
Digunakan untuk menampilkan konten dalam bentuk card, seperti layanan atau portfolio.

### Input.tsx  
Komponen input untuk form, sudah dilengkapi dengan validasi dan styling yang konsisten.

### EmptyState.tsx  
Digunakan saat tidak ada data yang ditampilkan.

### LoadingPage.tsx  
Menampilkan loading state saat data masih diproses.

## Constants

Folder ini digunakan untuk menyimpan data statis atau konfigurasi yang digunakan di berbagai bagian aplikasi.

## Notes

Struktur komponen dibagi menjadi beberapa kategori seperti animation, layout, section, UI, dan constants. Pendekatan ini membantu menjaga konsistensi tampilan, mempermudah pengembangan, serta memudahkan penambahan fitur baru tanpa harus mengubah banyak bagian yang sudah ada.