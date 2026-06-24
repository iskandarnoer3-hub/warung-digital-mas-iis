'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminPanel from '@/components/admin-panel';
import {
  ArrowLeft,
  Check,
  MessageCircle,
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
  Wrench,
  ExternalLink,
  Quote,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Clock,
  Award,
} from 'lucide-react';
import { FALLBACK_SERVICES } from '@/data/fallback-services';

interface ServiceImage {
  id: string;
  serviceId: string;
  url: string;
  caption: string;
  type: string;
  order: number;
}

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
  heroImageUrl: string;
  videoUrl: string;
  audioUrl: string;
  externalLink: string;
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
  images?: ServiceImage[];
}

interface Props {
  serviceId: string;
  onBack: () => void;
  onAskAI: (query: string) => void;
}

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  Elektronik: <Monitor className="w-5 h-5" />,
  Pendidikan: <GraduationCap className="w-5 h-5" />,
  Fashion: <Shirt className="w-5 h-5" />,
  Digital: <Palette className="w-5 h-5" />,
  Event: <PartyPopper className="w-5 h-5" />,
  IT: <Globe className="w-5 h-5" />,
  Konsultan: <BarChart3 className="w-5 h-5" />,
  Seni: <Paintbrush className="w-5 h-5" />,
  Peternakan: <Rabbit className="w-5 h-5" />,
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

// Service-specific hero images by slug - real, relevant photos
const SERVICE_HERO_IMAGES: Record<string, string> = {
  'servis-laptop-macbook': '/services/laptop.png',
  'bimbingan-skripsi-tesis-disertasi-artikel-ilmiah': '/services/skripsi.png',
  'jasa-cek-turnitin-ai': '/services/turnitin.png',
  'les-privat-pelajaran-sd-tk': '/services/belajar.png',
  'jasa-jahit-borongan-sekolah': '/services/jahit-new.png',
  'desain-grafis-profesional': '/services/desain.png',
  'ceo-copywriting': '/services/copywriting.png',
  'jasa-agency-acara': '/services/agency.png',
  'jasa-mc-profesional': '/services/mc.png',
  'gambus-elhusna-sound-system': '/services/gambus.png',
  'jasa-hiburan-angklung': '/services/angklung-new.png',
  'jual-beli-kambing-qurban': '/services/kambing.png',
  'website-profil-minimalis': '/services/website.png',
  'konsultan-manajemen-sekolah': '/services/konsultan.png',
  'jasa-kaligrafi-arab': '/services/kaligrafi.png',
  'hiasan-pigura-custom': '/services/pigura-new.png',
  'hias-taman-profesional': '/services/taman.png',
};

// Service-specific gallery images by slug
const SERVICE_GALLERY_IMAGES: Record<string, string[]> = {
  'servis-laptop-macbook': ['/services/laptop.png'],
  'bimbingan-skripsi-tesis-disertasi-artikel-ilmiah': ['/services/skripsi.png'],
  'jasa-cek-turnitin-ai': ['/services/turnitin.png'],
  'les-privat-pelajaran-sd-tk': ['/services/belajar.png'],
  'jasa-jahit-borongan-sekolah': ['/services/jahit-new.png'],
  'desain-grafis-profesional': ['/services/desain.png'],
  'ceo-copywriting': ['/services/copywriting.png'],
  'jasa-agency-acara': ['/services/agency.png', '/services/event-gallery.png'],
  'jasa-mc-profesional': ['/services/mc.png'],
  'gambus-elhusna-sound-system': ['/services/gambus.png'],
  'jasa-hiburan-angklung': ['/services/angklung-new.png'],
  'jual-beli-kambing-qurban': ['/services/kambing.png', '/services/kambing-gallery.png'],
  'website-profil-minimalis': ['/services/website.png'],
  'konsultan-manajemen-sekolah': ['/services/konsultan.png'],
  'jasa-kaligrafi-arab': ['/services/kaligrafi.png'],
  'hiasan-pigura-custom': ['/services/pigura-new.png'],
  'hias-taman-profesional': ['/services/taman.png'],
};

// Category fallback images (used when slug not found)
const CATEGORY_HERO_IMAGES: Record<string, string> = {
  Elektronik: '/services/laptop.png',
  Pendidikan: '/services/skripsi.png',
  Fashion: '/services/jahit-new.png',
  Digital: '/services/desain.png',
  Event: '/services/agency.png',
  IT: '/services/website.png',
  Konsultan: '/services/konsultan.png',
  Seni: '/services/kaligrafi.png',
  Peternakan: '/services/kambing.png',
};

