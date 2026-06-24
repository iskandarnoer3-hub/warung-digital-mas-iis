import { db } from '../src/lib/db';

const SERVICES = [
  {
    name: 'Servis Laptop & MacBook',
    slug: 'servis-laptop-macbook',
    category: 'Elektronik',
    shortDesc: 'Perbaikan segala jenis kerusakan laptop dan MacBook',
    detailDesc:
      'Perbaikan segala jenis kerusakan laptop dan MacBook. Layanan meliputi: perbaikan motherboard, penggantian power IC, layar retak atau pecah, keyboard rusak atau tombol hilang, baterai drop atau tidak charging, upgrade HDD ke SSD untuk performa lebih cepat, upgrade RAM untuk multitasking lebih lancar, install ulang Windows (7, 8, 10, 11) atau MacOS, hapus virus dan malware, perbaiki blue screen of death, solusi overheating, perbaikan port USB atau HDMI yang longgar atau rusak, penggantian kabel fleksibel, perbaikan fan berisik, recovery data dari hard drive yang rusak, penggantian thermal paste, perbaikan engsel laptop yang longgar, dan upgrade BIOS. Merek yang ditangani: ASUS, Acer, Lenovo, HP, Dell, Toshiba, Samsung, MSI, dan semua merek laptop. MacBook Air, MacBook Pro, MacBook M1/M2/M3/M4, iMac, Mac Mini. Proses pengerjaan: cek kerusakan GRATIS, diagnosa mendalam, konfirmasi harga sebelum perbaikan (transparan 100%), perbaikan oleh teknisi berpengalaman lebih dari 8 tahun, testing menyeluruh minimal 2 jam burn test, dan garansi resmi. Waktu pengerjaan: ringan 1-2 hari, sedang 2-4 hari, berat 5-7 hari.',
    price: 150000,
    priceMax: 1500000,
    benefit1: 'Gratis Cek Kerusakan',
    benefit2: 'Garansi 30 Hari',
    benefit3: 'Sparepart Original',
    benefit4: 'Teknisi Berpengalaman',
    benefit5: 'Panggilan Gratis Cirebon',
    waText:
      'Halo Mas Iis, saya mau tanya-tanya tentang servis laptop/MacBook. Bisa bantu cek kerusakan?',
    imageUrl: '/services/laptop.png',
    bonus: 'Free thermal paste',
    slotStatus: 'Slot Tersedia',
    slotAvailable: true,
    order: 1,
  },
  {
    name: 'Bimbingan Skripsi/Tesis/Disertasi/Artikel Ilmiah',
    slug: 'bimbingan-skripsi-tesis-disertasi-artikel-ilmiah',
    category: 'Pendidikan',
    shortDesc: 'Bimbingan dari judul sampai sidang, dijamin ACC',
    detailDesc:
      'Bimbingan skripsi, tesis, disertasi, dan artikel ilmiah untuk semua jurusan tanpa terkecuali. Ini adalah layanan unggulan Mas Iis yang paling diminati. Jurusan yang ditangani meliputi: Manajemen, Akuntansi, Pendidikan, Teknik Sipil, Teknik Informatika, Hukum, Psikologi, Kedokteran, Farmasi, Kesehatan Masyarakat, Ilmu Komputer, Sastra, Ekonomi Pembangunan, Ilmu Administrasi, Matematika, Fisika, Kimia, Biologi, Pertanian, Teknik Mesin, Teknik Elektro, Arsitektur, DKV, Ilmu Komunikasi, dan semua jurusan lainnya. Metode bimbingan: Online via Zoom atau Google Meet (bisa dari mana saja di Indonesia), juga tersedia offline untuk area Cirebon. Layanan termasuk: bantuan pemilihan judul, penyusunan rumusan masalah dan kerangka berpikir, bimbingan metodologi penelitian kuantitatif dan kualitatif, analisis data menggunakan SPSS, AMOS, LISREL, NVivo, Stata, R, Python, dan PLS-SEM, bimbingan coding, penulisan jurnal internasional, review dan revisi tiap bab sampai ACC, persiapan sidang termasuk mock interview dan presentasi, serta cek Turnitin dan paraphrase gratis. Jaminan: Dijamin ACC atau bimbingan ulang gratis tanpa batas waktu.',
    price: 1500000,
    priceMax: 5000000,
    benefit1: 'Jaminan Sampai Lulus',
    benefit2: 'Online & Offline',
    benefit3: 'Semua Jurusan',
    benefit4: 'Revisi Gratis',
    benefit5: 'Mentor Berpengalaman',
    waText:
      'Halo Mas Iis, saya mau konsultasi tentang bimbingan skripsi/tesis. Bisa dibantu dari judul sampai sidang?',
    imageUrl: '/services/skripsi.png',
    bonus: 'Free cek Turnitin & AI',
    slotStatus: 'Slot Tersedia',
    slotAvailable: true,
    order: 2,
  },
  {
    name: 'Jasa Cek Turnitin & AI',
    slug: 'jasa-cek-turnitin-ai',
    category: 'Pendidikan',
    shortDesc: 'Cek plagiarisme Turnitin & deteksi AI dengan laporan PDF resmi',
    detailDesc:
      'Cek similarity Turnitin resmi dan deteksi konten AI menggunakan sistem terbaru. Layanan ini sangat populer di kalangan mahasiswa dan dosen. Jenis layanan: Cek similarity Turnitin saja menggunakan akun Turnitin resmi institusi (hasilnya sama persis dengan kampus), Deteksi AI untuk cek apakah konten ditulis oleh ChatGPT, Claude, Gemini, dll, dan Paket Lengkap yang mencakup cek Turnitin ditambah deteksi AI ditambah paraphrase. Laporan PDF lengkap resmi sama persis dengan yang digunakan kampus, bisa dilampirkan langsung ke dosen pembimbing. Akurasi 99%. Tersedia paket paraphrase untuk menurunkan similarity secara aman dan natural tanpa mengubah makna. Proses: kirim file via WhatsApp atau email, proses 1-24 jam tergantung antrian, kirim laporan PDF resmi lengkap, jika perlu paraphrase proses tambahan 1-2 hari, file dihapus dari sistem setelah laporan dikirim untuk menjaga privasi.',
    price: 50000,
    priceMax: 150000,
    benefit1: 'Laporan PDF Resmi',
    benefit2: 'Akurat Sama Kampus',
    benefit3: 'Proses Cepat 1-24 Jam',
    benefit4: 'Deteksi AI + Plagiarisme',
    benefit5: 'Privasi Terjaga',
    waText:
      'Halo Mas Iis, saya mau cek Turnitin dan AI untuk tugas kuliah. Bisa bantu proses hari ini?',
    imageUrl: '/services/turnitin.png',
    bonus: 'Free paraphrase 2 halaman',
    slotStatus: 'Slot Tersedia',
    slotAvailable: true,
    order: 3,
  },
  {
    name: 'Les dan Privat Pelajaran SD dan TK',
    slug: 'les-privat-pelajaran-sd-tk',
    category: 'Pendidikan',
    shortDesc: 'Bimbingan belajar privat untuk anak SD dan TK dengan pendekatan menyenangkan',
    detailDesc:
      'LES dan privat pelajaran untuk anak SD kelas 1 sampai 6 dan TK. Pendekatan belajar menyenangkan agar anak tidak bosan dan termotivasi. Materi sesuai kurikulum Merdeka terbaru. Evaluasi berkala setiap minggu untuk memantau perkembangan. Laporan progress ke orang tua setiap bulan secara detail dan mudah dipahami. Mata pelajaran yang ditangani: Matematika, Bahasa Indonesia, IPA, IPS, PKn, Bahasa Inggris, Seni, PJOK, baca tulis untuk TK dan kelas 1 SD, Calistung (Baca, Tulis, Hitung) untuk anak usia dini, dan persiapan ujian semester serta ujian kenaikan kelas. Tersedia pilihan privat 1-on-1 atau grup kecil 3-5 anak. Jadwal fleksibel, bisa pilih hari dan jam sendiri. Minimal 2 kali seminggu masing-masing 90 menit per pertemuan. Bisa pagi, siang, atau sore. Guru sabar, menyenangkan, dan berpengalaman mengajar anak-anak.',
    price: 200000,
    priceMax: 600000,
    benefit1: 'Guru Sabar & Menyenangkan',
    benefit2: 'Kurikulum Merdeka Terbaru',
    benefit3: 'Privat 1-on-1 atau Grup Kecil',
    benefit4: 'Laporan Progress Bulanan',
    benefit5: 'Evaluasi Berkala Setiap Minggu',
    waText:
      'Halo Mas Iis, saya mau daftar les privat untuk anak saya yang masih SD/TK. Bisa info paket dan jadwalnya?',
    imageUrl: '/services/belajar.png',
    bonus: 'Free tes minat bakat anak',
    slotStatus: 'Slot Tersedia',
    slotAvailable: true,
    order: 4,
  },
  {
    name: 'Jasa Jahit Baju Borongan Sekolah',
    slug: 'jasa-jahit-borongan-sekolah',
    category: 'Fashion',
    shortDesc: 'Jahit seragam sekolah borongan, kualitas rapi & kuat',
    detailDesc:
      'Jasa jahit baju seragam sekolah borongan menggunakan mesin industrial untuk hasil yang rapi dan kuat. Bisa custom logo bordir dan sablon sesuai kebutuhan sekolah. Warna sesuai permintaan. Bahan bisa disediakan sendiri oleh pelanggan atau kami sediakan dengan harga terjangkau. Jenis seragam yang dibuat: seragam harian SD, SMP, SMA, SMK, seragam olahraga, seragam pramuka, seragam khusus (lab, OSIS, dll), dan seragam madrasah serta pesantren. Minimum order 20 pcs per model. Waktu pengerjaan 7-14 hari kerja tergantung jumlah pesanan. Urgent bisa 5 hari dengan tambahan biaya. Jahitan rapi dan kuat karena menggunakan mesin industrial profesional.',
    price: 45000,
    priceMax: 150000,
    benefit1: 'Jahitan Rapi & Kuat',
    benefit2: 'Bisa Custom Logo',
    benefit3: 'Minimum 20 Pcs',
    benefit4: 'Tepat Waktu',
    benefit5: 'Harga Borongan',
    waText:
      'Halo Mas Iis, saya mau tanya tentang jasa jahit baju borongan untuk seragam sekolah. Bisa info harga dan minimal order?',
    imageUrl: '/services/jahit-new.png',
    bonus: 'Gratis Sample 1 Pcs',
    slotStatus: 'Slot Tersedia',
    slotAvailable: true,
    order: 5,
  },
  {
    name: 'Desain Grafis Profesional',
    slug: 'desain-grafis-profesional',
    category: 'Digital',
    shortDesc: 'Logo, banner, feed IG, undangan, kartu nama',
    detailDesc:
      'Jasa desain grafis profesional untuk berbagai kebutuhan visual bisnis dan personal. Desainer kami berpengalaman lebih dari 5 tahun dan menguasai berbagai gaya desain. Jenis desain yang ditangani: logo brand (minimalis, vintage, modern, 3D, mascot), banner dan poster, feed Instagram dan carousel, undangan digital (pernikahan, khitanan, anniversary), kartu nama (standard, premium, custom shape), brosur dan flyer, packaging produk, menu restoran dan kafe, sertifikat dan diploma, ID card dan badge karyawan, desain kaos dan merchandise, serta mockup produk. Revisi unlimited sampai puas, beneran tanpa batas. File dikirim semua format: AI, PSD, PDF, PNG, dan JPG termasuk file masternya sehingga bisa diedit sendiri nanti. Waktu pengerjaan 1-3 hari kerja untuk desain pertama, revisi 1 hari.',
    price: 250000,
    priceMax: 1500000,
    benefit1: 'Revisi Unlimited',
    benefit2: 'File Semua Format',
    benefit3: 'Desainer Berpengalaman',
    benefit4: 'Proses 1-3 Hari',
    benefit5: 'Portfolio Lengkap',
    waText:
      'Halo Mas Iis, saya mau jasa desain grafis profesional. Bisa bantu buat desain logo/banner/undangan?',
    imageUrl: '/services/desain.png',
    bonus: 'Bonus kartu nama',
    slotStatus: 'Slot Tersedia',
    slotAvailable: true,
    order: 6,
  },
  {
    name: 'Jasa Agency Acara Lengkap',
    slug: 'jasa-agency-acara',
    category: 'Event',
    shortDesc: 'Paket all-in satu tahun untuk event organizer',
    detailDesc:
      'Jasa agency acara lengkap all-in-one. Satu paket untuk semua kebutuhan acara Anda. Tidak perlu repot mencari vendor satu-satu, kami urus semuanya dari A sampai Z. Layanan yang termasuk: MC profesional bilingual Indonesia-Sunda, dekorasi impian sesuai tema acara, sound system jernih dan lengkap, dokumentasi foto dan video cinematic, lighting dramatis dan profesional, rekomendasi catering terbaik di Cirebon, susun rundown dan sistem acara lengkap, serta koordinasi semua vendor dan timeline. Cocok untuk: wedding, khitanan, seminar, lomba, reuni, halalbihalal, syukuran, aqiqah, sunatan, dan acara apapun. Tersedia paket Basic, Standard, dan Premium All-in. Free MC profesional di semua paket. Syarat pembayaran: DP 30% untuk mengunci jadwal, pelunasan setelah acara selesai.',
    price: 5000000,
    priceMax: 25000000,
    benefit1: 'Paket All-In 1 Tahun',
    benefit2: 'MC Profesional',
    benefit3: 'Dokumentasi Lengkap',
    benefit4: 'Dekorasi Premium',
    benefit5: 'Sound System Lengkap',
    waText:
      'Halo Mas Iis, saya mau tanya tentang paket agency acara lengkap. Bisa bantu urus semua kebutuhan event saya?',
    imageUrl: '/services/agency.png',
    bonus: 'Free MC',
    slotStatus: 'Slot Tersedia',
    slotAvailable: true,
    order: 7,
  },
  {
    name: 'Jasa MC Profesional',
    slug: 'jasa-mc-profesional',
    category: 'Event',
    shortDesc: 'MC bilingual Indonesia-Sunda untuk segala acara',
    detailDesc:
      'MC profesional bilingual Indonesia-Sunda dengan pengalaman lebih dari 10 tahun. Mampu membaca situasi dan beradaptasi dengan audiens. Humor natural dan sopan, bukan jorok atau makian. Mampu menghidupkan suasana tanpa melecehkan siapapun. Cocok untuk semua jenis acara: wedding, khitanan, seminar, lomba, reuni, halalbihalal, dan acara formal maupun informal. Spesialisasi: wedding (akad dan resepsi), khitanan dan sunatan, seminar dan workshop, lomba dan kompetisi, reuni sekolah dan keluarga, halalbihalal dan syukuran, aqiqah dan tasyakuran, serta acara kantor dan gathering. Tersedia MC Reguler (Indonesia saja) dan MC Premium (bilingual Indonesia-Sunda ditambah susun rundown). Durasi sesuai acara, standar 4-6 jam. Gratis susun rundown dan sistem acara lengkap dengan timing yang presisi.',
    price: 750000,
    priceMax: 3000000,
    benefit1: 'Bilingual Indonesia-Sunda',
    benefit2: 'Susun Sistem Lengkap',
    benefit3: 'Gratis Susun Rundown',
    benefit4: 'Berpengalaman 10+ Tahun',
    benefit5: 'Energi & Humor',
    waText:
      'Halo Mas Iis, saya mau tanya tentang jasa MC profesional untuk acara saya. Bisa susun rundown juga?',
    imageUrl: '/services/mc.png',
    bonus: 'Gratis Susun Rundown',
    slotStatus: 'Slot Tersedia',
    slotAvailable: true,
    order: 8,
  },
  {
    name: 'Gambus & El-Husna Sound System',
    slug: 'gambus-elhusna-sound-system',
    category: 'Event',
    shortDesc: 'Sewa sound system lengkap untuk acara gambusan & el-husna',
    detailDesc:
      'Paket gambus dan el-husna lengkap untuk acara keagamaan. Sound system jernih dan berkualitas: mic wireless, speaker 12-15 inch, mixer profesional, dan player. Lagu bisa request sesuai keinginan. Koleksi lengkap lagu gambus, el-husna, sholawat, nasyid, dan qasidah. Cocok untuk gambusan, Maulid Nabi, haul, tahlilan, dan acara keagamaan lainnya. Peralatan yang termasuk: speaker aktif 12-15 inch (2 unit), mic wireless (2 unit), mixer audio profesional, player dan laptop, kabel dan stan mic, serta operator sound system berpengalaman. Tersedia paket 1-3 hari. Semua paket sudah termasuk operator berpengalaman yang ramah dan responsif.',
    price: 1500000,
    priceMax: 5000000,
    benefit1: 'Sound System Lengkap',
    benefit2: 'Lagu Bisa Request',
    benefit3: 'Free 2 Lagu Tambahan',
    benefit4: 'Operator Berpengalaman',
    benefit5: 'Paket 1-3 Hari',
    waText:
      'Halo Mas Iis, saya mau sewa paket gambus dan el-husna untuk acara keagamaan. Bisa info paket dan harga?',
    imageUrl: '/services/gambus.png',
    bonus: 'Free 2 lagu tambahan',
    slotStatus: 'Slot Tersedia',
    slotAvailable: true,
    order: 9,
  },
  {
    name: 'Jual Beli Kambing Qurban & Aqiqah',
    slug: 'jual-beli-kambing-qurban',
    category: 'Peternakan',
    shortDesc: 'Kambing qurban & aqiqah sesuai syariat Islam',
    detailDesc:
      'Jual beli kambing qurban dan aqiqah yang sesuai syariat Islam. Kambing sehat, gemuk, umur cukup, dan fisik sempurna. Jadi dalam 3 hari setelah pemesanan. Gratis sembelih dan packing rapi. Bisa antar ke rumah area Cirebon. Tersedia kambing jantan dan betina dalam berbagai ukuran dan harga. Syarat kambing sesuai syariat: umur cukup (minimal 1 tahun untuk kambing, sesuai pendapat ulama), fisik sempurna (tidak buta, tidak pincang, tidak sakit, tidak kurus), sehat dan gemuk, diperiksa sebelum diserahkan. Layanan tambahan: gratis sembelih sesuai syariat Islam, gratis packing rapi dan higienis, bisa antar ke rumah area Cirebon, foto dan video kambing sebelum deal, serta bantu distribusi daging jika diperlukan. Tersedia sepanjang tahun, permintaan meningkat mendekati Idul Adha.',
    price: 2500000,
    priceMax: 5000000,
    benefit1: 'Sesuai Syariat Islam',
    benefit2: 'Jadi 3 Hari',
    benefit3: 'Gratis Sembelih',
    benefit4: 'Kambing Sehat & Gemuk',
    benefit5: 'Bisa Antar',
    waText:
      'Halo Mas Iis, saya mau tanya tentang kambing qurban/aqiqah. Bisa kirim foto dan info harga kambing yang tersedia?',
    imageUrl: '/services/kambing.png',
    bonus: 'Gratis Sembelih & Packing',
    slotStatus: 'Slot Tersedia',
    slotAvailable: true,
    order: 10,
  },
  {
    name: 'Website Profil Minimalis',
    slug: 'website-profil-minimalis',
    category: 'IT',
    shortDesc: 'Website company profile, toko online, landing page',
    detailDesc:
      'Jasa pembuatan website profesional untuk berbagai kebutuhan bisnis. Desain minimalis modern yang clean dan profesional. Gratis domain dot com dan hosting selama 1 tahun. SEO friendly sehingga mudah ditemukan di Google. Responsive mobile, tampilan sempurna di semua perangkat dari HP sampai desktop. Gratis maintenance 1 bulan setelah selesai termasuk training cara edit konten sendiri. Jenis website yang dibuat: company profile atau profil bisnis, toko online atau e-commerce lengkap, landing page untuk kampanye promosi, blog atau portal berita, portfolio atau showcase karya, website sekolah atau lembaga pendidikan, website klinik atau praktik dokter, website restoran atau kafe dengan menu online. Loading super cepat. Pembayaran: DP 50%, 30% saat desain disetujui, 20% setelah launch.',
    price: 1500000,
    priceMax: 10000000,
    benefit1: 'Desain Minimalis Modern',
    benefit2: 'Gratis Domain 1 Tahun',
    benefit3: 'Gratis Maintenance 1 Bulan',
    benefit4: 'SEO Friendly',
    benefit5: 'Responsive Mobile',
    waText:
      'Halo Mas Iis, saya mau buat website untuk bisnis saya. Bisa konsultasi dulu tentang paket dan harganya?',
    imageUrl: '/services/website.png',
    bonus: 'Gratis Maintenance 1 Bulan',
    slotStatus: 'Slot Tersedia',
    slotAvailable: true,
    order: 11,
  },
  {
    name: 'Konsultan Manajemen Sekolah',
    slug: 'konsultan-manajemen-sekolah',
    category: 'Konsultan',
    shortDesc: 'Bimbingan akreditasi A dan SOP lengkap sekolah',
    detailDesc:
      'Konsultan manajemen sekolah profesional untuk bimbingan akreditasi A. Layanan komprehensif dari awal sampai visitasi. Tim konsultan berpengalaman dalam membantu puluhan sekolah mencapai akreditasi A. Layanan yang termasuk: penyusunan SOP lengkap yang bisa langsung dipakai (lebih dari 50 SOP), sistem administrasi digital modern, penyiapan dokumen visitasi lengkap, simulasi visitasi dengan tim profesional, pendampingan selama 1 tahun penuh, training staf dan guru, serta evaluasi berkala setiap bulan. Jenjang yang ditangani: SD, SMP, SMA, SMK, dan Perguruan Tinggi (negeri maupun swasta). Bisa offline dan online. Jaminan lolos, jika belum lolos pendampingan gratis sampai lolos.',
    price: 3000000,
    priceMax: 15000000,
    benefit1: 'Bimbingan Akreditasi A',
    benefit2: 'Jaminan Lolos',
    benefit3: 'Bonus SOP Lengkap',
    benefit4: 'Sistem Administrasi',
    benefit5: 'Pendampingan 1 Tahun',
    waText:
      'Halo Mas Iis, saya mau konsultasi tentang manajemen sekolah dan akreditasi. Bisa info paket bimbingannya?',
    imageUrl: '/services/konsultan.png',
    bonus: 'Bonus SOP lengkap',
    slotStatus: 'Slot Tersedia',
    slotAvailable: true,
    order: 12,
  },
  {
    name: 'CEO Copywriting',
    slug: 'ceo-copywriting',
    category: 'Digital',
    shortDesc: 'Copywriting formula AIDA & PAS untuk bisnis',
    detailDesc:
      'Jasa copywriting profesional menggunakan formula terbukti: AIDA (Attention, Interest, Desire, Action) dan PAS (Problem, Agitate, Solution). Riset produk dan target market mendalam sebelum menulis copy. Copy yang dihasilkan berfokus pada konversi, bukan sekadar tulisan indah. Setiap kata dipilih untuk membuat pembaca mengambil tindakan. Platform yang ditangani: landing page untuk website, iklan Facebook Ads dan Instagram Ads, iklan Google Ads, email marketing sequence, product description untuk marketplace, social media caption Instagram, TikTok, YouTube, sales letter dan sales page, serta video script untuk iklan dan YouTube. Tersedia paket Single landing page copy, Paket iklan (5 ads copy untuk multi-platform), dan Paket komplit (landing page, ads, email sequence). Revisi sampai pas tanpa limit.',
    price: 500000,
    priceMax: 3000000,
    benefit1: 'Formula AIDA & PAS',
    benefit2: 'Riset Produk Mendalam',
    benefit3: 'Bonus 10 Headline',
    benefit4: 'Conversion-Focused',
    benefit5: 'Revisi Sampai Pas',
    waText:
      'Halo Mas Iis, saya mau jasa copywriting untuk bisnis saya. Bisa bantu buat copy yang menjual dan convert?',
    imageUrl: '/services/copywriting.png',
    bonus: 'Bonus 10 Headline',
    slotStatus: 'Slot Tersedia',
    slotAvailable: true,
    order: 13,
  },
  {
    name: 'Jasa Kaligrafi Arab',
    slug: 'jasa-kaligrafi-arab',
    category: 'Seni',
    shortDesc: 'Kaligrafi Arab di kanvas, kayu, atau kaca',
    detailDesc:
      'Jasa kaligrafi Arab dengan berbagai gaya khat profesional. Setiap karya dibuat dengan ketelitian tinggi dan keindahan yang memukau. Cocok untuk masjid, rumah, kantor, dan hadiah yang berkesan. Gaya khat yang dikuasai: Naskhi (gaya paling mudah dibaca, cocok untuk ayat Al-Quran), Tsuluts (gaya elegan dan megah, cocok untuk dekorasi masjid), Diwani (gaya indah dan artistik, cocok untuk hadiah), Farisi (gaya khas Persia yang anggun), Kufi (gaya kuno dan kokoh, cocok untuk desain modern), dan Riqaah (gaya sederhana dan flowy). Media yang tersedia: kanvas, kayu jati, kaca, dan langsung di dinding rumah atau masjid. Custom ukuran sesuai permintaan. Free bingkai untuk ukuran di atas 50x70cm. Pengerjaan 3-7 hari kerja tergantung ukuran dan tingkat detail. Garansi warna 3 bulan.',
    price: 300000,
    priceMax: 2000000,
    benefit1: 'Khat Berbagai Gaya',
    benefit2: 'Media Kanvas/Kayu/Kaca',
    benefit3: 'Free Bingkai',
    benefit4: 'Custom Ukuran',
    benefit5: 'Pengerjaan 3-7 Hari',
    waText:
      'Halo Mas Iis, saya mau pesan kaligrafi Arab. Bisa bantu pilih gaya khat dan media yang cocok?',
    imageUrl: '/services/kaligrafi.png',
    bonus: 'Free bingkai (ukuran di atas 50x70cm)',
    slotStatus: 'Slot Tersedia',
    slotAvailable: true,
    order: 14,
  },
  {
    name: 'Hiasan Pigura Custom',
    slug: 'hiasan-pigura-custom',
    category: 'Seni',
    shortDesc: 'Pigura dan hiasan dinding desain custom eksklusif',
    detailDesc:
      'Jasa pembuatan pigura dan hiasan dinding custom eksklusif. Desain 100% sesuai permintaan pelanggan, tidak ada yang sama karena setiap karya dibuat khusus. Bahan premium: kayu jati, MDF, akrilik, dan logam. Pengerjaan 7 hari kerja. Bonus box packaging untuk hadiah yang makin premium dan elegan. Jenis pigura yang dibuat: pigura foto keluarga dan pernikahan, pigura kaligrafi dan ayat Al-Quran, pigura sertifikat dan ijazah, hiasan dinding 3D, mirror frame custom, dan combo set pigura untuk dekorasi ruangan. Bisa combo set untuk harga lebih hemat hingga 20% dibeli satuan.',
    price: 250000,
    priceMax: 1500000,
    benefit1: 'Desain Custom Eksklusif',
    benefit2: 'Pengerjaan 7 Hari',
    benefit3: 'Bonus Box Packaging',
    benefit4: 'Bahan Premium',
    benefit5: 'Bisa Combo Set',
    waText:
      'Halo Mas Iis, saya mau pesan pigura/hiasan dinding custom. Bisa bantu desain sesuai keinginan saya?',
    imageUrl: '/services/pigura-new.png',
    bonus: 'Bonus Box Packaging',
    slotStatus: 'Slot Tersedia',
    slotAvailable: true,
    order: 15,
  },
  {
    name: 'Hias Taman Profesional',
    slug: 'hias-taman-profesional',
    category: 'Seni',
    shortDesc: 'Jasa hias taman berpengalaman 40 tahun',
    detailDesc:
      'Jasa hias taman profesional dengan pengalaman 40 tahun. Ratusan taman sudah dikerjakan di seluruh Cirebon dan sekitarnya. Desain taman custom sesuai kebutuhan dan budget. Jenis taman yang dibuat: taman minimalis modern (simpel, clean, dan elegan), taman Jepang yang asri (dengan batu, air, dan tanaman khas Jepang), taman tropis rindang (penuh tanaman hijau dan bunga), taman herbal untuk masakan (kemangi, serai, jahe, kunyit, dll), vertical garden untuk lahan sempit (dinding hijau yang cantik), taman rooftop untuk hunian vertikal, dan taman playground yang aman dan menyenangkan untuk anak-anak. Layanan yang termasuk: konsultasi desain gratis, pemilihan tanaman yang sesuai iklim dan kondisi, instalasi sistem irigasi otomatis (opsional), pemasangan dekorasi taman, dan garansi tanaman 1 bulan. Maintenance bulanan tersedia untuk perawatan rutin.',
    price: 500000,
    priceMax: 10000000,
    benefit1: 'Pengalaman 40 Tahun',
    benefit2: 'Desain Custom',
    benefit3: 'Garansi Tanaman 1 Bulan',
    benefit4: 'Bahan Premium',
    benefit5: 'Maintenance Bulanan',
    waText:
      'Halo Mas Iis, saya mau jasa hias taman untuk rumah saya. Bisa konsultasi desain dulu secara gratis?',
    imageUrl: '/services/taman.png',
    bonus: 'Gratis konsultasi desain',
    slotStatus: 'Slot Tersedia',
    slotAvailable: true,
    order: 16,
  },
  {
    name: 'Jasa Hiburan Angklung',
    slug: 'jasa-hiburan-angklung',
    category: 'Event',
    shortDesc: '10 personil angklung dengan kostum tradisional',
    detailDesc:
      'Jasa hiburan angklung dengan 10 personil berpakaian kostum tradisional Sunda yang cantik dan menarik. Pengalaman yang sangat menyenangkan dan berkesan untuk semua tamu undangan. Repertoar lagu Sunda dan Nasional yang lengkap. Bisa request lagu di paket premium. Cocok untuk acara adat, pernikahan, khitanan, seminar, dan perkungulan. Fitur spesial: 10 personil angklung berpengalaman dan profesional, kostum tradisional Sunda yang cantik dan eye-catching, free interaktif 15 menit dimana penonton bisa ikut bermain angklung bersama personil (pengalaman unik yang tidak dilupakan), dan repertoar lengkap lagu Sunda dan Nasional. Tersedia Paket Standar (10 personil, 2 jam) dan Paket Premium (ditambah interaktif dan lagu request).',
    price: 1200000,
    priceMax: 3000000,
    benefit1: '10 Personil Angklung',
    benefit2: 'Kostum Tradisional',
    benefit3: 'Free Interaktif 15 Menit',
    benefit4: 'Lagu Sunda & Nasional',
    benefit5: 'Bisa Request Lagu',
    waText:
      'Halo Mas Iis, saya mau sewa jasa hiburan angklung untuk acara saya. Bisa info paket dan harga?',
    imageUrl: '/services/angklung-new.png',
    bonus: 'Free interaktif 15 menit',
    slotStatus: 'Slot Tersedia',
    slotAvailable: true,
    order: 17,
  },
];

