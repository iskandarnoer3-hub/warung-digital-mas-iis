'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Check,
  MessageCircle,
  Phone,
  Gift,
  Shield,
  Star,
  Monitor,
  GraduationCap,
  Shirt,
  Palette,
  PartyPopper,
  Globe,
  BarChart3,
  Paintbrush,
  Rabbit,
  ChevronLeft,
  ChevronRight,
  Play,
  FileText,
  Download,
  Image as ImageIcon,
  Camera,
  Volume2,
  Sparkles,
  Wrench,
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDesc: string;
  detailDesc: string;
  price: number;
  priceMax: number;
  benefit1: string;
  benefit2: string;
  benefit3: string;
  benefit4: string;
  benefit5: string;
  waText: string;
  imageUrl: string;
  bonus: string;
  slotStatus: string;
  slotAvailable: boolean;
  active: boolean;
  order: number;
  landingPage?: {
    id: string;
    headline: string;
    subheadline: string;
    ctaText: string;
    sections: string;
    active: boolean;
  };
}

interface Props {
  serviceId: string | null;
  onClose: () => void;
  onAskAI: (query: string) => void;
}

// Lucide icon components per category
const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  Elektronik: <Monitor className="w-4 h-4" />,
  Pendidikan: <GraduationCap className="w-4 h-4" />,
  Fashion: <Shirt className="w-4 h-4" />,
  Digital: <Palette className="w-4 h-4" />,
  Event: <PartyPopper className="w-4 h-4" />,
  IT: <Globe className="w-4 h-4" />,
  Konsultan: <BarChart3 className="w-4 h-4" />,
  Seni: <Paintbrush className="w-4 h-4" />,
  Peternakan: <Rabbit className="w-4 h-4" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  Elektronik: 'from-blue-600 to-cyan-500',
  Pendidikan: 'from-violet-600 to-purple-500',
  Fashion: 'from-pink-600 to-rose-500',
  Digital: 'from-amber-500 to-orange-400',
  Event: 'from-emerald-600 to-teal-500',
  IT: 'from-violet-600 to-indigo-500',
  Konsultan: 'from-slate-600 to-zinc-500',
  Seni: 'from-fuchsia-600 to-pink-500',
  Peternakan: 'from-green-600 to-emerald-500',
};

const CATEGORY_DOT_COLORS: Record<string, string> = {
  Elektronik: 'bg-blue-500',
  Pendidikan: 'bg-violet-500',
  Fashion: 'bg-pink-500',
  Digital: 'bg-amber-500',
  Event: 'bg-emerald-500',
  IT: 'bg-indigo-500',
  Konsultan: 'bg-zinc-400',
  Seni: 'bg-fuchsia-500',
  Peternakan: 'bg-green-500',
};

