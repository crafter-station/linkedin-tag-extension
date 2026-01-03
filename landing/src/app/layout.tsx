import type { Metadata } from "next";
import { Geist, Geist_Mono, Jost } from "next/font/google";
import { ThemeProvider } from "next-themes";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = "https://www.letstag.fast";
const siteName = "Let's Tag Fast";
const siteDescription =
  "Bulk tag LinkedIn users and organizations in your posts with a single click. Collect profiles while browsing, organize into lists, and insert all tags instantly.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Bulk LinkedIn Tagging`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "LinkedIn",
    "Chrome extension",
    "tag users",
    "bulk tagging",
    "social media",
    "productivity",
    "LinkedIn mentions",
    "LinkedIn automation",
  ],
  authors: [{ name: "Crafter Station", url: "https://www.crafterstation.com/" }],
  creator: "Crafter Station",
  publisher: "Crafter Station",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} — Bulk LinkedIn Tagging`,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og.png`,
        width: 1200,
        height: 630,
        alt: `${siteName} - Tag multiple LinkedIn users in seconds`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Bulk LinkedIn Tagging`,
    description: siteDescription,
    images: [`${siteUrl}/og.png`],
    creator: "@crafterstation",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#18181b" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jost.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
