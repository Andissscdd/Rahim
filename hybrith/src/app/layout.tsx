import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HYBRITH - La Plateforme Sociale du Futur",
  description: "Découvrez HYBRITH, l'expérience sociale ultime qui combine le meilleur de TikTok et Facebook. Vidéos virales, connexions authentiques, et bien plus encore.",
  keywords: "social media, videos, friends, viral content, HYBRITH",
  authors: [{ name: "HYBRITH Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#8b5cf6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased min-h-screen bg-dark-bg text-white overflow-x-hidden">
        <div id="modal-root"></div>
        {children}
      </body>
    </html>
  );
}
