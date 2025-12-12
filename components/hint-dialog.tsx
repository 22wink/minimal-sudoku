"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Hint } from "@/lib/sudoku-hints"

interface HintDialogProps {
  hint: Hint | null
  isOpen: boolean
  onClose: () => void
  onApply: () => void
}

export function HintDialog({ hint, isOpen, onClose, onApply }: HintDialogProps) {
  if (!hint) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">💡 Hint: {hint.technique}</DialogTitle>
          <DialogDescription className="text-left">{hint.explanation}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">
              Row {hint.row + 1}, Column {hint.col + 1}
            </div>
            <div className="text-3xl font-bold text-primary">{hint.value}</div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Just Show Me
          </Button>
          <Button onClick={onApply}>Apply Hint</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
