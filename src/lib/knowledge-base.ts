// =====================================================
// STATIC KNOWLEDGE BASE - Emergency AI Fallback
// =====================================================
// Ketika Groq AND z-ai-web-dev-sdk keduanya gagal,
// module ini jawab pertanyaan dasar pakai rule-based matching.
// Jadi chatbot tetap berguna walau AI lagi down.
// =====================================================

interface KBRule {
  keywords: string[]
  response: string
}

const WA_NUMBER = '0882-0008-58698'
const WA_LINK = 'https://wa.me/62882000858698'

const KNOWLEDGE_BASE: KBRule[] = [
  {
    keywords: ['halo', 'hai', 'hi', 'hello', 'assalam', 'pagi', 'siang', 'sore', 'malam', 'selamat', 'woi', 'woy', 'p'],
    response: `Halo kak! Selamat datang di Mas Iis - Warung Solusi 😊\n\nSaya AI CS Mas Iis, siap bantu kakak 24/7. Kami punya 17 jasa lengkap mulai dari servis laptop, bimbingan skripsi, desain grafis, hingga hiasan taman.\n\nAda yang bisa saya bantu? Kakak bisa tanya:\n- Daftar jasa\n- Harga\n- Jam buka\n- Lokasi\n- Cara order\n\nAtau langsung WA Mas Iis: ${WA_NUMBER}`,
  },
  {
    keywords: ['jam buka', 'jam operasional', 'buka jam', 'kapan buka', 'jam berapa', 'buka gak', 'tutup', 'buka'],
    response: `Jam operasional Mas Iis - Warung Solusi:\n- Senin sampai Sabtu: 08.00 - 21.00 WIB\n- Minggu: 09.00 - 17.00 WIB (khusus emergency)\n\nTapi tenang, chat AI saya ini 24/7 nonstop! Bisa tanya kapan saja ya kak 😊\n\nMau WA langsung? ${WA_LINK}`,
  },
  {
    keywords: ['lokasi', 'alamat', 'dimana', 'tempat', 'cabang', 'kantor', 'lokasinya'],
    response: `Alamat Mas Iis - Warung Solusi:\nSindanglaut, Kabupaten Cirebon, Jawa Barat\n\nKami melayani area Cirebon dan sekitarnya. Untuk beberapa jasa juga bisa online/delivery kak.\n\nMau kunjungan langsung atau WA dulu? ${WA_LINK}`,
  },
  {
    keywords: ['kontak', 'wa', 'whatsapp', 'nomor', 'telepon', 'hp', 'hubungi', 'contact'],
    response: `Kontak Mas Iis - Warung Solusi:\nWhatsApp: ${WA_NUMBER}\nChat: ${WA_LINK}\n\nTim kami siap bantu kakak. Kirim pesan kapan saja, insya Allah dibalas cepat 🙏`,
  },
  {
    keywords: ['daftar jasa', 'jasa apa', 'jasa apa aja', 'layanan', 'menu', 'semua jasa', 'jasa tersedia', 'jasa', 'layanan apa'],
    response: `Mas Iis punya 17 jasa lengkap kak:\n\n1. Servis Laptop dan MacBook\n2. Bimbingan Skripsi/Tesis/Disertasi\n3. Cek Turnitin dan AI\n4. Desain Grafis\n5. Pembuatan Website\n6. Jasa MC\n7. Kaligrafi\n8. Angklung\n9. Gambus\n10. Kambing Qurban\n11. Hiasan Taman\n12. Pigura\n13. Copywriting\n14. Konsultan\n15. Jahit\n16. Event Organizer\n17. Belajar\n\nMau detail jasa mana? Ketik nama jasanya ya, atau langsung WA: ${WA_NUMBER}`,
  },
  {
    keywords: ['harga', 'biaya', 'tarif', 'berapa', 'murah', 'mahal', 'cost', 'bayar', 'price', 'duit'],
    response: `Harga jasa Mas Iis bervariasi tergantung jenis jasa dan tingkat kerumitan kak:\n- Servis Laptop: Rp 150.000 - Rp 1.500.000\n- Bimbingan Skripsi: Rp 1.500.000 - Rp 5.000.000\n- Cek Turnitin: Rp 50.000 - Rp 150.000\n- Desain Grafis: Rp 50.000 - Rp 500.000\n- Website: Rp 500.000 - Rp 5.000.000\n- Jasa MC: Rp 500.000 - Rp 2.000.000\n\nUntuk harga pasti sesuai kebutuhan kakak, langsung WA aja ya: ${WA_LINK}\nNanti Mas Iis kasih penawaran terbaik!`,
  },
  {
    keywords: ['order', 'pesan', 'cara pesan', 'cara order', 'booking', 'daftar', 'gimana cara', 'caranya'],
    response: `Cara order di Mas Iis gampang banget kak:\n\n1. Pilih jasa yang kakak butuh\n2. Chat WA Mas Iis: ${WA_NUMBER}\n3. Jelaskan kebutuhan kakak\n4. Dapat penawaran harga\n5. Deal dan kerja dimulai\n\nLink WA: ${WA_LINK}\n\nBisa juga kakak pilih jasa di halaman utama, klik tombol "Pesan Sekarang" akan otomatis ke WA dengan pesan yang sudah disiapkan 😊`,
  },
  {
    keywords: ['garansi', 'jaminan', 'garansi gak', 'aman', 'garansi apa'],
    response: `Tenang kak, Mas Iis beri garansi untuk sebagian besar jasa:\n- Servis Laptop: Garansi 30 hari sparepart, 14 hari software\n- Bimbingan Skripsi: Jaminan sampai lulus atau bimbingan ulang gratis\n- Desain: Revisi gratis sampai puas\n- Lainnya: Garansi sesuai kesepakatan\n\nKami mengutamakan kepuasan pelanggan! Ada masalah? Hubungi: ${WA_LINK}`,
  },
  {
    keywords: ['laptop', 'macbook', 'komputer', 'servis hp', 'pc', 'elektro', 'servis'],
    response: `Jasa Servis Laptop dan MacBook Mas Iis:\n- Perbaikan motherboard, power IC\n- Layar retak/pecah\n- Keyboard rusak\n- Baterai drop\n- Upgrade HDD ke SSD, upgrade RAM\n- Install ulang Windows/MacOS\n- Hapus virus, blue screen\n- Solusi overheating\n\nHarga: Rp 150.000 - Rp 1.500.000\nGaransi: 30 hari sparepart, 14 hari software\nGratis panggilan area Cirebon kota!\n\nWA: ${WA_LINK}`,
  },
  {
    keywords: ['skripsi', 'tesis', 'disertasi', 'jurnal', 'ilmiah', 'bimbingan', 'kuliah', 'tugas akhir', 'kripsi', 'skirpsi'],
    response: `Bimbingan Skripsi/Tesis/Disertasi Mas Iis:\n- Semua jurusan tanpa terkecuali\n- Online (Zoom/Meet) atau offline\n- Coding, jurnal internasional\n- SPSS, AMOS, LISREL, NVivo, Stata, R\n- Jaminan ACC atau bimbingan ulang gratis\n\nHarga: Rp 1.500.000 - Rp 5.000.000\nBonus: Free cek Turnitin dan AI\n\nWA: ${WA_LINK}`,
  },
  {
    keywords: ['turnitin', 'plagiarisme', 'similarity', 'cek ai', 'plagiarism', 'cek plagiarisme'],
    response: `Jasa Cek Turnitin dan AI Mas Iis:\n- Cek similarity Turnitin resmi\n- Deteksi konten AI\n- Laporan PDF lengkap sama kampus\n- Proses 1-24 jam\n- Akurasi 99%\n- Paket paraphrase untuk turunkan similarity\n\nHarga: Rp 50.000 - Rp 150.000\n\nWA: ${WA_LINK}`,
  },
  {
    keywords: ['desain', 'grafis', 'logo', 'banner', 'vektor', 'edit foto', 'photoshop', 'desain grafis'],
    response: `Jasa Desain Grafis Mas Iis:\n- Logo, banner, brosur\n- Undangan digital/cetak\n- Edit foto profesional\n- Desain konten sosmed\n- Vektor dan ilustrasi\n\nHarga: Rp 50.000 - Rp 500.000\nRevisi gratis sampai puas!\n\nWA: ${WA_LINK}`,
  },
  {
    keywords: ['website', 'web', 'aplikasi', 'online shop', 'toko online', 'landing page', 'situs', 'web site'],
    response: `Jasa Pembuatan Website Mas Iis:\n- Company profile\n- Landing page\n- Toko online/e-commerce\n- Blog/CMS\n- Aplikasi web custom\n- SEO ready, mobile responsive\n\nHarga: Rp 500.000 - Rp 5.000.000\nGaransi + training gratis!\n\nWA: ${WA_LINK}`,
  },
  {
    keywords: ['mc', 'master ceremony', 'pembawa acara', 'host'],
    response: `Jasa MC Mas Iis:\n- MC wedding\n- MC acara kantor\n- MC birthday\n- MC wisuda\n- MC event komunitas\n\nPengalaman 8+ tahun, profesional, bisa bahasa Indonesia/Sunda.\nHarga: Rp 500.000 - Rp 2.000.000\n\nWA: ${WA_LINK}`,
  },
  {
    keywords: ['kaligrafi', 'arab', 'islami', 'arabian', 'kaligrafy'],
    response: `Jasa Kaligrafi Mas Iis:\n- Kaligrafi Arab custom\n- Frame pigura premium\n- Bahan kayu jati/aksilik\n- Ukuran custom sesuai request\n\nCocok untuk hadiah, dekorasi rumah/masjid.\nHarga: Rp 100.000 - Rp 1.000.000\n\nWA: ${WA_LINK}`,
  },
  {
    keywords: ['angklung', 'musik tradisional', 'seni'],
    response: `Jasa Angklung Mas Iis:\n- Performans angklung untuk event\n- Workshop angklung\n- Pembuatan angklung custom\n- Pelatihan angklung untuk sekolah/komunitas\n\nHarga: Rp 500.000 - Rp 3.000.000\n\nWA: ${WA_LINK}`,
  },
  {
    keywords: ['gambus', 'marawis', 'hadroh', 'islami musik', 'orkes'],
    response: `Jasa Gambus Mas Iis:\n- Performans gambus untuk wedding/acara\n- Marawis dan hadroh\n- Grup musik islami\n\nHarga: Rp 1.000.000 - Rp 3.000.000\n\nWA: ${WA_LINK}`,
  },
  {
    keywords: ['kambing', 'qurban', 'aqiqah', 'kambing qurban', 'kurban'],
    response: `Jasa Kambing Qurban Mas Iis:\n- Kambing qurban berkualitas\n- Aqiqah package\n- Kambing sehat, terjamin\n- Delivery area Cirebon\n\nHarga: Rp 2.000.000 - Rp 4.000.000\n\nWA: ${WA_LINK}`,
  },
  {
    keywords: ['taman', 'hiasan', 'tanaman', 'garden', 'landscape', 'gardening'],
    response: `Jasa Hiasan Taman Mas Iis:\n- Desain taman rumah\n- Taman minimalis\n- Taman vertikal/gantung\n- Perawatan taman\n- Supply tanaman hias\n\nHarga: Rp 500.000 - Rp 10.000.000\n\nWA: ${WA_LINK}`,
  },
  {
    keywords: ['pigura', 'frame', 'bingkai', 'frame foto'],
    response: `Jasa Pigura Mas Iis:\n- Pigura custom semua ukuran\n- Bingkai foto/lukisan\n- Pigura kaligrafi\n- Bahan kayu/PS/plastik\n\nHarga: Rp 50.000 - Rp 500.000\n\nWA: ${WA_LINK}`,
  },
  {
    keywords: ['copywriting', 'caption', 'deskripsi', 'konten', 'artikel', 'copy writer'],
    response: `Jasa Copywriting Mas Iis:\n- Caption sosmed\n- Deskripsi produk\n- Artikel blog/SEO\n- Copywriting iklan\n- Skenario video\n\nHarga: Rp 50.000 - Rp 500.000\n\nWA: ${WA_LINK}`,
  },
  {
    keywords: ['konsultan', 'konsultasi', 'advisor', 'business', 'konsult', 'konseling'],
    response: `Jasa Konsultan Mas Iis:\n- Konsultan bisnis\n- Konsultan digital marketing\n- Konsultan legalitas usaha\n- Konsultan IT\n\nHarga: Rp 300.000 - Rp 2.000.000/sesi\n\nWA: ${WA_LINK}`,
  },
  {
    keywords: ['jahit', 'tailor', 'pakaian', 'baju', 'dress', 'penjahit'],
    response: `Jasa Jahit Mas Iis:\n- Jahit pakaian custom\n- Repair/ubah baju\n- Jahit seragam\n- Jahit kebaya\n\nHarga: Rp 50.000 - Rp 500.000\n\nWA: ${WA_LINK}`,
  },
  {
    keywords: ['event', 'organizer', 'acara', 'eo', 'pernikahan', 'wedding', 'organiser'],
    response: `Jasa Event Organizer Mas Iis:\n- Wedding organizer\n- Birthday party\n- Acara kantor\n- Gathering\n- Concert\n\nHarga: Rp 2.000.000 - Rp 50.000.000\n\nWA: ${WA_LINK}`,
  },
  {
    keywords: ['belajar', 'kursus', 'les', 'bimbel', 'training', 'pelatihan', 'belajar apa'],
    response: `Jasa Belajar/Kursus Mas Iis:\n- Les komputer/laptop\n- Kursus desain grafis\n- Kursus website\n- Bimbel sekolah\n- Pelatihan digital marketing\n\nHarga: Rp 100.000 - Rp 1.000.000\n\nWA: ${WA_LINK}`,
  },
  {
    keywords: ['terima kasih', 'makasih', 'thanks', 'thx', 'ok thanks', 'oke thanks', 'makasi', 'trims'],
    response: `Sama-sama kak! Senang bisa bantu 😊\n\nKalau ada yang ditanya lagi, chat aja kapan saja ya. Jangan lupa WA Mas Iis kalau mau order: ${WA_NUMBER}\n\nSemoga harimu menyenangkan kak! 🙏`,
  },
  {
    keywords: ['baik', 'sip', 'oke', 'ok', 'okey', 'okeh', 'gas'],
    response: `Siap kak! Kalau ada yang mau ditanya atau mau order, tinggal chat aja ya 😊\n\nWA Mas Iis: ${WA_NUMBER}`,
  },
  {
    keywords: ['siapa kamu', 'kamu siapa', 'kamu apa', 'bot apa', 'kamu bot', 'ai apa'],
    response: `Saya AI CS (Artificial Intelligence Customer Service) untuk Mas Iis - Warung Solusi 😊\n\nSaya siap bantu kakak 24/7 untuk:\n- Info jasa\n- Harga\n- Cara order\n- Jam operasional\n- Dll\n\nWalau AI, jawaban saya selalu relevan dengan bisnis Mas Iis. Kalau butuh bantuan human, WA Mas Iis langsung: ${WA_NUMBER}`,
  },
]

/**
 * Coba jawab pertanyaan pakai knowledge base.
 * Return null kalau tidak ada match (harus pakai AI).
 */
export function tryStaticReply(message: string): string | null {
  const lower = message.toLowerCase().trim()

  if (!lower || lower.length < 2) return null

  // Score each rule by how many keywords match
  let bestMatch: KBRule | null = null
  let bestScore = 0

  for (const rule of KNOWLEDGE_BASE) {
    let score = 0
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) {
        score += kw.length // Longer keyword match = higher score
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestMatch = rule
    }
  }

  // Require minimum score to avoid false positives
  if (bestMatch && bestScore >= 3) {
    return bestMatch.response
  }

  return null
}
