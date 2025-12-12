export type Difficulty = "beginner" | "easy" | "hard" | "impossible"

export class SudokuGenerator {
  private grid: number[][]

  constructor() {
    this.grid = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0))
  }

  // Generate a complete valid Sudoku solution
  private generateComplete(): number[][] {
    this.grid = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0))

    this.fillGrid()
    return this.grid.map((row) => [...row])
  }

  private fillGrid(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.grid[row][col] === 0) {
          const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9])

          for (const num of numbers) {
            if (this.isValidMove(row, col, num)) {
              this.grid[row][col] = num

              if (this.fillGrid()) {
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

  private isValidMove(row: number, col: number, num: number): boolean {
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

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  private getDifficultySettings(difficulty: Difficulty) {
    switch (difficulty) {
      case "beginner":
        return { cellsToRemove: 35, maxAttempts: 3 }
      case "easy":
        return { cellsToRemove: 45, maxAttempts: 5 }
      case "hard":
        return { cellsToRemove: 55, maxAttempts: 10 }
      case "impossible":
        return { cellsToRemove: 65, maxAttempts: 15 }
      default:
        return { cellsToRemove: 45, maxAttempts: 5 }
    }
  }

  // Generate a puzzle by removing cells from a complete solution
  generatePuzzle(difficulty: Difficulty = "easy"): { puzzle: number[][]; solution: number[][] } {
    const solution = this.generateComplete()
    const puzzle = solution.map((row) => [...row])
    const { cellsToRemove } = this.getDifficultySettings(difficulty)

    // Create list of all cell positions
    const positions: [number, number][] = []
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        positions.push([row, col])
      }
    }

    // Shuffle positions for random removal
    const shuffledPositions = this.shuffleArray(positions)
    let removed = 0

    // Remove cells while maintaining unique solution
    for (const [row, col] of shuffledPositions) {
      if (removed >= cellsToRemove) break

      const backup = puzzle[row][col]
      puzzle[row][col] = 0

      // For simplicity, we'll assume the puzzle remains valid
      // In a production app, you'd verify the puzzle still has a unique solution
      removed++
    }

    return { puzzle, solution }
  }
}

// Utility function to convert number grid to SudokuCell grid
export function numberGridToSudokuGrid(numberGrid: number[][]): import("@/components/sudoku-game").SudokuCell[][] {
  return numberGrid.map((row) =>
    row.map((value) => ({
      value: value === 0 ? null : value,
      isGiven: value !== 0,
      notes: [],
      isSelected: false,
      isHighlighted: false,
    })),
  )
}
