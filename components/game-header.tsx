"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Moon, Sun, Settings, RotateCcw, Loader2, Zap, Trophy, Clock } from "lucide-react"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SettingsDialog } from "./settings-dialog"
import { ConfirmDialog } from "./confirm-dialog"
import type { Difficulty } from "@/lib/sudoku-generator"
import { useI18n } from "@/lib/i18n-context"

interface GameHeaderProps {
  difficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
  onNewGame: () => void
  onAutoSolve: () => void
  isGenerating: boolean
  isSolving: boolean
  isComplete: boolean
  timer: number
}

export function GameHeader({
  difficulty,
  onDifficultyChange,
  onNewGame,
  onAutoSolve,
  isGenerating,
  isSolving,
  isComplete,
  timer,
}: GameHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [showSettings, setShowSettings] = useState(false)
  const [showSolveConfirm, setShowSolveConfirm] = useState(false)
  const { t } = useI18n()

  const difficultyLabels: Record<Difficulty, string> = {
    beginner: t("beginner"),
    easy: t("easy"),
    hard: t("hard"),
    impossible: t("impossible"),
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAutoSolve = () => {
    if (isComplete) return
    setShowSolveConfirm(true)
  }

  const confirmAutoSolve = () => {
    setShowSolveConfirm(false)
    onAutoSolve()
  }

  return (
    <TooltipProvider>
      <header className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{t("sudoku")}</h1>
            {isComplete && <Trophy className="h-5 w-5 text-yellow-500" />}
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground justify-start"
                >
                  {difficultyLabels[difficulty]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {Object.entries(difficultyLabels).map(([key, label]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => onDifficultyChange(key as Difficulty)}
                    className={difficulty === key ? "bg-accent" : ""}
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="font-mono">{formatTime(timer)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAutoSolve}
                disabled={isSolving || isComplete}
                className="h-9 w-9"
              >
                {isSolving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                <span className="sr-only">{t("autoSolve")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("autoSolve")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onNewGame} disabled={isGenerating} className="h-9 w-9">
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                <span className="sr-only">{t("newGame")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("newGame")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">{t("toggleTheme")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("toggleTheme")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} className="h-9 w-9">
                <Settings className="h-4 w-4" />
                <span className="sr-only">{t("settings")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("settings")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </header>

      <SettingsDialog isOpen={showSettings} onClose={() => setShowSettings(false)} />

      <ConfirmDialog
        isOpen={showSolveConfirm}
        onClose={() => setShowSolveConfirm(false)}
        onConfirm={confirmAutoSolve}
        title={t("autoSolveTitle")}
        description={t("autoSolveDescription")}
        confirmText={t("solve")}
        cancelText={t("cancel")}
      />
    </TooltipProvider>
  )
}
