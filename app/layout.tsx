import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "The Athlete Insider | NBA & NFL News, Scores & Analysis",
  description:
    "Your premium source for NBA and NFL news, live scores, expert analysis, betting odds, and community-driven sports content.",
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "hsl(217 33% 17%)",
              border: "1px solid hsl(215 25% 27%)",
              color: "hsl(210 40% 96.1%)",
            },
          }}
        />
      </body>
    </html>
  );
}
