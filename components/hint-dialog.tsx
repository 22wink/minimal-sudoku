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
import { useI18n } from "@/lib/i18n-context"

interface HintDialogProps {
  hint: Hint | null
  isOpen: boolean
  onClose: () => void
  onApply: () => void
}

export function HintDialog({ hint, isOpen, onClose, onApply }: HintDialogProps) {
  const { t } = useI18n()
  
  if (!hint) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">💡 {t("hintTitle")}: {hint.technique}</DialogTitle>
          <DialogDescription className="text-left">{hint.explanation}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">
              {t("row")} {hint.row + 1}, {t("column")} {hint.col + 1}
            </div>
            <div className="text-3xl font-bold text-primary">{hint.value}</div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            {t("justShowMe")}
          </Button>
          <Button onClick={onApply}>{t("applyHint")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