// Testimonials data per service category
const TESTIMONIALS: Record<string, Array<{
  name: string;
  location: string;
  photo: string;
  rating: number;
  text: string;
  hasAudio: boolean;
}>> = {
  Elektronik: [
    {
      name: 'Rizky Fauzan',
      location: 'Sindanglaut, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=11',
      rating: 5,
      text: 'Dulu laptop saya mati total udah 2 minggu, bingung mau bawa ke mana. Teman recommend Mas Iis, ternyata beneran bisa! 3 hari udah nyala lagi, datanya gak ilang. Sampai sekarang udah 6 bulan masih awet. Terima kasih Mas Iis!',
      hasAudio: true,
    },
    {
      name: 'Siti Nurhaliza',
      location: 'Kesambi, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=5',
      rating: 5,
      text: 'MacBook Pro saya kena coffee spill, udah mati total. Dua service center bilang motherboard harus ganti baru, harganya selangit. Mas Iis coba perbaiki IC-nya aja, dan ternyata bisa hidup lagi! Hemat hampir 5 juta. Luar biasa!',
      hasAudio: false,
    },
    {
      name: 'Ahmad Dani',
      location: 'Harjamukti, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=12',
      rating: 4,
      text: 'Laptop kantor sering blue screen, udah bolak-balik bawa ke tukang servis yang lain tapi gak pernah sembuh total. Di Mas Iis, beliau langsung diagnosa akurat, ternyata RAM kotor & Windows perlu clean install. Sekali beres, gak pernah BSOD lagi.',
      hasAudio: true,
    },
    {
      name: 'Dewi Safitri',
      location: 'Lemahwungkuk, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=9',
      rating: 5,
      text: 'Anak saya laptopnya error pas mau online school. Panggil Mas Iis, beliau datang ke rumah gratis biaya panggilan area Cirebon. Cuma 1 jam udah beres, bahkan dikasih tips biar laptop awet. Recommended banget!',
      hasAudio: false,
    },
    {
      name: 'Budi Santoso',
      location: 'Plered, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=15',
      rating: 5,
      text: 'Laptop gaming saya overheat terus, udah gak bisa dipakai main apalagi kerja. Mas Iis bongkar, ganti thermal paste, bersihin fan, dan kasih cooling pad juga. Sekarang suhu stabil di 60 derajat. Puas banget!',
      hasAudio: true,
    },
  ],
  Pendidikan: [
    {
      name: 'Rina Marlina',
      location: 'Sumber, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=20',
      rating: 5,
      text: 'Skripsi saya udah 2 tahun gak kelar-kelar, dosen pembimbing selalu revisi. Teman suggest Mas Iis, dan bener aja! Dibimbing dari rumusan masalah sampai sidang, 3 bulan langsung ACC. Sekarang udah wisuda! Terima kasih banyak Mas Iis!',
      hasAudio: true,
    },
    {
      name: 'Fajar Nugroho',
      location: 'Kesambi, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=13',
      rating: 5,
      text: 'Tesis S2 saya mentok di bab 3, metodologi penelitian bingung banget. Mas Iis bantu jelasin AMOS dan SPSS step by step. Diajari sampai ngerti, bukan cuma dikasih hasilnya. Sekarang tesis saya lulus dengan predikat memuaskan!',
      hasAudio: false,
    },
    {
      name: 'Laila Fitriani',
      location: 'Harjamukti, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=25',
      rating: 4,
      text: 'Cek Turnitin di kampus dapat 45%, panik banget. Mas Iis bantu cek & paraphrase, turun jadi 8% dalam 24 jam. Laporan PDF-nya lengkap dan resmi, bisa dilampirin ke dosen. Cepat dan akurat!',
      hasAudio: true,
    },
    {
      name: 'Yusuf Ramadhan',
      location: 'Tengah Tani, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=18',
      rating: 5,
      text: 'Anak saya kelas 3 SMP, nilainya turun drastis. Daftar paket belajar B di Mas Iis, setiap minggu ada try out dan progress report. 3 bulan kemudian naik ke peringkat 5 sekelas. Worth it banget!',
      hasAudio: false,
    },
    {
      name: 'Mega Puspita',
      location: 'Lemahwungkuk, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=23',
      rating: 5,
      text: 'Disertasi saya udah mepet deadline, data penelitian berantakan. Mas Iis bantu analisis data dan susun argumentasi yang kuat. Revisi dosen cuma sekali, langsung ACC. Sempet nangis bahagia pas dinyatakan lulus!',
      hasAudio: true,
    },
  ],
  Fashion: [
    {
      name: 'Ibu Hj. Asep',
      location: 'Sindanglaut, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=28',
      rating: 5,
      text: 'Pesanan 200 seragam SMP untuk madrasah, deadline 2 minggu. Mas Iis jahit rapi, jahitan kuat, logo sablon juga rapi. Semua pas ukurannya. Orang tua murid puas semua. Pasti order lagi tahun depan!',
      hasAudio: false,
    },
    {
      name: 'Dra. Ratna',
      location: 'Sumber, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=30',
      rating: 5,
      text: 'Sudah 3 tahun kerja sama sama Mas Iis untuk seragam sekolah. Jahitan konsisten rapi, harga borongan sangat kompetitif, dan yang paling penting selalu tepat waktu. Recommended untuk borongan sekolah!',
      hasAudio: true,
    },
    {
      name: 'Rini Handayani',
      location: 'Kesambi, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=32',
      rating: 4,
      text: 'Butuh 50 baju pramuka darurat, cuma 1 minggu. Mas Iis sanggup dan hasilnya memuaskan. Bonus sample 1 pcs dulu sebelum produksi massal, jadi bisa cek kualitas dulu. Profesional!',
      hasAudio: false,
    },
    {
      name: 'H. Dedi Mulyadi',
      location: 'Plered, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=33',
      rating: 5,
      text: 'Ponpes kami pesan 300 kemeja dan 300 batik. Hasilnya rapi, ukuran presisi, dan bahannya nyaman. Mas Iis kasih harga spesial untuk pesanan besar. Alhamdulillah santri-santri pada senang!',
      hasAudio: true,
    },
    {
      name: 'Sri Wahyuni',
      location: 'Harjamukti, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=36',
      rating: 5,
      text: 'Awalnya ragu jahit borongan online, takut ukuran gak pas. Ternyata Mas Iis kasih panduan ukur detail, dan hasilnya semua pas. Bisa custom logo juga. Murid-murid senang seragam barunya!',
      hasAudio: false,
    },
  ],
  Digital: [
    {
      name: 'Dimas Pratama',
      location: 'Kesambi, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=51',
      rating: 5,
      text: 'Logo bisnis kuliner saya dibikin Mas Iis, hasilnya keren banget! Revisi unlimited ternyata beneran unlimited, bukan cuma marketing. Sampai 5 kali revisi tetap sabar dan hasilnya makin bagus. Sekarang logo saya dipake di semua outlet.',
      hasAudio: true,
    },
    {
      name: 'Anita Sari',
      location: 'Sumber, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=44',
      rating: 5,
      text: 'Copywriting landing page toko online saya sebelumnya konversinya 1%. Setelah Mas Iis tulis ulang pakai formula AIDA, konversi naik ke 4.5%! Bonus 10 headline-nya juga kebukti ampuh buat iklan FB. ROI naik 3x lipat!',
      hasAudio: false,
    },
    {
      name: 'Rahmat Hidayat',
      location: 'Harjamukti, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=52',
      rating: 4,
      text: 'Desain banner dan feed Instagram buat event sekolah. Cepat, 2 hari jadi. File dikirim semua format: AI, PSD, PNG, PDF. Tinggal pakai. Kualitas desain profesional, jauh dari yang saya bayangkan.',
      hasAudio: true,
    },
    {
      name: 'Linda Permata',
      location: 'Lemahwungkuk, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=45',
      rating: 5,
      text: 'Undangan digital pernikahan saya desain Mas Iis. Tamu-tamu pada bilang undangannya estetik banget! Bisa di-custom warna dan tema. Harganya juga sangat worth it dibanding undangan fisik yang mahal.',
      hasAudio: false,
    },
    {
      name: 'Eko Prasetyo',
      location: 'Plered, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=53',
      rating: 5,
      text: 'CEO copywriting Mas Iis bantu susun sales letter untuk produk herbal saya. Riset produknya mendalam, bahasanya persuasif tapi gak lebay. Sales letter-nya naikin revenue 40% dalam sebulan. Nggak nyangka!',
      hasAudio: true,
    },
  ],
  Event: [
    {
      name: 'H. Supriatna',
      location: 'Sindanglaut, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=60',
      rating: 5,
      text: 'Agency acara Mas Iis handle hajatan putri saya dari A sampai Z. MC, dekorasi, sound system, dokumentasi, semua one package. Saya cuma duduk manis aja sebagai tuan rumah. Tamu-tamu pada kagum dengan acaranya!',
      hasAudio: true,
    },
    {
      name: 'Ibu Enung',
      location: 'Sumber, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=38',
      rating: 5,
      text: 'MC Mas Iis luar biasa! Bilingual Indonesia-Sunda, bisa baca situasi, humornya pas. Khitanan anak saya jadi meriah dan berkesan. Bahkan sisa makanan juga diurus. Profesional level hotel!',
      hasAudio: false,
    },
    {
      name: 'Ustadz Ahmad',
      location: 'Kesambi, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=55',
      rating: 5,
      text: 'Gambus & El-Husna dari Mas Iis bikin acara Maulid Nabi di masjid kami jadi luar biasa. Suara merdu, sound system jernih, lagu-lagu bisa request. Jemaah sampai nangis terharu. Bismillah next year lagi!',
      hasAudio: true,
    },
    {
      name: 'Dewi Rachmawati',
      location: 'Harjamukti, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=37',
      rating: 4,
      text: 'Jasa angklung Mas Iis pentas di pernikahan adat Sunda kami. 10 personil pakai kostum tradisional, lagu-lagu Sunda dan nasional. Ada sesi interaktif 15 menit, tamu-tamu pada ikut angklung. Uniq dan berkesan!',
      hasAudio: false,
    },
    {
      name: 'Pak RW Dedi',
      location: 'Plered, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=57',
      rating: 5,
      text: 'Setiap tahun pakai jasa agency Mas Iis buat HUT RI. Semua tertata rapi: MC, sound system, dekorasi merah putih. Warga pada antusias setiap tahun. Sudah 3 tahun langganan dan gak pernah mengecewakan!',
      hasAudio: true,
    },
  ],
  IT: [
    {
      name: 'Dr. Hartono',
      location: 'Kesambi, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=61',
      rating: 5,
      text: 'Website klinik saya dibikin Mas Iis, desainnya minimalis modern. Pasien bisa booking online, ada fitur chat juga. Gratis domain & hosting 1 tahun. Dalam 2 bulan, pasien online naik 30%. Investasi yang sangat worth it!',
      hasAudio: true,
    },
    {
      name: 'Rina Amelia',
      location: 'Sumber, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=26',
      rating: 5,
      text: 'Toko batik online saya butuh website yang bisa handle transaksi. Mas Iis bikinin toko online lengkap dengan keranjang belanja dan payment gateway. Desainnya premium tapi harganya terjangkau. Maintenance 1 bulan gratis juga!',
      hasAudio: false,
    },
    {
      name: 'Firman Syah',
      location: 'Harjamukti, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=62',
      rating: 4,
      text: 'Landing page produk herbal saya sebelumnya convert-nya rendah. Mas Iis bikin ulang dengan desain modern + copywriting yang hit. Loading cepat, SEO friendly, dan responsive mobile. Enak banget buat iklan Google!',
      hasAudio: true,
    },
    {
      name: 'Ibu Yayah',
      location: 'Lemahwungkuk, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=39',
      rating: 5,
      text: 'Website pondok pesantren kami dibantu Mas Iis. Ada fitur pendaftaran online, profil guru, dan galeri kegiatan. Orang tua santri bisa monitoring dari jauh. Gratis maintenance 1 bulan, dan kalau ada error cepat direspons!',
      hasAudio: false,
    },
    {
      name: 'Agus Setiawan',
      location: 'Plered, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=63',
      rating: 5,
      text: 'Company profile kontraktor saya jadi terlihat profesional banget setelah dibikin website. Klien dari Jakarta sampai Surabaya bisa lihat portfolio online. Closing rate naik karena klien udah lihat credibility lewat website. Top!',
      hasAudio: true,
    },
  ],
  Konsultan: [
    {
      name: 'Drs. Wahyu',
      location: 'Kesambi, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=14',
      rating: 5,
      text: 'Sekolah kami mau akreditasi A, bingung mulai dari mana. Mas Iis pendampingan dari awal: SOP, administrasi, sampai simulasi visitasi. Alhamdulillah dapat A! Bonus SOP lengkapnya sangat membantu.',
      hasAudio: true,
    },
    {
      name: 'Ibu Hindun',
      location: 'Sumber, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=29',
      rating: 5,
      text: 'Sekolah swasta kami 3 kali gak lolos akreditasi A. Setelah dikonsultasin Mas Iis, ternyata banyak administrasi yang kurang. Mas Iis bantu lengkapi semua, termasuk sistem administrasi digital. Visitasi berikutnya: LULUS A!',
      hasAudio: false,
    },
    {
      name: 'H. Rohimat',
      location: 'Harjamukti, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=16',
      rating: 4,
      text: 'Pendampingan 1 tahun dari Mas Iis benar-benar committed. Tiap bulan ada evaluasi, bukan cuma teori. Sekolah kami sekarang punya SOP yang rapi dan sistem administrasi yang clear. Recommended!',
      hasAudio: true,
    },
    {
      name: 'Siti Aminah',
      location: 'Sindanglaut, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=24',
      rating: 5,
      text: 'Sekolah kami butuh manajemen yang lebih modern. Mas Iis bantu digitalisasi administrasi, buat SOP kurikulum merdeka, dan training guru. Dalam 6 bulan, sekolah jadi lebih tertib dan efisien.',
      hasAudio: false,
    },
    {
      name: 'Pak Mulyadi',
      location: 'Plered, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=17',
      rating: 5,
      text: 'Jaminan lolos akreditasi A dari Mas Iis ternyata beneran! Awalnya ragu, tapi setelah lihat kerja keras beliau pendampingan kami, yakin banget. Dan bener, dapat A! Terima kasih banyak Mas Iis!',
      hasAudio: true,
    },
  ],
  Seni: [
    {
      name: 'Hj. Eti',
      location: 'Sindanglaut, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=40',
      rating: 5,
      text: 'Taman rumah saya yang tadinya kosong melompong sekarang jadi taman Jepang yang indah. Mas Iis desain custom, pilih tanaman yang cocok, dan kasih garansi tanaman 1 bulan. Tetangga pada iri! Pengalaman 40 tahun beneran terasa.',
      hasAudio: true,
    },
    {
      name: 'Ustadz Mahmud',
      location: 'Kesambi, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=56',
      rating: 5,
      text: 'Kaligrafi Ayat Kursi di kanvas besar untuk masjid kami. Mas Iis bikin khat Tsuluts yang indah banget, detailnya luar biasa. Free bingkai juga. Jemaah masjid pada kagum. Sudah 1 tahun warna tetap cerah!',
      hasAudio: false,
    },
    {
      name: 'Ratna Dewi',
      location: 'Sumber, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=41',
      rating: 4,
      text: 'Hiasan pigura custom buat hadiah pernikahan teman. Desainnya eksklusif, ada nama pengantin dan tanggal pernikahannya. Bonus box packaging-nya premium. Temen sampai nangis terharu! Pengerjaan cuma 7 hari.',
      hasAudio: true,
    },
    {
      name: 'Kang Dasep',
      location: 'Harjamukti, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=58',
      rating: 5,
      text: 'Taman kantor kami dirapikan Mas Iis. Tanaman dipilih yang cocok iklim Cirebon, ada taman tropis dengan kolam kecil. Karyawan jadi betah kerja, ada yang bilang kayak kerja di resort! Maintenance bulanan juga tersedia.',
      hasAudio: false,
    },
    {
      name: 'Ibu Imas',
      location: 'Lemahwungkuk, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=42',
      rating: 5,
      text: 'Kaligrafi di kayu jati buat dekorasi rumah. Mas Iis pahat manual, hasilnya rustic dan elegan. Bahan kayu jati tua, jadi awet. Free bingkai kayu juga. Kebanggaan banget kalau tamu lihat dan tanya beli di mana!',
      hasAudio: true,
    },
  ],
  Peternakan: [
    {
      name: 'H. Amin',
      location: 'Sindanglaut, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=64',
      rating: 5,
      text: 'Kambing qurban dari Mas Iis sehat dan gemuk, sesuai syariat. Umur udah cukup, fisiknya sempurna. Gratis sembelih dan packing. Keluarga saya puas, dan dagingnya juga empuk. Pasti langganan setiap Idul Adha!',
      hasAudio: true,
    },
    {
      name: 'Ibu Siti Aminah',
      location: 'Sumber, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=35',
      rating: 5,
      text: 'Aqiqah anak kembar saya, pesan 2 ekor kambing. Mas Iis antar ke rumah, sembelih, dan packing rapi. Dagingnya cukup buat dibagikan ke tetangga semua. Prosesnya amanah dan sesuai syariat.',
      hasAudio: false,
    },
    {
      name: 'Ustadz Rizal',
      location: 'Kesambi, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=65',
      rating: 4,
      text: 'Masjid kami pesan 5 ekor kambing qurban dari Mas Iis. Semua sehat, gemuk, dan sesuai syarat. Penyembelihan dilakukan sesuai syariat Islam. Jemaah puas semua. Amanah dan terpercaya!',
      hasAudio: true,
    },
    {
      name: 'Kang Yana',
      location: 'Harjamukti, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=66',
      rating: 5,
      text: 'Dulu beli kambing qurban di pasar, sering gak sesuai ekspektasi. Sejak kenal Mas Iis, kambingnya selalu premium. Bisa pilih langsung atau pesan spesifikasi. Harga juga fair untuk kualitas segini.',
      hasAudio: false,
    },
    {
      name: 'H. Saepudin',
      location: 'Plered, Cirebon',
      photo: 'https://i.pravatar.cc/150?img=67',
      rating: 5,
      text: 'Aqiqah cucu saya, pesan kambing dari Mas Iis. 3 hari jadi, bisa diantar ke rumah. Dagingnya segar, packingnya rapi. Bahkan dikasih resep masakan kambing juga. Pelayanan lengkap dari A sampai Z!',
      hasAudio: true,
    },
  ],
};

