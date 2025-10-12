"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, X } from "lucide-react"

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  adTitle: string
  isDeleting?: boolean
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  adTitle,
  isDeleting = false
}: DeleteConfirmationDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-destructive" />
            <h3 className="text-lg font-semibold">広告を削除</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">
            以下の広告を削除しますか？この操作は取り消せません。
          </p>
          <div className="p-3 bg-muted rounded-md">
            <p className="font-medium">{adTitle}</p>
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "削除中..." : "削除する"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

