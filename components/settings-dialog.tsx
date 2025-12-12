"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import { useCustomTheme } from "./theme-provider"
import { Monitor, Moon, Sun, Palette } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme()
  const { accentColor, setAccentColor, availableColors, backgroundColor, setBackgroundColor, availableBackgrounds } =
    useCustomTheme()

  const [currentTheme, setCurrentTheme] = useState<string>("light")

  useEffect(() => {
    setCurrentTheme(theme || "light")
  }, [theme])

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ]

  const getColorForTheme = (colorKey: string, isDark: boolean) => {
    const color = availableColors[colorKey]
    return isDark ? color.dark : color.light
  }

  const getBackgroundForTheme = (bgKey: string, isDark: boolean) => {
    const bg = availableBackgrounds[bgKey]
    return isDark ? bg.dark : bg.light
  }

  const isDarkPreview =
    currentTheme === "dark" || (currentTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col bg-background">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>Customize your Sudoku experience with themes and display options.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Theme Mode Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Theme Mode</Label>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  variant={theme === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme(value)}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Background Color Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Background</Label>
            <div className="grid grid-cols-3 gap-2 p-5">
              {Object.entries(availableBackgrounds).map(([key, bg]) => {
                const bgColors = getBackgroundForTheme(key, isDarkPreview)
                return (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => setBackgroundColor(key)}
                    className={cn(
                      "flex flex-col items-center gap-1 h-auto py-2 px-1 relative min-h-[60px]",
                      backgroundColor === key && "ring-2 ring-primary ring-offset-2",
                    )}
                    style={{
                      backgroundColor: `hsl(${bgColors.background})`,
                      color: isDarkPreview ? "hsl(0 0% 98%)" : "hsl(222.2 84% 4.9%)",
                      borderColor:
                        backgroundColor === key
                          ? `hsl(${getColorForTheme(accentColor, isDarkPreview).primary})`
                          : undefined,
                    }}
                  >
                    <span className="text-xs font-medium text-center leading-tight">{bg.name}</span>
                    {backgroundColor === key && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
                    )}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Accent Color Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Accent Color</Label>
            <div className="grid grid-cols-4 gap-2 p-3">
              {Object.entries(availableColors).map(([key, color]) => {
                const colorValues = getColorForTheme(key, isDarkPreview)
                return (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => setAccentColor(key)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 h-auto py-2 px-1 relative min-h-[70px]",
                      accentColor === key && "ring-2 ring-offset-2",
                    )}
                    style={{
                      borderColor: accentColor === key ? colorValues.primary : undefined,
                      ringColor: accentColor === key ? colorValues.primary : undefined,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full border-2 border-background shadow-sm flex-shrink-0"
                      style={{
                        backgroundColor: colorValues.primary,
                      }}
                    />
                    <span className="text-xs font-medium text-center leading-tight">{color.name}</span>
                    {accentColor === key && (
                      <div
                        className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background"
                        style={{
                          backgroundColor: colorValues.primary,
                        }}
                      />
                    )}
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Preview</Label>
            <div
              className={cn(
                "p-4 border rounded-lg transition-colors",
                isDarkPreview ? "border-gray-700" : "border-gray-200",
              )}
              style={{
                backgroundColor: `hsl(${getBackgroundForTheme(backgroundColor, isDarkPreview).background})`,
                color: isDarkPreview ? "hsl(0 0% 98%)" : "hsl(222.2 84% 4.9%)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Button
                  size="sm"
                  className="flex-1"
                  style={{
                    backgroundColor: `hsl(${getColorForTheme(accentColor, isDarkPreview).primary})`,
                    color: `hsl(${getColorForTheme(accentColor, isDarkPreview).primaryForeground})`,
                  }}
                >
                  Primary Button
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: `hsl(${getColorForTheme(accentColor, isDarkPreview).primary})`,
                    color: `hsl(${getColorForTheme(accentColor, isDarkPreview).primary})`,
                  }}
                >
                  Secondary
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className="aspect-square border rounded flex items-center justify-center text-sm font-medium"
                    style={{
                      backgroundColor: `hsl(${getColorForTheme(accentColor, isDarkPreview).primary})`,
                      color: `hsl(${getColorForTheme(accentColor, isDarkPreview).primaryForeground})`,
                      borderColor: isDarkPreview ? "hsl(217.2 32.6% 17.5%)" : "hsl(214.3 31.8% 91.4%)",
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t flex-shrink-0">
          <Button onClick={onClose}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