// Placeholder documents
const DOCUMENTS = [
  { name: 'Brosur Layanan.pdf', type: 'pdf' as const, size: '2.4 MB' },
  { name: 'Pricelist 2025.xlsx', type: 'excel' as const, size: '1.1 MB' },
  { name: 'Portofolio.pdf', type: 'pdf' as const, size: '5.8 MB' },
];

export default function ServiceDetailModal({
  serviceId,
  onClose,
  onAskAI,
}: Props) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [testiIndex, setTestiIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState('');
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadService() {
      if (!serviceId) {
        setService(null);
        return;
      }
      setLoading(true);
      setGalleryIndex(0);
      setTestiIndex(0);
      try {
        const res = await fetch(`/api/services/${serviceId}`);
        const data = await res.json();
        if (data.success) setService(data.data);
      } catch (err) {
        console.error('Failed to fetch service:', err);
      }
      setLoading(false);
    }
    loadService();
  }, [serviceId]);

  const formatPrice = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
  const waNumber = '62882000858698';

  const benefits = service
    ? [service.benefit1, service.benefit2, service.benefit3, service.benefit4, service.benefit5].filter(Boolean)
    : [];

  // Gallery images using picsum with different seeds based on slug
  const galleryImages = service
    ? [
        `https://picsum.photos/seed/${service.slug}-1/600/400`,
        `https://picsum.photos/seed/${service.slug}-2/600/400`,
        `https://picsum.photos/seed/${service.slug}-3/600/400`,
        `https://picsum.photos/seed/${service.slug}-4/600/400`,
      ]
    : [];

  // Testimonials for this service's category
  const testimonials = service
    ? TESTIMONIALS[service.category] || TESTIMONIALS['Elektronik']
    : [];

  const scrollGallery = (direction: 'left' | 'right') => {
    if (!galleryRef.current) return;
    const scrollAmount = 280;
    galleryRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <Dialog open={!!serviceId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl bg-[#09090b] border-[#262626] text-white p-0 overflow-hidden max-h-[92vh]">
        <DialogHeader className="sr-only">
          <DialogTitle>{service ? service.name : 'Detail Layanan'}</DialogTitle>
          <DialogDescription>{service ? service.shortDesc : 'Detail layanan Mas Iis'}</DialogDescription>
        </DialogHeader>

        {/* Lightbox overlay */}
        {lightboxOpen && (
          <div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <img
              src={lightboxSrc}
              alt="Gallery preview"
              className="max-w-full max-h-[85vh] rounded-xl object-contain"
            />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : service ? (
          <div className="overflow-y-auto max-h-[92vh] scroll-smooth">
            {/* ===== A. HERO SECTION ===== */}
            <div className="relative">
              {/* Hero background */}
              <div
                className={`relative bg-gradient-to-br ${CATEGORY_COLORS[service.category] || 'from-violet-600 to-pink-500'} p-8 pb-16`}
              >
                <div className="absolute inset-0 bg-black/30" />

                {/* Hero image overlay */}
                <div className="absolute inset-0 opacity-20">
                  <img
                    src={`/services/${service.slug}.png`}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>

                <div className="relative z-10">
                  <Badge className="bg-white/20 text-white border-0 mb-3 inline-flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${CATEGORY_DOT_COLORS[service.category] || 'bg-violet-400'}`} />
                    {CATEGORY_ICON_MAP[service.category] || <Wrench className="w-4 h-4" />}
                    {service.category}
                  </Badge>
                  <h2 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
                    {service.name}
                  </h2>
                  <p className="text-white/80 text-sm md:text-base max-w-xl">{service.shortDesc}</p>

                  {/* Price badge */}
                  <div className="mt-5 inline-flex items-center gap-3 bg-black/40 backdrop-blur-sm rounded-xl px-5 py-3">
                    <div>
                      <div className="text-xs text-white/60 uppercase tracking-wider">Harga</div>
                      <div className="text-xl md:text-2xl font-bold text-violet-300">
                        {formatPrice(service.price)}
                        <span className="text-sm text-white/50"> - {formatPrice(service.priceMax)}</span>
                      </div>
                    </div>
                    {service.slotAvailable && (
                      <div className="flex items-center gap-1.5 text-emerald-300 text-sm bg-emerald-500/20 rounded-lg px-3 py-1.5">
                        <Shield className="w-4 h-4" />
                        {service.slotStatus}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ===== B. PHOTO GALLERY SECTION ===== */}
            <div className="px-6 pt-8 pb-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-violet-400" />
                  <h3 className="text-lg font-semibold text-white">Galeri Foto</h3>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => scrollGallery('left')}
                    className="w-8 h-8 rounded-lg bg-[#1a1a1e] border border-[#262626] flex items-center justify-center hover:bg-violet-600 hover:border-violet-600 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollGallery('right')}
                    className="w-8 h-8 rounded-lg bg-[#1a1a1e] border border-[#262626] flex items-center justify-center hover:bg-violet-600 hover:border-violet-600 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                ref={galleryRef}
                className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setLightboxSrc(img);
                      setLightboxOpen(true);
                    }}
                    className="flex-shrink-0 w-[260px] h-[180px] rounded-xl overflow-hidden border border-[#262626] hover:border-violet-500 transition-all hover:scale-[1.02] group relative"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <img
                      src={img}
                      alt={`${service.name} - Foto ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ===== C. VIDEO SECTION ===== */}
            <div className="px-6 pt-6 pb-2">
              <div className="flex items-center gap-2 mb-4">
                <Play className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-semibold text-white">Video Profil Layanan</h3>
              </div>
              <div className="relative bg-[#111113] border border-[#262626] rounded-2xl overflow-hidden aspect-video flex items-center justify-center group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 to-black/60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-violet-600/80 flex items-center justify-center group-hover:bg-violet-500 transition-all group-hover:scale-110 shadow-lg shadow-violet-500/30">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 text-white/60 text-sm">
                  Klik untuk menonton video profil
                </div>
                {/* Fake progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                  <div className="h-full bg-violet-500 w-0 group-hover:w-1/3 transition-all duration-1000" />
                </div>
              </div>
            </div>

            {/* ===== D. DETAIL DESCRIPTION SECTION ===== */}
            <div className="px-6 pt-6 pb-2">
              {service.detailDesc && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Deskripsi Layanan
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {service.detailDesc}
                  </p>
                </div>
              )}

              {/* Benefits in grid */}
              {benefits.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Keunggulan Layanan
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {benefits.map((b, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-[#111113] border border-[#262626] rounded-xl px-4 py-3 hover:border-violet-500/30 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-sm text-zinc-300">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ===== E. DOCUMENTS SECTION ===== */}
            <div className="px-6 pt-6 pb-2">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-semibold text-white">Dokumen</h3>
              </div>
              <div className="space-y-2">
                {DOCUMENTS.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-[#111113] border border-[#262626] rounded-xl px-4 py-3 hover:border-violet-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        doc.type === 'pdf' ? 'bg-red-500/10' : 'bg-emerald-500/10'
                      }`}>
                        {doc.type === 'pdf' ? (
                          <FileText className="w-5 h-5 text-red-400" />
                        ) : (
                          <BarChart3 className="w-5 h-5 text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm text-white font-medium">{doc.name}</div>
                        <div className="text-xs text-zinc-500">{doc.size}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-lg"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Unduh
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* ===== F. TESTIMONIALS SECTION ===== */}
            <div className="px-6 pt-6 pb-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-violet-400" />
                  <h3 className="text-lg font-semibold text-white">Testimoni Pelanggan</h3>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setTestiIndex(Math.max(0, testiIndex - 1))}
                    className="w-8 h-8 rounded-lg bg-[#1a1a1e] border border-[#262626] flex items-center justify-center hover:bg-violet-600 hover:border-violet-600 transition-colors disabled:opacity-30"
                    disabled={testiIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTestiIndex(Math.min(testimonials.length - 1, testiIndex + 1))}
                    className="w-8 h-8 rounded-lg bg-[#1a1a1e] border border-[#262626] flex items-center justify-center hover:bg-violet-600 hover:border-violet-600 transition-colors disabled:opacity-30"
                    disabled={testiIndex >= testimonials.length - 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Testimonial cards - show 1 on mobile, carousel style */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${testiIndex * 100}%)` }}
                >
                  {testimonials.map((t, i) => (
                    <div
                      key={i}
                      className="w-full flex-shrink-0 pr-3"
                    >
                      <div className="bg-[#111113] border border-[#262626] rounded-2xl p-5">
                        {/* Header: photo, name, location, rating */}
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={t.photo}
                            alt={t.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-violet-500/30 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-semibold text-sm">{t.name}</div>
                            <div className="text-zinc-500 text-xs mt-0.5">{t.location}</div>
                            <div className="flex items-center gap-0.5 mt-1">
                              {Array.from({ length: 5 }).map((_, si) => (
                                <Star
                                  key={si}
                                  className={`w-3.5 h-3.5 ${si < t.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'}`}
                                />
                              ))}
                            </div>
                          </div>
                          {t.hasAudio && (
                            <button className="flex-shrink-0 w-9 h-9 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center hover:bg-violet-500/20 transition-colors group">
                              <Volume2 className="w-4 h-4 text-violet-400 group-hover:text-violet-300" />
                            </button>
                          )}
                        </div>

                        {/* Testimonial text */}
                        <p className="text-zinc-300 text-sm leading-relaxed italic">
                          &ldquo;{t.text}&rdquo;
                        </p>

                        {/* Audio waveform placeholder */}
                        {t.hasAudio && (
                          <div className="mt-3 flex items-center gap-2">
                            <div className="flex items-end gap-0.5 h-5">
                              {Array.from({ length: 20 }).map((_, bi) => (
                                <div
                                  key={bi}
                                  className="w-1 bg-violet-500/40 rounded-full"
                                  style={{ height: `${Math.random() * 16 + 4}px` }}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-zinc-500">0:42</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots indicator */}
              <div className="flex justify-center gap-1.5 mt-4">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestiIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === testiIndex ? 'bg-violet-500 w-6' : 'bg-zinc-600 hover:bg-zinc-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* ===== Bonus ===== */}
            {service.bonus && (
              <div className="px-6 pt-4">
                <div className="bg-gradient-to-r from-emerald-950/50 to-transparent border border-emerald-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-emerald-400" />
                    <span className="font-semibold text-emerald-400">Bonus</span>
                  </div>
                  <p className="text-zinc-300 mt-1">{service.bonus}</p>
                </div>
              </div>
            )}

            {/* ===== G. CTA SECTION ===== */}
            <div className="px-6 pt-6 pb-8">
              <div className="bg-gradient-to-br from-violet-950/60 to-[#111113] border border-violet-500/20 rounded-2xl p-6 text-center">
                <Sparkles className="w-8 h-8 text-violet-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Tertarik dengan layanan ini?
                </h3>
                <p className="text-zinc-400 text-sm mb-5">
                  Hubungi kami sekarang dan dapatkan penawaran terbaik!
                </p>
                {service.bonus && (
                  <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-5">
                    <Gift className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-sm font-medium">Bonus: {service.bonus}</span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent(service.waText || `Halo Mas Iis, saya mau ${service.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <Button className="w-full bg-[#25d366] hover:bg-[#20bd5a] text-white rounded-xl h-12 text-base font-semibold shadow-lg shadow-emerald-500/20">
                      <Phone className="w-5 h-5 mr-2" />
                      WhatsApp Sekarang
                    </Button>
                  </a>
                  <Button
                    onClick={() => {
                      onAskAI(`${service.name} berapa dan bagaimana?`);
                      onClose();
                    }}
                    className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white rounded-xl h-12 text-base font-semibold shadow-lg shadow-violet-500/20"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Tanya AI
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