const FAQS = [
  {
    question: 'Bagaimana cara memesan jasa di Mas Iis - Warung Solusi?',
    answer:
      'Pemesanan sangat mudah! Anda bisa langsung hubungi kami via WhatsApp di 0882-0008-58698, atau chat dengan AI CS kami di website masiis.vercel.app. Setelah konsultasi awal, kami akan memberikan penawaran harga dan jika setuju, proses bisa langsung dimulai.',
    category: 'Umum',
    order: 1,
    active: true,
    serviceId: null,
  },
  {
    question: 'Apa saja metode pembayaran yang tersedia?',
    answer:
      'Kami menerima transfer bank BCA (nomor rekening akan diberikan saat deal), bayar di tempat (COD) untuk area Cirebon, dan DP 30-50% tergantung jenis jasa. Pelunasan setelah selesai. Khusus skripsi/tesis: DP 50%, pelunasan setelah ACC. Khusus agency acara: DP 30% untuk mengunci jadwal.',
    category: 'Pembayaran',
    order: 2,
    active: true,
    serviceId: null,
  },
  {
    question: 'Area layanan mencakup wilayah mana saja?',
    answer:
      'Layanan offline mencakup seluruh Kota Cirebon dan Kabupaten Cirebon (gratis ongkos panggilan untuk Cirebon kota). Layanan online bisa dari mana saja di Indonesia: bimbingan skripsi/tesis, pembuatan website, copywriting, desain grafis, cek Turnitin, dan konsultan manajemen sekolah. Area luar Cirebon bisa dengan tambahan biaya transport.',
    category: 'Umum',
    order: 3,
    active: true,
    serviceId: null,
  },
  {
    question: 'Berapa lama waktu respons setelah menghubungi WhatsApp?',
    answer:
      'WhatsApp kami aktif 24/7. Jam kerja Senin-Sabtu 08.00-21.00 WIB, Minggu 09.00-17.00 WIB (emergency only). Balas maksimal 1 jam di jam kerja. Chat AI di website bisa diakses nonstop 24/7 tanpa henti.',
    category: 'Umum',
    order: 4,
    active: true,
    serviceId: null,
  },
  {
    question: 'Apakah ada garansi untuk setiap jasa?',
    answer:
      'Ya, setiap jasa memiliki garansi. Servis laptop: 30 hari sparepart, 14 hari software. Skripsi/tesis: jaminan ACC atau bimbingan ulang gratis tanpa batas waktu. Desain grafis: revisi unlimited sampai puas. Website: maintenance gratis 1 bulan. Hias taman: garansi tanaman 1 bulan. Kaligrafi: garansi warna 3 bulan. Konsultan sekolah: jaminan lolos akreditasi.',
    category: 'Garansi',
    order: 5,
    active: true,
    serviceId: null,
  },
  {
    question: 'Apakah bisa request jadwal di luar jam kerja?',
    answer:
      'Untuk layanan seperti bimbingan skripsi/tesis, jadwal sangat fleksibel. Bisa malam atau weekend sesuai kesepakatan. Untuk servis laptop, bisa panggil ke rumah area Cirebon. Untuk layanan lain, silakan konsultasi via WhatsApp untuk penyesuaian jadwal.',
    category: 'Umum',
    order: 6,
    active: true,
    serviceId: null,
  },
  {
    question: 'Bagaimana jika hasil tidak sesuai ekspektasi?',
    answer:
      'Kami mengutamakan kepuasan pelanggan di atas segalanya. Jika hasil tidak sesuai, kami akan melakukan revisi tanpa biaya tambahan. Untuk desain grafis, revisi unlimited sampai puas. Untuk skripsi, bimbingan ulang gratis tanpa batas waktu. Untuk jasa lainnya, garansi dan revisi tersedia sesuai ketentuan masing-masing layanan.',
    category: 'Garansi',
    order: 7,
    active: true,
    serviceId: null,
  },
  {
    question: 'Apakah Mas Iis melayani permintaan urgent atau last minute?',
    answer:
      'Beberapa jasa bisa dikerjakan secara urgent dengan tambahan biaya. Misalnya servis laptop ringan bisa same day, cek Turnitin bisa urgent same day, jahit borongan urgent 5 hari kerja. Silakan hubungi WhatsApp untuk konfirmasi ketersediaan jadwal urgent.',
    category: 'Umum',
    order: 8,
    active: true,
    serviceId: null,
  },
];

