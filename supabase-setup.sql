-- =====================================================
-- MAS IIS - WARUNG SOLUSI
-- COMPLETE SUPABASE SQL SETUP
-- Copy paste SEMUA kode ini ke Supabase SQL Editor lalu klik RUN
-- =====================================================

-- STEP 1: HAPUS SEMUA TABEL YANG ADA (START FROM ZERO)
DROP TABLE IF EXISTS "_prisma_migrations" CASCADE;
DROP TABLE IF EXISTS "FAQ" CASCADE;
DROP TABLE IF EXISTS "Booking" CASCADE;
DROP TABLE IF EXISTS "ServiceImage" CASCADE;
DROP TABLE IF EXISTS "Testimonial" CASCADE;
DROP TABLE IF EXISTS "LandingPage" CASCADE;
DROP TABLE IF EXISTS "Article" CASCADE;
DROP TABLE IF EXISTS "SiteConfig" CASCADE;
DROP TABLE IF EXISTS "ChatLog" CASCADE;
DROP TABLE IF EXISTS "Service" CASCADE;

-- STEP 2: BUAT SEMUA TABEL

-- TABEL SERVICE (17 jasa)
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL,
    "detailDesc" TEXT DEFAULT '',
    "price" INTEGER DEFAULT 0,
    "priceMax" INTEGER DEFAULT 0,
    "benefit1" TEXT DEFAULT '',
    "benefit2" TEXT DEFAULT '',
    "benefit3" TEXT DEFAULT '',
    "benefit4" TEXT DEFAULT '',
    "benefit5" TEXT DEFAULT '',
    "waText" TEXT DEFAULT '',
    "imageUrl" TEXT DEFAULT '',
    "heroImageUrl" TEXT DEFAULT '',
    "videoUrl" TEXT DEFAULT '',
    "audioUrl" TEXT DEFAULT '',
    "externalLink" TEXT DEFAULT '',
    "bonus" TEXT DEFAULT '',
    "slotStatus" TEXT DEFAULT 'Slot Tersedia',
    "slotAvailable" BOOLEAN DEFAULT true,
    "active" BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- TABEL ARTICLE
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT DEFAULT '',
    "content" TEXT DEFAULT '',
    "imageUrl" TEXT DEFAULT '',
    "published" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- TABEL LANDING PAGE
CREATE TABLE "LandingPage" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "headline" TEXT DEFAULT '',
    "subheadline" TEXT DEFAULT '',
    "ctaText" TEXT DEFAULT 'Hubungi Sekarang',
    "sections" TEXT DEFAULT '[]',
    "active" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LandingPage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LandingPage_serviceId_key" ON "LandingPage"("serviceId");

-- TABEL TESTIMONIAL
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT DEFAULT '',
    "photoUrl" TEXT DEFAULT '',
    "rating" INTEGER DEFAULT 5,
    "text" TEXT NOT NULL,
    "audioUrl" TEXT DEFAULT '',
    "order" INTEGER DEFAULT 0,
    "active" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- TABEL CHAT LOG
CREATE TABLE "ChatLog" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatLog_pkey" PRIMARY KEY ("id")
);

-- TABEL SERVICE IMAGE
CREATE TABLE "ServiceImage" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT DEFAULT '',
    "type" TEXT DEFAULT 'gallery',
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ServiceImage_pkey" PRIMARY KEY ("id")
);

-- TABEL SITE CONFIG
CREATE TABLE "SiteConfig" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SiteConfig_key_key" ON "SiteConfig"("key");

-- TABEL BOOKING
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "customerName" TEXT DEFAULT '',
    "customerPhone" TEXT DEFAULT '',
    "customerEmail" TEXT DEFAULT '',
    "message" TEXT DEFAULT '',
    "status" TEXT DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- TABEL FAQ
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT DEFAULT '',
    "order" INTEGER DEFAULT 0,
    "active" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- STEP 3: BUAT FOREIGN KEY RELATIONS
ALTER TABLE "LandingPage" ADD CONSTRAINT "LandingPage_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceImage" ADD CONSTRAINT "ServiceImage_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FAQ" ADD CONSTRAINT "FAQ_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- STEP 4: BUAT INDEX UNTUK PERFORMA
CREATE INDEX "LandingPage_serviceId_idx" ON "LandingPage"("serviceId");
CREATE INDEX "Testimonial_serviceId_idx" ON "Testimonial"("serviceId");
CREATE INDEX "ServiceImage_serviceId_idx" ON "ServiceImage"("serviceId");
CREATE INDEX "Booking_serviceId_idx" ON "Booking"("serviceId");
CREATE INDEX "FAQ_serviceId_idx" ON "FAQ"("serviceId");
CREATE INDEX "ChatLog_sessionId_idx" ON "ChatLog"("sessionId");

