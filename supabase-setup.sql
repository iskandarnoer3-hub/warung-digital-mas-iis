-- =====================================================
-- Mas Iis - Warung Solusi 🍜
-- Database Setup Script for Supabase
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- =====================================================

-- CreateTable: Service
CREATE TABLE IF NOT EXISTS "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL,
    "detailDesc" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "priceMax" INTEGER NOT NULL,
    "benefit1" TEXT NOT NULL DEFAULT '',
    "benefit2" TEXT NOT NULL DEFAULT '',
    "benefit3" TEXT NOT NULL DEFAULT '',
    "benefit4" TEXT NOT NULL DEFAULT '',
    "benefit5" TEXT NOT NULL DEFAULT '',
    "waText" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "bonus" TEXT NOT NULL DEFAULT '',
    "slotStatus" TEXT NOT NULL DEFAULT 'Slot Tersedia',
    "slotAvailable" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Article
CREATE TABLE IF NOT EXISTS "Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable: LandingPage
CREATE TABLE IF NOT EXISTS "LandingPage" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "headline" TEXT NOT NULL DEFAULT '',
    "subheadline" TEXT NOT NULL DEFAULT '',
    "ctaText" TEXT NOT NULL DEFAULT 'Hubungi Sekarang',
    "sections" TEXT NOT NULL DEFAULT '[]',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LandingPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable: ChatLog
CREATE TABLE IF NOT EXISTS "ChatLog" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Service_slug_key" ON "Service"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "Article_slug_key" ON "Article"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "LandingPage_serviceId_key" ON "LandingPage"("serviceId");

-- Add foreign key for LandingPage -> Service
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'LandingPage_serviceId_fkey'
    ) THEN
        ALTER TABLE "LandingPage" ADD CONSTRAINT "LandingPage_serviceId_fkey"
        FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Enable RLS but allow public read access
ALTER TABLE "Service" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Article" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LandingPage" ENABLE Row LEVEL SECURITY;
ALTER TABLE "ChatLog" ENABLE ROW LEVEL SECURITY;

-- Allow public read for Service, Article, LandingPage
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read Service') THEN
        CREATE POLICY "Public read Service" ON "Service" FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read Article') THEN
        CREATE POLICY "Public read Article" ON "Article" FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read LandingPage') THEN
        CREATE POLICY "Public read LandingPage" ON "LandingPage" FOR SELECT USING (true);
    END IF;
END $$;

-- ✅ Done! Now deploy to Vercel and call /api/setup to seed data
