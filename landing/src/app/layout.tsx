import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Let's Tag Fast - Quickly Tag Multiple LinkedIn Users in Posts",
  description:
    "A Chrome extension for quickly tagging multiple LinkedIn users and organizations in posts. Save time with bulk tagging, organized lists, and one-click insertion.",
  keywords: [
    "LinkedIn",
    "Chrome extension",
    "tag users",
    "bulk tagging",
    "social media",
    "productivity",
    "Let's Tag Fast",
  ],
  authors: [{ name: "Let's Tag Fast" }],
  openGraph: {
    title: "Let's Tag Fast - Quickly Tag Multiple LinkedIn Users in Posts",
    description:
      "Save time tagging LinkedIn users. Collect profiles while browsing, organize into lists, and insert all tags with one click.",
    type: "website",
    url: "https://letstag.fast",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