-- STEP 5: INSERT DATA 17 JASA
INSERT INTO "Service" ("id", "name", "slug", "category", "shortDesc", "detailDesc", "price", "priceMax", "benefit1", "benefit2", "benefit3", "benefit4", "benefit5", "waText", "imageUrl", "bonus", "slotStatus", "slotAvailable", "active", "order") VALUES
('svc01', 'Servis Laptop & MacBook', 'servis-laptop-macbook', 'Elektronik', 'Perbaikan segala jenis kerusakan laptop dan MacBook', 'Servis lengkap laptop dan MacBook: perbaikan motherboard, power IC, layar retak atau pecah, keyboard rusak, baterai drop, upgrade HDD ke SSD, upgrade RAM, install ulang Windows atau MacOS, hapus virus, perbaiki blue screen, solusi overheating. Garansi 30 hari sparepart, 14 hari software. Gratis panggilan area Cirebon kota.', 150000, 1500000, 'Gratis Cek Kerusakan', 'Garansi 30 Hari', 'Sparepart Original', 'Teknisi Berpengalaman 8+ Tahun', 'Panggilan Gratis Cirebon', 'Halo Mas Iis, saya mau servis laptop atau MacBook', '/services/laptop.svg', 'Free thermal paste', 'Slot Tersedia', true, true, 1),

('svc02', 'Bimbingan Skripsi/Tesis/Disertasi/Artikel Ilmiah', 'bimbingan-skripsi-tesis-disertasi-artikel-ilmiah', 'Pendidikan', 'Bimbingan dari judul sampai sidang, dijamin ACC', 'Bimbingan skripsi, tesis, disertasi, dan artikel ilmiah semua jurusan tanpa terkecuali. Online via Zoom atau Google Meet, juga bisa offline. Coding, jurnal internasional, SPSS, AMOS, LISREL, NVivo, Stata, dan R. Dijamin ACC atau bimbingan ulang gratis tanpa batas waktu.', 1500000, 5000000, 'Jaminan Sampai Lulus', 'Online dan Offline', 'Semua Jurusan', 'Revisi Gratis Tanpa Batas', 'Mentor S2 dan S3 Berpengalaman', 'Halo Mas Iis, saya mau bimbingan skripsi atau tesis atau disertasi', '/services/skripsi.svg', 'Free cek Turnitin dan AI', 'Slot Tersedia', true, true, 2),

('svc03', 'Jasa Cek Turnitin & AI', 'jasa-cek-turnitin-ai', 'Pendidikan', 'Cek plagiarisme Turnitin dan deteksi AI dengan laporan PDF resmi', 'Cek similarity Turnitin resmi dan deteksi konten AI. Laporan PDF lengkap resmi sama persis dengan kampus. Proses 1 sampai 24 jam. Akurasi 99%. Tersedia paket paraphrase untuk menurunkan similarity.', 50000, 150000, 'Laporan PDF Resmi', 'Akurat Sama Kampus', 'Proses Cepat 1 sampai 24 Jam', 'Deteksi AI dan Plagiarisme', 'Privasi Terjaga 100 Persen', 'Halo Mas Iis, saya mau cek Turnitin dan AI', '/services/turnitin.svg', 'Free paraphrase 2 halaman', 'Slot Tersedia', true, true, 3),

('svc04', 'LES dan Privat Pelajaran SD dan TK', 'les-privat-pelajaran-sd-tk', 'Pendidikan', 'Bimbingan belajar privat untuk anak SD dan TK dengan pendekatan menyenangkan', 'LES dan privat pelajaran untuk anak SD kelas 1 sampai 6 dan TK. Pendekatan belajar menyenangkan. Materi sesuai kurikulum Merdeka. Evaluasi berkala setiap minggu. Laporan progress ke orang tua per bulan. Privat 1-on-1 atau grup kecil 3-5 anak.', 200000, 600000, 'Guru Sabar dan Menyenangkan', 'Materi Sesuai Kurikulum Merdeka', 'Privat atau Grup Kecil', 'Laporan Progress ke Orang Tua', 'Evaluasi Berkala Setiap Minggu', 'Halo Mas Iis, saya mau daftar les privat SD atau TK', '/services/belajar.svg', 'Free tes minat bakat anak', 'Slot Tersedia', true, true, 4),

('svc05', 'Jasa Jahit Baju Borongan Sekolah', 'jasa-jahit-borongan-sekolah', 'Fashion', 'Jahit seragam sekolah borongan, kualitas rapi dan kuat', 'Jasa jahit baju seragam sekolah borongan. Jahitan rapi dan kuat menggunakan mesin industrial. Bisa custom logo bordir dan sablon. Minimum order 20 pcs.', 45000, 150000, 'Jahitan Rapi dan Kuat', 'Bisa Custom Logo Bordir dan Sablon', 'Minimum 20 Pcs', 'Tepat Waktu', 'Harga Borongan Kompetitif', 'Halo Mas Iis, saya mau jahit baju borongan sekolah', '/services/jahit.svg', 'Gratis Sample 1 Pcs', 'Slot Tersedia', true, true, 5),

