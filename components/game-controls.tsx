"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Edit3, Eraser, Undo, Redo, Lightbulb } from "lucide-react"
import type { GameMode } from "./sudoku-game"
import { useI18n } from "@/lib/i18n-context"

interface GameControlsProps {
  gameMode: GameMode
  onToggleMode: () => void
  onNumberInput: (number: number) => void
  onClear: () => void
  onUndo: () => void
  onRedo: () => void
  onHint: () => void
  canUndo: boolean
  canRedo: boolean
  showGridOutline?: boolean
  onToggleGridOutline?: (show: boolean) => void
}

export function GameControls({
  gameMode,
  onToggleMode,
  onNumberInput,
  onClear,
  onUndo,
  onRedo,
  onHint,
  canUndo,
  canRedo,
}: GameControlsProps) {
  const { t } = useI18n()
  
  return (
    <TooltipProvider>
      <div className="w-full space-y-4">
        {/* Number pad */}
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((number) => (
            <Button
              key={number}
              variant="outline"
              size="lg"
              onClick={() => onNumberInput(number)}
              className="aspect-square text-lg font-medium"
            >
              {number}
            </Button>
          ))}
        </div>

        {/* Action buttons with tooltips */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={gameMode === "notes" ? "default" : "outline"}
                size="sm"
                onClick={onToggleMode}
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                {t("notes")}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("toggleNotesMode")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onClear} className="flex items-center gap-2 bg-transparent">
                <Eraser className="h-4 w-4" />
                {t("clear")}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("clearCell")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onUndo}
                disabled={!canUndo}
                className="flex items-center gap-2 bg-transparent"
              >
                <Undo className="h-4 w-4" />
                {t("undo")}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("undoMove")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onRedo}
                disabled={!canRedo}
                className="flex items-center gap-2 bg-transparent"
              >
                <Redo className="h-4 w-4" />
                {t("redo")}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("redoMove")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onHint} className="flex items-center gap-2 bg-transparent">
                <Lightbulb className="h-4 w-4" />
                {t("hint")}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("getHint")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
