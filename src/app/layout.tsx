import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mas Iis - Warung Solusi | 17 Jasa Lengkap Sindanglaut, Cirebon",
  description: "17 jasa lengkap: servis laptop, bimbingan skripsi/tesis/disertasi, website, MC, angklung, desain grafis, hias taman, dan lainnya. AI chat 24/7. Sindanglaut, Kab. Cirebon.",
  keywords: ["servis laptop", "bimbingan skripsi", "jasa Cirebon", "website", "warung solusi", "Mas Iis", "Cirebon"],
  authors: [{ name: "Mas Iis" }],
  icons: {
    icon: "/logo-new.png",
  },
  openGraph: {
    title: "Mas Iis - Warung Solusi | 17 Jasa Lengkap Cirebon",
    description: "Servis laptop, bimbingan skripsi, website, dan 14 jasa lainnya. AI chat 24/7.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b] text-white`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