('svc06', 'Desain Grafis Profesional', 'desain-grafis-profesional', 'Digital', 'Logo, banner, feed IG, undangan, kartu nama, dan lainnya', 'Jasa desain grafis profesional: logo, banner, feed Instagram, undangan digital, kartu nama, brosur, packaging, menu restoran, sertifikat, dan ID card. Revisi unlimited sampai puas. File dikirim semua format AI PSD PDF PNG JPG.', 250000, 1500000, 'Revisi Unlimited Sampai Puas', 'File Semua Format AI PSD PDF PNG JPG', 'Desainer Berpengalaman 5+ Tahun', 'Proses 1 sampai 3 Hari', 'Portfolio Lengkap', 'Halo Mas Iis, saya mau jasa desain grafis', '/services/desain.svg', 'Bonus kartu nama', 'Slot Tersedia', true, true, 6),

('svc07', 'Jasa Agency Acara Lengkap', 'jasa-agency-acara', 'Event', 'Paket all-in satu tahun untuk event organizer', 'Jasa agency acara lengkap all-in-one. MC, dekorasi, sound system, dokumentasi foto dan video, lighting, dan rekomendasi catering. Paket untuk 1 tahun atau per event. Free MC profesional di semua paket.', 5000000, 25000000, 'Paket All-In 1 Tahun', 'MC Profesional Free', 'Dokumentasi Lengkap Foto dan Video', 'Dekorasi Premium', 'Sound System Lengkap', 'Halo Mas Iis, saya mau jasa agency acara', '/services/agency.svg', 'Free MC Profesional', 'Slot Tersedia', true, true, 7),

('svc08', 'Jasa MC Profesional', 'jasa-mc-profesional', 'Event', 'MC bilingual Indonesia-Sunda untuk segala acara', 'MC profesional bilingual Indonesia-Sunda. Berpengalaman 10+ tahun. Wedding, khitanan, seminar, lomba, reuni, halalbihalal. Susun rundown dan sistem lengkap. Gratis susun rundown di semua paket.', 750000, 3000000, 'Bilingual Indonesia-Sunda', 'Susun Sistem dan Rundown Lengkap', 'Gratis Susun Rundown', 'Berpengalaman 10+ Tahun', 'Energi dan Humor Natural', 'Halo Mas Iis, saya mau jasa MC', '/services/mc.svg', 'Gratis Susun Rundown', 'Slot Tersedia', true, true, 8),

('svc09', 'Gambus dan El-Husna Sound System', 'gambus-elhusna-sound-system', 'Event', 'Sewa sound system lengkap untuk acara gambusan dan el-husna', 'Paket gambus dan el-husna lengkap: sound system, mic wireless, speaker 12-15 inch, mixer, dan player. Lagu bisa request. Tersedia paket 1-3 hari. Cocok untuk gambusan, Maulid Nabi, haul, tahlilan, dan acara keagamaan lainnya.', 1500000, 5000000, 'Sound System Lengkap', 'Lagu Bisa Request', 'Free 2 Lagu Tambahan', 'Operator Berpengalaman', 'Paket 1 sampai 3 Hari', 'Halo Mas Iis, saya mau sewa gambus atau el-husna', '/services/gambir.svg', 'Free 2 lagu tambahan', 'Slot Tersedia', true, true, 9),

('svc10', 'Jual Beli Kambing Qurban dan Aqiqah', 'jual-beli-kambing-qurban', 'Peternakan', 'Kambing qurban dan aqiqah sesuai syariat Islam', 'Jual beli kambing qurban dan aqiqah. Sesuai syariat Islam. Sehat, gemuk, umur cukup. Jadi 3 hari. Gratis sembelih dan packing. Bisa antar ke rumah area Cirebon.', 2500000, 5000000, 'Sesuai Syariat Islam', 'Jadi 3 Hari', 'Gratis Sembelih dan Packing', 'Kambing Sehat dan Gemuk', 'Bisa Antar Area Cirebon', 'Halo Mas Iis, saya mau kambing qurban atau aqiqah', '/services/kambing.svg', 'Gratis Sembelih', 'Slot Tersedia', true, true, 10),

('svc11', 'Website Profil Minimalis', 'website-profil-minimalis', 'IT', 'Website company profile, toko online, landing page', 'Jasa pembuatan website: company profile, toko online, landing page, blog, portfolio. Desain minimalis modern. Gratis domain dot com dan hosting 1 tahun. SEO friendly. Responsive mobile. Gratis maintenance 1 bulan.', 1500000, 10000000, 'Desain Minimalis Modern', 'Gratis Domain dot com 1 Tahun', 'Gratis Maintenance 1 Bulan', 'SEO Friendly', 'Responsive Mobile', 'Halo Mas Iis, saya mau buat website', '/services/website.svg', 'Gratis Maintenance 1 Bulan', 'Slot Tersedia', true, true, 11),

