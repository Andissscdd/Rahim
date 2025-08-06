import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HYBRITH - Plateforme Sociale Ultra-Addictive",
  description: "Découvrez HYBRITH, la plateforme qui combine le meilleur de TikTok et Facebook. Vidéos virales, profils complets, messagerie et plus encore !",
  keywords: "réseau social, vidéos, viral, tiktok, facebook, hybrith",
  authors: [{ name: "HYBRITH Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#8B5CF6",
  openGraph: {
    title: "HYBRITH - Plateforme Sociale Ultra-Addictive",
    description: "Découvrez HYBRITH, la plateforme qui combine le meilleur de TikTok et Facebook",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "HYBRITH - Plateforme Sociale Ultra-Addictive",
    description: "Découvrez HYBRITH, la plateforme qui combine le meilleur de TikTok et Facebook",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1F1F1F',
                color: '#E5E5E5',
                border: '1px solid #8B5CF6',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#E5E5E5',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#E5E5E5',
                },
              },
            }}
          />
        </AppProvider>
      </body>
    </html>
  );
}
