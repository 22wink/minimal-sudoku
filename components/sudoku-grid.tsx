"use client"

import { cn } from "@/lib/utils"
import type { SudokuCell } from "./sudoku-game"

interface SudokuGridProps {
  grid: SudokuCell[][]
  onCellSelect: (row: number, col: number) => void
}

export function SudokuGrid({ grid, onCellSelect }: SudokuGridProps) {
  return (
    <div className="aspect-square w-full max-w-sm mx-auto">
      <div className="grid grid-cols-9 gap-0 rounded-lg overflow-hidden bg-card border-2 border-foreground">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => onCellSelect(rowIndex, colIndex)}
              className={cn(
                "aspect-square flex items-center justify-center text-lg font-medium transition-colors",
                "border border-border hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset",
                {
                  "border-r-2 border-r-foreground": colIndex === 2 || colIndex === 5,
                  "border-b-2 border-b-foreground": rowIndex === 2 || rowIndex === 5,
                },
                // Cell states
                {
                  "bg-primary text-primary-foreground": cell.isSelected,
                  "bg-accent": cell.isHighlighted && !cell.isSelected,
                  "font-bold text-foreground": cell.isGiven,
                  "font-semibold": !cell.isGiven && cell.value,
                  "bg-destructive/20 text-destructive": cell.hasConflict,
                  "bg-destructive text-destructive-foreground": cell.hasConflict && cell.isSelected,
                  "bg-yellow-200 dark:bg-yellow-800 ring-2 ring-yellow-400 animate-pulse": cell.isHinted,
                },
              )}
              style={
                !cell.isGiven && cell.value
                  ? {
                      color: "hsl(var(--user-input))",
                      fontWeight: "600",
                    }
                  : undefined
              }
            >
              {cell.value ? (
                <span className="text-base sm:text-lg">{cell.value}</span>
              ) : cell.notes.length > 0 ? (
                <div className="grid grid-cols-3 gap-0 text-xs leading-none p-0.5">
                  {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                    <span
                      key={num}
                      className={cn(
                        "text-center",
                        cell.notes.includes(num) ? "text-muted-foreground" : "text-transparent",
                        cell.isHinted && cell.notes.includes(num)
                          ? "text-yellow-600 dark:text-yellow-400 font-bold"
                          : "",
                      )}
                    >
                      {num}
                    </span>
                  ))}
                </div>
              ) : null}
            </button>
          )),
        )}
      </div>
    </div>
  )
}
