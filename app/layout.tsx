import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Athlete Insider | Sports News & Analytics",
  description:
    "Your insider source for NBA & NFL news, live scores, standings, power rankings, fantasy analytics, and betting insights. The scrappy alternative to corporate sports media.",
  keywords: [
    "sports news",
    "NBA",
    "NFL",
    "fantasy analytics",
    "live scores",
    "standings",
    "power rankings",
    "betting odds",
  ],
}

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
