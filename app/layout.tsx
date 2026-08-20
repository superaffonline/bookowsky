import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { brand } from "@/lib/brand";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: {
    default: `${brand.name} — Free books, funded by brands`,
    template: `%s — ${brand.name}`,
  },
  description: brand.description,
  keywords: [
    "free ebooks",
    "sponsored books",
    "digital books",
    "Kindle ebooks",
    "Kobo ebooks",
    "public domain books",
    "independent authors",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: `${brand.name} — Free books, funded by brands`,
    description: brand.description,
    siteName: brand.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — Free books, funded by brands`,
    description: brand.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f1ea",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
