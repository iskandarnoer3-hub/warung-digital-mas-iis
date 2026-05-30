-- =====================================================
-- MAS IIS - WARUNG SOLUSI
-- Complete Database Initialization Script
-- Supabase PostgreSQL
-- =====================================================
-- Run this ENTIRE script in Supabase SQL Editor
-- It will DROP all existing tables and recreate everything
-- =====================================================

-- STEP 1: DROP ALL EXISTING TABLES (CASCADE)
DROP TABLE IF EXISTS "_prisma_migrations" CASCADE;
DROP TABLE IF EXISTS "ServiceImage" CASCADE;
DROP TABLE IF EXISTS "Testimonial" CASCADE;
DROP TABLE IF EXISTS "LandingPage" CASCADE;
DROP TABLE IF EXISTS "ChatLog" CASCADE;
DROP TABLE IF EXISTS "Booking" CASCADE;
DROP TABLE IF EXISTS "FAQ" CASCADE;
DROP TABLE IF EXISTS "Article" CASCADE;
DROP TABLE IF EXISTS "Service" CASCADE;
DROP TABLE IF EXISTS "SiteConfig" CASCADE;

-- STEP 2: CREATE ALL TABLES

CREATE TABLE "Service" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "shortDesc" TEXT NOT NULL,
  "detailDesc" TEXT NOT NULL DEFAULT '',
  "price" INTEGER NOT NULL DEFAULT 0,
  "priceMax" INTEGER NOT NULL DEFAULT 0,
  "benefit1" TEXT NOT NULL DEFAULT '',
  "benefit2" TEXT NOT NULL DEFAULT '',
  "benefit3" TEXT NOT NULL DEFAULT '',
  "benefit4" TEXT NOT NULL DEFAULT '',
  "benefit5" TEXT NOT NULL DEFAULT '',
  "waText" TEXT NOT NULL DEFAULT '',
  "imageUrl" TEXT NOT NULL DEFAULT '',
  "heroImageUrl" TEXT NOT NULL DEFAULT '',
  "videoUrl" TEXT NOT NULL DEFAULT '',
  "audioUrl" TEXT NOT NULL DEFAULT '',
  "externalLink" TEXT NOT NULL DEFAULT '',
  "bonus" TEXT NOT NULL DEFAULT '',
  "slotStatus" TEXT NOT NULL DEFAULT 'Slot Tersedia',
  "slotAvailable" BOOLEAN NOT NULL DEFAULT true,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Service_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Service_slug_key" UNIQUE ("slug")
);

CREATE TABLE "Article" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "excerpt" TEXT NOT NULL DEFAULT '',
  "content" TEXT NOT NULL DEFAULT '',
  "imageUrl" TEXT NOT NULL DEFAULT '',
  "published" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Article_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Article_slug_key" UNIQUE ("slug")
);