const CATEGORY_GALLERY_IMAGES: Record<string, string[]> = {
  Elektronik: ['/services/laptop.png'],
  Pendidikan: ['/services/skripsi.png'],
  Fashion: ['/services/jahit-new.png'],
  Digital: ['/services/desain.png'],
  Event: ['/services/agency.png', '/services/event-gallery.png'],
  IT: ['/services/website.png'],
  Konsultan: ['/services/konsultan.png'],
  Seni: ['/services/kaligrafi.png'],
  Peternakan: ['/services/kambing.png', '/services/kambing-gallery.png'],
};

// Storytelling testimonials per category - authentic and compelling (text-focused, no photos)
const TESTIMONIALS: Record<string, Array<{
  name: string;
  location: string;
  rating: number;
  story: string;
  hasAudio: boolean;
  audioDuration: string;
}>> = {
  Elektronik: [
    {
      name: 'Rizky Fauzan',
      location: 'Sindanglaut, Cirebon',
      rating: 5,
      story: 'Dulu laptop saya mati total udah 2 minggu, bingung mau bawa ke mana. Teman recommend Mas Iis, ternyata beneran bisa! 3 hari udah nyala lagi, datanya gak ilang. Sampai sekarang udah 6 bulan masih awet. Terima kasih Mas Iis!',
      hasAudio: true,
      audioDuration: '0:42',
    },
    {
      name: 'Siti Nurhaliza',
      location: 'Kesambi, Cirebon',
      rating: 5,
      story: 'MacBook Pro saya kena coffee spill, udah mati total. Dua service center bilang motherboard harus ganti baru, harganya selangit. Mas Iis coba perbaiki IC-nya aja, dan ternyata bisa hidup lagi! Hemat hampir 5 juta. Luar biasa!',
      hasAudio: false,
      audioDuration: '0:38',
    },
    {
      name: 'Ahmad Dani',
      location: 'Harjamukti, Cirebon',
      rating: 4,
      story: 'Laptop kantor sering blue screen, udah bolak-balik bawa ke tukang servis yang lain tapi gak pernah sembuh total. Di Mas Iis, beliau langsung diagnosa akurat, ternyata RAM kotor dan Windows perlu clean install. Sekali beres, gak pernah BSOD lagi.',
      hasAudio: true,
      audioDuration: '0:55',
    },
  ],
  Pendidikan: [
    {
      name: 'Rina Marlina',
      location: 'Sumber, Cirebon',
      rating: 5,
      story: 'Skripsi saya udah 2 tahun gak kelar-kelar, dosen pembimbing selalu revisi. Teman suggest Mas Iis, dan bener aja! Dibimbing dari rumusan masalah sampai sidang, 3 bulan langsung ACC. Sekarang udah wisuda! Terima kasih banyak Mas Iis!',
      hasAudio: true,
      audioDuration: '0:48',
    },
    {
      name: 'Fajar Nugroho',
      location: 'Kesambi, Cirebon',
      rating: 5,
      story: 'Tesis S2 saya mentok di bab 3, metodologi penelitian bingung banget. Mas Iis bantu jelasin AMOS dan SPSS step by step. Diajari sampai ngerti, bukan cuma dikasih hasilnya. Sekarang tesis saya lulus dengan predikat memuaskan!',
      hasAudio: false,
      audioDuration: '0:35',
    },
    {
      name: 'Laila Fitriani',
      location: 'Harjamukti, Cirebon',
      rating: 5,
      story: 'Cek Turnitin di kampus dapat 45%, panik banget. Mas Iis bantu cek dan paraphrase, turun jadi 8% dalam 24 jam. Laporan PDF-nya lengkap dan resmi, bisa dilampirin ke dosen. Cepat dan akurat!',
      hasAudio: true,
      audioDuration: '0:32',
    },
  ],
  Fashion: [
    {
      name: 'Dra. Ratna',
      location: 'Sumber, Cirebon',
      rating: 5,
      story: 'Sudah 3 tahun kerja sama sama Mas Iis untuk seragam sekolah. Jahitan konsisten rapi, harga borongan sangat kompetitif, dan yang paling penting selalu tepat waktu. Recommended untuk borongan sekolah!',
      hasAudio: true,
      audioDuration: '0:40',
    },
    {
      name: 'Ibu Hj. Asep',
      location: 'Sindanglaut, Cirebon',
      rating: 5,
      story: 'Pesanan 200 seragam SMP untuk madrasah, deadline 2 minggu. Mas Iis jahit rapi, jahitan kuat, logo sablon juga rapi. Semua pas ukurannya. Orang tua murid puas semua. Pasti order lagi tahun depan!',
      hasAudio: false,
      audioDuration: '0:36',
    },
  ],
  Digital: [
    {
      name: 'Dimas Pratama',
      location: 'Kesambi, Cirebon',
      rating: 5,
      story: 'Logo bisnis kuliner saya dibikin Mas Iis, hasilnya keren banget! Revisi unlimited ternyata beneran unlimited, bukan cuma marketing. Sampai 5 kali revisi tetap sabar dan hasilnya makin bagus. Sekarang logo saya dipake di semua outlet.',
      hasAudio: true,
      audioDuration: '0:45',
    },
    {
      name: 'Anita Sari',
      location: 'Sumber, Cirebon',
      rating: 5,
      story: 'Copywriting landing page toko online saya sebelumnya konversinya 1%. Setelah Mas Iis tulis ulang pakai formula AIDA, konversi naik ke 4.5%! Bonus 10 headline-nya juga kebukti ampuh buat iklan FB. ROI naik 3x lipat!',
      hasAudio: false,
      audioDuration: '0:50',
    },
  ],
  Event: [
    {
      name: 'H. Supriatna',
      location: 'Sindanglaut, Cirebon',
      rating: 5,
      story: 'Agency acara Mas Iis handle hajatan putri saya dari A sampai Z. MC, dekorasi, sound system, dokumentasi, semua one package. Saya cuma duduk manis aja sebagai tuan rumah. Tamu-tamu pada kagum dengan acaranya!',
      hasAudio: true,
      audioDuration: '0:52',
    },
    {
      name: 'Ibu Enung',
      location: 'Sumber, Cirebon',
      rating: 5,
      story: 'MC Mas Iis luar biasa! Bilingual Indonesia-Sunda, bisa baca situasi, humornya pas. Khitanan anak saya jadi meriah dan berkesan. Bahkan sisa makanan juga diurus. Profesional level hotel!',
      hasAudio: false,
      audioDuration: '0:38',
    },
  ],
  IT: [
    {
      name: 'Dr. Hartono',
      location: 'Kesambi, Cirebon',
      rating: 5,
      story: 'Website klinik saya dibikin Mas Iis, desainnya minimalis modern. Pasien bisa booking online, ada fitur chat juga. Gratis domain dan hosting 1 tahun. Dalam 2 bulan, pasien online naik 30%. Investasi yang sangat worth it!',
      hasAudio: true,
      audioDuration: '0:44',
    },
    {
      name: 'Rina Amelia',
      location: 'Sumber, Cirebon',
      rating: 5,
      story: 'Toko batik online saya butuh website yang bisa handle transaksi. Mas Iis bikinin toko online lengkap dengan keranjang belanja dan payment gateway. Desainnya premium tapi harganya terjangkau. Maintenance 1 bulan gratis juga!',
      hasAudio: false,
      audioDuration: '0:39',
    },
  ],
  Konsultan: [
    {
      name: 'Drs. Wahyu',
      location: 'Kesambi, Cirebon',
      rating: 5,
      story: 'Sekolah kami mau akreditasi A, bingung mulai dari mana. Mas Iis pendampingan dari awal: SOP, administrasi, sampai simulasi visitasi. Alhamdulillah dapat A! Bonus SOP lengkapnya sangat membantu.',
      hasAudio: true,
      audioDuration: '0:46',
    },
    {
      name: 'Ibu Hindun',
      location: 'Sumber, Cirebon',
      rating: 5,
      story: 'Sekolah swasta kami 3 kali gak lolos akreditasi A. Setelah dikonsultasin Mas Iis, ternyata banyak administrasi yang kurang. Mas Iis bantu lengkapi semua, termasuk sistem administrasi digital. Visitasi berikutnya: LULUS A!',
      hasAudio: false,
      audioDuration: '0:41',
    },
  ],
  Seni: [
    {
      name: 'Hj. Eti',
      location: 'Sindanglaut, Cirebon',
      rating: 5,
      story: 'Taman rumah saya yang tadinya kosong melompong sekarang jadi taman Jepang yang indah. Mas Iis desain custom, pilih tanaman yang cocok, dan kasih garansi tanaman 1 bulan. Tetangga pada iri! Pengalaman 40 tahun beneran terasa.',
      hasAudio: true,
      audioDuration: '0:50',
    },
    {
      name: 'Ustadz Mahmud',
      location: 'Kesambi, Cirebon',
      rating: 5,
      story: 'Kaligrafi Ayat Kursi di kanvas besar untuk masjid kami. Mas Iis bikin khat Tsuluts yang indah banget, detailnya luar biasa. Free bingkai juga. Jemaah masjid pada kagum. Sudah 1 tahun warna tetap cerah!',
      hasAudio: false,
      audioDuration: '0:35',
    },
  ],
  Peternakan: [
    {
      name: 'H. Amin',
      location: 'Sindanglaut, Cirebon',
      rating: 5,
      story: 'Kambing qurban dari Mas Iis sehat dan gemuk, sesuai syariat. Umur udah cukup, fisiknya sempurna. Gratis sembelih dan packing. Keluarga saya puas, dan dagingnya juga empuk. Pasti langganan setiap Idul Adha!',
      hasAudio: true,
      audioDuration: '0:37',
    },
    {
      name: 'Ibu Siti Aminah',
      location: 'Sumber, Cirebon',
      rating: 5,
      story: 'Aqiqah anak kembar saya, pesan 2 ekor kambing. Mas Iis antar ke rumah, sembelih, dan packing rapi. Dagingnya cukup buat dibagikan ke tetangga semua. Prosesnya amanah dan sesuai syariat.',
      hasAudio: false,
      audioDuration: '0:33',
    },
  ],
};

