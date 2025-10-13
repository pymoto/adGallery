"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  User,
  Mail
} from "lucide-react"

export default function GrantAdminPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleGrantAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/admin/grant-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: data.message })
        setEmail("")
      } else {
        setMessage({ type: "error", text: data.error })
      }
    } catch (error) {
      setMessage({ type: "error", text: "管理者権限の付与に失敗しました" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">管理者権限付与</h1>
        <p className="text-muted-foreground mt-2">
          指定したユーザーに管理者権限を付与します
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            管理者権限付与
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGrantAdmin} className="space-y-4">
            <div>
              <Label htmlFor="email">ユーザーのメールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                管理者権限を付与するユーザーのメールアドレスを入力してください
              </p>
            </div>

            {message && (
              <Alert className={message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                {message.type === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={message.type === "success" ? "text-green-700" : "text-red-700"}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isLoading || !email.trim()}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  処理中...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  管理者権限を付与
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>注意事項</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
            <p className="text-sm">
              管理者権限を付与されたユーザーは、システム全体を管理できます。
            </p>
          </div>
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-blue-500 mt-0.5" />
            <p className="text-sm">
              対象ユーザーは事前にアカウント登録が完了している必要があります。
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Mail className="h-4 w-4 text-green-500 mt-0.5" />
            <p className="text-sm">
              正確なメールアドレスを入力してください。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