CREATE TABLE "LandingPage" (
  "id" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  "headline" TEXT NOT NULL DEFAULT '',
  "subheadline" TEXT NOT NULL DEFAULT '',
  "ctaText" TEXT NOT NULL DEFAULT 'Hubungi Sekarang',
  "sections" TEXT NOT NULL DEFAULT '[]',
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LandingPage_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "LandingPage_serviceId_key" UNIQUE ("serviceId"),
  CONSTRAINT "LandingPage_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Testimonial" (
  "id" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "location" TEXT NOT NULL DEFAULT '',
  "photoUrl" TEXT NOT NULL DEFAULT '',
  "rating" INTEGER NOT NULL DEFAULT 5,
  "text" TEXT NOT NULL,
  "audioUrl" TEXT NOT NULL DEFAULT '',
  "order" INTEGER NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Testimonial_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ChatLog" (
  "id" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChatLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ServiceImage" (
  "id" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "caption" TEXT NOT NULL DEFAULT '',
  "type" TEXT NOT NULL DEFAULT 'gallery',
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ServiceImage_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ServiceImage_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "SiteConfig" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "SiteConfig_key_key" UNIQUE ("key")
);

CREATE TABLE "Booking" (
  "id" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  "customerName" TEXT NOT NULL DEFAULT '',
  "customerPhone" TEXT NOT NULL DEFAULT '',
  "customerEmail" TEXT NOT NULL DEFAULT '',
  "message" TEXT NOT NULL DEFAULT '',
  "status" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Booking_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "FAQ" (
  "id" TEXT NOT NULL,
  "serviceId" TEXT,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "category" TEXT NOT NULL DEFAULT '',
  "order" INTEGER NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "FAQ_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create indexes for performance
CREATE INDEX "Service_category_idx" ON "Service"("category");
CREATE INDEX "Service_active_idx" ON "Service"("active");
CREATE INDEX "Service_order_idx" ON "Service"("order");
CREATE INDEX "ChatLog_sessionId_idx" ON "ChatLog"("sessionId");
CREATE INDEX "ChatLog_createdAt_idx" ON "ChatLog"("createdAt");
CREATE INDEX "Booking_serviceId_idx" ON "Booking"("serviceId");
CREATE INDEX "Booking_status_idx" ON "Booking"("status");
CREATE INDEX "FAQ_category_idx" ON "FAQ"("category");
CREATE INDEX "FAQ_active_idx" ON "FAQ"("active");

-- STEP 3: SEED ALL DATA

-- =====================================================
-- 17 SERVICES
-- =====================================================

INSERT INTO "Service" ("id", "name", "slug", "category", "shortDesc", "detailDesc", "price", "priceMax", "benefit1", "benefit2", "benefit3", "benefit4", "benefit5", "waText", "imageUrl", "heroImageUrl", "videoUrl", "audioUrl", "externalLink", "bonus", "slotStatus", "slotAvailable", "active", "order") VALUES
('svc01', 'Servis Laptop & MacBook', 'servis-laptop-macbook', 'Elektronik', 'Perbaikan segala jenis kerusakan laptop dan MacBook', 'Servis lengkap laptop dan MacBook: perbaikan motherboard, power IC, layar retak atau pecah, keyboard rusak, baterai drop, upgrade HDD ke SSD, upgrade RAM, install ulang Windows atau MacOS, hapus virus, perbaiki blue screen, solusi overheating. Proses: Cek gratis, diagnosa, konfirmasi harga, perbaikan, testing, serah terima ditambah garansi. Waktu pengerjaan 1 sampai 7 hari kerja tergantung tingkat kerusakan. Garansi 30 hari untuk sparepart dan 14 hari untuk software. Gratis panggilan area Cirebon kota, luar kota ongkir ditanggung customer. Teknisi berpengalaman lebih dari 8 tahun.', 150000, 1500000, 'Gratis Cek Kerusakan', 'Garansi 30 Hari', 'Sparepart Original', 'Teknisi Berpengalaman 8+ Tahun', 'Panggilan Gratis Cirebon', 'Halo Mas Iis, saya mau servis laptop atau MacBook', '/services/laptop.svg', '', '', '', '', 'Free thermal paste', 'Slot Tersedia', true, true, 1),

('svc02', 'Bimbingan Skripsi/Tesis/Disertasi/Artikel Ilmiah', 'bimbingan-skripsi-tesis-disertasi-artikel-ilmiah', 'Pendidikan', 'Bimbingan dari judul sampai sidang, dijamin ACC', 'Bimbingan skripsi, tesis, disertasi, dan artikel ilmiah semua jurusan tanpa terkecuali. Jurusan yang ditangani: manajemen, akuntansi, pendidikan, teknik, hukum, psikologi, kedokteran, farmasi, kesehatan masyarakat, ilmu komputer, sastra, ekonomi, dan lain-lain. Online via Zoom atau Google Meet, juga bisa offline. Bimbingan coding, jurnal internasional, analisis data menggunakan SPSS, AMOS, LISREL, NVivo, Stata, dan R. Dijamin ACC atau bimbingan ulang gratis tanpa batas waktu. Paket A untuk judul dan Bab 1 sampai 3 harga Rp 1.5 sampai 2.5 juta. Paket B untuk full Bab 1 sampai 5 ditambah persiapan sidang harga Rp 2.5 sampai 4 juta. Paket C untuk tesis dan disertasi full harga Rp 3 sampai 5 juta. Proses: konsultasi awal, pilih paket, pembayaran DP 50 persen, bimbingan rutin mingguan, revisi, ACC, pelunasan 50 persen, persiapan sidang. Mentor bergelar S2 dan S3 berpengalaman.', 1500000, 5000000, 'Jaminan Sampai Lulus', 'Online dan Offline', 'Semua Jurusan', 'Revisi Gratis Tanpa Batas', 'Mentor S2 dan S3 Berpengalaman', 'Halo Mas Iis, saya mau bimbingan skripsi atau tesis atau disertasi', '/services/skripsi.svg', '', '', '', '', 'Free cek Turnitin dan AI', 'Slot Tersedia', true, true, 2),

('svc03', 'Jasa Cek Turnitin & AI', 'jasa-cek-turnitin-ai', 'Pendidikan', 'Cek plagiarisme Turnitin dan deteksi AI dengan laporan PDF resmi', 'Cek similarity Turnitin resmi dan deteksi konten AI. Laporan PDF lengkap resmi sama persis dengan yang digunakan kampus. Proses 1 sampai 24 jam. Akurasi 99 persen. Tersedia paket paraphrase untuk menurunkan similarity. Harga: cek Turnitin saja Rp 50 ribu, cek Turnitin ditambah deteksi AI Rp 75 ribu, paket lengkap cek ditambah paraphrase Rp 100 sampai 150 ribu. Proses: kirim file, proses 1 sampai 24 jam, kirim laporan PDF, jika perlu paraphrase proses tambahan 1 sampai 2 hari. File dijamin aman dan dihapus setelah selesai. Privasi terjamin 100 persen.', 50000, 150000, 'Laporan PDF Resmi', 'Akurat Sama Kampus', 'Proses Cepat 1 sampai 24 Jam', 'Deteksi AI dan Plagiarisme', 'Privasi Terjaga 100 Persen', 'Halo Mas Iis, saya mau cek Turnitin dan AI', '/services/turnitin.svg', '', '', '', '', 'Free paraphrase 2 halaman', 'Slot Tersedia', true, true, 3),

('svc04', 'LES dan Privat Pelajaran SD dan TK', 'les-privat-pelajaran-sd-tk', 'Pendidikan', 'Bimbingan belajar privat untuk anak SD dan TK dengan pendekatan menyenangkan', 'LES dan privat pelajaran untuk anak SD kelas 1 sampai 6 dan TK. Pendekatan belajar menyenangkan agar anak tidak bosan. Materi sesuai kurikulum Merdeka terbaru. Evaluasi berkala setiap minggu. Laporan progress ke orang tua setiap bulan. Tersedia Privat 1-on-1 atau grup kecil 3 sampai 5 anak. Harga: Privat 1-on-1 Rp 400 sampai 600 ribu per bulan, Grup 3 sampai 5 anak Rp 200 sampai 350 ribu per bulan per anak. Jadwal fleksibel bisa pilih hari dan jam sendiri. Minimal 2 kali seminggu masing-masing 90 menit. Semua guru lulusan pendidikan dan berpengalaman mengajar anak-anak.', 200000, 600000, 'Guru Sabar dan Menyenangkan', 'Materi Sesuai Kurikulum Merdeka', 'Privat atau Grup Kecil', 'Laporan Progress ke Orang Tua', 'Evaluasi Berkala Setiap Minggu', 'Halo Mas Iis, saya mau daftar les privat SD atau TK', '/services/belajar.svg', '', '', '', '', 'Free tes minat bakat anak', 'Slot Tersedia', true, true, 4),

('svc05', 'Jasa Jahit Baju Borongan Sekolah', 'jasa-jahit-borongan-sekolah', 'Fashion', 'Jahit seragam sekolah borongan, kualitas rapi dan kuat', 'Jasa jahit baju seragam sekolah borongan. Jahitan rapi dan kuat menggunakan mesin industrial. Bisa custom logo bordir dan sablon. Warna sesuai permintaan. Bahan bisa dari customer atau kami sediakan. Harga: tanpa bahan Rp 45 sampai 80 ribu per pcs, dengan bahan Rp 80 sampai 150 ribu per pcs. Minimum order 20 pcs per model. Waktu pengerjaan 7 sampai 14 hari kerja tergantung jumlah pesanan. Jahitan kuat dan tahan lama, cocok untuk seragam harian sekolah.', 45000, 150000, 'Jahitan Rapi dan Kuat', 'Bisa Custom Logo Bordir dan Sablon', 'Minimum 20 Pcs', 'Tepat Waktu', 'Harga Borongan Kompetitif', 'Halo Mas Iis, saya mau jahit baju borongan sekolah', '/services/jahit.svg', '', '', '', '', 'Gratis Sample 1 Pcs', 'Slot Tersedia', true, true, 5),

('svc06', 'Desain Grafis Profesional', 'desain-grafis-profesional', 'Digital', 'Logo, banner, feed IG, undangan, kartu nama, dan lainnya', 'Jasa desain grafis profesional: logo, banner, feed Instagram, undangan digital, kartu nama, brosur, packaging, menu restoran, sertifikat, dan ID card. Revisi unlimited sampai puas, bukan cuma marketing tetapi beneran unlimited. File dikirim semua format yaitu AI, PSD, PDF, PNG, dan JPG. Harga: logo Rp 500 ribu sampai 1.5 juta, banner atau poster Rp 250 sampai 500 ribu, feed IG Rp 150 sampai 300 ribu per desain, undangan digital Rp 300 sampai 600 ribu, kartu nama Rp 200 sampai 400 ribu. Waktu pengerjaan 1 sampai 3 hari kerja untuk desain pertama, revisi 1 hari. Desainer berpengalaman lebih dari 5 tahun.', 250000, 1500000, 'Revisi Unlimited Sampai Puas', 'File Semua Format AI PSD PDF PNG JPG', 'Desainer Berpengalaman 5+ Tahun', 'Proses 1 sampai 3 Hari', 'Portfolio Lengkap', 'Halo Mas Iis, saya mau jasa desain grafis', '/services/desain.svg', '', '', '', '', 'Bonus kartu nama', 'Slot Tersedia', true, true, 6),

('svc07', 'Jasa Agency Acara Lengkap', 'jasa-agency-acara', 'Event', 'Paket all-in satu tahun untuk event organizer', 'Jasa agency acara lengkap all-in-one. Termasuk MC, dekorasi, sound system, dokumentasi foto dan video, lighting, dan rekomendasi catering. Paket tersedia untuk 1 tahun atau per event. Cocok untuk wedding, khitanan, seminar, lomba, reuni, halalbihalal, syukuran, dan aqiqah. Paket Basic termasuk MC dan sound system harga Rp 5 sampai 8 juta. Paket Standard ditambah dekorasi dan dokumentasi harga Rp 8 sampai 15 juta. Paket Premium all-in harga Rp 15 sampai 25 juta. Free MC profesional di semua paket. DP 30 persen dari total harga. Area coverage Cirebon dan sekitarnya, luar kota bisa dengan additional cost.', 5000000, 25000000, 'Paket All-In 1 Tahun', 'MC Profesional Free', 'Dokumentasi Lengkap Foto dan Video', 'Dekorasi Premium', 'Sound System Lengkap', 'Halo Mas Iis, saya mau jasa agency acara', '/services/agency.svg', '', '', '', '', 'Free MC Profesional', 'Slot Tersedia', true, true, 7),

('svc08', 'Jasa MC Profesional', 'jasa-mc-profesional', 'Event', 'MC bilingual Indonesia-Sunda untuk segala acara', 'Jasa MC profesional bilingual Indonesia-Sunda. Berpengalaman lebih dari 10 tahun. Cocok untuk wedding, khitanan, seminar, lomba, reuni, dan halalbihalal. Susun rundown dan sistem acara lengkap. Bisa baca situasi dan adaptasi dengan audiens. Humor natural bukan jorok, sopan dan menghibur. Harga: MC reguler Rp 750 ribu sampai 1.5 juta, MC premium bilingual ditambah susun rundown Rp 1.5 sampai 3 juta. Durasi sesuai acara, standar 4 sampai 6 jam. Gratis susun rundown di semua paket.', 750000, 3000000, 'Bilingual Indonesia-Sunda', 'Susun Sistem dan Rundown Lengkap', 'Gratis Susun Rundown', 'Berpengalaman 10+ Tahun', 'Energi dan Humor Natural', 'Halo Mas Iis, saya mau jasa MC', '/services/mc.svg', '', '', '', '', 'Gratis Susun Rundown', 'Slot Tersedia', true, true, 8),

('svc09', 'Gambus dan El-Husna Sound System', 'gambus-elhusna-sound-system', 'Event', 'Sewa sound system lengkap untuk acara gambusan dan el-husna', 'Paket gambus dan el-husna lengkap: sound system, mic wireless, speaker 12 sampai 15 inch, mixer, dan player. Lagu bisa request sesuai keinginan. Tersedia paket 1 sampai 3 hari. Cocok untuk gambusan, Maulid Nabi, haul, tahlilan, dan acara keagamaan lainnya. Harga: paket 1 hari Rp 1.5 sampai 2.5 juta, paket 2 hari Rp 2.5 sampai 3.5 juta, paket 3 hari Rp 3.5 sampai 5 juta. Termasuk operator berpengalaman.', 1500000, 5000000, 'Sound System Lengkap', 'Lagu Bisa Request', 'Free 2 Lagu Tambahan', 'Operator Berpengalaman', 'Paket 1 sampai 3 Hari', 'Halo Mas Iis, saya mau sewa gambus atau el-husna', '/services/gambir.svg', '', '', '', '', 'Free 2 lagu tambahan', 'Slot Tersedia', true, true, 9),

('svc10', 'Jual Beli Kambing Qurban dan Aqiqah', 'jual-beli-kambing-qurban', 'Peternakan', 'Kambing qurban dan aqiqah sesuai syariat Islam', 'Jual beli kambing qurban dan aqiqah. Sesuai syariat Islam, sehat, gemuk, umur cukup. Jadi dalam 3 hari. Gratis sembelih dan packing rapi. Bisa antar ke rumah area Cirebon. Tersedia kambing jantan dan betina dalam berbagai ukuran. Harga: kambing qurban Rp 2.5 sampai 4 juta, kambing aqiqah Rp 2.5 sampai 5 juta tergantung ukuran. Tersedia sepanjang tahun, terutama mendekati Idul Adha permintaan meningkat.', 2500000, 5000000, 'Sesuai Syariat Islam', 'Jadi 3 Hari', 'Gratis Sembelih dan Packing', 'Kambing Sehat dan Gemuk', 'Bisa Antar Area Cirebon', 'Halo Mas Iis, saya mau kambing qurban atau aqiqah', '/services/kambing.svg', '', '', '', '', 'Gratis Sembelih', 'Slot Tersedia', true, true, 10),

('svc11', 'Website Profil Minimalis', 'website-profil-minimalis', 'IT', 'Website company profile, toko online, landing page', 'Jasa pembuatan website: company profile, toko online, landing page, blog, dan portfolio. Desain minimalis modern menggunakan teknologi terkini. Gratis domain dot com dan hosting 1 tahun. SEO friendly sehingga mudah ditemukan di Google. Responsive mobile tampilan sempurna di semua perangkat. Gratis maintenance 1 bulan setelah selesai. Paket: landing page Rp 1.5 sampai 3 juta pengerjaan 3 sampai 7 hari, company profile Rp 3 sampai 5 juta pengerjaan 7 sampai 14 hari, toko online Rp 5 sampai 10 juta pengerjaan 14 sampai 30 hari. Bisa edit sendiri, dikasih training.', 1500000, 10000000, 'Desain Minimalis Modern', 'Gratis Domain dot com 1 Tahun', 'Gratis Maintenance 1 Bulan', 'SEO Friendly', 'Responsive Mobile', 'Halo Mas Iis, saya mau buat website', '/services/website.svg', '', '', '', '', 'Gratis Maintenance 1 Bulan', 'Slot Tersedia', true, true, 11),

('svc12', 'Konsultan Manajemen Sekolah', 'konsultan-manajemen-sekolah', 'Konsultan', 'Bimbingan akreditasi A dan SOP lengkap sekolah', 'Konsultan manajemen sekolah profesional. Bimbingan akreditasi A, SOP lengkap, sistem administrasi digital, penyiapan dokumen visitasi, simulasi visitasi, dan pendampingan selama 1 tahun. Jaminan lolos akreditasi. Paket Akreditasi Rp 3 sampai 8 juta, Paket Manajemen Lengkap Rp 8 sampai 15 juta. Untuk semua jenjang: SD, SMP, SMA, SMK, dan Perguruan Tinggi. Bisa offline dan online. Pendampingan 6 sampai 12 bulan sampai akreditasi selesai. Bonus SOP lengkap yang bisa langsung dipakai.', 3000000, 15000000, 'Bimbingan Akreditasi A', 'Jaminan Lolos Akreditasi', 'Bonus SOP Lengkap', 'Sistem Administrasi Digital', 'Pendampingan 1 Tahun', 'Halo Mas Iis, saya mau konsultasi manajemen sekolah', '/services/konsultan.svg', '', '', '', '', 'Bonus SOP lengkap', 'Slot Tersedia', true, true, 12),

('svc13', 'CEO Copywriting', 'ceo-copywriting', 'Digital', 'Copywriting formula AIDA dan PAS untuk bisnis', 'Jasa copywriting profesional menggunakan formula AIDA yaitu Attention Interest Desire Action dan PAS yaitu Problem Agitate Solution. Riset produk dan target market mendalam sebelum menulis. Cocok untuk landing page, iklan Facebook Instagram Google, email marketing, product description, dan social media caption. Paket: single landing page copy Rp 500 ribu sampai 1 juta, paket iklan 5 ads Rp 1 sampai 2 juta, paket komplit landing ditambah ads ditambah email Rp 2 sampai 3 juta. Revisi sampai pas tanpa limit. Copy yang menjual bukan sekadar tulisan biasa.', 500000, 3000000, 'Formula AIDA dan PAS', 'Riset Produk dan Market Mendalam', 'Bonus 10 Headline Ampuh', 'Conversion-Focused', 'Revisi Sampai Pas Tanpa Limit', 'Halo Mas Iis, saya mau jasa copywriting', '/services/copywriting.svg', '', '', '', '', 'Bonus 10 Headline', 'Slot Tersedia', true, true, 13),

('svc14', 'Jasa Kaligrafi Arab', 'jasa-kaligrafi-arab', 'Seni', 'Kaligrafi Arab di kanvas, kayu, atau kaca', 'Jasa kaligrafi Arab dengan berbagai gaya khat: Naskhi, Tsuluts, Diwani, Farisi, Kufi, dan Riqah. Media: kanvas, kayu, kaca, dan dinding. Custom ukuran sesuai permintaan. Free bingkai untuk ukuran di atas 50x70cm. Cocok untuk masjid, rumah, kantor, dan hadiah. Harga: kanvas kecil 30x40 Rp 300 sampai 500 ribu, kanvas sedang 50x70 Rp 500 ribu sampai 1 juta, kanvas besar 80x100 dan di atasnya Rp 1 sampai 2 juta. Pengerjaan 3 sampai 7 hari kerja.', 300000, 2000000, 'Khat Berbagai Gaya Naskhi Tsuluts Diwani Farisi Kufi', 'Media Kanvas Kayu Kaca Dinding', 'Free Bingkai Ukuran di Atas 50x70', 'Custom Ukuran Sesuai Permintaan', 'Pengerjaan 3 sampai 7 Hari', 'Halo Mas Iis, saya mau jasa kaligrafi', '/services/kaligrafi.svg', '', '', '', '', 'Free bingkai', 'Slot Tersedia', true, true, 14),

('svc15', 'Hiasan Pigura Custom', 'hiasan-pigura-custom', 'Seni', 'Pigura dan hiasan dinding desain custom eksklusif', 'Jasa pembuatan pigura dan hiasan dinding custom eksklusif. Desain sesuai permintaan pelanggan. Bahan premium: kayu jati, MDF, akrilik, dan logam. Pengerjaan 7 hari kerja. Bonus box packaging untuk hadiah. Harga: pigura kecil 20x30 Rp 250 sampai 500 ribu, pigura sedang 40x60 Rp 500 ribu sampai 1 juta, pigura besar atau combo set Rp 1 sampai 1.5 juta. Cocok untuk hadiah, dekorasi rumah, dan kantor.', 250000, 1500000, 'Desain Custom Eksklusif', 'Pengerjaan 7 Hari', 'Bonus Box Packaging', 'Bahan Premium Kayu Jati MDF Akrilik', 'Bisa Combo Set', 'Halo Mas Iis, saya mau pesan pigura atau hiasan', '/services/pigura.svg', '', '', '', '', 'Bonus Box', 'Slot Tersedia', true, true, 15),

('svc16', 'Hias Taman Profesional', 'hias-taman-profesional', 'Seni', 'Jasa hias taman berpengalaman 40 tahun', 'Jasa hias taman profesional dengan pengalaman 40 tahun. Desain taman minimalis, taman Jepang, taman tropis, taman herbal, vertical garden, dan taman rooftop. Garansi tanaman 1 bulan. Maintenance bulanan tersedia. Paket: taman minimalis Rp 500 ribu sampai 3 juta, taman Jepang atau tropis Rp 3 sampai 7 juta, taman lengkap ditambah maintenance Rp 7 sampai 10 juta. Gratis konsultasi desain di awal. Bahan premium dan tanaman pilihan berkualitas.', 500000, 10000000, 'Pengalaman 40 Tahun', 'Desain Custom Sesuai Kebutuhan', 'Garansi Tanaman 1 Bulan', 'Bahan Premium Tanaman Pilihan', 'Maintenance Bulanan Tersedia', 'Halo Mas Iis, saya mau jasa hias taman', '/services/taman.svg', '', '', '', '', 'Gratis konsultasi desain', 'Slot Tersedia', true, true, 16),

('svc17', 'Jasa Hiburan Angklung', 'jasa-hiburan-angklung', 'Event', '10 personil angklung dengan kostum tradisional', 'Jasa hiburan angklung dengan 10 personil berpakaian kostum tradisional Sunda. Free interaktif 15 menit dimana penonton bisa ikut bermain angklung. Lagu Sunda dan Nasional tersedia. Bisa request lagu di paket premium. Cocok untuk acara adat, pernikahan, khitanan, seminar, dan perkumpulan. Harga: paket standar 10 personil 2 jam Rp 1.2 sampai 2 juta, paket premium ditambah interaktif dan lagu request Rp 2 sampai 3 juta.', 1200000, 3000000, '10 Personil Angklung Berpengalaman', 'Kostum Tradisional Sunda', 'Free Interaktif 15 Menit', 'Lagu Sunda dan Nasional', 'Bisa Request Lagu', 'Halo Mas Iis, saya mau jasa angklung', '/services/angklung.svg', '', '', '', '', 'Free interaktif 15 menit', 'Slot Tersedia', true, true, 17);


-- =====================================================
-- LANDING PAGES FOR EACH SERVICE
-- =====================================================

INSERT INTO "LandingPage" ("id", "serviceId", "headline", "subheadline", "ctaText", "sections") VALUES
('lp01', 'svc01', 'Servis Laptop & MacBook', 'Perbaikan segala jenis kerusakan laptop dan MacBook', 'Hubungi Sekarang', '[{"type":"hero","title":"Servis Laptop dan MacBook","subtitle":"Perbaikan segala jenis kerusakan laptop dan MacBook"},{"type":"benefits","title":"Keunggulan Layanan","items":["Gratis Cek Kerusakan","Garansi 30 Hari","Sparepart Original","Teknisi Berpengalaman 8+ Tahun","Panggilan Gratis Cirebon"]},{"type":"pricing","title":"Harga","price":150000,"priceMax":1500000},{"type":"cta","title":"Pesan Sekarang","bonus":"Free thermal paste"}]'),
('lp02', 'svc02', 'Bimbingan Skripsi/Tesis/Disertasi', 'Bimbingan dari judul sampai sidang, dijamin ACC', 'Hubungi Sekarang', '[{"type":"hero","title":"Bimbingan Skripsi Tesis Disertasi","subtitle":"Dari judul sampai sidang dijamin ACC"},{"type":"benefits","title":"Keunggulan Layanan","items":["Jaminan Sampai Lulus","Online dan Offline","Semua Jurusan","Revisi Gratis Tanpa Batas","Mentor S2 S3 Berpengalaman"]},{"type":"pricing","title":"Harga","price":1500000,"priceMax":5000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Free cek Turnitin dan AI"}]'),
('lp03', 'svc03', 'Jasa Cek Turnitin & AI', 'Cek plagiarisme dan deteksi AI dengan laporan PDF resmi', 'Hubungi Sekarang', '[{"type":"hero","title":"Cek Turnitin dan AI","subtitle":"Laporan PDF resmi sama kampus"},{"type":"benefits","title":"Keunggulan Layanan","items":["Laporan PDF Resmi","Akurat Sama Kampus","Proses Cepat 1-24 Jam","Deteksi AI dan Plagiarisme","Privasi Terjaga"]},{"type":"pricing","title":"Harga","price":50000,"priceMax":150000},{"type":"cta","title":"Pesan Sekarang","bonus":"Free paraphrase 2 halaman"}]'),
('lp04', 'svc04', 'LES dan Privat SD/TK', 'Bimbingan belajar privat dengan pendekatan menyenangkan', 'Hubungi Sekarang', '[{"type":"hero","title":"LES dan Privat SD TK","subtitle":"Belajar menyenangkan anak tidak bosan"},{"type":"benefits","title":"Keunggulan Layanan","items":["Guru Sabar dan Menyenangkan","Materi Sesuai Kurikulum Merdeka","Privat atau Grup Kecil","Laporan Progress ke Orang Tua","Evaluasi Berkala"]},{"type":"pricing","title":"Harga","price":200000,"priceMax":600000},{"type":"cta","title":"Pesan Sekarang","bonus":"Free tes minat bakat anak"}]'),
('lp05', 'svc05', 'Jahit Baju Borongan Sekolah', 'Seragam sekolah borongan rapi dan kuat', 'Hubungi Sekarang', '[{"type":"hero","title":"Jahit Borongan Sekolah","subtitle":"Jahitan rapi kuat harga kompetitif"},{"type":"benefits","title":"Keunggulan Layanan","items":["Jahitan Rapi dan Kuat","Bisa Custom Logo","Minimum 20 Pcs","Tepat Waktu","Harga Borongan"]},{"type":"pricing","title":"Harga","price":45000,"priceMax":150000},{"type":"cta","title":"Pesan Sekarang","bonus":"Gratis Sample 1 Pcs"}]'),
('lp06', 'svc06', 'Desain Grafis Profesional', 'Logo, banner, feed IG, undangan, dan lainnya', 'Hubungi Sekarang', '[{"type":"hero","title":"Desain Grafis Profesional","subtitle":"Revisi unlimited sampai puas"},{"type":"benefits","title":"Keunggulan Layanan","items":["Revisi Unlimited","File Semua Format","Desainer 5+ Tahun","Proses 1-3 Hari","Portfolio Lengkap"]},{"type":"pricing","title":"Harga","price":250000,"priceMax":1500000},{"type":"cta","title":"Pesan Sekarang","bonus":"Bonus kartu nama"}]'),
('lp07', 'svc07', 'Agency Acara Lengkap', 'Paket all-in untuk event organizer', 'Hubungi Sekarang', '[{"type":"hero","title":"Agency Acara Lengkap","subtitle":"All-in-one MC dekorasi sound system dokumentasi"},{"type":"benefits","title":"Keunggulan Layanan","items":["Paket All-In 1 Tahun","MC Profesional Free","Dokumentasi Lengkap","Dekorasi Premium","Sound System Lengkap"]},{"type":"pricing","title":"Harga","price":5000000,"priceMax":25000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Free MC"}]'),
('lp08', 'svc08', 'Jasa MC Profesional', 'MC bilingual Indonesia-Sunda', 'Hubungi Sekarang', '[{"type":"hero","title":"MC Profesional","subtitle":"Bilingual Indonesia-Sunda berpengalaman 10+ tahun"},{"type":"benefits","title":"Keunggulan Layanan","items":["Bilingual Indonesia-Sunda","Susun Sistem Lengkap","Gratis Susun Rundown","Berpengalaman 10+ Tahun","Energi dan Humor Natural"]},{"type":"pricing","title":"Harga","price":750000,"priceMax":3000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Gratis Susun Rundown"}]'),
('lp09', 'svc09', 'Gambus & El-Husna Sound System', 'Sewa sound system untuk gambusan dan el-husna', 'Hubungi Sekarang', '[{"type":"hero","title":"Gambus dan El-Husna","subtitle":"Sound system lengkap lagu bisa request"},{"type":"benefits","title":"Keunggulan Layanan","items":["Sound System Lengkap","Lagu Bisa Request","Free 2 Lagu Tambahan","Operator Berpengalaman","Paket 1-3 Hari"]},{"type":"pricing","title":"Harga","price":1500000,"priceMax":5000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Free 2 lagu tambahan"}]'),
('lp10', 'svc10', 'Kambing Qurban & Aqiqah', 'Kambing sesuai syariat Islam', 'Hubungi Sekarang', '[{"type":"hero","title":"Kambing Qurban dan Aqiqah","subtitle":"Sesuai syariat Islam sehat gemuk"},{"type":"benefits","title":"Keunggulan Layanan","items":["Sesuai Syariat Islam","Jadi 3 Hari","Gratis Sembelih","Kambing Sehat Gemuk","Bisa Antar"]},{"type":"pricing","title":"Harga","price":2500000,"priceMax":5000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Gratis Sembelih"}]'),
('lp11', 'svc11', 'Website Profil Minimalis', 'Website company profile, toko online, landing page', 'Hubungi Sekarang', '[{"type":"hero","title":"Website Profil Minimalis","subtitle":"Desain modern SEO friendly responsive"},{"type":"benefits","title":"Keunggulan Layanan","items":["Desain Minimalis Modern","Gratis Domain 1 Tahun","Gratis Maintenance 1 Bulan","SEO Friendly","Responsive Mobile"]},{"type":"pricing","title":"Harga","price":1500000,"priceMax":10000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Gratis Maintenance 1 Bulan"}]'),
('lp12', 'svc12', 'Konsultan Manajemen Sekolah', 'Bimbingan akreditasi A dan SOP lengkap', 'Hubungi Sekarang', '[{"type":"hero","title":"Konsultan Manajemen Sekolah","subtitle":"Jaminan lolos akreditasi A"},{"type":"benefits","title":"Keunggulan Layanan","items":["Bimbingan Akreditasi A","Jaminan Lolos","Bonus SOP Lengkap","Sistem Administrasi Digital","Pendampingan 1 Tahun"]},{"type":"pricing","title":"Harga","price":3000000,"priceMax":15000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Bonus SOP lengkap"}]'),
('lp13', 'svc13', 'CEO Copywriting', 'Copywriting formula AIDA dan PAS', 'Hubungi Sekarang', '[{"type":"hero","title":"CEO Copywriting","subtitle":"Formula AIDA PAS copy yang menjual"},{"type":"benefits","title":"Keunggulan Layanan","items":["Formula AIDA dan PAS","Riset Produk Mendalam","Bonus 10 Headline","Conversion-Focused","Revisi Sampai Pas"]},{"type":"pricing","title":"Harga","price":500000,"priceMax":3000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Bonus 10 Headline"}]'),
('lp14', 'svc14', 'Jasa Kaligrafi Arab', 'Kaligrafi Arab di kanvas, kayu, atau kaca', 'Hubungi Sekarang', '[{"type":"hero","title":"Kaligrafi Arab","subtitle":"Berbagai gaya khat media kanvas kayu kaca"},{"type":"benefits","title":"Keunggulan Layanan","items":["Khat Berbagai Gaya","Media Kanvas Kayu Kaca","Free Bingkai","Custom Ukuran","Pengerjaan 3-7 Hari"]},{"type":"pricing","title":"Harga","price":300000,"priceMax":2000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Free bingkai"}]'),
('lp15', 'svc15', 'Hiasan Pigura Custom', 'Pigura dan hiasan dinding eksklusif', 'Hubungi Sekarang', '[{"type":"hero","title":"Pigura Custom","subtitle":"Desain eksklusif bahan premium"},{"type":"benefits","title":"Keunggulan Layanan","items":["Desain Custom Eksklusif","Pengerjaan 7 Hari","Bonus Box","Bahan Premium","Bisa Combo Set"]},{"type":"pricing","title":"Harga","price":250000,"priceMax":1500000},{"type":"cta","title":"Pesan Sekarang","bonus":"Bonus Box"}]'),
('lp16', 'svc16', 'Hias Taman Profesional', 'Jasa hias taman berpengalaman 40 tahun', 'Hubungi Sekarang', '[{"type":"hero","title":"Hias Taman Profesional","subtitle":"Pengalaman 40 tahun garansi tanaman"},{"type":"benefits","title":"Keunggulan Layanan","items":["Pengalaman 40 Tahun","Desain Custom","Garansi Tanaman 1 Bulan","Bahan Premium","Maintenance Bulanan"]},{"type":"pricing","title":"Harga","price":500000,"priceMax":10000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Gratis konsultasi desain"}]'),
('lp17', 'svc17', 'Jasa Hiburan Angklung', '10 personil angklung kostum tradisional', 'Hubungi Sekarang', '[{"type":"hero","title":"Hiburan Angklung","subtitle":"10 personil kostum tradisional Sunda"},{"type":"benefits","title":"Keunggulan Layanan","items":["10 Personil Angklung","Kostum Tradisional","Free Interaktif 15 Menit","Lagu Sunda dan Nasional","Bisa Request Lagu"]},{"type":"pricing","title":"Harga","price":1200000,"priceMax":3000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Free interaktif 15 menit"}]');


-- =====================================================
-- ARTICLES
-- =====================================================

INSERT INTO "Article" ("id", "title", "slug", "excerpt", "content", "published") VALUES
('art01', 'Tips Merawat Laptop Agar Awet', 'tips-merawat-laptop', 'Pelajari cara merawat laptop agar tetap performa optimal selama bertahun-tahun.', '<h2>1. Bersihkan Secara Rutin</h2><p>Bersihkan keyboard dan layar minimal 1 minggu sekali menggunakan kain microfiber dan cairan pembersih khusus elektronik. Debu dan kotoran yang menumpuk bisa merusak komponen dalam jangka panjang.</p><h2>2. Jangan Makan di Dekat Laptop</h2><p>Remah makanan bisa masuk ke sela keyboard dan menarik serangga. Minuman yang tumpah adalah salah satu penyebab utama kerusakan laptop. Jika terlanjur tumpah, segera matikan laptop dan bawa ke teknisi profesional.</p><h2>3. Gunakan Cooling Pad</h2><p>Overheating adalah musuh utama laptop. Gunakan cooling pad terutama saat menggunakan laptop untuk kerja berat seperti gaming atau rendering. Suhu ideal laptop adalah 40-60 derajat Celsius.</p><h2>4. Jangan Charge Berlebihan</h2><p>Jangan biarkan laptop terus-menerus dalam keadaan charge 24 jam. Hal ini bisa membuat baterai cepat drop. Idealnya charge sampai 80% dan cabut charger.</p><h2>5. Update Driver dan OS Secara Berkala</h2><p>Update driver dan sistem operasi untuk keamanan dan performa terbaik. Driver yang outdated bisa menyebabkan blue screen dan crash.</p>', true),

('art02', 'Cara Menyelesaikan Skripsi 1 Bulan', 'skripsi-1-bulan', 'Strategi praktis menyelesaikan skripsi dalam waktu singkat tanpa stres.', '<h2>1. Tentukan Judul Secepat Mungkin</h2><p>Jangan terlalu lama mencari judul sempurna. Pilih judul yang realistis dan bisa diselesaikan dengan data yang mudah diakses. Judul yang terlalu ambisius justru akan menghambat progress.</p><h2>2. Buat Timeline Ketat</h2><p>Bagi waktu per bab. Bab 1: 3 hari. Bab 2: 5 hari. Bab 3: 5 hari. Bab 4: 7 hari. Bab 5: 5 hari. Revisi: 5 hari. Total sekitar 30 hari jika disiplin.</p><h2>3. Gunakan Template</h2><p>Gunakan template skripsi dari kampus atau senior. Jangan mulai dari nol. Template sudah sesuai format kampus sehingga menghemat waktu formatting.</p><h2>4. Konsultasi Rutin dengan Pembimbing</h2><p>Jangan tunggu bab selesai baru konsultasi. Konsultasi per sub-bab untuk menghindari revisi besar di akhir. Buat jadwal konsultasi mingguan.</p><h2>5. Gunakan Jasa Bimbingan Profesional</h2><p>Jika stuck, jangan malu untuk menggunakan jasa bimbingan skripsi profesional. Mas Iis Warung Solusi menyediakan bimbingan skripsi dengan jaminan ACC atau bimbingan ulang gratis.</p>', true),

('art03', 'Mengapa Website Penting untuk Bisnis', 'website-untuk-bisnis', 'Alasan mengapa setiap bisnis membutuhkan website di era digital.', '<h2>1. Kredibilitas Bisnis</h2><p>75 persen konsumen menilai kredibilitas bisnis dari website. Bisnis tanpa website dianggap kurang profesional dan kurang terpercaya.</p><h2>2. Bisa Ditemukan 24 Jam</h2><p>Website bekerja 24 jam 7 hari seminggu. Konsumen bisa menemukan informasi tentang bisnis Anda kapan saja, bahkan saat Anda tidur.</p><h2>3. Jangkauan Lebih Luas</h2><p>Website memungkinkan bisnis Anda menjangkau pelanggan di seluruh Indonesia bahkan dunia. Tidak terbatas oleh lokasi fisik.</p><h2>4. Lebih Murah dari Membuka Cabang</h2><p>Membuat website jauh lebih murah daripada membuka cabang baru. Satu website bisa melayani ribuan pelanggan sekaligus.</p><h2>5. Pemasaran Digital</h2><p>Website adalah fondasi semua pemasaran digital: SEO, iklan Google, iklan social media, email marketing, semuanya membutuhkan website sebagai tujuan akhir.</p>', true);


-- =====================================================
-- SITE CONFIG
-- =====================================================

INSERT INTO "SiteConfig" ("id", "key", "value") VALUES
('sc01', 'hero_image', '/hero-bg-new.png'),
('sc02', 'site_name', 'Mas Iis - Warung Solusi'),
('sc03', 'site_description', 'Warung Solusi Terpercaya di Cirebon. 17 jasa lengkap: servis laptop, bimbingan skripsi, desain grafis, jasa MC, website, dan lainnya. AI CS 24/7.'),
('sc04', 'whatsapp_number', '0882-0008-58698'),
('sc05', 'address', 'Sindanglaut, Kab. Cirebon, Jawa Barat'),
('sc06', 'instagram', 'https://instagram.com/masiis.warungsolusi'),
('sc07', 'facebook', 'https://facebook.com/masiis.warungsolusi'),
('sc08', 'tiktok', 'https://tiktok.com/@masiis.warungsolusi'),
('sc09', 'email', 'masiis.warungsolusi@gmail.com'),
('sc10', 'operating_hours', 'Senin-Sabtu 08.00-21.00 WIB, Minggu 09.00-17.00 WIB'),
('sc11', 'bank_info', 'BCA Transfer'),
('sc12', 'warranty_policy', 'Garansi hingga 30 hari untuk sebagian besar jasa'),
('sc13', 'stats_customers', '500+'),
('sc14', 'stats_rating', '4.9/5'),
('sc15', 'stats_services', '17');


-- =====================================================
-- TESTIMONIALS (per category)
-- =====================================================

INSERT INTO "Testimonial" ("id", "serviceId", "name", "location", "rating", "text", "order", "active") VALUES
-- Elektronik
('t01', 'svc01', 'Rizky Fauzan', 'Sindanglaut, Cirebon', 5, 'Dulu laptop saya mati total udah 2 minggu, bingung mau bawa ke mana. Teman recommend Mas Iis, ternyata beneran bisa! 3 hari udah nyala lagi, datanya gak ilang. Sampai sekarang udah 6 bulan masih awet. Terima kasih Mas Iis!', 1, true),
('t02', 'svc01', 'Siti Nurhaliza', 'Kesambi, Cirebon', 5, 'MacBook Pro saya kena coffee spill, udah mati total. Dua service center bilang motherboard harus ganti baru, harganya selangit. Mas Iis coba perbaiki IC-nya aja, dan ternyata bisa hidup lagi! Hemat hampir 5 juta. Luar biasa!', 2, true),
('t03', 'svc01', 'Ahmad Dani', 'Harjamukti, Cirebon', 4, 'Laptop kantor sering blue screen, udah bolak-balik bawa ke tukang servis yang lain tapi gak pernah sembuh total. Di Mas Iis, beliau langsung diagnosa akurat, ternyata RAM kotor dan Windows perlu clean install. Sekali beres, gak pernah BSOD lagi.', 3, true),

-- Pendidikan
('t04', 'svc02', 'Rina Marlina', 'Sumber, Cirebon', 5, 'Skripsi saya udah 2 tahun gak kelar-kelar, dosen pembimbing selalu revisi. Teman suggest Mas Iis, dan bener aja! Dibimbing dari rumusan masalah sampai sidang, 3 bulan langsung ACC. Sekarang udah wisuda! Terima kasih banyak Mas Iis!', 1, true),
('t05', 'svc02', 'Fajar Nugroho', 'Kesambi, Cirebon', 5, 'Tesis S2 saya mentok di bab 3, metodologi penelitian bingung banget. Mas Iis bantu jelasin AMOS dan SPSS step by step. Diajari sampai ngerti, bukan cuma dikasih hasilnya. Sekarang tesis saya lulus dengan predikat memuaskan!', 2, true),
('t06', 'svc03', 'Laila Fitriani', 'Harjamukti, Cirebon', 5, 'Cek Turnitin di kampus dapat 45%, panik banget. Mas Iis bantu cek dan paraphrase, turun jadi 8% dalam 24 jam. Laporan PDF-nya lengkap dan resmi, bisa dilampirin ke dosen. Cepat dan akurat!', 3, true),

-- Fashion
('t07', 'svc05', 'Dra. Ratna', 'Sumber, Cirebon', 5, 'Sudah 3 tahun kerja sama sama Mas Iis untuk seragam sekolah. Jahitan konsisten rapi, harga borongan sangat kompetitif, dan yang paling penting selalu tepat waktu. Recommended untuk borongan sekolah!', 1, true),
('t08', 'svc05', 'Ibu Hj. Asep', 'Sindanglaut, Cirebon', 5, 'Pesanan 200 seragam SMP untuk madrasah, deadline 2 minggu. Mas Iis jahit rapi, jahitan kuat, logo sablon juga rapi. Semua pas ukurannya. Orang tua murid puas semua. Pasti order lagi tahun depan!', 2, true),

-- Digital
('t09', 'svc06', 'Dimas Pratama', 'Kesambi, Cirebon', 5, 'Logo bisnis kuliner saya dibikin Mas Iis, hasilnya keren banget! Revisi unlimited ternyata beneran unlimited, bukan cuma marketing. Sampai 5 kali revisi tetap sabar dan hasilnya makin bagus. Sekarang logo saya dipake di semua outlet.', 1, true),
('t10', 'svc13', 'Anita Sari', 'Sumber, Cirebon', 5, 'Copywriting landing page toko online saya sebelumnya konversinya 1%. Setelah Mas Iis tulis ulang pakai formula AIDA, konversi naik ke 4.5%! Bonus 10 headline-nya juga kebukti ampuh buat iklan FB. ROI naik 3x lipat!', 2, true),

-- Event
('t11', 'svc07', 'H. Supriatna', 'Sindanglaut, Cirebon', 5, 'Agency acara Mas Iis handle hajatan putri saya dari A sampai Z. MC, dekorasi, sound system, dokumentasi, semua one package. Saya cuma duduk manis aja sebagai tuan rumah. Tamu-tamu pada kagum dengan acaranya!', 1, true),
('t12', 'svc08', 'Ibu Enung', 'Sumber, Cirebon', 5, 'MC Mas Iis luar biasa! Bilingual Indonesia-Sunda, bisa baca situasi, humornya pas. Khitanan anak saya jadi meriah dan berkesan. Bahkan sisa makanan juga diurus. Profesional level hotel!', 2, true),
('t13', 'svc09', 'Kang Dedi', 'Sindanglaut, Cirebon', 5, 'Gambus dan el-husna untuk hajatan ibu, lagu-lagunya merdu, sound system-nya jernih. Operatornya juga ramah. Paket 2 hari harganya worth it banget. Tetangga pada datang nurutin suaranya!', 3, true),
('t14', 'svc17', 'Bu Eti Sunda', 'Kesambi, Cirebon', 5, 'Angklung Mas Iis bikin acara pernikahan adik saya jadi sangat meriah. 10 personil kostum tradisionalnya bagus banget, interaktif 15 menit membuat tamu ikut bermain. Semua tamu senang!', 4, true),

-- IT
('t15', 'svc11', 'Dr. Hartono', 'Kesambi, Cirebon', 5, 'Website klinik saya dibikin Mas Iis, desainnya minimalis modern. Pasien bisa booking online, ada fitur chat juga. Gratis domain dan hosting 1 tahun. Dalam 2 bulan, pasien online naik 30%. Investasi yang sangat worth it!', 1, true),
('t16', 'svc11', 'Rina Amelia', 'Sumber, Cirebon', 5, 'Toko batik online saya butuh website yang bisa handle transaksi. Mas Iis bikinin toko online lengkap dengan keranjang belanja dan payment gateway. Desainnya premium tapi harganya terjangkau. Maintenance 1 bulan gratis juga!', 2, true),

-- Konsultan
('t17', 'svc12', 'Drs. Wahyu', 'Kesambi, Cirebon', 5, 'Sekolah kami mau akreditasi A, bingung mulai dari mana. Mas Iis pendampingan dari awal: SOP, administrasi, sampai simulasi visitasi. Alhamdulillah dapat A! Bonus SOP lengkapnya sangat membantu.', 1, true),
('t18', 'svc12', 'Ibu Hindun', 'Sumber, Cirebon', 5, 'Sekolah swasta kami 3 kali gak lolos akreditasi A. Setelah dikonsultasin Mas Iis, ternyata banyak administrasi yang kurang. Mas Iis bantu lengkapi semua, termasuk sistem administrasi digital. Visitasi berikutnya: LULUS A!', 2, true),

-- Seni
('t19', 'svc16', 'Hj. Eti', 'Sindanglaut, Cirebon', 5, 'Taman rumah saya yang tadinya kosong melompong sekarang jadi taman Jepang yang indah. Mas Iis desain custom, pilih tanaman yang cocok, dan kasih garansi tanaman 1 bulan. Tetangga pada iri! Pengalaman 40 tahun beneran terasa.', 1, true),
('t20', 'svc14', 'Ustadz Mahmud', 'Kesambi, Cirebon', 5, 'Kaligrafi Ayat Kursi di kanvas besar untuk masjid kami. Mas Iis bikin khat Tsuluts yang indah banget, detailnya luar biasa. Free bingkai juga. Jemaah masjid pada kagum. Sudah 1 tahun warna tetap cerah!', 2, true),
('t21', 'svc15', 'Ibu Rina', 'Harjamukti, Cirebon', 5, 'Pigura custom untuk hadiah pernikahan sahabat, hasilnya elegan banget. Bonus box packaging-nya bikin makin premium. Sahabat saya sampe nangis terharu! Pasti order lagi untuk hadiah lainnya.', 3, true),

-- Peternakan
('t22', 'svc10', 'H. Amin', 'Sindanglaut, Cirebon', 5, 'Kambing qurban dari Mas Iis sehat dan gemuk, sesuai syariat. Umur udah cukup, fisiknya sempurna. Gratis sembelih dan packing. Keluarga saya puas, dan dagingnya juga empuk. Pasti langganan setiap Idul Adha!', 1, true),
('t23', 'svc10', 'Ibu Siti Aminah', 'Sumber, Cirebon', 5, 'Aqiqah anak kembar saya, pesan 2 ekor kambing. Mas Iis antar ke rumah, sembelih, dan packing rapi. Dagingnya cukup buat dibagikan ke tetangga semua. Prosesnya amanah dan sesuai syariat.', 2, true);


-- =====================================================
-- FAQs (at least 2 per service)
-- =====================================================

INSERT INTO "FAQ" ("id", "serviceId", "question", "answer", "category", "order", "active") VALUES
-- Servis Laptop
('faq01', 'svc01', 'Bisa servis MacBook?', 'Bisa, kami menangani semua tipe MacBook mulai dari MacBook Air, MacBook Pro, hingga MacBook Pro M1/M2/M3. Kerusakan motherboard, layar, keyboard, baterai, semua bisa ditangani.', 'Elektronik', 1, true),
('faq02', 'svc01', 'Berapa lama waktu pengerjaan?', 'Tergantung tingkat kerusakan. Kerusakan ringan seperti install ulang atau ganti RAM 1-2 hari. Kerusakan berat seperti motherboard 5-7 hari. Kami akan konfirmasi estimasi waktu setelah diagnosa.', 'Elektronik', 2, true),
('faq03', 'svc01', 'Data saya aman?', 'Ya, kami prioritaskan keamanan data pelanggan. Jika memungkinkan, kami backup data terlebih dahulu sebelum perbaikan. Untuk kerusakan hard drive, kami bisa bantu recovery data dengan biaya terpisah.', 'Elektronik', 3, true),
('faq04', 'svc01', 'Bisa panggil ke rumah?', 'Bisa, gratis panggilan area Cirebon kota. Untuk luar kota ada biaya transport yang bisa dikonsultasikan terlebih dahulu.', 'Elektronik', 4, true),

-- Skripsi
('faq05', 'svc02', 'Bisa bimbingan online?', 'Bisa, bimbingan dilakukan via Zoom atau Google Meet. Jadwal fleksibel bisa disesuaikan. Bisa juga offline untuk area Cirebon.', 'Pendidikan', 1, true),
('faq06', 'svc02', 'Berapa lama selesai skripsi?', 'Skripsi rata-rata 2-4 bulan, tesis 3-6 bulan, disertasi 6-12 bulan. Tergantung kompleksitas dan konsistensi bimbingan. Kami ada jaminan ACC atau bimbingan ulang gratis.', 'Pendidikan', 2, true),
('faq07', 'svc02', 'Dijamin lulus?', 'Ya, kami berikan jaminan ACC. Jika belum ACC, bimbingan ulang gratis tanpa batas waktu sampai benar-benar lulus sidang.', 'Pendidikan', 3, true),
('faq08', 'svc02', 'Jurusan apa saja yang bisa dibimbing?', 'Semua jurusan tanpa terkecuali. Manajemen, akuntansi, pendidikan, teknik, hukum, psikologi, kedokteran, farmasi, ilmu komputer, sastra, ekonomi, dan lain-lain.', 'Pendidikan', 4, true),

-- Turnitin
('faq09', 'svc03', 'Hasilnya sama dengan kampus?', 'Ya, kami menggunakan sistem Turnitin resmi sehingga hasilnya sama persis dengan yang digunakan kampus. Laporan PDF lengkap bisa dilampirkan ke dosen pembimbing.', 'Pendidikan', 1, true),
('faq10', 'svc03', 'Berapa lama prosesnya?', 'Proses 1-24 jam tergantung antrian. Jika butuh paraphrase, tambahan 1-2 hari kerja.', 'Pendidikan', 2, true),
('faq11', 'svc03', 'File saya aman?', 'Ya, privasi terjamin 100%. File akan dihapus dari server kami setelah proses selesai dan laporan sudah dikirimkan.', 'Pendidikan', 3, true),

-- LES
('faq12', 'svc04', 'Berapa anak per kelas grup?', 'Grup kecil 3 sampai 5 anak per kelas. Ini agar guru bisa fokus memberikan perhatian ke setiap anak. Tersedia juga pilihan privat 1-on-1.', 'Pendidikan', 1, true),
('faq13', 'svc04', 'Bisa pilih jadwal sendiri?', 'Bisa, jadwal fleksibel. Minimal 2 kali seminggu masing-masing 90 menit. Hari dan jam bisa disesuaikan dengan kebutuhan orang tua.', 'Pendidikan', 2, true),

-- Jahit
('faq14', 'svc05', 'Minimum order berapa?', 'Minimum order 20 pcs per model. Semakin banyak pesanan, harga per pcs semakin murah.', 'Fashion', 1, true),
('faq15', 'svc05', 'Bisa custom logo?', 'Bisa, tersedia logo bordir dan sablon. Desain logo bisa dari pelanggan atau kami bantu buatkan.', 'Fashion', 2, true),

-- Desain
('faq16', 'svc06', 'Revisi berapa kali?', 'Revisi unlimited sampai puas, bukan cuma marketing tetapi beneran unlimited. Kami revisi sampai pelanggan 100% puas dengan hasilnya.', 'Digital', 1, true),
('faq17', 'svc06', 'File dikirim format apa?', 'Semua format dikirim: AI, PSD, PDF, PNG, dan JPG. File master juga diberikan agar bisa diedit sendiri di kemudian hari.', 'Digital', 2, true),

-- Agency
('faq18', 'svc07', 'Paket termasuk apa saja?', 'Paket Basic: MC dan Sound System. Paket Standard: ditambah Dekorasi dan Dokumentasi. Paket Premium: All-in termasuk Lighting dan Catering Recommendation. Bisa juga custom paket sesuai kebutuhan.', 'Event', 1, true),
('faq19', 'svc07', 'DP berapa?', 'DP 30% dari total harga untuk mengunci jadwal. Pelunasan setelah acara selesai. Pembayaran via transfer BCA.', 'Event', 2, true),

-- MC
('faq20', 'svc08', 'Bisa bahasa Sunda?', 'Bisa, MC kami bilingual Indonesia-Sunda. Bisa juga campur tergantung permintaan dan situasi acara.', 'Event', 1, true),
('faq21', 'svc08', 'Acara apa saja yang bisa di-MC?', 'Semua jenis acara: wedding, khitanan, seminar, lomba, reuni, halalbihalal, syukuran, aqiqah, dan acara apapun.', 'Event', 2, true),

-- Gambus
('faq22', 'svc09', 'Lagu bisa request?', 'Bisa, lagu bisa request sesuai keinginan. Kami punya koleksi lengkap lagu gambus, el-husna, sholawat, dan nasyid.', 'Event', 1, true),
('faq23', 'svc09', 'Termasuk operator?', 'Ya, semua paket sudah termasuk operator sound system yang berpengalaman. Anda tidak perlu repot mengatur teknis.', 'Event', 2, true),

-- Kambing
('faq24', 'svc10', 'Sesuai syariat Islam?', 'Ya, kambing yang kami sediakan sudah pasti sesuai syariat Islam. Umur cukup, fisik sempurna, sehat dan gemuk. Bisa diinspeksi sebelum beli.', 'Peternakan', 1, true),
('faq25', 'svc10', 'Bisa antar ke rumah?', 'Bisa, gratis antar area Cirebon kota. Untuk luar kota bisa diatur dengan biaya tambahan.', 'Peternakan', 2, true),

-- Website
('faq26', 'svc11', 'Domain sudah termasuk?', 'Ya, gratis domain dot com selama 1 tahun. Setelah itu perpanjangan domain sekitar Rp 150 ribu per tahun.', 'IT', 1, true),
('faq27', 'svc11', 'Bisa edit sendiri setelah jadi?', 'Bisa, kami kasih training cara edit konten website. Untuk toko online, kami ajarin cara tambah produk dan kelola pesanan.', 'IT', 2, true),

-- Konsultan
('faq28', 'svc12', 'Jaminan lolos akreditasi?', 'Ya, kami berikan jaminan lolos akreditasi. Jika belum lolos, pendampingan dilanjutkan gratis sampai benar-benar lolos.', 'Konsultan', 1, true),
('faq29', 'svc12', 'Untuk jenjang apa saja?', 'Semua jenjang pendidikan: SD, SMP, SMA, SMK, dan Perguruan Tinggi. Baik sekolah negeri maupun swasta.', 'Konsultan', 2, true),

-- Copywriting
('faq30', 'svc13', 'Formula copywriting apa yang digunakan?', 'Kami menggunakan formula AIDA (Attention, Interest, Desire, Action) dan PAS (Problem, Agitate, Solution) yang terbukti meningkatkan konversi penjualan.', 'Digital', 1, true),
('faq31', 'svc13', 'Revisi ada limit?', 'Tidak ada limit revisi. Kami revisi sampai copy yang dihasilkan benar-benar pas dan memenuhi ekspektasi pelanggan.', 'Digital', 2, true),

-- Kaligrafi
('faq32', 'svc14', 'Gaya khat apa saja yang tersedia?', 'Tersedia berbagai gaya khat: Naskhi, Tsuluts, Diwani, Farisi, Kufi, dan Riqaah. Bisa request gaya tertentu atau campuran.', 'Seni', 1, true),
('faq33', 'svc14', 'Media apa saja bisa?', 'Bisa di kanvas, kayu, kaca, dan langsung di dinding. Untuk media khusus lainnya bisa dikonsultasikan terlebih dahulu.', 'Seni', 2, true),

-- Pigura
('faq34', 'svc15', 'Bahan apa saja yang tersedia?', 'Bahan premium: kayu jati, MDF, akrilik, dan logam. Setiap bahan memiliki karakter dan keunggulan masing-masing.', 'Seni', 1, true),
('faq35', 'svc15', 'Bisa untuk hadiah?', 'Sangat cocok untuk hadiah! Bonus box packaging membuat tampilan makin premium. Bisa request kertas kartu ucapan juga.', 'Seni', 2, true),

-- Taman
('faq36', 'svc16', 'Garansi tanaman berapa lama?', 'Garansi tanaman 1 bulan. Jika ada tanaman yang mati dalam 1 bulan, kami ganti gratis. Maintenance bulanan juga tersedia untuk perawatan rutin.', 'Seni', 1, true),
('faq37', 'svc16', 'Desain taman apa saja?', 'Taman minimalis, taman Jepang, taman tropis, taman herbal, vertical garden, dan taman rooftop. Semua desain custom sesuai kebutuhan dan budget pelanggan.', 'Seni', 2, true),

-- Angklung
('faq38', 'svc17', 'Berapa personil angklung?', '10 personil angklung dengan kostum tradisional Sunda. Semua personil berpengalaman tampil di berbagai acara.', 'Event', 1, true),
('faq39', 'svc17', 'Apa itu interaktif 15 menit?', 'Penonton bisa ikut bermain angklung bersama personil kami selama 15 menit. Ini pengalaman yang sangat menyenangkan dan membuat acara jadi lebih interaktif dan berkesan.', 'Event', 2, true),

-- General FAQs (no serviceId)
('faq40', NULL, 'Apa saja metode pembayaran?', 'Kami menerima transfer bank BCA. Untuk area Cirebon juga bisa bayar di tempat (COD). DP 30-50% tergantung jenis jasa, pelunasan setelah selesai.', 'Umum', 1, true),
('faq41', NULL, 'Berapa lama garansi?', 'Garansi bervariasi tergantung jasa. Servis laptop: 30 hari sparepart, 14 hari software. Desain grafis: revisi unlimited. Website: maintenance 1 bulan. Hias taman: garansi tanaman 1 bulan. Umumnya hingga 30 hari untuk sebagian besar jasa.', 'Umum', 2, true),
('faq42', NULL, 'Area layanan sampai mana?', 'Layanan offline mencakup seluruh Kota Cirebon dan Kabupaten Cirebon. Layanan online (skripsi, website, copywriting, desain, cek Turnitin) bisa dari seluruh Indonesia.', 'Umum', 3, true),
('faq43', NULL, 'Jam operasional kapan?', 'WhatsApp: 24/7 (balas maksimal 1 jam di jam kerja). Jam kerja: Senin-Sabtu 08.00-21.00 WIB. Minggu: 09.00-17.00 WIB. Chat AI: 24/7.', 'Umum', 4, true),
('faq44', NULL, 'Bagaimana cara memesan?', 'Hubungi kami via WhatsApp di 0882-0008-58698. Atau tanya AI di website ini 24/7. Kami akan merespon dan memberikan info lengkap termasuk harga dan estimasi waktu.', 'Umum', 5, true);


-- =====================================================
-- DONE! Database is fully initialized.
-- =====================================================