('svc12', 'Konsultan Manajemen Sekolah', 'konsultan-manajemen-sekolah', 'Konsultan', 'Bimbingan akreditasi A dan SOP lengkap sekolah', 'Konsultan manajemen sekolah profesional. Bimbingan akreditasi A, SOP lengkap, sistem administrasi digital, penyiapan dokumen visitasi, simulasi visitasi, pendampingan 1 tahun. Jaminan lolos akreditasi.', 3000000, 15000000, 'Bimbingan Akreditasi A', 'Jaminan Lolos Akreditasi', 'Bonus SOP Lengkap', 'Sistem Administrasi Digital', 'Pendampingan 1 Tahun', 'Halo Mas Iis, saya mau konsultasi manajemen sekolah', '/services/konsultan.svg', 'Bonus SOP lengkap', 'Slot Tersedia', true, true, 12),

('svc13', 'CEO Copywriting', 'ceo-copywriting', 'Digital', 'Copywriting formula AIDA dan PAS untuk bisnis', 'Jasa copywriting profesional menggunakan formula AIDA dan PAS. Riset produk dan target market mendalam. Cocok untuk landing page, iklan Facebook/Instagram/Google, email marketing, product description, dan social media caption. Revisi sampai pas tanpa limit.', 500000, 3000000, 'Formula AIDA dan PAS', 'Riset Produk dan Market Mendalam', 'Bonus 10 Headline Ampuh', 'Conversion-Focused', 'Revisi Sampai Pas Tanpa Limit', 'Halo Mas Iis, saya mau jasa copywriting', '/services/copywriting.svg', 'Bonus 10 Headline', 'Slot Tersedia', true, true, 13),

('svc14', 'Jasa Kaligrafi Arab', 'jasa-kaligrafi-arab', 'Seni', 'Kaligrafi Arab di kanvas, kayu, atau kaca', 'Jasa kaligrafi Arab dengan berbagai gaya khat: Naskhi, Tsuluts, Diwani, Farisi, Kufi, dan Riqaah. Media: kanvas, kayu, kaca, dinding. Custom ukuran. Free bingkai untuk ukuran di atas 50x70cm. Pengerjaan 3-7 hari kerja.', 300000, 2000000, 'Khat Berbagai Gaya Naskhi Tsuluts Diwani Farisi Kufi', 'Media Kanvas Kayu Kaca Dinding', 'Free Bingkai Ukuran di Atas 50x70', 'Custom Ukuran Sesuai Permintaan', 'Pengerjaan 3 sampai 7 Hari', 'Halo Mas Iis, saya mau jasa kaligrafi', '/services/kaligrafi.svg', 'Free bingkai', 'Slot Tersedia', true, true, 14),

('svc15', 'Hiasan Pigura Custom', 'hiasan-pigura-custom', 'Seni', 'Pigura dan hiasan dinding desain custom eksklusif', 'Jasa pembuatan pigura dan hiasan dinding custom eksklusif. Desain sesuai permintaan. Bahan premium: kayu jati, MDF, akrilik, logam. Pengerjaan 7 hari. Bonus box packaging untuk hadiah.', 250000, 1500000, 'Desain Custom Eksklusif', 'Pengerjaan 7 Hari', 'Bonus Box Packaging', 'Bahan Premium Kayu Jati MDF Akrilik', 'Bisa Combo Set', 'Halo Mas Iis, saya mau pesan pigura atau hiasan', '/services/pigura.svg', 'Bonus Box', 'Slot Tersedia', true, true, 15),

('svc16', 'Hias Taman Profesional', 'hias-taman-profesional', 'Seni', 'Jasa hias taman berpengalaman 40 tahun', 'Jasa hias taman profesional dengan pengalaman 40 tahun. Desain taman minimalis, taman Jepang, taman tropis, taman herbal, vertical garden, taman rooftop. Garansi tanaman 1 bulan. Maintenance bulanan tersedia.', 500000, 10000000, 'Pengalaman 40 Tahun', 'Desain Custom Sesuai Kebutuhan', 'Garansi Tanaman 1 Bulan', 'Bahan Premium Tanaman Pilihan', 'Maintenance Bulanan Tersedia', 'Halo Mas Iis, saya mau jasa hias taman', '/services/taman.svg', 'Gratis konsultasi desain', 'Slot Tersedia', true, true, 16),

