"use client"

import { useState, useCallback, useEffect } from "react"
import { SudokuGrid } from "./sudoku-grid"
import { GameHeader } from "./game-header"
import { GameControls } from "./game-controls"
import { SudokuGenerator, numberGridToSudokuGrid, type Difficulty } from "@/lib/sudoku-generator"
import { SudokuValidator } from "@/lib/sudoku-solver"
import { SudokuHintGenerator, type Hint } from "@/lib/sudoku-hints"
import { CompletionCelebration } from "./completion-celebration"
import { useI18n } from "@/lib/i18n-context"

export type SudokuCell = {
  value: number | null
  isGiven: boolean
  notes: number[]
  isSelected: boolean
  isHighlighted: boolean
  hasConflict: boolean
  isHinted: boolean
}

export type GameMode = "normal" | "notes"

interface GameState {
  grid: SudokuCell[][]
  selectedCell: { row: number; col: number } | null
  gameMode: GameMode
}

export function SudokuGame() {
  const { t, tHint } = useI18n()
  
  // Initialize empty 9x9 grid
  const initializeGrid = (): SudokuCell[][] => {
    return Array(9)
      .fill(null)
      .map(() =>
        Array(9)
          .fill(null)
          .map(() => ({
            value: null,
            isGiven: false,
            notes: [],
            isSelected: false,
            isHighlighted: false,
            hasConflict: false,
            isHinted: false,
          })),
      )
  }

  const [grid, setGrid] = useState<SudokuCell[][]>(initializeGrid)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [gameMode, setGameMode] = useState<GameMode>("normal")
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [solution, setSolution] = useState<number[][] | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSolving, setIsSolving] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  // Added undo/redo and hint functionality
  const [gameHistory, setGameHistory] = useState<GameState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentHint, setCurrentHint] = useState<Hint | null>(null)
  const [showHintDialog, setShowHintDialog] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  const handleToggleGridOutline = useCallback((show: boolean) => {
    localStorage.setItem("sudoku-grid-outline", JSON.stringify(show))
  }, [])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && !isComplete) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, isComplete])

  // Save game state for undo/redo
  const saveGameState = useCallback((stateToSave: GameState) => {
    setHistoryIndex((currentIndex) => {
      setGameHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, currentIndex + 1)
        newHistory.push(stateToSave)
        return newHistory.slice(-50) // Keep last 50 states
      })
      return Math.min(currentIndex + 1, 49)
    })
  }, [])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = gameHistory[historyIndex - 1]
      setGrid(prevState.grid)
      setSelectedCell(prevState.selectedCell)
      setGameMode(prevState.gameMode)
      setHistoryIndex((prev) => prev - 1)
    }
  }, [gameHistory, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < gameHistory.length - 1) {
      const nextState = gameHistory[historyIndex + 1]
      setGrid(nextState.grid)
      setSelectedCell(nextState.selectedCell)
      setGameMode(nextState.gameMode)
      setHistoryIndex((prev) => prev + 1)
    }
  }, [gameHistory, historyIndex])

  // Get hint functionality
  const getHint = useCallback(() => {
    const numberGrid = grid.map((row) => row.map((cell) => cell.value))
    const hint = SudokuHintGenerator.getHint(numberGrid, {
      nakedSingle: t("nakedSingle"),
      nakedSingleExplanation: tHint.nakedSingleExplanation,
      hiddenSingle: t("hiddenSingle"),
      hiddenSingleRow: tHint.hiddenSingleRow,
      hiddenSingleColumn: tHint.hiddenSingleColumn,
      hiddenSingleBox: tHint.hiddenSingleBox,
    })

    if (hint) {
      // Clear previous hints
      setGrid((prevGrid) => prevGrid.map((row) => row.map((cell) => ({ ...cell, isHinted: false }))))

      // Highlight the hinted cell and show the number briefly
      setGrid((prevGrid) => {
        const newGrid = [...prevGrid]
        newGrid[hint.row][hint.col] = {
          ...newGrid[hint.row][hint.col],
          isHinted: true,
          notes: [...newGrid[hint.row][hint.col].notes, hint.value].filter((n, i, arr) => arr.indexOf(n) === i).sort(),
        }
        return newGrid
      })

      // Auto-clear hint after 3 seconds
      setTimeout(() => {
        setGrid((prevGrid) => prevGrid.map((row) => row.map((cell) => ({ ...cell, isHinted: false }))))
      }, 3000)
    }
  }, [grid])

  const updateConflicts = useCallback((newGrid: SudokuCell[][]) => {
    const numberGrid = newGrid.map((row) => row.map((cell) => cell.value))
    const conflicts = SudokuValidator.getConflicts(numberGrid)

    return newGrid.map((row, rowIndex) =>
      row.map((cell, colIndex) => ({
        ...cell,
        hasConflict: conflicts.has(`${rowIndex}-${colIndex}`),
      })),
    )
  }, [])

  const checkCompletion = useCallback((newGrid: SudokuCell[][]) => {
    const numberGrid = newGrid.map((row) => row.map((cell) => cell.value))
    const complete = SudokuValidator.isComplete(numberGrid)
    setIsComplete(complete)
    if (complete) {
      setIsTimerRunning(false)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 4000) // Extended celebration time
    }
    return complete
  }, [])

  const applyHint = useCallback(() => {
    if (!currentHint) return

    setGrid((prevGrid) => {
      // Save current state before applying hint using functional update
      const currentState: GameState = {
        grid: prevGrid.map((r) => r.map((c) => ({ ...c }))),
        selectedCell,
        gameMode,
      }
      saveGameState(currentState)

      const newGrid = [...prevGrid]
      const cell = { ...newGrid[currentHint.row][currentHint.col] }
      cell.value = currentHint.value
      cell.notes = []
      cell.isHinted = false
      newGrid[currentHint.row][currentHint.col] = cell

      const gridWithConflicts = updateConflicts(newGrid)
      checkCompletion(gridWithConflicts)
      return gridWithConflicts
    })

    setCurrentHint(null)
    setShowHintDialog(false)
  }, [currentHint, selectedCell, gameMode, updateConflicts, checkCompletion, saveGameState])

  const generateNewPuzzle = useCallback(
    async (newDifficulty?: Difficulty) => {
      setIsGenerating(true)
      const targetDifficulty = newDifficulty || difficulty

      await new Promise((resolve) => setTimeout(resolve, 100))

      const generator = new SudokuGenerator()
      const { puzzle, solution: newSolution } = generator.generatePuzzle(targetDifficulty)

      const sudokuGrid = numberGridToSudokuGrid(puzzle)
      const gridWithConflicts = updateConflicts(sudokuGrid)
      setGrid(gridWithConflicts)
      setSolution(newSolution)
      setSelectedCell(null)
      setIsComplete(false)
      setIsGenerating(false)

      // Reset game state for new puzzle
      setGameHistory([])
      setHistoryIndex(-1)
      setTimer(0)
      setIsTimerRunning(true)
      setCurrentHint(null)
      setShowHintDialog(false)
    },
    [difficulty, updateConflicts],
  )

  const handleAutoSolve = useCallback(async () => {
    if (!solution) return

    setIsSolving(true)

    const solvedGrid = numberGridToSudokuGrid(solution)
    const emptyCells: { row: number; col: number; value: number }[] = []

    // Find all empty cells that need to be filled
    grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!cell.value && !cell.isGiven) {
          emptyCells.push({ row: r, col: c, value: solvedGrid[r][c].value! })
        }
      })
    })

    // Shuffle the cells for random animation
    const shuffledCells = [...emptyCells].sort(() => Math.random() - 0.5)
    const totalTime = 2000 // 2 seconds total
    const delayPerCell = totalTime / shuffledCells.length

    // Animate each cell with random timing
    for (let i = 0; i < shuffledCells.length; i++) {
      const delay = Math.random() * delayPerCell * 0.5 + i * delayPerCell

      setTimeout(() => {
        const { row, col, value } = shuffledCells[i]
        setGrid((prevGrid) => {
          const newGrid = [...prevGrid]
          newGrid[row][col] = { ...newGrid[row][col], value }
          return newGrid
        })
      }, delay)
    }

    // Final validation after all animations
    setTimeout(() => {
      const finalGrid = updateConflicts(solvedGrid)
      setGrid(finalGrid)
      checkCompletion(finalGrid)
      setIsSolving(false)
    }, totalTime + 100)
  }, [solution, grid, updateConflicts, checkCompletion])

  useEffect(() => {
    generateNewPuzzle()
  }, [])

  const handleDifficultyChange = useCallback(
    (newDifficulty: Difficulty) => {
      setDifficulty(newDifficulty)
      generateNewPuzzle(newDifficulty)
    },
    [generateNewPuzzle],
  )

  const handleCellSelect = useCallback(
    (row: number, col: number) => {
      if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
        setSelectedCell(null)
        setGrid((prevGrid) =>
          prevGrid.map((gridRow) =>
            gridRow.map((cell) => ({
              ...cell,
              isSelected: false,
              isHighlighted: false,
            })),
          ),
        )
        return
      }

      setSelectedCell({ row, col })

      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((gridRow, r) =>
          gridRow.map((cell, c) => ({
            ...cell,
            isSelected: r === row && c === col,
            isHighlighted:
              r === row ||
              c === col ||
              (Math.floor(r / 3) === Math.floor(row / 3) && Math.floor(c / 3) === Math.floor(col / 3)),
          })),
        )
        return newGrid
      })
    },
    [selectedCell],
  )

  const handleNumberInput = useCallback(
    (number: number) => {
      if (!selectedCell) return

      const { row, col } = selectedCell

      setGrid((prevGrid) => {
        // Save current state before making changes using functional update
        const currentState: GameState = {
          grid: prevGrid.map((r) => r.map((c) => ({ ...c }))),
          selectedCell,
          gameMode,
        }
        saveGameState(currentState)

        const newGrid = [...prevGrid]
        const cell = { ...newGrid[row][col] }

        if (cell.isGiven) return prevGrid

        if (gameMode === "normal") {
          cell.value = cell.value === number ? null : number
          cell.notes = []
        } else {
          if (cell.notes.includes(number)) {
            cell.notes = cell.notes.filter((n) => n !== number)
          } else {
            cell.notes = [...cell.notes, number].sort()
          }
          cell.value = null
        }

        newGrid[row][col] = cell

        const gridWithConflicts = updateConflicts(newGrid)
        checkCompletion(gridWithConflicts)
        return gridWithConflicts
      })
    },
    [selectedCell, gameMode, updateConflicts, checkCompletion, saveGameState],
  )

  const handleClearCell = useCallback(() => {
    if (!selectedCell) return

    const { row, col } = selectedCell

    setGrid((prevGrid) => {
      // Save current state before clearing using functional update
      const currentState: GameState = {
        grid: prevGrid.map((r) => r.map((c) => ({ ...c }))),
        selectedCell,
        gameMode,
      }
      saveGameState(currentState)

      const newGrid = [...prevGrid]
      const cell = { ...newGrid[row][col] }

      if (cell.isGiven) return prevGrid

      cell.value = null
      cell.notes = []
      newGrid[row][col] = cell

      const gridWithConflicts = updateConflicts(newGrid)
      checkCompletion(gridWithConflicts)
      return gridWithConflicts
    })
  }, [selectedCell, gameMode, updateConflicts, checkCompletion, saveGameState])

  const toggleGameMode = useCallback(() => {
    setGameMode((prev) => (prev === "normal" ? "notes" : "normal"))
  }, [])

  // Keyboard input handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle keyboard input if user is typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement && event.target.isContentEditable)
      ) {
        return
      }

      // Handle number keys (1-9)
      const number = parseInt(event.key)
      if (number >= 1 && number <= 9) {
        event.preventDefault()
        handleNumberInput(number)
        return
      }

      // Handle Delete or Backspace to clear cell
      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault()
        handleClearCell()
        return
      }

      // Handle arrow keys to navigate
      if (selectedCell) {
        const { row, col } = selectedCell
        let newRow = row
        let newCol = col

        switch (event.key) {
          case "ArrowUp":
            event.preventDefault()
            newRow = Math.max(0, row - 1)
            handleCellSelect(newRow, col)
            return
          case "ArrowDown":
            event.preventDefault()
            newRow = Math.min(8, row + 1)
            handleCellSelect(newRow, col)
            return
          case "ArrowLeft":
            event.preventDefault()
            newCol = Math.max(0, col - 1)
            handleCellSelect(row, newCol)
            return
          case "ArrowRight":
            event.preventDefault()
            newCol = Math.min(8, col + 1)
            handleCellSelect(row, newCol)
            return
        }
      }

      // Handle spacebar to toggle notes mode
      if (event.key === " ") {
        event.preventDefault()
        toggleGameMode()
        return
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedCell, handleNumberInput, handleClearCell, handleCellSelect, toggleGameMode])

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto px-4 py-6 gap-6 sudoku-container">
      <GameHeader
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
        onNewGame={() => generateNewPuzzle()}
        onAutoSolve={handleAutoSolve}
        isGenerating={isGenerating}
        isSolving={isSolving}
        isComplete={isComplete}
        timer={timer}
      />

      <div className="flex-1 flex flex-col items-center justify-center gap-6 relative">
        {showCelebration && <CompletionCelebration />}

        <SudokuGrid grid={grid} onCellSelect={handleCellSelect} />

        <GameControls
          gameMode={gameMode}
          onToggleMode={toggleGameMode}
          onNumberInput={handleNumberInput}
          onClear={handleClearCell}
          onUndo={undo}
          onRedo={redo}
          onHint={getHint}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < gameHistory.length - 1}
        />
      </div>
    </div>
  )
}
