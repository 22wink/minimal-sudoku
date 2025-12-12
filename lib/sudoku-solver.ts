export class SudokuSolver {
  private grid: number[][]

  constructor(grid: number[][]) {
    this.grid = grid.map((row) => [...row])
  }

  // Check if a number can be placed at a specific position
  private isValid(row: number, col: number, num: number): boolean {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (this.grid[row][x] === num) return false
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (this.grid[x][col] === num) return false
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.grid[boxRow + i][boxCol + j] === num) return false
      }
    }

    return true
  }

  // Solve the puzzle using backtracking
  solve(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.isValid(row, col, num)) {
              this.grid[row][col] = num

              if (this.solve()) {
                return true
              }

              this.grid[row][col] = 0
            }
          }
          return false
        }
      }
    }
    return true
  }

  // Get the solved grid
  getSolution(): number[][] {
    return this.grid.map((row) => [...row])
  }

  // Solve and return the solution
  static solvePuzzle(grid: number[][]): number[][] | null {
    const solver = new SudokuSolver(grid)
    if (solver.solve()) {
      return solver.getSolution()
    }
    return null
  }
}

export class SudokuValidator {
  // Check if the current grid state is valid (no conflicts)
  static isValidState(grid: (number | null)[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = grid[row][col]
        if (value !== null) {
          // Temporarily remove the value to check if it's valid in this position
          const tempGrid = grid.map((r) => [...r])
          tempGrid[row][col] = null

          if (!this.canPlaceNumber(tempGrid, row, col, value)) {
            return false
          }
        }
      }
    }
    return true
  }

  // Check if a number can be placed at a specific position
  static canPlaceNumber(grid: (number | null)[][], row: number, col: number, num: number): boolean {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (x !== col && grid[row][x] === num) return false
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (x !== row && grid[x][col] === num) return false
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const currentRow = boxRow + i
        const currentCol = boxCol + j
        if (currentRow !== row && currentCol !== col && grid[currentRow][currentCol] === num) {
          return false
        }
      }
    }

    return true
  }

  // Check if the puzzle is complete and correct
  static isComplete(grid: (number | null)[][]): boolean {
    // Check if all cells are filled
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) return false
      }
    }

    // Check if the solution is valid
    return this.isValidState(grid)
  }

  // Get all conflicts in the current grid
  static getConflicts(grid: (number | null)[][]): Set<string> {
    const conflicts = new Set<string>()

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = grid[row][col]
        if (value !== null) {
          // Check for conflicts in row
          for (let x = 0; x < 9; x++) {
            if (x !== col && grid[row][x] === value) {
              conflicts.add(`${row}-${col}`)
              conflicts.add(`${row}-${x}`)
            }
          }

          // Check for conflicts in column
          for (let x = 0; x < 9; x++) {
            if (x !== row && grid[x][col] === value) {
              conflicts.add(`${row}-${col}`)
              conflicts.add(`${x}-${col}`)
            }
          }

          // Check for conflicts in 3x3 box
          const boxRow = Math.floor(row / 3) * 3
          const boxCol = Math.floor(col / 3) * 3

          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              const currentRow = boxRow + i
              const currentCol = boxCol + j
              if (currentRow !== row && currentCol !== col && grid[currentRow][currentCol] === value) {
                conflicts.add(`${row}-${col}`)
                conflicts.add(`${currentRow}-${currentCol}`)
              }
            }
          }
        }
      }
    }

    return conflicts
  }
}

// Convert SudokuCell grid to number grid for solver
export function sudokuGridToNumberGrid(grid: import("@/components/sudoku-game").SudokuCell[][]): number[][] {
  return grid.map((row) => row.map((cell) => cell.value || 0))
}