('svc17', 'Jasa Hiburan Angklung', 'jasa-hiburan-angklung', 'Event', '10 personil angklung dengan kostum tradisional', 'Jasa hiburan angklung 10 personil dengan kostum tradisional Sunda. Free interaktif 15 menit dimana penonton bisa ikut bermain. Lagu Sunda dan Nasional. Bisa request lagu. Cocok untuk acara adat, pernikahan, khitanan, seminar, dan perkumpulan.', 1200000, 3000000, '10 Personil Angklung Berpengalaman', 'Kostum Tradisional Sunda', 'Free Interaktif 15 Menit', 'Lagu Sunda dan Nasional', 'Bisa Request Lagu', 'Halo Mas Iis, saya mau jasa angklung', '/services/angklung.svg', 'Free interaktif 15 menit', 'Slot Tersedia', true, true, 17);

-- STEP 6: INSERT LANDING PAGE UNTUK SETIAP JASA
INSERT INTO "LandingPage" ("id", "serviceId", "headline", "subheadline", "ctaText", "sections") VALUES
('lp01', 'svc01', 'Servis Laptop & MacBook', 'Perbaikan segala jenis kerusakan laptop dan MacBook', 'Hubungi Sekarang', '[{"type":"hero","title":"Servis Laptop & MacBook","subtitle":"Perbaikan segala jenis kerusakan laptop dan MacBook"},{"type":"benefits","title":"Keunggulan Layanan","items":["Gratis Cek Kerusakan","Garansi 30 Hari","Sparepart Original","Teknisi Berpengalaman 8+ Tahun","Panggilan Gratis Cirebon"]},{"type":"pricing","title":"Harga","price":150000,"priceMax":1500000},{"type":"cta","title":"Pesan Sekarang","bonus":"Free thermal paste"}]'),
('lp02', 'svc02', 'Bimbingan Skripsi/Tesis/Disertasi/Artikel Ilmiah', 'Bimbingan dari judul sampai sidang, dijamin ACC', 'Hubungi Sekarang', '[{"type":"hero","title":"Bimbingan Skripsi/Tesis/Disertasi/Artikel Ilmiah","subtitle":"Bimbingan dari judul sampai sidang, dijamin ACC"},{"type":"benefits","title":"Keunggulan Layanan","items":["Jaminan Sampai Lulus","Online dan Offline","Semua Jurusan","Revisi Gratis Tanpa Batas","Mentor S2 dan S3 Berpengalaman"]},{"type":"pricing","title":"Harga","price":1500000,"priceMax":5000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Free cek Turnitin dan AI"}]'),
('lp03', 'svc03', 'Jasa Cek Turnitin & AI', 'Cek plagiarisme Turnitin dan deteksi AI dengan laporan PDF resmi', 'Hubungi Sekarang', '[{"type":"hero","title":"Jasa Cek Turnitin & AI","subtitle":"Cek plagiarisme Turnitin dan deteksi AI dengan laporan PDF resmi"},{"type":"benefits","title":"Keunggulan Layanan","items":["Laporan PDF Resmi","Akurat Sama Kampus","Proses Cepat 1 sampai 24 Jam","Deteksi AI dan Plagiarisme","Privasi Terjaga 100 Persen"]},{"type":"pricing","title":"Harga","price":50000,"priceMax":150000},{"type":"cta","title":"Pesan Sekarang","bonus":"Free paraphrase 2 halaman"}]'),
('lp04', 'svc04', 'LES dan Privat Pelajaran SD dan TK', 'Bimbingan belajar privat untuk anak SD dan TK dengan pendekatan menyenangkan', 'Hubungi Sekarang', '[{"type":"hero","title":"LES dan Privat Pelajaran SD dan TK","subtitle":"Bimbingan belajar privat untuk anak SD dan TK dengan pendekatan menyenangkan"},{"type":"benefits","title":"Keunggulan Layanan","items":["Guru Sabar dan Menyenangkan","Materi Sesuai Kurikulum Merdeka","Privat atau Grup Kecil","Laporan Progress ke Orang Tua","Evaluasi Berkala Setiap Minggu"]},{"type":"pricing","title":"Harga","price":200000,"priceMax":600000},{"type":"cta","title":"Pesan Sekarang","bonus":"Free tes minat bakat anak"}]'),
('lp05', 'svc05', 'Jasa Jahit Baju Borongan Sekolah', 'Jahit seragam sekolah borongan, kualitas rapi dan kuat', 'Hubungi Sekarang', '[{"type":"hero","title":"Jasa Jahit Baju Borongan Sekolah","subtitle":"Jahit seragam sekolah borongan, kualitas rapi dan kuat"},{"type":"benefits","title":"Keunggulan Layanan","items":["Jahitan Rapi dan Kuat","Bisa Custom Logo Bordir dan Sablon","Minimum 20 Pcs","Tepat Waktu","Harga Borongan Kompetitif"]},{"type":"pricing","title":"Harga","price":45000,"priceMax":150000},{"type":"cta","title":"Pesan Sekarang","bonus":"Gratis Sample 1 Pcs"}]'),
('lp06', 'svc06', 'Desain Grafis Profesional', 'Logo, banner, feed IG, undangan, kartu nama, dan lainnya', 'Hubungi Sekarang', '[{"type":"hero","title":"Desain Grafis Profesional","subtitle":"Logo, banner, feed IG, undangan, kartu nama, dan lainnya"},{"type":"benefits","title":"Keunggulan Layanan","items":["Revisi Unlimited Sampai Puas","File Semua Format AI PSD PDF PNG JPG","Desainer Berpengalaman 5+ Tahun","Proses 1 sampai 3 Hari","Portfolio Lengkap"]},{"type":"pricing","title":"Harga","price":250000,"priceMax":1500000},{"type":"cta","title":"Pesan Sekarang","bonus":"Bonus kartu nama"}]'),
('lp07', 'svc07', 'Jasa Agency Acara Lengkap', 'Paket all-in satu tahun untuk event organizer', 'Hubungi Sekarang', '[{"type":"hero","title":"Jasa Agency Acara Lengkap","subtitle":"Paket all-in satu tahun untuk event organizer"},{"type":"benefits","title":"Keunggulan Layanan","items":["Paket All-In 1 Tahun","MC Profesional Free","Dokumentasi Lengkap Foto dan Video","Dekorasi Premium","Sound System Lengkap"]},{"type":"pricing","title":"Harga","price":5000000,"priceMax":25000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Free MC Profesional"}]'),
('lp08', 'svc08', 'Jasa MC Profesional', 'MC bilingual Indonesia-Sunda untuk segala acara', 'Hubungi Sekarang', '[{"type":"hero","title":"Jasa MC Profesional","subtitle":"MC bilingual Indonesia-Sunda untuk segala acara"},{"type":"benefits","title":"Keunggulan Layanan","items":["Bilingual Indonesia-Sunda","Susun Sistem dan Rundown Lengkap","Gratis Susun Rundown","Berpengalaman 10+ Tahun","Energi dan Humor Natural"]},{"type":"pricing","title":"Harga","price":750000,"priceMax":3000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Gratis Susun Rundown"}]'),
('lp09', 'svc09', 'Gambus dan El-Husna Sound System', 'Sewa sound system lengkap untuk acara gambusan dan el-husna', 'Hubungi Sekarang', '[{"type":"hero","title":"Gambus dan El-Husna Sound System","subtitle":"Sewa sound system lengkap untuk acara gambusan dan el-husna"},{"type":"benefits","title":"Keunggulan Layanan","items":["Sound System Lengkap","Lagu Bisa Request","Free 2 Lagu Tambahan","Operator Berpengalaman","Paket 1 sampai 3 Hari"]},{"type":"pricing","title":"Harga","price":1500000,"priceMax":5000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Free 2 lagu tambahan"}]'),
('lp10', 'svc10', 'Jual Beli Kambing Qurban dan Aqiqah', 'Kambing qurban dan aqiqah sesuai syariat Islam', 'Hubungi Sekarang', '[{"type":"hero","title":"Jual Beli Kambing Qurban dan Aqiqah","subtitle":"Kambing qurban dan aqiqah sesuai syariat Islam"},{"type":"benefits","title":"Keunggulan Layanan","items":["Sesuai Syariat Islam","Jadi 3 Hari","Gratis Sembelih dan Packing","Kambing Sehat dan Gemuk","Bisa Antar Area Cirebon"]},{"type":"pricing","title":"Harga","price":2500000,"priceMax":5000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Gratis Sembelih"}]'),
('lp11', 'svc11', 'Website Profil Minimalis', 'Website company profile, toko online, landing page', 'Hubungi Sekarang', '[{"type":"hero","title":"Website Profil Minimalis","subtitle":"Website company profile, toko online, landing page"},{"type":"benefits","title":"Keunggulan Layanan","items":["Desain Minimalis Modern","Gratis Domain dot com 1 Tahun","Gratis Maintenance 1 Bulan","SEO Friendly","Responsive Mobile"]},{"type":"pricing","title":"Harga","price":1500000,"priceMax":10000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Gratis Maintenance 1 Bulan"}]'),
('lp12', 'svc12', 'Konsultan Manajemen Sekolah', 'Bimbingan akreditasi A dan SOP lengkap sekolah', 'Hubungi Sekarang', '[{"type":"hero","title":"Konsultan Manajemen Sekolah","subtitle":"Bimbingan akreditasi A dan SOP lengkap sekolah"},{"type":"benefits","title":"Keunggulan Layanan","items":["Bimbingan Akreditasi A","Jaminan Lolos Akreditasi","Bonus SOP Lengkap","Sistem Administrasi Digital","Pendampingan 1 Tahun"]},{"type":"pricing","title":"Harga","price":3000000,"priceMax":15000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Bonus SOP lengkap"}]'),
('lp13', 'svc13', 'CEO Copywriting', 'Copywriting formula AIDA dan PAS untuk bisnis', 'Hubungi Sekarang', '[{"type":"hero","title":"CEO Copywriting","subtitle":"Copywriting formula AIDA dan PAS untuk bisnis"},{"type":"benefits","title":"Keunggulan Layanan","items":["Formula AIDA dan PAS","Riset Produk dan Market Mendalam","Bonus 10 Headline Ampuh","Conversion-Focused","Revisi Sampai Pas Tanpa Limit"]},{"type":"pricing","title":"Harga","price":500000,"priceMax":3000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Bonus 10 Headline"}]'),
('lp14', 'svc14', 'Jasa Kaligrafi Arab', 'Kaligrafi Arab di kanvas, kayu, atau kaca', 'Hubungi Sekarang', '[{"type":"hero","title":"Jasa Kaligrafi Arab","subtitle":"Kaligrafi Arab di kanvas, kayu, atau kaca"},{"type":"benefits","title":"Keunggulan Layanan","items":["Khat Berbagai Gaya Naskhi Tsuluts Diwani Farisi Kufi","Media Kanvas Kayu Kaca Dinding","Free Bingkai Ukuran di Atas 50x70","Custom Ukuran Sesuai Permintaan","Pengerjaan 3 sampai 7 Hari"]},{"type":"pricing","title":"Harga","price":300000,"priceMax":2000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Free bingkai"}]'),
('lp15', 'svc15', 'Hiasan Pigura Custom', 'Pigura dan hiasan dinding desain custom eksklusif', 'Hubungi Sekarang', '[{"type":"hero","title":"Hiasan Pigura Custom","subtitle":"Pigura dan hiasan dinding desain custom eksklusif"},{"type":"benefits","title":"Keunggulan Layanan","items":["Desain Custom Eksklusif","Pengerjaan 7 Hari","Bonus Box Packaging","Bahan Premium Kayu Jati MDF Akrilik","Bisa Combo Set"]},{"type":"pricing","title":"Harga","price":250000,"priceMax":1500000},{"type":"cta","title":"Pesan Sekarang","bonus":"Bonus Box"}]'),
('lp16', 'svc16', 'Hias Taman Profesional', 'Jasa hias taman berpengalaman 40 tahun', 'Hubungi Sekarang', '[{"type":"hero","title":"Hias Taman Profesional","subtitle":"Jasa hias taman berpengalaman 40 tahun"},{"type":"benefits","title":"Keunggulan Layanan","items":["Pengalaman 40 Tahun","Desain Custom Sesuai Kebutuhan","Garansi Tanaman 1 Bulan","Bahan Premium Tanaman Pilihan","Maintenance Bulanan Tersedia"]},{"type":"pricing","title":"Harga","price":500000,"priceMax":10000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Gratis konsultasi desain"}]'),
('lp17', 'svc17', 'Jasa Hiburan Angklung', '10 personil angklung dengan kostum tradisional', 'Hubungi Sekarang', '[{"type":"hero","title":"Jasa Hiburan Angklung","subtitle":"10 personil angklung dengan kostum tradisional"},{"type":"benefits","title":"Keunggulan Layanan","items":["10 Personil Angklung Berpengalaman","Kostum Tradisional Sunda","Free Interaktif 15 Menit","Lagu Sunda dan Nasional","Bisa Request Lagu"]},{"type":"pricing","title":"Harga","price":1200000,"priceMax":3000000},{"type":"cta","title":"Pesan Sekarang","bonus":"Free interaktif 15 menit"}]');

