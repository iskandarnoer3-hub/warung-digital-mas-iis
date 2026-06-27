'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  X,
  Plus,
  Trash2,
  Edit3,
  Save,
  RefreshCw,
  FileText,
  Layout,
  Settings,
  Gift,
  ImagePlus,
  Upload,
  Lock,
  Eye,
  EyeOff,
  Monitor,
  Camera,
  Video,
  Music,
  Globe,
  Home,
  Image as ImageIcon,
  FolderOpen,
  Star,
  Play,
  Mic,
  ChevronDown,
  ChevronUp,
  Link,
  ExternalLink,
  FileUp,
  BookOpen,
} from 'lucide-react';

// Admin password
const ADMIN_PASSWORD = 'Nurmuhamad3@';

// ====== INTERFACES ======
interface ServiceImage {
  id: string;
  serviceId: string;
  url: string;
  caption: string;
  type: string;
  order: number;
  createdAt: string;
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
  landingPage?: LandingPage;
  images?: ServiceImage[];
  testimonials?: Testimonial[];
}

interface Testimonial {
  id: string;
  serviceId: string;
  name: string;
  location: string;
  photoUrl: string;
  rating: number;
  text: string;
  audioUrl: string;
  order: number;
  active: boolean;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  published: boolean;
  createdAt: string;
}

interface LandingPage {
  id: string;
  serviceId: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  sections: string;
  active: boolean;
}

interface SiteConfigMap {
  [key: string]: string;
}

// ====== CONSTANTS ======
const CATEGORIES = [
  'Elektronik', 'Pendidikan', 'Fashion', 'Digital', 'Event', 'IT', 'Konsultan', 'Seni', 'Peternakan',
];

const CATEGORY_ICONS: Record<string, string> = {
  Elektronik: '\uD83D\uDCBB', Pendidikan: '\uD83C\uDF93', Fashion: '\uD83D\uDC54', Digital: '\uD83C\uDFA8',
  Event: '\uD83C\uDF89', IT: '\uD83C\uDF10', Konsultan: '\uD83D\uDCCA', Seni: '\uD83D\uDD8C\uFE0F', Peternakan: '\uD83D\uDC10',
};

const emptyService: Omit<Service, 'id' | 'landingPage' | 'images' | 'testimonials'> = {
  name: '', slug: '', category: 'Elektronik', shortDesc: '', detailDesc: '',
  price: 0, priceMax: 0, benefit1: '', benefit2: '', benefit3: '', benefit4: '', benefit5: '',
  waText: '', imageUrl: '', heroImageUrl: '', videoUrl: '', audioUrl: '', externalLink: '', bonus: '',
  slotStatus: 'Slot Tersedia', slotAvailable: true, active: true, order: 0,
};

const emptyArticle: Omit<Article, 'id' | 'createdAt'> = {
  title: '', slug: '', excerpt: '', content: '', imageUrl: '', published: false,
};