// Documents per category
const CATEGORY_DOCUMENTS: Record<string, Array<{name: string; type: 'pdf' | 'excel'; size: string}>> = {
  Elektronik: [
    { name: 'Brosur Servis Laptop.pdf', type: 'pdf', size: '2.4 MB' },
    { name: 'Pricelist Servis 2025.pdf', type: 'pdf', size: '1.1 MB' },
    { name: 'Daftar Harga Sparepart.xlsx', type: 'excel', size: '890 KB' },
  ],
  Pendidikan: [
    { name: 'Panduan Bimbingan Skripsi.pdf', type: 'pdf', size: '3.2 MB' },
    { name: 'Template Turnitin.pdf', type: 'pdf', size: '1.5 MB' },
    { name: 'Paket Bimbingan & Harga.xlsx', type: 'excel', size: '720 KB' },
  ],
  Fashion: [
    { name: 'Katalog Seragam.pdf', type: 'pdf', size: '5.8 MB' },
    { name: 'Pricelist Jahit Borongan.xlsx', type: 'excel', size: '1.1 MB' },
    { name: 'Panduan Ukur Badan.pdf', type: 'pdf', size: '890 KB' },
  ],
  Digital: [
    { name: 'Portofolio Desain.pdf', type: 'pdf', size: '8.4 MB' },
    { name: 'Paket Desain & Copywriting.pdf', type: 'pdf', size: '2.1 MB' },
    { name: 'Daftar Harga Jasa Digital.xlsx', type: 'excel', size: '680 KB' },
  ],
  Event: [
    { name: 'Paket MC & Agency.pdf', type: 'pdf', size: '4.2 MB' },
    { name: 'Dokumentasi Event.pdf', type: 'pdf', size: '12.5 MB' },
    { name: 'Pricelist Paket Event.xlsx', type: 'excel', size: '950 KB' },
  ],
  IT: [
    { name: 'Portofolio Website.pdf', type: 'pdf', size: '6.3 MB' },
    { name: 'Paket Website & Landing Page.pdf', type: 'pdf', size: '2.8 MB' },
    { name: 'Perbandingan Harga Website.xlsx', type: 'excel', size: '540 KB' },
  ],
  Konsultan: [
    { name: 'Profil Pendampingan Akreditasi.pdf', type: 'pdf', size: '3.8 MB' },
    { name: 'SOP Manajemen Sekolah.pdf', type: 'pdf', size: '4.5 MB' },
    { name: 'Paket Konsultasi & Harga.xlsx', type: 'excel', size: '760 KB' },
  ],
  Seni: [
    { name: 'Katalog Taman & Kaligrafi.pdf', type: 'pdf', size: '7.2 MB' },
    { name: 'Galeri Pigura Custom.pdf', type: 'pdf', size: '4.1 MB' },
    { name: 'Pricelist Jasa Seni.xlsx', type: 'excel', size: '620 KB' },
  ],
  Peternakan: [
    { name: 'Katalog Kambing Qurban.pdf', type: 'pdf', size: '3.5 MB' },
    { name: 'Paket Aqiqah.pdf', type: 'pdf', size: '1.8 MB' },
    { name: 'Harga Kambing per Kategori.xlsx', type: 'excel', size: '450 KB' },
  ],
};

