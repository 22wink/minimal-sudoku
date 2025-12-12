"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { accentColors, backgroundColors, type AccentColor, type BackgroundColor } from "@/lib/theme-colors"

interface CustomThemeContextType {
  accentColor: string
  setAccentColor: (color: string) => void
  availableColors: Record<string, AccentColor>
  backgroundColor: string
  setBackgroundColor: (color: string) => void
  availableBackgrounds: Record<string, BackgroundColor>
}

const CustomThemeContext = React.createContext<CustomThemeContextType | undefined>(undefined)

export function useCustomTheme() {
  const context = React.useContext(CustomThemeContext)
  if (context === undefined) {
    throw new Error("useCustomTheme must be used within a CustomThemeProvider")
  }
  return context
}

interface CustomThemeProviderProps extends ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children, ...props }: CustomThemeProviderProps) {
  const [accentColor, setAccentColorState] = React.useState("blue")
  const [backgroundColor, setBackgroundColorState] = React.useState("default")

  // Load saved colors from localStorage
  React.useEffect(() => {
    const savedAccent = localStorage.getItem("sudoku-accent-color")
    const savedBackground = localStorage.getItem("sudoku-background-color")

    if (savedAccent && accentColors[savedAccent]) {
      setAccentColorState(savedAccent)
    }
    if (savedBackground && backgroundColors[savedBackground]) {
      setBackgroundColorState(savedBackground)
    }
  }, [])

  // Apply colors to CSS variables
  React.useEffect(() => {
    const applyColors = () => {
      // Fixed variable reference order
      const accent = accentColors[accentColor]
      const background = backgroundColors[backgroundColor]
      if (!accent || !background) return

      const root = document.documentElement
      const isDark = root.classList.contains("dark")

      const accentColorValues = isDark ? accent.dark : accent.light
      const backgroundColorValues = isDark ? background.dark : background.light

      root.style.setProperty("--primary", accentColorValues.primary)
      root.style.setProperty("--primary-foreground", accentColorValues.primaryForeground)
      root.style.setProperty("--ring", accentColorValues.ring)

      root.style.setProperty("--background", backgroundColorValues.background)
      root.style.setProperty("--card", backgroundColorValues.card)

      root.style.setProperty("--user-input", isDark ? "0 0% 98%" : "222.2 84% 4.9%")
    }

    applyColors()

    // Listen for theme changes to reapply colors
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          applyColors()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [accentColor, backgroundColor])

  const setAccentColor = React.useCallback((color: string) => {
    if (accentColors[color]) {
      setAccentColorState(color)
      localStorage.setItem("sudoku-accent-color", color)
    }
  }, [])

  const setBackgroundColor = React.useCallback((color: string) => {
    if (backgroundColors[color]) {
      setBackgroundColorState(color)
      localStorage.setItem("sudoku-background-color", color)
    }
  }, [])

  const contextValue = React.useMemo(
    () => ({
      accentColor,
      setAccentColor,
      availableColors: accentColors,
      backgroundColor,
      setBackgroundColor,
      availableBackgrounds: backgroundColors,
    }),
    [accentColor, setAccentColor, backgroundColor, setBackgroundColor],
  )

  return (
    <NextThemesProvider {...props}>
      <CustomThemeContext.Provider value={contextValue}>{children}</CustomThemeContext.Provider>
    </NextThemesProvider>
  )
}