-- STEP 7: INSERT SAMPLE ARTIKEL
INSERT INTO "Article" ("id", "title", "slug", "excerpt", "content", "published") VALUES
('art01', 'Tips Merawat Laptop Agar Awet', 'tips-merawat-laptop', 'Pelajari cara merawat laptop agar tetap performa optimal selama bertahun-tahun.', '<h2>1. Bersihkan Secara Rutin</h2><p>Bersihkan keyboard dan layar minimal 1 minggu sekali...</p><h2>2. Jangan Makan di Dekat Laptop</h2><p>Remah makanan bisa masuk ke keyboard...</p><h2>3. Gunakan Cooling Pad</h2><p>Overheating adalah musuh utama laptop...</p>', true),
('art02', 'Cara Menyelesaikan Skripsi 1 Bulan', 'skripsi-1-bulan', 'Strategi praktis menyelesaikan skripsi dalam waktu singkat tanpa stres.', '<h2>1. Tentukan Judul Secepat Mungkin</h2><p>Jangan terlalu lama mencari judul sempurna...</p><h2>2. Buat Timeline Ketat</h2><p>Bagi waktu per bab...</p>', true),
('art03', 'Mengapa Website Penting untuk Bisnis', 'website-untuk-bisnis', 'Alasan mengapa setiap bisnis membutuhkan website di era digital.', '<h2>1. Kredibilitas Bisnis</h2><p>75% konsumen menilai kredibilitas dari website...</p>', true);