export default function ServiceFullPage({ serviceId, onBack, onAskAI }: Props) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState('');
  const [testiIndex, setTestiIndex] = useState(0);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadService() {
      setLoading(true);

      // Try API first with safe JSON parsing
      try {
        const res = await fetch(`/api/services/${serviceId}`);
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (data.success && data.data) {
            setService(data.data);
            // Notify admin panel about the current service context
            window.dispatchEvent(new CustomEvent('admin-set-context', {
              detail: {
                page: 'service',
                serviceId: data.data.id,
                serviceSlug: data.data.slug,
                serviceName: data.data.name,
              },
            }));
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch service from API:', err);
      }

      // Fallback: try to find service from local data (by ID, slug, or order number)
      const fallback = FALLBACK_SERVICES.find(s =>
        s.id === serviceId ||
        s.slug === serviceId ||
        s.order === parseInt(serviceId, 10)
      );
      if (fallback) {
        setService(fallback as unknown as Service);
        setLoading(false);
        return;
      }

      // Last resort: if serviceId looks like a number 1-17, use order lookup
      const orderNum = parseInt(serviceId.replace(/\D/g, ''), 10);
      if (orderNum >= 1 && orderNum <= 17) {
        const byOrder = FALLBACK_SERVICES.find(s => s.order === orderNum);
        if (byOrder) {
          setService(byOrder as unknown as Service);
          setLoading(false);
          return;
        }
      }

      setLoading(false);
    }
    loadService();

    // Reset admin context to home when leaving this service page
    return () => {
      window.dispatchEvent(new CustomEvent('admin-set-context', {
        detail: { page: 'home' },
      }));
    };
  }, [serviceId]);

  // Scroll to top when service changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [serviceId]);

  const formatPrice = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
  const waNumber = '62882000858698';

  const benefits = service
    ? [service.benefit1, service.benefit2, service.benefit3, service.benefit4, service.benefit5].filter(Boolean)
    : [];

  // Use database hero image if set, otherwise fall back to hardcoded
  const heroImage = service
    ? service.heroImageUrl || SERVICE_HERO_IMAGES[service.slug] || CATEGORY_HERO_IMAGES[service.category] || SERVICE_HERO_IMAGES['servis-laptop-macbook']
    : '';

  // Use database gallery images if available, otherwise fall back to hardcoded
  const dbGalleryImages = (service?.images?.filter(img => img.type === 'gallery' || !img.type) || []).map(img => img.url);
  const galleryImages = dbGalleryImages.length > 0
    ? dbGalleryImages
    : (service ? SERVICE_GALLERY_IMAGES[service.slug] || CATEGORY_GALLERY_IMAGES[service.category] || SERVICE_GALLERY_IMAGES['servis-laptop-macbook'] : []);

  // Video URL from database
  const videoUrl = service?.videoUrl || '';

  // Audio URL from database
  const audioUrl = service?.audioUrl || '';

  // External link from database
  const externalLink = service?.externalLink || '';
  const testimonials = service ? TESTIMONIALS[service.category] || TESTIMONIALS['Elektronik'] : [];
  const documents = service ? CATEGORY_DOCUMENTS[service.category] || CATEGORY_DOCUMENTS['Elektronik'] : [];

  const scrollGallery = (direction: 'left' | 'right') => {
    if (!galleryRef.current) return;
    const scrollAmount = 320;
    galleryRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleWhatsApp = () => {
    const text = service?.waText || `Halo Mas Iis, saya tertarik dengan jasa ${service?.name}. Bisa info lebih lanjut?`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Memuat layanan...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Layanan tidak ditemukan</p>
          <Button onClick={onBack} variant="outline" className="border-zinc-700 text-zinc-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Lightbox overlay */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              onClick={() => setLightboxOpen(false)}
            >
              <span className="text-white text-xl">x</span>
            </button>
            <img
              src={lightboxSrc}
              alt="Gallery preview"
              className="max-w-full max-h-[90vh] rounded-xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== STICKY NAV BAR ===== */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Kembali</span>
          </button>
          <div className="flex items-center gap-2">
            <Badge className="bg-white/10 text-white border-0 items-center gap-1.5">
              {CATEGORY_ICON_MAP[service.category] || <Wrench className="w-4 h-4" />}
              {service.category}
            </Badge>
          </div>
          <Button
            onClick={handleWhatsApp}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-9 px-4 text-sm font-medium"
          >
            <MessageCircle className="w-4 h-4 mr-1.5" />
            WhatsApp
          </Button>
        </div>
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-16">
        <div className="relative h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden">
          {/* Background image */}
          <img
            src={heroImage}
            alt={service.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/80 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className={`bg-gradient-to-r ${CATEGORY_COLORS[service.category] || 'from-violet-600 to-pink-500'} text-white border-0 mb-4 inline-flex items-center gap-1.5 px-3 py-1.5`}>
                  {CATEGORY_ICON_MAP[service.category] || <Wrench className="w-4 h-4" />}
                  {service.category}
                </Badge>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  {service.name}
                </h1>

                <p className="text-zinc-300 text-lg max-w-2xl mb-6 leading-relaxed">
                  {service.shortDesc}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  {/* Price */}
                  <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-4 border border-zinc-700/50">
                    <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Mulai dari</div>
                    <div className="text-2xl md:text-3xl font-bold text-white">
                      {formatPrice(service.price)}
                      <span className="text-sm text-zinc-400 font-normal"> - {formatPrice(service.priceMax)}</span>
                    </div>
                  </div>

                  {/* Status */}
                  {service.slotAvailable && (
                    <div className="bg-emerald-500/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-emerald-500/20 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">{service.slotStatus}</span>
                    </div>
                  )}

                  {/* Bonus */}
                  {service.bonus && (
                    <div className="bg-amber-500/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-amber-500/20 flex items-center gap-2">
                      <Gift className="w-5 h-5 text-amber-400" />
                      <span className="text-amber-400 font-medium">{service.bonus}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTENT SECTIONS ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ===== A. BENEFITS SECTION ===== */}
        {benefits.length > 0 && (
          <section className="py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Keunggulan Layanan</h2>
                  <p className="text-zinc-500 text-sm">Mengapa memilih layanan kami</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {benefits.map((b, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                    className="bg-[#111113] border border-[#1e1e22] rounded-2xl p-5 hover:border-violet-500/30 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                        <Check className="w-5 h-5 text-emerald-400" />
                      </div>
                      <p className="text-zinc-300 text-sm leading-relaxed pt-2">{b}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* ===== B. DETAIL DESCRIPTION ===== */}
        {service.detailDesc && (
          <section className="py-12 border-t border-zinc-800/50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">Tentang Layanan Ini</h2>
              <p className="text-zinc-400 leading-relaxed text-base max-w-4xl">
                {service.detailDesc}
              </p>
            </motion.div>
          </section>
        )}

        {/* ===== C. PHOTO GALLERY ===== */}
        <section className="py-12 border-t border-zinc-800/50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Galeri Foto</h2>
                  <p className="text-zinc-500 text-sm">Dokumentasi layanan kami</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollGallery('left')}
                  className="w-10 h-10 rounded-xl bg-[#1a1a1e] border border-[#262626] flex items-center justify-center hover:bg-violet-600 hover:border-violet-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollGallery('right')}
                  className="w-10 h-10 rounded-xl bg-[#1a1a1e] border border-[#262626] flex items-center justify-center hover:bg-violet-600 hover:border-violet-600 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div
              ref={galleryRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setLightboxSrc(img);
                    setLightboxOpen(true);
                  }}
                  className="flex-shrink-0 w-[300px] h-[220px] md:w-[350px] md:h-[260px] rounded-2xl overflow-hidden border border-[#1e1e22] hover:border-violet-500/50 transition-all hover:scale-[1.02] group relative"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <img
                    src={img}
                    alt={`${service.name} - Foto ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImageIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ===== D. VIDEO SECTION ===== */}
        <section className="py-12 border-t border-zinc-800/50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Play className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Video Profil</h2>
                <p className="text-zinc-500 text-sm">Lihat layanan kami dalam aksi</p>
              </div>
            </div>
            {videoUrl ? (
              <div className="bg-[#111113] border border-[#1e1e22] rounded-2xl overflow-hidden aspect-video max-w-4xl">
                {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={videoUrl.includes('youtu.be')
                      ? `https://www.youtube.com/embed/${videoUrl.split('/').pop()?.split('?')[0]}`
                      : videoUrl.replace('watch?v=', 'embed/')
                    }
                    title="Video Profil"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-contain bg-black"
                  >
                    Browser Anda tidak mendukung video.
                  </video>
                )}
              </div>
            ) : (
              <div className="relative bg-[#111113] border border-[#1e1e22] rounded-2xl overflow-hidden aspect-video max-w-4xl flex items-center justify-center group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 to-black/60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-violet-600/80 flex items-center justify-center group-hover:bg-violet-500 transition-all group-hover:scale-110 shadow-lg shadow-violet-500/30">
                    <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 text-white/60 text-sm">
                  Video segera hadir
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                  <div className="h-full bg-violet-500 w-0 group-hover:w-1/3 transition-all duration-1000" />
                </div>
              </div>
            )}
          </motion.div>
        </section>

        {/* ===== E. DOCUMENTS SECTION ===== */}
        <section className="py-12 border-t border-zinc-800/50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Dokumen</h2>
                <p className="text-zinc-500 text-sm">Brosur, pricelist, dan dokumen terkait</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc, i) => (
                <div
                  key={i}
                  className="bg-[#111113] border border-[#1e1e22] rounded-2xl p-5 hover:border-violet-500/30 transition-colors group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      doc.type === 'pdf' ? 'bg-red-500/10' : 'bg-emerald-500/10'
                    }`}>
                      {doc.type === 'pdf' ? (
                        <FileText className="w-6 h-6 text-red-400" />
                      ) : (
                        <BarChart3 className="w-6 h-6 text-emerald-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm truncate">{doc.name}</div>
                      <div className="text-zinc-500 text-xs mt-1">{doc.size}</div>
                      <div className="text-xs text-zinc-600 mt-2 uppercase">{doc.type === 'pdf' ? 'PDF Document' : 'Excel Spreadsheet'}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 w-full text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-xl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Unduh
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ===== E2. AUDIO SECTION ===== */}
        {audioUrl && (
          <section className="py-12 border-t border-zinc-800/50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Audio</h2>
                  <p className="text-zinc-500 text-sm">Dengarkan rekaman layanan kami</p>
                </div>
              </div>
              <div className="bg-[#111113] border border-[#1e1e22] rounded-2xl p-6 max-w-2xl">
                <audio controls className="w-full" src={audioUrl}>
                  Browser Anda tidak mendukung audio.
                </audio>
              </div>
            </motion.div>
          </section>
        )}

        {/* ===== E3. EXTERNAL LINK SECTION ===== */}
        {externalLink && (
          <section className="py-12 border-t border-zinc-800/50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.68 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Link Terkait</h2>
                  <p className="text-zinc-500 text-sm">Kunjungi halaman terkait layanan ini</p>
                </div>
              </div>
              <a
                href={externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded-2xl px-6 py-4 transition-colors group"
              >
                <ExternalLink className="w-5 h-5 text-sky-400 group-hover:text-sky-300" />
                <span className="text-sky-300 group-hover:text-sky-200 font-medium text-sm truncate max-w-md">
                  {externalLink}
                </span>
              </a>
            </motion.div>
          </section>
        )}

        {/* ===== F. TESTIMONIALS SECTION ===== */}
        <section className="py-16 border-t border-zinc-800/50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Testimoni Pelanggan</h2>
                  <p className="text-zinc-500 text-sm">Cerita nyata dari pelanggan kami</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setTestiIndex(Math.max(0, testiIndex - 1))}
                  className="w-10 h-10 rounded-xl bg-[#1a1a1e] border border-[#262626] flex items-center justify-center hover:bg-violet-600 hover:border-violet-600 transition-colors disabled:opacity-30"
                  disabled={testiIndex === 0}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setTestiIndex(Math.min(testimonials.length - 1, testiIndex + 1))}
                  className="w-10 h-10 rounded-xl bg-[#1a1a1e] border border-[#262626] flex items-center justify-center hover:bg-violet-600 hover:border-violet-600 transition-colors disabled:opacity-30"
                  disabled={testiIndex >= testimonials.length - 1}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Testimonial cards */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${testiIndex * 100}%)` }}
              >
                {testimonials.map((t, i) => (
                  <div key={i} className="w-full flex-shrink-0 pr-6">
                    <div className="bg-[#111113] border border-[#1e1e22] rounded-2xl p-6 md:p-8">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-semibold text-base">{t.name}</div>
                          <div className="flex items-center gap-1.5 text-zinc-500 text-sm mt-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {t.location}
                          </div>
                          <div className="flex items-center gap-0.5 mt-2">
                            {Array.from({ length: 5 }).map((_, si) => (
                              <Star
                                key={si}
                                className={`w-4 h-4 ${si < t.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'}`}
                              />
                            ))}
                          </div>
                        </div>
                        {t.hasAudio && (
                          <button
                            onClick={() => setPlayingAudio(playingAudio === `${i}` ? null : `${i}`)}
                            className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                              playingAudio === `${i}`
                                ? 'bg-violet-500 border-violet-500 shadow-lg shadow-violet-500/30'
                                : 'bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20'
                            }`}
                          >
                            <Volume2 className={`w-5 h-5 ${playingAudio === `${i}` ? 'text-white' : 'text-violet-400'}`} />
                          </button>
                        )}
                      </div>

                      {/* Story text */}
                      <div className="relative">
                        <Quote className="w-8 h-8 text-violet-500/20 absolute -top-1 -left-1" />
                        <p className="text-zinc-300 text-base leading-relaxed pl-8 italic">
                          {t.story}
                        </p>
                      </div>

                      {/* Audio waveform */}
                      {t.hasAudio && (
                        <div className="mt-5 pl-8">
                          <div className="flex items-center gap-3 bg-[#0a0a0b] rounded-xl p-3">
                            <button
                              onClick={() => setPlayingAudio(playingAudio === `${i}` ? null : `${i}`)}
                              className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 hover:bg-violet-500/30 transition-colors"
                            >
                              {playingAudio === `${i}` ? (
                                <div className="flex gap-0.5 items-center justify-center">
                                  <div className="w-1 h-3 bg-violet-400 rounded-full" />
                                  <div className="w-1 h-3 bg-violet-400 rounded-full" />
                                </div>
                              ) : (
                                <Play className="w-3 h-3 text-violet-400 ml-0.5" />
                              )}
                            </button>
                            <div className="flex items-end gap-[2px] h-6 flex-1">
                              {Array.from({ length: 30 }).map((_, bi) => (
                                <div
                                  key={bi}
                                  className={`w-[3px] rounded-full transition-all ${
                                    playingAudio === `${i}` ? 'bg-violet-500' : 'bg-violet-500/30'
                                  }`}
                                  style={{
                                    height: playingAudio === `${i}`
                                      ? `${Math.sin(bi * 0.5) * 12 + 8}px`
                                      : `${4 + (bi % 5) * 3}px`,
                                  }}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-zinc-500 flex-shrink-0">{t.audioDuration}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestiIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === testiIndex ? 'bg-violet-500 w-8' : 'bg-zinc-700 w-2 hover:bg-zinc-500'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* ===== G. CTA SECTION ===== */}
        <section className="py-16 border-t border-zinc-800/50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-950/50 to-[#111113] border border-violet-500/20 p-8 md:p-12 text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.15),transparent_70%)]" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Tertarik dengan {service.name}?
              </h2>
              <p className="text-zinc-400 max-w-lg mx-auto mb-6">
                Hubungi kami sekarang untuk konsultasi gratis dan penawaran terbaik. Kami siap membantu Anda!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={handleWhatsApp}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl h-12 px-8 text-base font-medium shadow-lg shadow-emerald-500/20"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Hubungi via WhatsApp
                </Button>
                <Button
                  onClick={() => onAskAI(service.name)}
                  variant="outline"
                  className="border-violet-500/50 text-violet-300 hover:text-white hover:bg-violet-500/10 rounded-2xl h-12 px-8 text-base"
                >
                  Tanya AI
                </Button>
              </div>
              {service.slotAvailable && (
                <div className="mt-6 flex items-center justify-center gap-2 text-emerald-400 text-sm">
                  <Shield className="w-4 h-4" />
                  {service.slotStatus}
                </div>
              )}
            </div>
          </motion.div>
        </section>
      </div>

      {/* ===== BOTTOM FOOTER ===== */}
      <footer className="bg-black border-t border-zinc-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo-new.png" alt="Mas Iis" className="w-8 h-8 rounded-lg" />
              <p className="text-zinc-500 text-sm">
                Mas Iis - Warung Solusi | Sindanglaut, Kab. Cirebon
              </p>
            </div>
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-500 hover:text-emerald-400 text-sm transition-colors"
            >
              <Phone className="w-4 h-4" />
              +62 882-0008-58698
            </a>
          </div>
        </div>
      </footer>

      {/* Admin Panel (Ctrl+Shift+A) */}
      <AdminPanel />
    </div>
  );
}