const SITE_CONFIGS = [
  { key: 'business_name', value: 'Mas Iis - Warung Solusi' },
  { key: 'business_tagline', value: 'Warung Solusi Terpercaya di Cirebon' },
  { key: 'whatsapp_number', value: '0882-0008-58698' },
  { key: 'email', value: 'masiis.warungsolusi@gmail.com' },
  {
    key: 'location',
    value: 'Sindanglaut, Kabupaten Cirebon, Jawa Barat',
  },
  { key: 'hero_image', value: '/services/logo.png' },
  { key: 'instagram', value: '@masiis.warungsolusi' },
  { key: 'facebook', value: 'Mas Iis Warung Solusi' },
  { key: 'tiktok', value: '@masiis.warungsolusi' },
  { key: 'youtube', value: 'Mas Iis Warung Solusi' },
  {
    key: 'about_text',
    value:
      'Mas Iis - Warung Solusi adalah usaha yang sudah berdiri bertahun-tahun di Sindanglaut, Cirebon. Bermula dari jasa servis laptop dan bimbingan skripsi, kini telah berkembang menjadi warung solusi lengkap dengan 17 jasa yang mencakup berbagai bidang: teknologi, pendidikan, seni, event, fashion, dan peternakan. Ratusan pelanggan sudah mempercayakan kebutuhan mereka kepada Mas Iis dengan rating kepuasan 4.9 dari 5.',
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data in correct order (respect foreign keys)
  await db.testimonial.deleteMany();
  await db.fAQ.deleteMany();
  await db.booking.deleteMany();
  await db.serviceImage.deleteMany();
  await db.landingPage.deleteMany();
  await db.chatLog.deleteMany();
  await db.article.deleteMany();
  await db.service.deleteMany();
  await db.siteConfig.deleteMany();

  // Seed services
  const createdServices: { id: string; slug: string }[] = [];
  for (const svc of SERVICES) {
    const service = await db.service.create({ data: svc });
    createdServices.push({ id: service.id, slug: svc.slug });
    // Auto-create landing page for each service
    await db.landingPage.create({
      data: {
        serviceId: service.id,
        headline: svc.name,
        subheadline: svc.shortDesc,
        ctaText: 'Hubungi Sekarang',
        sections: JSON.stringify([
          { type: 'hero', title: svc.name, subtitle: svc.shortDesc },
          {
            type: 'benefits',
            title: 'Keunggulan Layanan',
            items: [
              svc.benefit1,
              svc.benefit2,
              svc.benefit3,
              svc.benefit4,
              svc.benefit5,
            ],
          },
          { type: 'pricing', title: 'Harga', price: svc.price, priceMax: svc.priceMax },
          { type: 'cta', title: 'Pesan Sekarang', bonus: svc.bonus },
        ]),
      },
    });
  }

  // Seed sample articles
  await db.article.createMany({
    data: [
      {
        title: 'Tips Merawat Laptop Agar Awet',
        slug: 'tips-merawat-laptop',
        excerpt:
          'Pelajari cara merawat laptop agar tetap performa optimal selama bertahun-tahun.',
        content:
          '<h2>1. Bersihkan Secara Rutin</h2><p>Bersihkan keyboard dan layar minimal 1 minggu sekali...</p><h2>2. Jangan Makan di Dekat Laptop</h2><p>Remah makanan bisa masuk ke keyboard...</p><h2>3. Gunakan Cooling Pad</h2><p>Overheating adalah musuh utama laptop...</p>',
        published: true,
      },
      {
        title: 'Cara Menyelesaikan Skripsi 1 Bulan',
        slug: 'skripsi-1-bulan',
        excerpt:
          'Strategi praktis menyelesaikan skripsi dalam waktu singkat tanpa stres.',
        content:
          '<h2>1. Tentukan Judul Secepat Mungkin</h2><p>Jangan terlalu lama mencari judul sempurna...</p><h2>2. Buat Timeline Ketat</h2><p>Bagi waktu per bab...</p>',
        published: true,
      },
      {
        title: 'Mengapa Website Penting untuk Bisnis',
        slug: 'website-untuk-bisnis',
        excerpt:
          'Alasan mengapa setiap bisnis membutuhkan website di era digital.',
        content:
          '<h2>1. Kredibilitas Bisnis</h2><p>75% konsumen menilai kredibilitas dari website...</p>',
        published: true,
      },
    ],
  });

  // Seed FAQs
  await db.fAQ.createMany({
    data: FAQS,
  });

  // Seed site configs
  await db.siteConfig.createMany({
    data: SITE_CONFIGS,
  });

  // Seed testimonials (8 testimonials tied to service IDs)
  const getServiceId = (slug: string) =>
    createdServices.find((s) => s.slug === slug)?.id;

  const testimonials = [
    {
      serviceId: getServiceId('servis-laptop-macbook')!,
      name: 'Rizky Pratama',
      location: 'Cirebon Kota',
      photoUrl: '/services/testimonial-1.png',
      rating: 5,
      text: 'Laptop saya yang mati total bisa hidup lagi! Teknisinya ramah dan jujur, bilang kerusakannya cuma di power IC, gak ditambah-tambah. Harga juga transparan. Recommended banget!',
      order: 1,
      active: true,
    },
    {
      serviceId: getServiceId('servis-laptop-macbook')!,
      name: 'Siti Nurhaliza',
      location: 'Sumber, Cirebon',
      photoUrl: '/services/testimonial-1.png',
      rating: 5,
      text: 'MacBook Pro M1 saya yang layarnya pecah diperbaiki dengan cepat dan rapi. Hasilnya seperti baru lagi. Garansi 30 hari juga bikin tenang. Terima kasih Mas Iis!',
      order: 2,
      active: true,
    },
    {
      serviceId: getServiceId('bimbingan-skripsi-tesis-disertasi-artikel-ilmiah')!,
      name: 'Ahmad Fauzi',
      location: 'Jakarta (Online)',
      photoUrl: '/services/testimonial-1.png',
      rating: 5,
      text: 'Bimbingan skripsi online dari Mas Iis luar biasa! Dari judul sampai sidang dibimbing dengan sabar. Sekarang sudah lulus dan ACC. Mentor S2-nya sangat kompeten. Jaminan ACC itu beneran!',
      order: 3,
      active: true,
    },
    {
      serviceId: getServiceId('jasa-cek-turnitin-ai')!,
      name: 'Dina Amelia',
      location: 'Bandung (Online)',
      photoUrl: '/services/testimonial-1.png',
      rating: 5,
      text: 'Cek Turnitin di Mas Iis hasilnya sama persis dengan kampus. Laporan PDF-nya lengkap dan resmi. Prosesnya juga cepat, kurang dari 12 jam sudah jadi. Paraphrase-nya juga natural banget!',
      order: 4,
      active: true,
    },
    {
      serviceId: getServiceId('jasa-agency-acara')!,
      name: 'Hj. Ratna Dewi',
      location: 'Cirebon Kota',
      photoUrl: '/services/testimonial-1.png',
      rating: 5,
      text: 'Paket agency acara untuk pernikahan anak saya lengkap banget! MC, dekorasi, sound system, dokumentasi, semua diurus. Tinggal datang dan nikmati acara. Sangat profesional dan rapi.',
      order: 5,
      active: true,
    },
    {
      serviceId: getServiceId('website-profil-minimalis')!,
      name: 'Budi Santoso',
      location: 'Cirebon Kota',
      photoUrl: '/services/testimonial-1.png',
      rating: 5,
      text: 'Website toko online saya jadi keren banget! Desain minimalis modern, loading cepat, dan SEO friendly. Gratis domain dan hosting 1 tahun. Maintenance 1 bulan juga sangat membantu. Top!',
      order: 6,
      active: true,
    },
    {
      serviceId: getServiceId('desain-grafis-profesional')!,
      name: 'Linda Permata',
      location: 'Kuningan',
      photoUrl: '/services/testimonial-1.png',
      rating: 5,
      text: 'Desain logo untuk bisnis saya dibuat dengan sangat profesional. Revisinya benar-benar unlimited sampai saya puas. File dikirim semua format lengkap dengan master-nya. Sangat puas!',
      order: 7,
      active: true,
    },
    {
      serviceId: getServiceId('jual-beli-kambing-qurban')!,
      name: 'H. Mahmud',
      location: 'Sindanglaut, Cirebon',
      photoUrl: '/services/testimonial-1.png',
      rating: 5,
      text: 'Kambing qurbannya sehat dan gemuk, sesuai syariat Islam. Gratis sembelih dan packing rapi. Bisa antar ke rumah. Tiap tahun selalu order di sini. Terpercaya!',
      order: 8,
      active: true,
    },
  ];

  for (const t of testimonials) {
    if (t.serviceId) {
      await db.testimonial.create({ data: t });
    }
  }

  const count = await db.service.count();
  const faqCount = await db.fAQ.count();
  const configCount = await db.siteConfig.count();
  const testimonialCount = await db.testimonial.count();
  const articleCount = await db.article.count();

  console.log(
    `✅ Seeded ${count} services, ${articleCount} articles, ${faqCount} FAQs, ${configCount} site configs, ${testimonialCount} testimonials!`,
  );
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
