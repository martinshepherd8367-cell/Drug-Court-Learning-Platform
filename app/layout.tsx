import type React from "react"
import type { Metadata } from "next"
import { StoreProvider } from "@/lib/store"
import { BuildFooter } from "@/components/build-footer"
import "./globals.css"

export const metadata: Metadata = {
  title: "Accountability Court Platform",
  description: "Drug Court Learning Platform by DMS Clinical Services",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <StoreProvider>
          {children}
          <BuildFooter />
        </StoreProvider>
      </body>
    </html>
  )
}
