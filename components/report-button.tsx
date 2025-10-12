"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Flag, X } from "lucide-react"

interface ReportButtonProps {
  adId: string
  adTitle: string
}

export function ReportButton({ adId, adTitle }: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/ads/${adId}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason,
          description: description.trim() || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: data.message })
        setReason("")
        setDescription("")
        setTimeout(() => {
          setIsOpen(false)
          setMessage(null)
        }, 2000)
      } else {
        setMessage({ type: "error", text: data.error })
      }
    } catch (error) {
      setMessage({ type: "error", text: "通報の送信に失敗しました" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Flag className="w-4 h-4 mr-1" />
        通報
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">不適切なコンテンツを通報</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="ad-title">対象広告</Label>
              <p className="text-sm text-muted-foreground mt-1">{adTitle}</p>
            </div>

            <div>
              <Label htmlFor="reason">通報理由 *</Label>
              <Select value={reason} onValueChange={setReason} required>
                <SelectTrigger>
                  <SelectValue placeholder="理由を選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spam">スパム・詐欺</SelectItem>
                  <SelectItem value="inappropriate">不適切な内容</SelectItem>
                  <SelectItem value="harassment">ハラスメント</SelectItem>
                  <SelectItem value="violence">暴力・脅迫</SelectItem>
                  <SelectItem value="copyright">著作権侵害</SelectItem>
                  <SelectItem value="privacy">プライバシー侵害</SelectItem>
                  <SelectItem value="other">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">詳細説明（任意）</Label>
              <Textarea
                id="description"
                placeholder="具体的な理由や状況を教えてください"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={!reason || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "送信中..." : "通報する"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
