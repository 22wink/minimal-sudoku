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
                "aspect-square flex items-center justify-center text-lg font-medium transition-all",
                "border hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset",
                {
                  // Default border
                  "border-border": !cell.isSelected,
                  // Selected cell border
                  "border-primary": cell.isSelected,
                  // Thick borders for 3x3 boxes
                  "border-r-2": colIndex === 2 || colIndex === 5,
                  "border-b-2": rowIndex === 2 || rowIndex === 5,
                  // Keep foreground color for thick borders when not selected
                  "border-r-foreground": (colIndex === 2 || colIndex === 5) && !cell.isSelected,
                  "border-b-foreground": (rowIndex === 2 || rowIndex === 5) && !cell.isSelected,
                  // Selected cell uses primary color for all borders
                  "border-r-primary": (colIndex === 2 || colIndex === 5) && cell.isSelected,
                  "border-b-primary": (rowIndex === 2 || rowIndex === 5) && cell.isSelected,
                },
                // Cell states
                {
                  "bg-accent": cell.isHighlighted && !cell.isSelected,
                  "bg-destructive/20 text-destructive": cell.hasConflict,
                  "bg-destructive text-destructive-foreground": cell.hasConflict && cell.isSelected,
                  "bg-yellow-200 dark:bg-yellow-800 ring-2 ring-yellow-400 animate-pulse": cell.isHinted,
                },
              )}
              style={{
                // User input color uses theme primary color
                ...(cell.value
                  ? {
                      color: cell.isGiven
                        ? "hsl(var(--given-number))"
                        : "var(--user-input-color)",
                      fontWeight: cell.isGiven ? "700" : "600",
                    }
                  : {}),
              }}
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
