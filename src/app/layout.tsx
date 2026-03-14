import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PageEffects } from "@/components/PageEffects";
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
  title: "HackSL – Connecting Sri Lanka's Tech Innovators",
  icons: {
    icon: "/hacksl-logo.png",
    shortcut: "/hacksl-logo.png",
    apple: "/hacksl-logo.png",
  },
  description:
    "HackSL is the comprehensive guide for hackathons and tech events in Sri Lanka. One hackathon at a time.",
  openGraph: {
    title: "HackSL – Hack Sri Lanka",
    description:
      "Connecting Sri Lanka's Tech Innovators. Hackathons, events, and community.",
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
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <PageEffects />
        {children}
      </body>
    </html>
  );
}
