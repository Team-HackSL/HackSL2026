import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PageEffects } from "@/components/PageEffects";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HackerModeProvider } from "@/components/HackerModeProvider";
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.setAttribute('data-theme','dark')}var h=localStorage.getItem('hackerMode');document.documentElement.setAttribute('data-hacker',h==='on'?'on':'off')}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <HackerModeProvider>
          <ThemeProvider>
            <PageEffects />
            {children}
          </ThemeProvider>
        </HackerModeProvider>
      </body>
    </html>
  );
}