-- STEP 8: INSERT SITE CONFIG
INSERT INTO "SiteConfig" ("id", "key", "value") VALUES
('cfg01', 'hero_image', '/hero-bg-new.png'),
('cfg02', 'site_name', 'Mas Iis - Warung Solusi'),
('cfg03', 'site_description', 'Warung Solusi Terpercaya di Cirebon. 17 jasa lengkap.'),
('cfg04', 'whatsapp_number', '0882-0008-58698'),
('cfg05', 'address', 'Sindanglaut, Kab. Cirebon, Jawa Barat'),
('cfg06', 'operating_hours', 'Senin-Sabtu 08.00-21.00 WIB'),
('cfg07', 'bank_info', 'BCA Transfer'),
('cfg08', 'warranty_policy', 'Garansi hingga 30 hari untuk sebagian besar jasa'),
('cfg09', 'stats_customers', '500+'),
('cfg10', 'stats_rating', '4.9/5'),
('cfg11', 'stats_services', '17');

-- STEP 9: INSERT SAMPLE TESTIMONIAL
INSERT INTO "Testimonial" ("id", "serviceId", "name", "location", "rating", "text", "order", "active") VALUES
('test01', 'svc01', 'Budi Santoso', 'Cirebon Kota', 5, 'Laptop saya yang blue screen berhasil diperbaiki dalam 2 hari. Hasilnya memuaskan, garansinya juga bikin tenang.', 1, true),
('test02', 'svc02', 'Siti Nurhaliza', 'Kuningan', 5, 'Alhamdulillah skripsi saya ACC setelah dibimbing 3 bulan. Mentor sangat sabar dan profesional.', 2, true),
('test03', 'svc03', 'Ahmad Fauzi', 'Majalengka', 5, 'Cek Turnitin cepat dan hasilnya sama persis sama kampus. Laporan PDF lengkap.', 3, true),
('test04', 'svc06', 'Dewi Lestari', 'Cirebon Kota', 5, 'Desain logo untuk bisnis saya keren banget. Revisinya juga cepat dan sabar.', 4, true),
('test05', 'svc08', 'Kang Dedi', 'Sindanglaut', 5, 'MC untuk pernikahan anak saya luar biasa. Bisa bahasa Sunda dan Indonesia, tamu semua terhibur.', 5, true),
('test06', 'svc11', 'Rina Wulandari', 'Jakarta', 5, 'Website toko online saya jadi keren dan profesional. Domain dot com gratisnya mantap.', 6, true),
('test07', 'svc16', 'Pak Haji Rohmat', 'Cirebon Kota', 5, 'Taman rumah saya jadi indah sekali. Tanaman juga garansi 1 bulan, ada yang mati langsung diganti gratis.', 7, true),
('test08', 'svc17', 'Ibu Ema', 'Sindanglaut', 5, 'Angklungnya merdu dan kostumnya cantik. Tamu undangan pada ikut bermain, seru banget.', 8, true);

