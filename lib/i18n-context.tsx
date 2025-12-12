"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Language } from "./i18n"
import { translations } from "./i18n"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof typeof translations.en) => string
  tHint: {
    nakedSingleExplanation: (value: number) => string
    hiddenSingleRow: (num: number, row: number) => string
    hiddenSingleColumn: (num: number, col: number) => string
    hiddenSingleBox: (num: number) => string
  }
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("sudoku-language") as Language | null
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "zh")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  // Save language to localStorage when it changes
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("sudoku-language", lang)
  }, [])

  const t = useCallback(
    (key: keyof typeof translations.en): string => {
      return translations[language][key] as string
    },
    [language],
  )

  const tHint = {
    nakedSingleExplanation: useCallback(
      (value: number) => {
        const translation = translations[language].nakedSingleExplanation
        return typeof translation === "function" ? translation(value) : translation
      },
      [language],
    ),
    hiddenSingleRow: useCallback(
      (num: number, row: number) => {
        const translation = translations[language].hiddenSingleRow
        return typeof translation === "function" ? translation(num, row) : translation
      },
      [language],
    ),
    hiddenSingleColumn: useCallback(
      (num: number, col: number) => {
        const translation = translations[language].hiddenSingleColumn
        return typeof translation === "function" ? translation(num, col) : translation
      },
      [language],
    ),
    hiddenSingleBox: useCallback(
      (num: number) => {
        const translation = translations[language].hiddenSingleBox
        return typeof translation === "function" ? translation(num) : translation
      },
      [language],
    ),
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, tHint }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

