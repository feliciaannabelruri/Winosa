const mongoose = require('mongoose');

async function update() {
  await mongoose.connect('mongodb+srv://feliciaannabel:Luvlyjanu11@cluster0.puxbe.mongodb.net/winosa-db?retryWrites=true&w=majority');
  
  const Blog = mongoose.model('Blog', new mongoose.Schema({}, { strict: false }));
  
  const content = `
    <h2>Mengapa Bisnis Anda Harus Berubah Sekarang?</h2>
    <p>Di era yang serba cepat ini, transformasi digital bukan lagi sekadar tren teknologi, melainkan fondasi utama bagi kelangsungan bisnis. Banyak perusahaan yang gagal karena terlambat menyadari bahwa perilaku konsumen telah bergeser sepenuhnya ke ranah digital.</p>
    
    <h3>1. Efisiensi Operasional yang Tak Tertandingi</h3>
    <p>Dengan mengadopsi teknologi seperti Cloud Computing dan Automation, bisnis dapat memangkas biaya operasional hingga 40%. Proses yang sebelumnya memakan waktu berhari-hari kini bisa diselesaikan dalam hitungan jam.</p>
    
    <h3>2. Pengambilan Keputusan Berbasis Data (Data-Driven)</h3>
    <p>Transformasi digital memungkinkan Anda untuk mengumpulkan data pelanggan secara real-time. Anda tidak lagi menebak apa yang diinginkan pasar, tetapi Anda tahu pasti berdasarkan angka yang akurat.</p>
    
    <div style="padding: 20px; border-left: 5px solid #C4A832; background: #f9f9f9; margin: 30px 0; font-style: italic;">
      "Teknologi bukan hanya alat, melainkan strategi untuk memenangkan persaingan di pasar global." - Tim Winosa
    </div>

    <h3>3. Meningkatkan Pengalaman Pelanggan (UX)</h3>
    <p>Konsumen modern mengharapkan layanan yang instan dan personal. Dengan aplikasi web yang responsif dan sistem backend yang kuat, Anda memberikan kenyamanan yang akan membuat mereka kembali lagi.</p>

    <p>Kami di Winosa berdedikasi untuk membantu UMKM hingga korporasi besar dalam melompati batasan tradisional mereka menuju ekosistem digital yang modern dan menguntungkan.</p>
    
    <h3>Kesimpulan</h3>
    <p>Jangan tunggu sampai kompetitor Anda mendahului. Transformasi digital adalah investasi jangka panjang yang akan memberikan imbal hasil berlipat ganda di masa depan.</p>
  `;

  await Blog.findOneAndUpdate(
    { slug: 'mengapa-transformasi-digital-penting' },
    { 
      $set: { 
        content: content, 
        metaTitle: 'Pentingnya Transformasi Digital bagi Bisnis di 2026 | Winosa',
        metaDescription: 'Temukan alasan mengapa transformasi digital bukan lagi pilihan, melainkan keharusan untuk bertahan di era modern. Baca selengkapnya di Winosa Digital Agency.',
        metaKeywords: 'digital transformation, winosa, business automation, agensi digital lampung, web development'
      } 
    }
  );

  console.log('Blog updated successfully with SEO and long content!');
  process.exit(0);
}

update().catch(err => {
  console.error(err);
  process.exit(1);
});