-- STEP 10: INSERT SAMPLE FAQ
INSERT INTO "FAQ" ("id", "serviceId", "question", "answer", "category", "order", "active") VALUES
('faq01', 'svc01', 'Berapa lama servis laptop?', 'Tergantung kerusakan. Ringan 1-2 hari, sedang 2-4 hari, berat 5-7 hari kerja.', 'Servis Laptop', 1, true),
('faq02', 'svc01', 'Bisa servis MacBook?', 'Bisa, semua tipe MacBook dari Air, Pro, sampai M1/M2/M3.', 'Servis Laptop', 2, true),
('faq03', 'svc02', 'Dijamin lulus skripsi?', 'Ya, garansi bimbingan ulang gratis sampai ACC tanpa batas waktu.', 'Skripsi', 3, true),
('faq04', 'svc02', 'Bisa bimbingan online?', 'Bisa, via Zoom atau Google Meet dari mana saja di Indonesia.', 'Skripsi', 4, true),
('faq05', 'svc03', 'Hasilnya sama dengan kampus?', 'Ya, sistem Turnitin resmi, hasilnya identik dengan kampus.', 'Turnitin', 5, true),
('faq06', 'svc06', 'Revisi berapa kali?', 'Unlimited, sampai puas tanpa batas.', 'Desain', 6, true),
('faq07', 'svc11', 'Domain sudah termasuk?', 'Ya, gratis domain dot com 1 tahun.', 'Website', 7, true),
('faq08', 'svc08', 'Bisa bahasa Sunda?', 'Bisa, bilingual Indonesia-Sunda, bisa juga campur sesuai situasi.', 'MC', 8, true);

-- =====================================================
-- SELESAI! Semua tabel sudah dibuat dan data sudah diisi.
-- Total: 8 tabel, 17 jasa, 17 landing page, 3 artikel,
-- 11 site config, 8 testimoni, 8 FAQ
-- =====================================================
