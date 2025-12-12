"use client"

import { I18nProvider, useI18n } from "@/lib/i18n-context"
import { useEffect } from "react"

function LanguageSetter() {
  const { language } = useI18n()
  
  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en"
  }, [language])
  
  return null
}

export function I18nWrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <LanguageSetter />
      {children}
    </I18nProvider>
  )
}

