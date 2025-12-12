"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Edit3, Eraser, Undo, Redo, Lightbulb } from "lucide-react"
import type { GameMode } from "./sudoku-game"

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
                Notes
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle between number and notes mode</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onClear} className="flex items-center gap-2 bg-transparent">
                <Eraser className="h-4 w-4" />
                Clear
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear selected cell</p>
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
                Undo
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo last move</p>
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
                Redo
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo last undone move</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onHint} className="flex items-center gap-2 bg-transparent">
                <Lightbulb className="h-4 w-4" />
                Hint
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get a hint for the next move</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
