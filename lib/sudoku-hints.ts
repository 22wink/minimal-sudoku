import { SudokuValidator } from "./sudoku-solver"

export interface Hint {
  row: number
  col: number
  value: number
  technique: string
  explanation: string
}

export class SudokuHintGenerator {
  // Find the next logical move using basic techniques
  static getHint(grid: (number | null)[][]): Hint | null {
    // Try naked singles first (cells with only one possible value)
    const nakedSingle = this.findNakedSingle(grid)
    if (nakedSingle) return nakedSingle

    // Try hidden singles (numbers that can only go in one place in a unit)
    const hiddenSingle = this.findHiddenSingle(grid)
    if (hiddenSingle) return hiddenSingle

    return null
  }

  private static findNakedSingle(grid: (number | null)[][]): Hint | null {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) {
          const possibleValues = this.getPossibleValues(grid, row, col)
          if (possibleValues.length === 1) {
            return {
              row,
              col,
              value: possibleValues[0],
              technique: "Naked Single",
              explanation: `Only ${possibleValues[0]} can go in this cell`,
            }
          }
        }
      }
    }
    return null
  }

  private static findHiddenSingle(grid: (number | null)[][]): Hint | null {
    // Check rows
    for (let row = 0; row < 9; row++) {
      for (let num = 1; num <= 9; num++) {
        if (!this.isNumberInRow(grid, row, num)) {
          const possibleCols = []
          for (let col = 0; col < 9; col++) {
            if (grid[row][col] === null && SudokuValidator.canPlaceNumber(grid, row, col, num)) {
              possibleCols.push(col)
            }
          }
          if (possibleCols.length === 1) {
            return {
              row,
              col: possibleCols[0],
              value: num,
              technique: "Hidden Single",
              explanation: `${num} can only go in this position in row ${row + 1}`,
            }
          }
        }
      }
    }

    // Check columns
    for (let col = 0; col < 9; col++) {
      for (let num = 1; num <= 9; num++) {
        if (!this.isNumberInColumn(grid, col, num)) {
          const possibleRows = []
          for (let row = 0; row < 9; row++) {
            if (grid[row][col] === null && SudokuValidator.canPlaceNumber(grid, row, col, num)) {
              possibleRows.push(row)
            }
          }
          if (possibleRows.length === 1) {
            return {
              row: possibleRows[0],
              col,
              value: num,
              technique: "Hidden Single",
              explanation: `${num} can only go in this position in column ${col + 1}`,
            }
          }
        }
      }
    }

    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        for (let num = 1; num <= 9; num++) {
          if (!this.isNumberInBox(grid, boxRow * 3, boxCol * 3, num)) {
            const possibleCells = []
            for (let i = 0; i < 3; i++) {
              for (let j = 0; j < 3; j++) {
                const row = boxRow * 3 + i
                const col = boxCol * 3 + j
                if (grid[row][col] === null && SudokuValidator.canPlaceNumber(grid, row, col, num)) {
                  possibleCells.push({ row, col })
                }
              }
            }
            if (possibleCells.length === 1) {
              return {
                row: possibleCells[0].row,
                col: possibleCells[0].col,
                value: num,
                technique: "Hidden Single",
                explanation: `${num} can only go in this position in the 3×3 box`,
              }
            }
          }
        }
      }
    }

    return null
  }

  private static getPossibleValues(grid: (number | null)[][], row: number, col: number): number[] {
    const possible = []
    for (let num = 1; num <= 9; num++) {
      if (SudokuValidator.canPlaceNumber(grid, row, col, num)) {
        possible.push(num)
      }
    }
    return possible
  }

  private static isNumberInRow(grid: (number | null)[][], row: number, num: number): boolean {
    return grid[row].includes(num)
  }

  private static isNumberInColumn(grid: (number | null)[][], col: number, num: number): boolean {
    for (let row = 0; row < 9; row++) {
      if (grid[row][col] === num) return true
    }
    return false
  }

  private static isNumberInBox(grid: (number | null)[][], startRow: number, startCol: number, num: number): boolean {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[startRow + i][startCol + j] === num) return true
      }
    }
    return false
  }
}
