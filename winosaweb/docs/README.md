# Winosa Company Website (Frontend)

## Description  
Ini adalah frontend (user-side) dari website company profile Winosa.  
Website ini dibuat untuk menampilkan informasi perusahaan seperti layanan, tim, dan kontak dengan tampilan yang modern, responsive, dan mudah digunakan.  

Fokus utama dari project ini adalah UI yang clean dan enak dilihat, user experience yang smooth, serta performa yang tetap optimal saat digunakan.

## Features  
Website ini memiliki beberapa fitur utama seperti tampilan yang responsive untuk berbagai device (mobile, tablet, desktop), animasi sederhana seperti hover, transition, dan fade-in, serta struktur komponen yang reusable agar kode lebih rapi dan mudah dikembangkan.  

Selain itu, digunakan juga state management dengan Zustand, integrasi API menggunakan Axios, serta basic analytics dan error tracking untuk membantu monitoring.

## Tech Stack  
Project ini menggunakan Next.js, React, dan TypeScript sebagai teknologi utama. Untuk styling digunakan Tailwind CSS agar pengembangan UI lebih cepat dan konsisten.  

Library tambahan yang digunakan antara lain Framer Motion untuk animasi, Zustand untuk state management, Axios untuk API request, serta Lucide React dan Heroicons untuk icon.

## How to Run  

1. Install dependencies  
```bash
npm install
```

2. Jalankan project  
```bash
npm run dev
```

3. Buka di browser  
```
http://localhost:3000
```

## Project Structure  

```bash
src/
 ├── components/   Komponen UI yang bisa dipakai ulang
 ├── pages/        Halaman utama
 ├── assets/       Gambar dan file statis
 ├── styles/       CSS global dan styling
 ├── utils/        Helper functions
 ├── store/        State management (Zustand)
```

## Performance Notes  
Beberapa optimasi yang dilakukan antara lain mengurangi code yang tidak terpakai, menghapus console.log, menggunakan lazy loading untuk image, serta menjaga ukuran asset tetap ringan agar loading lebih cepat.

## Animations / Microinteractions  
Beberapa interaksi kecil ditambahkan seperti hover effect pada card dan button, transition yang halus, serta animasi fade-in saat scroll. Tujuannya agar tampilan terasa lebih hidup tanpa mengganggu kenyamanan pengguna.

## PWA (Optional)  
Fitur PWA masih dalam tahap pengembangan. Beberapa yang direncanakan antara lain service worker, offline mode, dan install prompt. Implementasi ini akan lebih optimal setelah project dideploy.

## Deployment  

Build project  
```bash
npm run build
```

Jalankan production  
```bash
npm run start
```

Deploy dapat dilakukan menggunakan Vercel dengan cara push project ke GitHub, lalu import ke Vercel dan deploy.

## Notes  
Project ini merupakan bagian frontend sehingga dapat diintegrasikan dengan backend API. Beberapa fitur masih bisa dikembangkan lebih lanjut terutama setelah proses deployment.