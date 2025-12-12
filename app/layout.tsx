import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nWrapper } from "@/components/i18n-wrapper"

export const metadata: Metadata = {
  title: "Sudoku - Zen Puzzle Game",
  description: "A minimal, zen Sudoku experience with customizable themes",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        {/* Updated ThemeProvider to include custom accent colors */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <I18nWrapper>
          {children}
          </I18nWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
