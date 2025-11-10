import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bloodline-kyumkyums-projects.vercel.app'),
  title: "Bloodline - 머더 미스터리 아카이브",
  description: "주인장이 해본 머미만 기록합니다. 흥미로운 머더 미스터리를 아카이빙하고 난이도와 평점을 공유하는 플랫폼입니다.",
  keywords: ["머더미스터리", "murder mystery", "미스터리", "추리", "게임", "아카이브"],
  authors: [{ name: "KyumKyum" }],
  creator: "KyumKyum",
  publisher: "Bloodline Archive",
  
  // Favicon and icons
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: "/apple-touch-icon.png",
  },

  // Open Graph metadata
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://bloodline-kyumkyums-projects.vercel.app",
    siteName: "Bloodline - 머더 미스터리 아카이브",
    title: "Bloodline - 머더 미스터리 아카이브",
    description: "주인장이 해본 머미만 기록합니다. 흥미로운 머더 미스터리를 아카이빙하고 난이도와 평점을 공유하는 플랫폼입니다.",
    images: [
      {
        url: "/og-banner.svg",
        width: 1200,
        height: 630,
        alt: "Bloodline - Murder Mystery Archive",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Bloodline - 머더 미스터리 아카이브",
    description: "주인장이 해본 머미만 기록합니다.",
    images: ["/og-banner.svg"],
    creator: "@kyumkyum",
  },

  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Manifest for PWA
  manifest: "/manifest.json",

  // Verification (you can add later if needed)
  // verification: {
  //   google: "your-google-verification-code",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