// ====== MAIN ADMIN PANEL COMPONENT ======
export default function AdminPanel() {
  // Core state
  const [open, setOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Data state
  const [services, setServices] = useState<Service[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfigMap>({});

  // Editing state
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [newService, setNewService] = useState(emptyService);
  const [newArticle, setNewArticle] = useState(emptyArticle);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Tab / modal state
  const [activeTab, setActiveTab] = useState('services');
  const [managingImagesFor, setManagingImagesFor] = useState<Service | null>(null);

  // Page-aware context (set via custom event from service-full-page.tsx)
  const [currentContext, setCurrentContext] = useState<{
    page: 'home' | 'service';
    serviceId?: string;
    serviceSlug?: string;
    serviceName?: string;
  }>({ page: 'home' });

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const settingsHeroFileInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  // ====== DATA LOADING ======
  const loadData = useCallback(async () => {
    try {
      // CRITICAL: cache: 'no-store' to prevent stale data after upload
      const [svcRes, artRes, cfgRes] = await Promise.all([
        fetch('/api/services', { cache: 'no-store' }),
        fetch('/api/articles', { cache: 'no-store' }),
        fetch('/api/site-config', { cache: 'no-store' }),
      ]);
      const svcData = await svcRes.json();
      const artData = await artRes.json();
      const cfgData = await cfgRes.json();
      if (svcData.success) setServices(svcData.data);
      if (artData.success) setArticles(artData.data);
      if (cfgData.success) setSiteConfig(cfgData.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  }, []);

  // ====== KEYBOARD SHORTCUT ======
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setOpen((prev) => {
          if (!prev) {
            setTimeout(() => { loadData(); }, 0);
          }
          return !prev;
        });
        if (open) {
          setAuthenticated(false);
          setPasswordInput('');
          setPasswordError(false);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [loadData, open]);

  // ====== LISTEN FOR CONTEXT EVENTS FROM SERVICE-FULL-PAGE ======
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setCurrentContext(detail);
      }
    };
    window.addEventListener('admin-set-context', handler);
    return () => window.removeEventListener('admin-set-context', handler);
  }, []);

  // ====== AUTH ======
  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  // ====== SERVICE CRUD ======
  const saveService = async (svc: Service | typeof emptyService, isNew: boolean) => {
    setSaving(true);
    try {
      const url = isNew ? '/api/services' : `/api/services/${(svc as Service).id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(svc),
      });
      const data = await res.json();
      if (data.success) {
        await loadData();
        if (isNew) setNewService(emptyService);
        else setEditingService(null);
      }
    } catch (err) {
      console.error('Save error:', err);
    }
    setSaving(false);
  };

  const deleteService = async (id: string) => {
    if (!confirm('Hapus jasa ini? Semua gambar juga ikut terhapus.')) return;
    try {
      await fetch(`/api/services/${id}`, { method: 'DELETE' });
      await loadData();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // ====== ARTICLE CRUD ======
  const saveArticle = async (art: Article | typeof emptyArticle, isNew: boolean) => {
    setSaving(true);
    try {
      const url = isNew ? '/api/articles' : `/api/articles/${(art as Article).id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(art),
      });
      const data = await res.json();
      if (data.success) {
        await loadData();
        if (isNew) setNewArticle(emptyArticle);
        else setEditingArticle(null);
      }
    } catch (err) {
      console.error('Save error:', err);
    }
    setSaving(false);
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Hapus artikel ini?')) return;
    try {
      await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      await loadData();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // ====== IMAGE HANDLERS ======
  const handleImageUpload = async (serviceId: string, file: File, type: string = 'gallery', caption: string = '') => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('serviceId', serviceId);

    try {
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        alert('Upload gagal: ' + uploadData.error);
        return;
      }

      const imgRes = await fetch(`/api/services/${serviceId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: uploadData.data.url, caption, type, order: 0 }),
      });
      const imgData = await imgRes.json();
      if (imgData.success) {
        if (managingImagesFor) {
          setManagingImagesFor({ ...managingImagesFor });
        }
        await loadData();
      }
    } catch (err) {
      console.error('Image upload error:', err);
      alert('Upload gagal');
    }
    setUploading(false);
  };

  const handleImageDelete = async (serviceId: string, imageId: string) => {
    if (!confirm('Hapus gambar ini?')) return;
    try {
      await fetch(`/api/services/${serviceId}/images/${imageId}`, { method: 'DELETE' });
      if (managingImagesFor) {
        setManagingImagesFor({ ...managingImagesFor });
      }
      await loadData();
    } catch (err) {
      console.error('Image delete error:', err);
    }
  };

  const handleSetHeroImage = async (serviceId: string, imageUrl: string) => {
    try {
      const res = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroImageUrl: imageUrl }),
      });
      const data = await res.json();
      if (data.success) {
        await loadData();
      }
    } catch (err) {
      console.error('Set hero image error:', err);
    }
  };

  // ====== FILE UPLOAD HELPER ======
  const uploadFile = async (file: File, serviceId?: string): Promise<string | null> => {
    try {
      // Compress image client-side BEFORE upload
      // This reduces file size by ~70-90% and avoids Vercel 4.5MB body limit
      let fileToUpload = file;
      if (file.type.startsWith('image/')) {
        setUploading(true);
        console.log(`[upload] Original: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        const { compressImage } = await import('@/lib/compress-image');
        fileToUpload = await compressImage(file, {
          targetSizeMB: 1.2,
          maxWidth: 1920,
          maxHeight: 1080,
          initialQuality: 0.85,
        });
        setUploading(false);
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);
      if (serviceId) formData.append('serviceId', serviceId);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        console.log('[upload] ✓ Success, got data URL');
        return data.data.url;
      } else {
        console.error('[upload] Server returned error:', data.error);
        alert('Upload gagal: ' + data.error);
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload gagal: ' + (err instanceof Error ? err.message : 'unknown error'));
    }
    return null;
  };

  // ====== SITE CONFIG ======
  const saveSiteConfig = async (key: string, value: string) => {
    try {
      console.log(`[site-config] Saving key="${key}" valueLength=${value.length}`);
      const res = await fetch('/api/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json();
      if (data.success) {
        console.log(`[site-config] ✓ Saved key="${key}"`);
        // Update local state IMMEDIATELY + reload from DB
        setSiteConfig(prev => ({ ...prev, [key]: value }));
        await loadData();
      } else {
        console.error(`[site-config] ✗ Save failed:`, data.error);
        alert('Gagal menyimpan: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Save config error:', err);
      alert('Gagal menyimpan: ' + (err instanceof Error ? err.message : 'Network error'));
    }
  };

  const formatPrice = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  // ====== CONTEXT-AWARE SERVICE ======
  const contextService = currentContext.serviceId
    ? services.find(s => s.id === currentContext.serviceId)
    : null;

  // ====== RENDER GATES ======
  if (!open) return null;

  // ====== PASSWORD GATE ======
  if (!authenticated) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center">
        <div className="w-full max-w-sm mx-4 bg-[#111113] border border-[#262626] rounded-2xl p-6 shadow-2xl">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold text-white">Admin Panel</h2>
              <p className="text-xs text-zinc-500 mt-1">Masukkan password untuk mengakses</p>
            </div>
            <div className="w-full">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
                  placeholder="Password admin..."
                  className={`bg-[#0a0a0b] border-[#262626] text-white pr-10 ${passwordError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-400 text-xs mt-2">Password salah!</p>
              )}
            </div>
            <div className="flex gap-2 w-full">
              <Button
                onClick={handleLogin}
                className="flex-1 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white"
              >
                <Lock className="w-4 h-4 mr-2" />
                Masuk
              </Button>
              <Button
                variant="outline"
                onClick={() => { setOpen(false); setPasswordInput(''); setPasswordError(false); }}
                className="border-[#262626] text-zinc-400"
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ====== IMAGE MANAGER MODAL ======
  if (managingImagesFor) {
    const svc = services.find(s => s.id === managingImagesFor.id) || managingImagesFor;
    const images = svc.images || [];
    const heroImages = images.filter((img: ServiceImage) => img.type === 'hero');
    const galleryImages = images.filter((img: ServiceImage) => img.type === 'gallery' || !img.type);
    const documentImages = images.filter((img: ServiceImage) => img.type === 'document');

    return (
      <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8">
        <div className="w-full max-w-5xl mx-4 bg-[#111113] border border-[#262626] rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-[#0a0a0b] border-b border-[#262626] px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
                <ImagePlus className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Kelola Gambar</h2>
                <p className="text-xs text-zinc-500">{svc.name}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setManagingImagesFor(null)} className="text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Hero Image Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Hero Image</h3>
                <Badge variant="outline" className="text-[10px] border-amber-500/50 text-amber-400">Banner utama</Badge>
              </div>
              {svc.heroImageUrl ? (
                <div className="relative group rounded-xl overflow-hidden border border-amber-500/30 max-w-2xl">
                  <img src={svc.heroImageUrl} alt="Hero" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 justify-center">
                    <Button variant="destructive" size="sm" onClick={async () => {
                      await fetch(`/api/services/${svc.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ heroImageUrl: '' }),
                      });
                      await loadData();
                      if (managingImagesFor) setManagingImagesFor({ ...managingImagesFor });
                    }} className="bg-red-600 hover:bg-red-500 text-white">
                      <Trash2 className="w-4 h-4 mr-1" /> Hapus Hero
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-amber-500/80 text-white border-0 text-[10px]">Hero</Badge>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#262626] hover:border-amber-500/50 rounded-xl p-6 text-center max-w-2xl">
                  <p className="text-zinc-500 text-sm">Belum ada hero image</p>
                </div>
              )}
              <div className="mt-2 flex gap-2">
                <input
                  ref={heroFileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadFile(file, svc.id);
                      if (url) {
                        await fetch(`/api/services/${svc.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ heroImageUrl: url }),
                        });
                        await loadData();
                        if (managingImagesFor) setManagingImagesFor({ ...managingImagesFor });
                      }
                      e.target.value = '';
                    }
                  }}
                />
                <Button size="sm" variant="outline" onClick={() => heroFileInputRef.current?.click()} className="border-[#262626] text-zinc-400 hover:text-amber-400">
                  <Upload className="w-3 h-3 mr-1" /> Upload Hero
                </Button>
              </div>
            </div>

            <Separator className="bg-[#262626]" />

            {/* Gallery Upload */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-semibold text-white">Galeri</h3>
                <Badge variant="outline" className="text-[10px] border-violet-500/50 text-violet-400">{galleryImages.length} gambar</Badge>
              </div>
              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(svc.id, file, 'gallery');
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-[#262626] hover:border-violet-500/50 rounded-xl p-6 flex flex-col items-center gap-3 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                    <Upload className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-zinc-300 text-sm font-medium">{uploading ? 'Mengupload...' : 'Klik untuk upload gambar galeri'}</p>
                    <p className="text-zinc-500 text-xs mt-1">JPEG, PNG, GIF, WebP. Maks 5MB</p>
                  </div>
                </button>
              </div>

              {/* Gallery Image Grid */}
              {galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {galleryImages.map((img: ServiceImage) => (
                    <div key={img.id} className="relative group rounded-xl overflow-hidden border border-[#262626]">
                      <img src={img.url} alt={img.caption || 'Gallery image'} className="w-full h-36 object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetHeroImage(svc.id, img.url)}
                          className="bg-amber-600/80 hover:bg-amber-500 text-white border-0 h-7 text-xs px-2"
                        >
                          <Star className="w-3 h-3 mr-1" /> Hero
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleImageDelete(svc.id, img.id)}
                          className="bg-red-600 hover:bg-red-500 text-white h-7 text-xs px-2"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-zinc-500">
                  <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Belum ada gambar galeri</p>
                </div>
              )}
            </div>

            <Separator className="bg-[#262626]" />

            {/* Document Images */}
            {documentImages.length > 0 && (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-semibold text-white">Dokumen</h3>
                    <Badge variant="outline" className="text-[10px] border-emerald-500/50 text-emerald-400">{documentImages.length}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {documentImages.map((img: ServiceImage) => (
                      <div key={img.id} className="relative group rounded-xl overflow-hidden border border-[#262626]">
                        <img src={img.url} alt={img.caption || 'Document'} className="w-full h-36 object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="destructive" size="sm" onClick={() => handleImageDelete(svc.id, img.id)} className="bg-red-600 hover:bg-red-500 text-white">
                            <Trash2 className="w-4 h-4 mr-1" /> Hapus
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator className="bg-[#262626]" />
              </>
            )}

            {/* Video & Audio URLs */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Video className="w-4 h-4 text-pink-400" />
                <h3 className="text-sm font-semibold text-white">Video & Audio</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-zinc-400 text-xs">Video URL (YouTube / embed)</Label>
                  <Input
                    value={svc.videoUrl || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Optimistic update
                      const updatedList = services.map(s => s.id === svc.id ? { ...s, videoUrl: val } : s);
                      setServices(updatedList);
                    }}
                    onBlur={async () => {
                      const currentSvc = services.find(s => s.id === svc.id);
                      if (currentSvc) {
                        await fetch(`/api/services/${svc.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ videoUrl: currentSvc.videoUrl }),
                        });
                      }
                    }}
                    placeholder="https://youtube.com/watch?v=..."
                    className="bg-[#0a0a0b] border-[#262626] text-white text-sm mt-1"
                  />
                </div>
                <div>
                  <Label className="text-zinc-400 text-xs">Audio URL (MP3 / upload)</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={svc.audioUrl || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const updatedList = services.map(s => s.id === svc.id ? { ...s, audioUrl: val } : s);
                        setServices(updatedList);
                      }}
                      onBlur={async () => {
                        const currentSvc = services.find(s => s.id === svc.id);
                        if (currentSvc) {
                          await fetch(`/api/services/${svc.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ audioUrl: currentSvc.audioUrl }),
                          });
                        }
                      }}
                      placeholder="https://...mp3"
                      className="bg-[#0a0a0b] border-[#262626] text-white text-sm flex-1"
                    />
                    <input
                      ref={audioFileInputRef}
                      type="file"
                      accept="audio/mpeg,audio/wav,audio/ogg,audio/mp3"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadFile(file, svc.id);
                          if (url) {
                            await fetch(`/api/services/${svc.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ audioUrl: url }),
                            });
                            await loadData();
                            if (managingImagesFor) setManagingImagesFor({ ...managingImagesFor });
                          }
                          e.target.value = '';
                        }
                      }}
                    />
                    <Button size="sm" variant="outline" onClick={() => audioFileInputRef.current?.click()} className="border-[#262626] text-zinc-400 hover:text-pink-400">
                      <Upload className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ====== MAIN ADMIN PANEL ======
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8">
      <div className="w-full max-w-6xl mx-4 bg-[#111113] border border-[#262626] rounded-2xl shadow-2xl">
        {/* Admin Header */}
        <div className="sticky top-0 z-10 bg-[#0a0a0b] border-b border-[#262626] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Admin Panel</h2>
              <p className="text-xs text-zinc-500">Ctrl+Shift+A untuk buka/tutup</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Context Badge */}
            {currentContext.page === 'service' && currentContext.serviceName && (
              <Badge className="bg-violet-500/20 text-violet-400 border border-violet-500/30 mr-2">
                <Monitor className="w-3 h-3 mr-1" />
                {currentContext.serviceName}
              </Badge>
            )}
            {currentContext.page === 'home' && (
              <Badge className="bg-zinc-500/20 text-zinc-400 border border-zinc-500/30 mr-2">
                <Home className="w-3 h-3 mr-1" />
                Beranda
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={loadData} className="text-zinc-400 hover:text-white">
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setOpen(false); setAuthenticated(false); setPasswordInput(''); }}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="bg-[#1a1a1e] border border-[#262626] flex-wrap h-auto gap-1">
              <TabsTrigger value="services" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-xs sm:text-sm">
                <Layout className="w-4 h-4 mr-1" /> Jasa
              </TabsTrigger>
              <TabsTrigger value="konten" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-xs sm:text-sm">
                <BookOpen className="w-4 h-4 mr-1" /> Konten
              </TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-xs sm:text-sm">
                <Camera className="w-4 h-4 mr-1" /> Media
              </TabsTrigger>
              <TabsTrigger value="articles" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-xs sm:text-sm">
                <FileText className="w-4 h-4 mr-1" /> Artikel
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-xs sm:text-sm">
                <Settings className="w-4 h-4 mr-1" /> Pengaturan
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ===== TAB 1: JASA (Services) ===== */}
          <TabsContent value="services" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">Daftar Jasa ({services.length})</h3>
                <p className="text-zinc-500 text-xs">Kelola semua layanan yang tersedia</p>
              </div>
              <Button size="sm" onClick={() => setActiveTab('add-service')} className="bg-violet-600 hover:bg-violet-500 text-white">
                <Plus className="w-4 h-4 mr-1" /> Tambah Jasa
              </Button>
            </div>
            <ScrollArea className="max-h-[65vh]">
              <div className="space-y-3">
                {services.map((svc) => (
                  <Card key={svc.id} className="bg-[#1a1a1e] border-[#262626]">
                    <CardContent className="p-4">
                      {editingService?.id === svc.id ? (
                        <EditServiceForm
                          service={editingService}
                          setService={setEditingService}
                          onSave={() => saveService(editingService, false)}
                          onCancel={() => setEditingService(null)}
                          saving={saving}
                        />
                      ) : (
                        <div className="flex items-start gap-4">
                          <div className="text-2xl">{CATEGORY_ICONS[svc.category] || '\uD83D\uDCE6'}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-semibold text-white truncate">{svc.name}</span>
                              <Badge variant="outline" className="text-[10px] border-violet-500/50 text-violet-400">{svc.category}</Badge>
                              {svc.active ? (
                                <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-0">Aktif</Badge>
                              ) : (
                                <Badge className="text-[10px] bg-zinc-500/20 text-zinc-400 border-0">Nonaktif</Badge>
                              )}
                              {(svc.images?.length || 0) > 0 && (
                                <Badge className="text-[10px] bg-violet-500/20 text-violet-400 border-0">
                                  {svc.images?.length} gambar
                                </Badge>
                              )}
                              {svc.heroImageUrl && (
                                <Badge className="text-[10px] bg-amber-500/20 text-amber-400 border-0">Hero</Badge>
                              )}
                              {svc.videoUrl && (
                                <Badge className="text-[10px] bg-pink-500/20 text-pink-400 border-0">Video</Badge>
                              )}
                              {svc.audioUrl && (
                                <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-0">Audio</Badge>
                              )}
                            </div>
                            <p className="text-sm text-zinc-400 mb-1 truncate">{svc.shortDesc}</p>
                            <p className="text-sm text-violet-400 font-medium">
                              {formatPrice(svc.price)} - {formatPrice(svc.priceMax)}
                            </p>
                            {svc.bonus && (
                              <p className="text-xs text-emerald-400 mt-1">
                                <Gift className="w-3 h-3 inline mr-1" />{svc.bonus}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setManagingImagesFor(svc)}
                              className="text-zinc-400 hover:text-violet-400"
                              title="Kelola Gambar & Media"
                            >
                              <ImagePlus className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingService(svc)}
                              className="text-zinc-400 hover:text-violet-400"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteService(svc.id)}
                              className="text-zinc-400 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {services.length === 0 && (
                  <div className="text-center py-10 text-zinc-500">
                    <Layout className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p>Belum ada jasa</p>
                    <Button size="sm" onClick={() => setActiveTab('add-service')} className="mt-3 bg-violet-600 hover:bg-violet-500 text-white">
                      <Plus className="w-4 h-4 mr-1" /> Tambah Jasa Pertama
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Add Service Form (embedded in services tab) */}
            {activeTab === 'add-service' && (
              <div className="mt-6 border-t border-[#262626] pt-6">
                <Card className="bg-[#1a1a1e] border-[#262626]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Plus className="w-5 h-5 text-violet-400" /> Tambah Jasa Baru
                    </CardTitle>
                    <p className="text-sm text-zinc-400">Landing page otomatis dibuat saat jasa ditambahkan</p>
                  </CardHeader>
                  <CardContent>
                    <ServiceForm service={newService} setService={setNewService} onSave={() => saveService(newService, true)} saving={saving} />
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* ===== TAB 2: KONTEN (Content Management) ===== */}
          <TabsContent value="konten" className="p-6">
            <KontenManager
              services={services}
              onSetManagingImagesFor={setManagingImagesFor}
              uploadFile={uploadFile}
              uploading={uploading}
              setUploading={setUploading}
              loadData={loadData}
            />
          </TabsContent>

          {/* ===== TAB 3: MEDIA (Image/Media Management) ===== */}
          <TabsContent value="media" className="p-6">
            {currentContext.page === 'service' && contextService ? (
              /* Service-specific media management */
              <ServiceMediaManager
                service={contextService}
                onUpload={(file, type, caption) => handleImageUpload(contextService.id, file, type, caption)}
                onDeleteImage={(imageId) => handleImageDelete(contextService.id, imageId)}
                onSetHero={(url) => handleSetHeroImage(contextService.id, url)}
                onUpdateVideoUrl={async (url) => {
                  await fetch(`/api/services/${contextService.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ videoUrl: url }),
                  });
                  await loadData();
                }}
                onUpdateAudioUrl={async (url) => {
                  await fetch(`/api/services/${contextService.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ audioUrl: url }),
                  });
                  await loadData();
                }}
                onUploadFile={uploadFile}
                uploading={uploading}
                setUploading={setUploading}
              />
            ) : (
              /* General media management - show all services with media stats */
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-semibold mb-1">Manajemen Media</h3>
                  <p className="text-zinc-500 text-xs">Statistik media semua jasa. Klik untuk mengelola media jasa tertentu.</p>
                </div>

                {/* Service media stats grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {services.map((svc) => {
                    const imgCount = svc.images?.length || 0;
                    const galleryCount = svc.images?.filter(i => i.type === 'gallery' || !i.type).length || 0;
                    const hasVideo = !!svc.videoUrl;
                    const hasAudio = !!svc.audioUrl;
                    const hasHero = !!svc.heroImageUrl;
                    const hasLink = !!svc.externalLink;
                    const mediaCount = [hasVideo, hasAudio, hasHero, hasLink].filter(Boolean).length;
                    return (
                      <Card
                        key={svc.id}
                        className="bg-[#1a1a1e] border-[#262626] hover:border-violet-500/50 transition-colors cursor-pointer"
                        onClick={() => {
                          setCurrentContext({
                            page: 'service',
                            serviceId: svc.id,
                            serviceSlug: svc.slug,
                            serviceName: svc.name,
                          });
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="text-xl">{CATEGORY_ICONS[svc.category] || '📦'}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate">{svc.name}</p>
                              <Badge variant="outline" className="text-[10px] border-violet-500/50 text-violet-400 mt-0.5">{svc.category}</Badge>
                            </div>
                            <ImagePlus className="w-4 h-4 text-zinc-500" />
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Badge className="text-[10px] bg-violet-500/20 text-violet-400 border-0">
                              <Camera className="w-2.5 h-2.5 mr-0.5" />{galleryCount} foto
                            </Badge>
                            {hasHero && (
                              <Badge className="text-[10px] bg-amber-500/20 text-amber-400 border-0">Hero</Badge>
                            )}
                            {hasVideo && (
                              <Badge className="text-[10px] bg-pink-500/20 text-pink-400 border-0">
                                <Video className="w-2.5 h-2.5 mr-0.5" />Video
                              </Badge>
                            )}
                            {hasAudio && (
                              <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-0">
                                <Music className="w-2.5 h-2.5 mr-0.5" />Audio
                              </Badge>
                            )}
                            {hasLink && (
                              <Badge className="text-[10px] bg-sky-500/20 text-sky-400 border-0">
                                <ExternalLink className="w-2.5 h-2.5 mr-0.5" />Link
                              </Badge>
                            )}
                          </div>
                          {mediaCount === 0 && imgCount === 0 && (
                            <p className="text-zinc-600 text-[10px] mt-2">Belum ada media</p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* All images across all services */}
                <Separator className="bg-[#262626]" />
                <div>
                  <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-zinc-400" />
                    Semua Gambar ({services.reduce((acc, s) => acc + (s.images?.length || 0), 0)})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                    {services.flatMap(svc =>
                      (svc.images || []).map(img => (
                        <div key={img.id} className="relative group rounded-xl overflow-hidden border border-[#262626]">
                          <img src={img.url} alt={img.caption || ''} className="w-full h-32 object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                            <p className="text-white text-[10px] px-2 truncate max-w-full">{svc.name}</p>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleImageDelete(svc.id, img.id)}
                              className="bg-red-600 hover:bg-red-500 text-white h-6 text-[10px] px-2"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          {img.type === 'hero' && (
                            <div className="absolute top-1 left-1">
                              <Badge className="bg-amber-500/80 text-white border-0 text-[8px] h-4">Hero</Badge>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                    {services.reduce((acc, s) => acc + (s.images?.length || 0), 0) === 0 && (
                      <div className="col-span-full text-center py-10 text-zinc-500">
                        <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />
                        <p>Belum ada gambar di semua jasa</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ===== TAB 3: ARTIKEL (Articles) ===== */}
          <TabsContent value="articles" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">Artikel ({articles.length})</h3>
                <p className="text-zinc-500 text-xs">Kelola semua artikel blog</p>
              </div>
              <Button size="sm" onClick={() => setActiveTab('add-article')} className="bg-violet-600 hover:bg-violet-500 text-white">
                <Plus className="w-4 h-4 mr-1" /> Tulis Artikel
              </Button>
            </div>
            <ScrollArea className="max-h-[65vh]">
              <div className="space-y-3">
                {articles.map((art) => (
                  <Card key={art.id} className="bg-[#1a1a1e] border-[#262626]">
                    <CardContent className="p-4">
                      {editingArticle?.id === art.id ? (
                        <EditArticleForm
                          article={editingArticle}
                          setArticle={setEditingArticle}
                          onSave={() => saveArticle(editingArticle, false)}
                          onCancel={() => setEditingArticle(null)}
                          saving={saving}
                        />
                      ) : (
                        <div className="flex items-start gap-4">
                          {art.imageUrl ? (
                            <img src={art.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-[#0a0a0b] flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-zinc-500" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-white truncate">{art.title}</span>
                              {art.published ? (
                                <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-0">Published</Badge>
                              ) : (
                                <Badge className="text-[10px] bg-zinc-500/20 text-zinc-400 border-0">Draft</Badge>
                              )}
                            </div>
                            <p className="text-sm text-zinc-400 truncate">{art.excerpt}</p>
                            <p className="text-xs text-zinc-500 mt-1">{new Date(art.createdAt).toLocaleDateString('id-ID')}</p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button variant="ghost" size="sm" onClick={() => setEditingArticle(art)} className="text-zinc-400 hover:text-violet-400">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteArticle(art.id)} className="text-zinc-400 hover:text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {articles.length === 0 && (
                  <div className="text-center py-10 text-zinc-500">
                    <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p>Belum ada artikel</p>
                    <Button size="sm" onClick={() => setActiveTab('add-article')} className="mt-3 bg-violet-600 hover:bg-violet-500 text-white">
                      <Plus className="w-4 h-4 mr-1" /> Tulis Artikel Pertama
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Add Article Form (embedded) */}
            {activeTab === 'add-article' && (
              <div className="mt-6 border-t border-[#262626] pt-6">
                <Card className="bg-[#1a1a1e] border-[#262626]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-violet-400" /> Tulis Artikel Baru
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ArticleForm article={newArticle} setArticle={setNewArticle} onSave={() => saveArticle(newArticle, true)} saving={saving} />
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* ===== TAB 4: PENGATURAN (Settings) ===== */}
          <TabsContent value="settings" className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold">Pengaturan Situs</h3>
                <p className="text-zinc-500 text-xs">Konfigurasi global dan tampilan situs</p>
              </div>

              {/* Hero Image for Home Page */}
              <Card className="bg-[#1a1a1e] border-[#262626]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Home className="w-4 h-4 text-amber-400" />
                    Hero Image Beranda
                  </CardTitle>
                  <p className="text-xs text-zinc-500">Gambar banner utama halaman beranda</p>
                </CardHeader>
                <CardContent>
                  {siteConfig.hero_image ? (
                    <div className="relative group rounded-xl overflow-hidden border border-amber-500/30 mb-3 max-w-xl">
                      <img src={siteConfig.hero_image} alt="Hero" className="w-full h-40 object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="destructive" size="sm" onClick={() => saveSiteConfig('hero_image', '')} className="bg-red-600 hover:bg-red-500 text-white">
                          <Trash2 className="w-4 h-4 mr-1" /> Hapus Hero
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-[#262626] rounded-xl p-6 text-center max-w-xl mb-3">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                      <p className="text-zinc-500 text-sm">Belum ada hero image</p>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <input
                      ref={settingsHeroFileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploading(true);
                          const url = await uploadFile(file);
                          if (url) {
                            await saveSiteConfig('hero_image', url);
                          }
                          setUploading(false);
                          e.target.value = '';
                        }
                      }}
                    />
                    <Button size="sm" variant="outline" onClick={() => settingsHeroFileInputRef.current?.click()} disabled={uploading} className="border-[#262626] text-zinc-400 hover:text-amber-400">
                      <Upload className="w-3 h-3 mr-1" /> {uploading ? 'Mengupload...' : 'Upload Hero Image'}
                    </Button>
                    <span className="text-zinc-600 text-xs">atau</span>
                    <Input
                      placeholder="Paste URL gambar..."
                      value={siteConfig.hero_image || ''}
                      onChange={(e) => saveSiteConfig('hero_image', e.target.value)}
                      className="bg-[#0a0a0b] border-[#262626] text-white text-sm max-w-xs"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Site Settings Key-Value Editor */}
              <Card className="bg-[#1a1a1e] border-[#262626]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4 text-violet-400" />
                    Konfigurasi Lainnya
                  </CardTitle>
                  <p className="text-xs text-zinc-500">Edit pengaturan situs secara langsung</p>
                </CardHeader>
                <CardContent>
                  <SiteConfigEditor config={siteConfig} onSave={saveSiteConfig} />
                </CardContent>
              </Card>

              {/* Service Stats */}
              <Card className="bg-[#1a1a1e] border-[#262626]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    Statistik Situs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-[#0a0a0b] rounded-lg p-3 border border-[#262626]">
                      <p className="text-zinc-500 text-xs">Total Jasa</p>
                      <p className="text-white text-xl font-bold">{services.length}</p>
                    </div>
                    <div className="bg-[#0a0a0b] rounded-lg p-3 border border-[#262626]">
                      <p className="text-zinc-500 text-xs">Jasa Aktif</p>
                      <p className="text-emerald-400 text-xl font-bold">{services.filter(s => s.active).length}</p>
                    </div>
                    <div className="bg-[#0a0a0b] rounded-lg p-3 border border-[#262626]">
                      <p className="text-zinc-500 text-xs">Total Gambar</p>
                      <p className="text-violet-400 text-xl font-bold">{services.reduce((acc, s) => acc + (s.images?.length || 0), 0)}</p>
                    </div>
                    <div className="bg-[#0a0a0b] rounded-lg p-3 border border-[#262626]">
                      <p className="text-zinc-500 text-xs">Artikel</p>
                      <p className="text-pink-400 text-xl font-bold">{articles.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Hidden tabs for add forms (so they can be navigated to) */}
          <TabsContent value="add-service" className="p-6">
            <Card className="bg-[#1a1a1e] border-[#262626]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-violet-400" /> Tambah Jasa Baru
                </CardTitle>
                <p className="text-sm text-zinc-400">Landing page otomatis dibuat saat jasa ditambahkan</p>
              </CardHeader>
              <CardContent>
                <ServiceForm service={newService} setService={setNewService} onSave={() => saveService(newService, true)} saving={saving} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-article" className="p-6">
            <Card className="bg-[#1a1a1e] border-[#262626]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-violet-400" /> Tulis Artikel Baru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ArticleForm article={newArticle} setArticle={setNewArticle} onSave={() => saveArticle(newArticle, true)} saving={saving} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ====== SUB-COMPONENTS ======

// --- Service Form (for new service) ---
function ServiceForm({ service, setService, onSave, saving }: {
  service: any; setService: (s: any) => void; onSave: () => void; saving: boolean;
}) {
  const update = (field: string, value: any) => setService({ ...service, [field]: value });
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-zinc-300 text-sm">Nama Jasa *</Label>
          <Input value={service.name} onChange={(e) => update('name', e.target.value)} placeholder="Servis Laptop Premium" className="bg-[#0a0a0b] border-[#262626] text-white mt-1" />
        </div>
        <div>
          <Label className="text-zinc-300 text-sm">Kategori *</Label>
          <select value={service.category} onChange={(e) => update('category', e.target.value)} className="w-full mt-1 px-3 py-2 bg-[#0a0a0b] border border-[#262626] rounded-md text-white text-sm">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <Label className="text-zinc-300 text-sm">Deskripsi Singkat *</Label>
        <Input value={service.shortDesc} onChange={(e) => update('shortDesc', e.target.value)} placeholder="Perbaikan segala jenis kerusakan laptop" className="bg-[#0a0a0b] border-[#262626] text-white mt-1" />
      </div>
      <div>
        <Label className="text-zinc-300 text-sm">Deskripsi Detail</Label>
        <Textarea value={service.detailDesc} onChange={(e) => update('detailDesc', e.target.value)} placeholder="Detail lengkap layanan..." rows={3} className="bg-[#0a0a0b] border-[#262626] text-white mt-1" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-zinc-300 text-sm">Harga Mulai (Rp)</Label>
          <Input type="number" value={service.price} onChange={(e) => update('price', parseInt(e.target.value) || 0)} className="bg-[#0a0a0b] border-[#262626] text-white mt-1" />
        </div>
        <div>
          <Label className="text-zinc-300 text-sm">Harga Maks (Rp)</Label>
          <Input type="number" value={service.priceMax} onChange={(e) => update('priceMax', parseInt(e.target.value) || 0)} className="bg-[#0a0a0b] border-[#262626] text-white mt-1" />
        </div>
      </div>

      {/* Toggle for more fields */}
      <button
        onClick={() => setShowMore(!showMore)}
        className="flex items-center gap-1 text-violet-400 text-xs hover:text-violet-300 transition-colors"
      >
        {showMore ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {showMore ? 'Sembunyikan' : 'Tampilkan'} field lainnya (benefit, media, dll)
      </button>

      {showMore && (
        <>
          <Separator className="bg-[#262626]" />
          <p className="text-sm text-zinc-400 font-medium">Keunggulan / Benefit</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {['benefit1', 'benefit2', 'benefit3', 'benefit4', 'benefit5'].map((b, i) => (
              <div key={b}>
                <Label className="text-zinc-400 text-xs">Benefit {i + 1}</Label>
                <Input value={service[b]} onChange={(e) => update(b, e.target.value)} placeholder={`Benefit ${i + 1}...`} className="bg-[#0a0a0b] border-[#262626] text-white mt-1 text-sm" />
              </div>
            ))}
          </div>
          <Separator className="bg-[#262626]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-300 text-sm">Bonus</Label>
              <Input value={service.bonus} onChange={(e) => update('bonus', e.target.value)} placeholder="Free thermal paste" className="bg-[#0a0a0b] border-[#262626] text-white mt-1" />
            </div>
            <div>
              <Label className="text-zinc-300 text-sm">Teks WhatsApp</Label>
              <Input value={service.waText} onChange={(e) => update('waText', e.target.value)} placeholder="Halo Mas Iis, saya mau..." className="bg-[#0a0a0b] border-[#262626] text-white mt-1" />
            </div>
          </div>

          {/* Media URLs */}
          <Separator className="bg-[#262626]" />
          <p className="text-sm text-zinc-400 font-medium">Media</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-300 text-sm flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> Hero Image URL</Label>
              <Input value={service.heroImageUrl} onChange={(e) => update('heroImageUrl', e.target.value)} placeholder="https://..." className="bg-[#0a0a0b] border-[#262626] text-white mt-1 text-sm" />
            </div>
            <div>
              <Label className="text-zinc-300 text-sm flex items-center gap-1"><ImageIcon className="w-3 h-3 text-violet-400" /> Image URL (Thumbnail)</Label>
              <Input value={service.imageUrl} onChange={(e) => update('imageUrl', e.target.value)} placeholder="https://..." className="bg-[#0a0a0b] border-[#262626] text-white mt-1 text-sm" />
            </div>
            <div>
              <Label className="text-zinc-300 text-sm flex items-center gap-1"><Video className="w-3 h-3 text-pink-400" /> Video URL</Label>
              <Input value={service.videoUrl} onChange={(e) => update('videoUrl', e.target.value)} placeholder="https://youtube.com/..." className="bg-[#0a0a0b] border-[#262626] text-white mt-1 text-sm" />
            </div>
            <div>
              <Label className="text-zinc-300 text-sm flex items-center gap-1"><Music className="w-3 h-3 text-emerald-400" /> Audio URL</Label>
              <Input value={service.audioUrl} onChange={(e) => update('audioUrl', e.target.value)} placeholder="https://...mp3" className="bg-[#0a0a0b] border-[#262626] text-white mt-1 text-sm" />
            </div>
            <div>
              <Label className="text-zinc-300 text-sm flex items-center gap-1"><ExternalLink className="w-3 h-3 text-sky-400" /> Link Eksternal</Label>
              <Input value={service.externalLink} onChange={(e) => update('externalLink', e.target.value)} placeholder="https://example.com" className="bg-[#0a0a0b] border-[#262626] text-white mt-1 text-sm" />
            </div>
          </div>

          {/* Slot & Order */}
          <Separator className="bg-[#262626]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-300 text-sm">Status Slot</Label>
              <Input value={service.slotStatus} onChange={(e) => update('slotStatus', e.target.value)} placeholder="Slot Tersedia" className="bg-[#0a0a0b] border-[#262626] text-white mt-1" />
            </div>
            <div>
              <Label className="text-zinc-300 text-sm">Urutan</Label>
              <Input type="number" value={service.order} onChange={(e) => update('order', parseInt(e.target.value) || 0)} className="bg-[#0a0a0b] border-[#262626] text-white mt-1" />
            </div>
          </div>
        </>
      )}

      <div className="flex items-center gap-3">
        <Switch checked={service.active} onCheckedChange={(v) => update('active', v)} />
        <Label className="text-zinc-300">Aktifkan jasa ini</Label>
        <div className="flex-1" />
        <Switch checked={service.slotAvailable} onCheckedChange={(v) => update('slotAvailable', v)} />
        <Label className="text-zinc-300">Slot Tersedia</Label>
      </div>
      <Button onClick={onSave} disabled={saving || !service.name} className="w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white">
        <Save className="w-4 h-4 mr-2" />{saving ? 'Menyimpan...' : 'Simpan & Buat Landing Page'}
      </Button>
    </div>
  );
}

// --- Article Form (for new article) ---
function ArticleForm({ article, setArticle, onSave, saving }: {
  article: any; setArticle: (a: any) => void; onSave: () => void; saving: boolean;
}) {
  const update = (field: string, value: any) => setArticle({ ...article, [field]: value });

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-zinc-300 text-sm">Judul Artikel *</Label>
        <Input value={article.title} onChange={(e) => update('title', e.target.value)} placeholder="Tips Merawat Laptop Agar Awet" className="bg-[#0a0a0b] border-[#262626] text-white mt-1" />
      </div>
      <div>
        <Label className="text-zinc-300 text-sm">Ringkasan</Label>
        <Textarea value={article.excerpt} onChange={(e) => update('excerpt', e.target.value)} placeholder="Ringkasan singkat artikel..." rows={2} className="bg-[#0a0a0b] border-[#262626] text-white mt-1" />
      </div>
      <div>
        <Label className="text-zinc-300 text-sm">Konten Artikel</Label>
        <p className="text-xs text-zinc-500 mb-1">Gunakan HTML: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;</p>
        <Textarea value={article.content} onChange={(e) => update('content', e.target.value)} placeholder="<h2>Judul Bagian</h2><p>Paragraf isi...</p>" rows={10} className="bg-[#0a0a0b] border-[#262626] text-white mt-1 font-mono text-sm" />
      </div>
      <div>
        <Label className="text-zinc-300 text-sm">URL Gambar</Label>
        <Input value={article.imageUrl} onChange={(e) => update('imageUrl', e.target.value)} placeholder="https://example.com/image.jpg" className="bg-[#0a0a0b] border-[#262626] text-white mt-1" />
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={article.published} onCheckedChange={(v) => update('published', v)} />
        <Label className="text-zinc-300">Publish sekarang</Label>
      </div>
      <Button onClick={onSave} disabled={saving || !article.title} className="w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white">
        <Save className="w-4 h-4 mr-2" />{saving ? 'Menyimpan...' : 'Simpan Artikel'}
      </Button>
    </div>
  );
}

// --- Edit Service Form (inline) ---
function EditServiceForm({ service, setService, onSave, onCancel, saving }: {
  service: Service; setService: (s: Service) => void; onSave: () => void; onCancel: () => void; saving: boolean;
}) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-violet-400">Edit Jasa</span>
        <Button variant="ghost" size="sm" onClick={onCancel} className="text-zinc-400"><X className="w-4 h-4" /></Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label className="text-zinc-400 text-xs">Nama</Label>
          <Input value={service.name} onChange={(e) => setService({ ...service, name: e.target.value })} className="bg-[#0a0a0b] border-[#262626] text-white text-sm mt-1" />
        </div>
        <div>
          <Label className="text-zinc-400 text-xs">Kategori</Label>
          <select value={service.category} onChange={(e) => setService({ ...service, category: e.target.value })} className="w-full mt-1 px-3 py-2 bg-[#0a0a0b] border border-[#262626] rounded-md text-white text-sm">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <Label className="text-zinc-400 text-xs">Deskripsi Singkat</Label>
        <Input value={service.shortDesc} onChange={(e) => setService({ ...service, shortDesc: e.target.value })} className="bg-[#0a0a0b] border-[#262626] text-white text-sm mt-1" />
      </div>
      <div>
        <Label className="text-zinc-400 text-xs">Deskripsi Detail</Label>
        <Textarea value={service.detailDesc} onChange={(e) => setService({ ...service, detailDesc: e.target.value })} rows={3} className="bg-[#0a0a0b] border-[#262626] text-white text-sm mt-1" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-zinc-400 text-xs">Harga Mulai</Label>
          <Input type="number" value={service.price} onChange={(e) => setService({ ...service, price: parseInt(e.target.value) || 0 })} className="bg-[#0a0a0b] border-[#262626] text-white text-sm mt-1" />
        </div>
        <div>
          <Label className="text-zinc-400 text-xs">Harga Maks</Label>
          <Input type="number" value={service.priceMax} onChange={(e) => setService({ ...service, priceMax: parseInt(e.target.value) || 0 })} className="bg-[#0a0a0b] border-[#262626] text-white text-sm mt-1" />
        </div>
      </div>

      {/* Toggle for more fields */}
      <button
        onClick={() => setShowMore(!showMore)}
        className="flex items-center gap-1 text-violet-400 text-xs hover:text-violet-300 transition-colors"
      >
        {showMore ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {showMore ? 'Sembunyikan' : 'Tampilkan'} field lainnya
      </button>

      {showMore && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {['benefit1', 'benefit2', 'benefit3', 'benefit4', 'benefit5'].map((b, i) => (
              <div key={b}>
                <Label className="text-zinc-400 text-xs">B{i + 1}</Label>
                <Input value={(service as any)[b]} onChange={(e) => setService({ ...service, [b]: e.target.value })} className="bg-[#0a0a0b] border-[#262626] text-white text-xs mt-1" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-zinc-400 text-xs">Bonus</Label>
              <Input value={service.bonus} onChange={(e) => setService({ ...service, bonus: e.target.value })} className="bg-[#0a0a0b] border-[#262626] text-white text-sm mt-1" />
            </div>
            <div>
              <Label className="text-zinc-400 text-xs">Teks WA</Label>
              <Input value={service.waText} onChange={(e) => setService({ ...service, waText: e.target.value })} className="bg-[#0a0a0b] border-[#262626] text-white text-sm mt-1" />
            </div>
          </div>

          {/* Media URLs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-zinc-400 text-xs flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> Hero Image URL</Label>
              <Input value={service.heroImageUrl || ''} onChange={(e) => setService({ ...service, heroImageUrl: e.target.value })} placeholder="https://..." className="bg-[#0a0a0b] border-[#262626] text-white text-sm mt-1" />
            </div>
            <div>
              <Label className="text-zinc-400 text-xs flex items-center gap-1"><ImageIcon className="w-3 h-3 text-violet-400" /> Thumbnail URL</Label>
              <Input value={service.imageUrl || ''} onChange={(e) => setService({ ...service, imageUrl: e.target.value })} placeholder="https://..." className="bg-[#0a0a0b] border-[#262626] text-white text-sm mt-1" />
            </div>
            <div>
              <Label className="text-zinc-400 text-xs flex items-center gap-1"><Video className="w-3 h-3 text-pink-400" /> Video URL</Label>
              <Input value={service.videoUrl || ''} onChange={(e) => setService({ ...service, videoUrl: e.target.value })} placeholder="https://youtube.com/..." className="bg-[#0a0a0b] border-[#262626] text-white text-sm mt-1" />
            </div>
            <div>
              <Label className="text-zinc-400 text-xs flex items-center gap-1"><Music className="w-3 h-3 text-emerald-400" /> Audio URL</Label>
              <Input value={service.audioUrl || ''} onChange={(e) => setService({ ...service, audioUrl: e.target.value })} placeholder="https://...mp3" className="bg-[#0a0a0b] border-[#262626] text-white text-sm mt-1" />
            </div>
            <div>
              <Label className="text-zinc-400 text-xs flex items-center gap-1"><ExternalLink className="w-3 h-3 text-sky-400" /> Link Eksternal</Label>
              <Input value={service.externalLink || ''} onChange={(e) => setService({ ...service, externalLink: e.target.value })} placeholder="https://example.com" className="bg-[#0a0a0b] border-[#262626] text-white text-sm mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-zinc-400 text-xs">Status Slot</Label>
              <Input value={service.slotStatus} onChange={(e) => setService({ ...service, slotStatus: e.target.value })} className="bg-[#0a0a0b] border-[#262626] text-white text-sm mt-1" />
            </div>
            <div>
              <Label className="text-zinc-400 text-xs">Urutan</Label>
              <Input type="number" value={service.order} onChange={(e) => setService({ ...service, order: parseInt(e.target.value) || 0 })} className="bg-[#0a0a0b] border-[#262626] text-white text-sm mt-1" />
            </div>
          </div>
        </>
      )}

      <div className="flex items-center gap-3">
        <Switch checked={service.active} onCheckedChange={(v) => setService({ ...service, active: v })} />
        <Label className="text-zinc-400 text-xs">Aktif</Label>
        <Switch checked={service.slotAvailable} onCheckedChange={(v) => setService({ ...service, slotAvailable: v })} />
        <Label className="text-zinc-400 text-xs">Slot Tersedia</Label>
      </div>
      <div className="flex gap-2">
        <Button onClick={onSave} disabled={saving} className="flex-1 bg-violet-600 hover:bg-violet-500 text-white text-sm">
          <Save className="w-3 h-3 mr-1" /> {saving ? 'Menyimpan...' : 'Simpan'}
        </Button>
        <Button onClick={onCancel} variant="outline" className="border-[#262626] text-zinc-400 text-sm">Batal</Button>
      </div>
    </div>
  );
}

// --- Edit Article Form (inline) ---
function EditArticleForm({ article, setArticle, onSave, onCancel, saving }: {
  article: Article; setArticle: (a: Article) => void; onSave: () => void; onCancel: () => void; saving: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-violet-400">Edit Artikel</span>
        <Button variant="ghost" size="sm" onClick={onCancel} className="text-zinc-400"><X className="w-4 h-4" /></Button>
      </div>
      <div>
        <Label className="text-zinc-400 text-xs">Judul</Label>
        <Input value={article.title} onChange={(e) => setArticle({ ...article, title: e.target.value })} className="bg-[#0a0a0b] border-[#262626] text-white text-sm mt-1" />
      </div>
      <div>
        <Label className="text-zinc-400 text-xs">Ringkasan</Label>
        <Textarea value={article.excerpt} onChange={(e) => setArticle({ ...article, excerpt: e.target.value })} rows={2} className="bg-[#0a0a0b] border-[#262626] text-white text-sm mt-1" />
      </div>
      <div>
        <Label className="text-zinc-400 text-xs">Konten (HTML)</Label>
        <Textarea value={article.content} onChange={(e) => setArticle({ ...article, content: e.target.value })} rows={8} className="bg-[#0a0a0b] border-[#262626] text-white text-sm mt-1 font-mono" />
      </div>
      <div>
        <Label className="text-zinc-400 text-xs">URL Gambar</Label>
        <Input value={article.imageUrl} onChange={(e) => setArticle({ ...article, imageUrl: e.target.value })} className="bg-[#0a0a0b] border-[#262626] text-white text-sm mt-1" />
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={article.published} onCheckedChange={(v) => setArticle({ ...article, published: v })} />
        <Label className="text-zinc-400 text-xs">Publish</Label>
      </div>
      <div className="flex gap-2">
        <Button onClick={onSave} disabled={saving} className="flex-1 bg-violet-600 hover:bg-violet-500 text-white text-sm">
          <Save className="w-3 h-3 mr-1" /> {saving ? 'Menyimpan...' : 'Simpan'}
        </Button>
        <Button onClick={onCancel} variant="outline" className="border-[#262626] text-zinc-400 text-sm">Batal</Button>
      </div>
    </div>
  );
}

// --- Service Media Manager (for Media tab when on service detail page) ---
function ServiceMediaManager({ service, onUpload, onDeleteImage, onSetHero, onUpdateVideoUrl, onUpdateAudioUrl, onUploadFile, uploading, setUploading }: {
  service: Service;
  onUpload: (file: File, type: string, caption: string) => void;
  onDeleteImage: (imageId: string) => void;
  onSetHero: (url: string) => void;
  onUpdateVideoUrl: (url: string) => Promise<void>;
  onUpdateAudioUrl: (url: string) => Promise<void>;
  onUploadFile: (file: File, serviceId?: string) => Promise<string | null>;
  uploading: boolean;
  setUploading: (v: boolean) => void;
}) {
  const images = service.images || [];
  const galleryImages = images.filter((img: ServiceImage) => img.type === 'gallery' || !img.type);
  const heroImages = images.filter((img: ServiceImage) => img.type === 'hero');
  const documentImages = images.filter((img: ServiceImage) => img.type === 'document');
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);
  const audioFileRef = useRef<HTMLInputElement>(null);

  const [videoInput, setVideoInput] = useState(service.videoUrl || '');
  const [audioInput, setAudioInput] = useState(service.audioUrl || '');
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div className="space-y-6">
      {/* Context indicator */}
      <div className="flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center flex-shrink-0">
          <Monitor className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold">{service.name}</h3>
          <p className="text-zinc-400 text-xs">Mengelola media untuk jasa ini</p>
        </div>
      </div>

      {/* Hero Image */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Hero Image</h3>
          <Badge variant="outline" className="text-[10px] border-amber-500/50 text-amber-400">Banner utama</Badge>
        </div>
        {service.heroImageUrl ? (
          <div className="relative group rounded-xl overflow-hidden border border-amber-500/30 mb-3 max-w-2xl">
            <img src={service.heroImageUrl} alt="Hero" className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={() => onSetHero('')} className="bg-red-600/80 hover:bg-red-500 text-white border-0">
                <Trash2 className="w-4 h-4 mr-1" /> Hapus Hero
              </Button>
            </div>
            <div className="absolute top-2 left-2">
              <Badge className="bg-amber-500/80 text-white border-0 text-[10px]">Hero</Badge>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-[#262626] rounded-xl p-6 text-center max-w-2xl mb-3">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
            <p className="text-zinc-500 text-sm">Belum ada hero image</p>
          </div>
        )}
        <input
          ref={heroFileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              setUploading(true);
              const url = await onUploadFile(file, service.id);
              if (url) onSetHero(url);
              setUploading(false);
              e.target.value = '';
            }
          }}
        />
        <Button size="sm" variant="outline" onClick={() => heroFileRef.current?.click()} disabled={uploading} className="border-[#262626] text-zinc-400 hover:text-amber-400">
          <Upload className="w-3 h-3 mr-1" /> {uploading ? 'Mengupload...' : 'Upload Hero Image'}
        </Button>
      </div>

      <Separator className="bg-[#262626]" />

      {/* Gallery Images */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Camera className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-white">Galeri Foto</h3>
          <Badge variant="outline" className="text-[10px] border-violet-500/50 text-violet-400">{galleryImages.length} gambar</Badge>
        </div>

        <input
          ref={galleryFileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          multiple
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              Array.from(files).forEach(file => onUpload(file, 'gallery', ''));
              e.target.value = '';
            }
          }}
        />

        {/* Drag and drop area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            const files = e.dataTransfer.files;
            Array.from(files).forEach(file => {
              if (file.type.startsWith('image/')) onUpload(file, 'gallery', '');
            });
          }}
          onClick={() => galleryFileRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 transition-colors cursor-pointer mb-4 ${
            isDragOver ? 'border-violet-500 bg-violet-500/5' : 'border-[#262626] hover:border-violet-500/50'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isDragOver ? 'bg-violet-500/20' : 'bg-violet-500/10'
          }`}>
            <Upload className="w-6 h-6 text-violet-400" />
          </div>
          <div className="text-center">
            <p className="text-zinc-300 text-sm font-medium">
              {uploading ? 'Mengupload...' : 'Klik atau drag & drop gambar ke sini'}
            </p>
            <p className="text-zinc-500 text-xs mt-1">JPEG, PNG, GIF, WebP. Maks 5MB per file</p>
          </div>
        </div>

        {/* Gallery grid */}
        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {galleryImages.map((img: ServiceImage) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden border border-[#262626]">
                <img src={img.url} alt={img.caption || 'Gallery image'} className="w-full h-36 object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); onSetHero(img.url); }}
                    className="bg-amber-600/80 hover:bg-amber-500 text-white border-0 h-7 text-xs px-2"
                  >
                    <Star className="w-3 h-3 mr-1" /> Hero
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); onDeleteImage(img.id); }}
                    className="bg-red-600 hover:bg-red-500 text-white h-7 text-xs px-2"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-500">
            <Camera className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Belum ada gambar galeri</p>
            <p className="text-xs">Upload gambar pertama di atas</p>
          </div>
        )}
      </div>

      <Separator className="bg-[#262626]" />

      {/* Video URL */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Video className="w-4 h-4 text-pink-400" />
          <h3 className="text-sm font-semibold text-white">Video</h3>
        </div>
        <div className="flex gap-2">
          <Input
            value={videoInput}
            onChange={(e) => setVideoInput(e.target.value)}
            placeholder="https://youtube.com/watch?v=... atau embed URL"
            className="bg-[#0a0a0b] border-[#262626] text-white text-sm flex-1"
          />
          <Button
            size="sm"
            onClick={() => onUpdateVideoUrl(videoInput)}
            className="bg-pink-600 hover:bg-pink-500 text-white"
          >
            <Save className="w-3 h-3 mr-1" /> Simpan
          </Button>
        </div>
        {videoInput && (
          <p className="text-zinc-500 text-xs mt-1">
            <Link className="w-3 h-3 inline mr-1" />{videoInput}
          </p>
        )}
      </div>

      <Separator className="bg-[#262626]" />

      {/* Audio URL */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Music className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Audio</h3>
        </div>
        <div className="flex gap-2">
          <Input
            value={audioInput}
            onChange={(e) => setAudioInput(e.target.value)}
            placeholder="https://...mp3 atau upload file"
            className="bg-[#0a0a0b] border-[#262626] text-white text-sm flex-1"
          />
          <input
            ref={audioFileRef}
            type="file"
            accept="audio/mpeg,audio/wav,audio/ogg,audio/mp3"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                setUploading(true);
                const url = await onUploadFile(file, service.id);
                if (url) {
                  setAudioInput(url);
                  await onUpdateAudioUrl(url);
                }
                setUploading(false);
                e.target.value = '';
              }
            }}
          />
          <Button size="sm" variant="outline" onClick={() => audioFileRef.current?.click()} disabled={uploading} className="border-[#262626] text-zinc-400 hover:text-emerald-400">
            <Upload className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            onClick={() => onUpdateAudioUrl(audioInput)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            <Save className="w-3 h-3 mr-1" /> Simpan
          </Button>
        </div>
        {audioInput && (
          <div className="mt-2">
            <audio controls className="w-full h-8 opacity-70">
              <source src={audioInput} />
            </audio>
          </div>
        )}
      </div>

      {/* Document Images */}
      {documentImages.length > 0 && (
        <>
          <Separator className="bg-[#262626]" />
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Dokumen</h3>
              <Badge variant="outline" className="text-[10px] border-emerald-500/50 text-emerald-400">{documentImages.length}</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {documentImages.map((img: ServiceImage) => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden border border-[#262626]">
                  <img src={img.url} alt={img.caption || 'Document'} className="w-full h-36 object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="destructive" size="sm" onClick={() => onDeleteImage(img.id)} className="bg-red-600 hover:bg-red-500 text-white">
                      <Trash2 className="w-4 h-4 mr-1" /> Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// --- Site Config Editor ---
function SiteConfigEditor({ config, onSave }: {
  config: SiteConfigMap;
  onSave: (key: string, value: string) => void;
}) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const configEntries = Object.entries(config).filter(([k]) => k !== 'hero_image'); // hero_image handled separately

  return (
    <div className="space-y-3">
      {configEntries.length > 0 ? (
        <div className="space-y-2">
          {configEntries.map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 bg-[#0a0a0b] rounded-lg p-2 border border-[#262626]">
              <span className="text-violet-400 text-xs font-mono min-w-[120px] px-2">{key}</span>
              {editingKey === key ? (
                <>
                  <Input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="bg-[#1a1a1e] border-[#262626] text-white text-xs flex-1"
                  />
                  <Button size="sm" onClick={() => { onSave(key, editingValue); setEditingKey(null); }} className="bg-violet-600 hover:bg-violet-500 text-white h-7 text-xs px-2">
                    <Save className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingKey(null)} className="text-zinc-400 h-7 text-xs px-2">
                    <X className="w-3 h-3" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-zinc-400 text-xs flex-1 truncate">{value}</span>
                  <Button size="sm" variant="ghost" onClick={() => { setEditingKey(key); setEditingValue(value); }} className="text-zinc-400 hover:text-violet-400 h-7 text-xs px-2">
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-zinc-500 text-xs py-3">Belum ada konfigurasi khusus</p>
      )}

      <Separator className="bg-[#262626]" />

      {/* Add new config */}
      <div className="flex gap-2">
        <Input
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="Key..."
          className="bg-[#0a0a0b] border-[#262626] text-white text-xs w-1/3"
        />
        <Input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Value..."
          className="bg-[#0a0a0b] border-[#262626] text-white text-xs flex-1"
        />
        <Button
          size="sm"
          onClick={() => {
            if (newKey) {
              onSave(newKey, newValue);
              setNewKey('');
              setNewValue('');
            }
          }}
          disabled={!newKey}
          className="bg-violet-600 hover:bg-violet-500 text-white h-9 text-xs"
        >
          <Plus className="w-3 h-3 mr-1" /> Tambah
        </Button>
      </div>
    </div>
  );
}

// --- Konten Manager (for Konten tab - organized per-service content editing) ---
function KontenManager({ services, onSetManagingImagesFor, uploadFile, uploading, setUploading, loadData }: {
  services: Service[];
  onSetManagingImagesFor: (svc: Service) => void;
  uploadFile: (file: File, serviceId?: string) => Promise<string | null>;
  uploading: boolean;
  setUploading: (v: boolean) => void;
  loadData: () => Promise<void>;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [savingField, setSavingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, Record<string, string>>>({});
  const audioFileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const getEditValue = (svcId: string, field: string, fallback: string): string => {
    if (editValues[svcId]?.[field] !== undefined) return editValues[svcId][field];
    return fallback;
  };

  const setEditValue = (svcId: string, field: string, value: string) => {
    setEditValues(prev => ({
      ...prev,
      [svcId]: { ...prev[svcId], [field]: value },
    }));
  };

  const saveField = async (svcId: string, field: string, value: string) => {
    setSavingField(`${svcId}-${field}`);
    try {
      await fetch(`/api/services/${svcId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      await loadData();
    } catch (err) {
      console.error('Save field error:', err);
    }
    setSavingField(null);
  };

  const getYoutubeEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    return null;
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-white font-semibold mb-1">Manajemen Konten</h3>
        <p className="text-zinc-500 text-xs">Kelola video, audio, link, dan teks untuk setiap jasa</p>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-10 text-zinc-500">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>Belum ada jasa untuk dikelola kontennya</p>
        </div>
      ) : (
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-3 pr-2">
            {services.map((svc) => {
              const isExpanded = expandedId === svc.id;
              const imgCount = svc.images?.length || 0;
              const galleryCount = svc.images?.filter(i => i.type === 'gallery' || !i.type).length || 0;
              const hasVideo = !!svc.videoUrl;
              const hasAudio = !!svc.audioUrl;
              const hasLink = !!svc.externalLink;
              const hasHero = !!svc.heroImageUrl;

              return (
                <Card key={svc.id} className={`bg-[#1a1a1e] border-[#262626] transition-colors ${isExpanded ? 'border-violet-500/50' : ''}`}>
                  {/* Collapsible Header */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : svc.id)}
                    className="w-full text-left p-4 flex items-center gap-3 hover:bg-[#1e1e22] transition-colors rounded-lg"
                  >
                    <div className="text-xl flex-shrink-0">{CATEGORY_ICONS[svc.category] || '📦'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white truncate">{svc.name}</span>
                        <Badge variant="outline" className="text-[10px] border-violet-500/50 text-violet-400">{svc.category}</Badge>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {hasHero && <Badge className="text-[9px] bg-amber-500/20 text-amber-400 border-0 h-5">📷 Hero</Badge>}
                        {galleryCount > 0 && <Badge className="text-[9px] bg-amber-500/20 text-amber-400 border-0 h-5">📷 {galleryCount} foto</Badge>}
                        {hasVideo && <Badge className="text-[9px] bg-pink-500/20 text-pink-400 border-0 h-5">🎬 Video</Badge>}
                        {hasAudio && <Badge className="text-[9px] bg-emerald-500/20 text-emerald-400 border-0 h-5">🎵 Audio</Badge>}
                        {hasLink && <Badge className="text-[9px] bg-sky-500/20 text-sky-400 border-0 h-5">🔗 Link</Badge>}
                        {!hasVideo && !hasAudio && !hasLink && !hasHero && galleryCount === 0 && (
                          <Badge className="text-[9px] bg-zinc-500/20 text-zinc-500 border-0 h-5">Kosong</Badge>
                        )}
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                    )}
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-4 border-t border-[#262626] pt-4">
                      {/* Video Section */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Video className="w-4 h-4 text-pink-400" />
                          <h4 className="text-sm font-medium text-pink-400">Video URL</h4>
                          {savingField === `${svc.id}-videoUrl` && <span className="text-[10px] text-zinc-500">Menyimpan...</span>}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={getEditValue(svc.id, 'videoUrl', svc.videoUrl || '')}
                            onChange={(e) => setEditValue(svc.id, 'videoUrl', e.target.value)}
                            placeholder="https://youtube.com/watch?v=... atau embed URL"
                            className="bg-[#0a0a0b] border-[#262626] text-white text-sm flex-1"
                          />
                          <Button
                            size="sm"
                            onClick={() => saveField(svc.id, 'videoUrl', getEditValue(svc.id, 'videoUrl', ''))}
                            disabled={savingField === `${svc.id}-videoUrl`}
                            className="bg-pink-600 hover:bg-pink-500 text-white flex-shrink-0"
                          >
                            <Save className="w-3 h-3 mr-1" /> Simpan
                          </Button>
                        </div>
                        {getEditValue(svc.id, 'videoUrl', svc.videoUrl || '') && (
                          <div className="mt-2">
                            {getYoutubeEmbedUrl(getEditValue(svc.id, 'videoUrl', svc.videoUrl || '')) ? (
                              <div className="rounded-lg overflow-hidden border border-pink-500/20 max-w-md">
                                <iframe
                                  src={getYoutubeEmbedUrl(getEditValue(svc.id, 'videoUrl', svc.videoUrl || ''))!}
                                  className="w-full aspect-video"
                                  allowFullScreen
                                  title="Video preview"
                                />
                              </div>
                            ) : (
                              <p className="text-zinc-500 text-xs flex items-center gap-1">
                                <Link className="w-3 h-3" />
                                {getEditValue(svc.id, 'videoUrl', svc.videoUrl || '')}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <Separator className="bg-[#262626]" />

                      {/* Audio Section */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Music className="w-4 h-4 text-emerald-400" />
                          <h4 className="text-sm font-medium text-emerald-400">Audio URL</h4>
                          {savingField === `${svc.id}-audioUrl` && <span className="text-[10px] text-zinc-500">Menyimpan...</span>}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={getEditValue(svc.id, 'audioUrl', svc.audioUrl || '')}
                            onChange={(e) => setEditValue(svc.id, 'audioUrl', e.target.value)}
                            placeholder="https://...mp3 atau upload file"
                            className="bg-[#0a0a0b] border-[#262626] text-white text-sm flex-1"
                          />
                          <input
                            ref={(el) => { audioFileRefs.current[svc.id] = el; }}
                            type="file"
                            accept="audio/mpeg,audio/wav,audio/ogg,audio/mp3"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setUploading(true);
                                const url = await uploadFile(file, svc.id);
                                if (url) {
                                  setEditValue(svc.id, 'audioUrl', url);
                                  await saveField(svc.id, 'audioUrl', url);
                                }
                                setUploading(false);
                                e.target.value = '';
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => audioFileRefs.current[svc.id]?.click()}
                            disabled={uploading}
                            className="border-[#262626] text-zinc-400 hover:text-emerald-400 flex-shrink-0"
                          >
                            <Upload className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => saveField(svc.id, 'audioUrl', getEditValue(svc.id, 'audioUrl', ''))}
                            disabled={savingField === `${svc.id}-audioUrl`}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white flex-shrink-0"
                          >
                            <Save className="w-3 h-3 mr-1" /> Simpan
                          </Button>
                        </div>
                        {getEditValue(svc.id, 'audioUrl', svc.audioUrl || '') && (
                          <div className="mt-2">
                            <audio controls className="w-full h-8 opacity-70">
                              <source src={getEditValue(svc.id, 'audioUrl', svc.audioUrl || '')} />
                            </audio>
                          </div>
                        )}
                      </div>

                      <Separator className="bg-[#262626]" />

                      {/* External Link Section */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <ExternalLink className="w-4 h-4 text-sky-400" />
                          <h4 className="text-sm font-medium text-sky-400">Link Eksternal</h4>
                          {savingField === `${svc.id}-externalLink` && <span className="text-[10px] text-zinc-500">Menyimpan...</span>}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={getEditValue(svc.id, 'externalLink', svc.externalLink || '')}
                            onChange={(e) => setEditValue(svc.id, 'externalLink', e.target.value)}
                            placeholder="https://example.com"
                            className="bg-[#0a0a0b] border-[#262626] text-white text-sm flex-1"
                          />
                          <Button
                            size="sm"
                            onClick={() => saveField(svc.id, 'externalLink', getEditValue(svc.id, 'externalLink', ''))}
                            disabled={savingField === `${svc.id}-externalLink`}
                            className="bg-sky-600 hover:bg-sky-500 text-white flex-shrink-0"
                          >
                            <Save className="w-3 h-3 mr-1" /> Simpan
                          </Button>
                          {getEditValue(svc.id, 'externalLink', svc.externalLink || '') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(getEditValue(svc.id, 'externalLink', ''), '_blank')}
                              className="border-sky-500/30 text-sky-400 hover:bg-sky-500/10 flex-shrink-0"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <Separator className="bg-[#262626]" />

                      {/* Text Content Section */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-violet-400" />
                          <h4 className="text-sm font-medium text-violet-400">Teks</h4>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-zinc-400 text-xs">Deskripsi Singkat</Label>
                            <div className="flex gap-2 mt-1">
                              <Input
                                value={getEditValue(svc.id, 'shortDesc', svc.shortDesc || '')}
                                onChange={(e) => setEditValue(svc.id, 'shortDesc', e.target.value)}
                                placeholder="Deskripsi singkat..."
                                className="bg-[#0a0a0b] border-[#262626] text-white text-sm flex-1"
                              />
                              <Button
                                size="sm"
                                onClick={() => saveField(svc.id, 'shortDesc', getEditValue(svc.id, 'shortDesc', ''))}
                                disabled={savingField === `${svc.id}-shortDesc`}
                                className="bg-violet-600 hover:bg-violet-500 text-white flex-shrink-0"
                              >
                                <Save className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label className="text-zinc-400 text-xs">Deskripsi Detail</Label>
                            <div className="flex gap-2 mt-1">
                              <Textarea
                                value={getEditValue(svc.id, 'detailDesc', svc.detailDesc || '')}
                                onChange={(e) => setEditValue(svc.id, 'detailDesc', e.target.value)}
                                placeholder="Deskripsi detail..."
                                rows={3}
                                className="bg-[#0a0a0b] border-[#262626] text-white text-sm flex-1"
                              />
                              <Button
                                size="sm"
                                onClick={() => saveField(svc.id, 'detailDesc', getEditValue(svc.id, 'detailDesc', ''))}
                                disabled={savingField === `${svc.id}-detailDesc`}
                                className="bg-violet-600 hover:bg-violet-500 text-white flex-shrink-0 self-start"
                              >
                                <Save className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-[#262626]" />

                      {/* Photo Section */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Camera className="w-4 h-4 text-amber-400" />
                          <h4 className="text-sm font-medium text-amber-400">Foto</h4>
                          {svc.heroImageUrl && (
                            <Badge className="text-[9px] bg-amber-500/20 text-amber-400 border-0 h-5">Hero ✓</Badge>
                          )}
                          <Badge variant="outline" className="text-[9px] border-amber-500/50 text-amber-400 h-5">{galleryCount} galeri</Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSetManagingImagesFor(svc)}
                          className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                        >
                          <ImagePlus className="w-3 h-3 mr-1" /> Kelola Gambar
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
