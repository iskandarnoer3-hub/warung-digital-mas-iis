'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Eye, Gift, Monitor, GraduationCap, Shirt, Palette, PartyPopper, Globe, BarChart3, Paintbrush, Rabbit, Wrench, ArrowRight } from 'lucide-react';
import { FALLBACK_SERVICES } from '@/data/fallback-services';

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  priceMax: number;
  shortDesc: string;
  bonus?: string;
  slug: string;
  imageUrl?: string;
  [key: string]: unknown;
}

const categoryIconComponents: Record<string, React.ReactNode> = {
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

const categoryDotColors: Record<string, string> = {
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

// Service-specific card images by slug for more relevant visuals
const serviceImages: Record<string, string> = {
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

// Fallback category images
const categoryImages: Record<string, string> = {
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

const categories = [
  'Semua',
  'Elektronik',
  'Pendidikan',
  'Fashion',
  'Digital',
  'Event',
  'IT',
  'Konsultan',
  'Seni',
  'Peternakan',
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID').format(price);
}

interface Props {
  onSelectService?: (id: string) => void;
}

export default function ServicesSection({ onSelectService }: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState('Semua');

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const json = await res.json();
          const data = json.data ?? json;
          if (Array.isArray(data) && data.length > 0) {
            setServices(data);
            return;
          }
        }
      } catch {
        // API failed, use fallback
      }
      // Use fallback data when API fails or returns empty
      setServices(FALLBACK_SERVICES as unknown as Service[]);
    }
    fetchServices();
  }, []);

  const filteredServices =
    activeCategory === 'Semua'
      ? services
      : services.filter((s) => s.category === activeCategory);

  const handleTanyaAI = (serviceName: string) => {
    const chatSection = document.querySelector('#chat');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth' });
    }
    window.dispatchEvent(
      new CustomEvent('ask-ai', { detail: `${serviceName} berapa?` })
    );
  };

  return (
    <section
      id="jasa"
      className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          17 Jasa Lengkap
        </h2>
        <p className="text-zinc-400 max-w-lg mx-auto">
          Dari servis laptop sampai hias taman, semua ada. Klik kartu untuk melihat halaman detail lengkap.
        </p>
      </div>

      <Tabs
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="w-full"
      >
        <div className="flex justify-center mb-8">
          <TabsList className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-1 flex-wrap h-auto gap-1 max-w-full overflow-x-auto">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="rounded-lg data-[state=active]:bg-violet-600 data-[state=active]:text-white text-zinc-400 text-xs sm:text-sm px-2 sm:px-3 py-1.5"
              >
                {cat !== 'Semua' && (
                  <span className={`mr-1.5 inline-block w-2 h-2 rounded-full ${categoryDotColors[cat] || 'bg-zinc-500'}`} />
                )}
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeCategory}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredServices.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Card className="bg-[#111113] border-zinc-800 rounded-2xl hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300 py-0 gap-0 group overflow-hidden">
                  {/* Card image */}
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={serviceImages[service.slug] || categoryImages[service.category] || categoryImages['Elektronik']}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent" />
                    <Badge
                      variant="secondary"
                      className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-zinc-300 text-[10px] px-1.5 py-0.5 border-0"
                    >
                      {service.category}
                    </Badge>
                  </div>

                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-violet-400">
                        {categoryIconComponents[service.category] || <Wrench className="w-4 h-4" />}
                      </span>
                      <CardTitle className="text-white text-base font-semibold line-clamp-1">
                        {service.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-1 pb-2">
                    <p className="text-violet-400 text-sm font-medium mb-2">
                      Rp {formatPrice(service.price)} - Rp{' '}
                      {formatPrice(service.priceMax)}
                    </p>
                    <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">
                      {service.shortDesc}
                    </p>
                    {service.bonus && (
                      <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1">
                        <Gift className="w-3 h-3" /> {service.bonus}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-2 gap-2">
                    <Button
                      onClick={() =>
                        onSelectService?.(service.id)
                      }
                      className="flex-1 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm h-9"
                    >
                      <Eye className="size-4 mr-1.5" />
                      Lihat Detail
                      <ArrowRight className="size-3.5 ml-1" />
                    </Button>
                    <Button
                      onClick={() => handleTanyaAI(service.name)}
                      variant="ghost"
                      className="flex-1 text-zinc-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-xl text-sm h-9"
                    >
                      <MessageCircle className="size-4 mr-1.5" />
                      Tanya AI
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-500">
                Belum ada jasa di kategori ini
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
