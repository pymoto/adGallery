"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { createBrowserClient } from "@/lib/client"
import { Mail, AlertCircle, CheckCircle } from "lucide-react"

export default function SignUpSuccessPage() {
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const supabase = createBrowserClient()

  const handleResendEmail = async () => {
    setIsResending(true)
    setResendMessage(null)

    try {
      // URLパラメータからメールアドレスを取得
      const params = new URLSearchParams(window.location.search)
      const email = params.get("email")

      if (!email) {
        setResendMessage({ type: "error", text: "メールアドレスが見つかりません" })
        setIsResending(false)
        return
      }

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      })

      if (error) {
        console.error("[v0] メール再送信エラー:", error)
        setResendMessage({ type: "error", text: "メールの再送信に失敗しました" })
      } else {
        setResendMessage({ type: "success", text: "確認メールを再送信しました" })
      }
    } catch (error) {
      console.error("[v0] メール再送信エラー:", error)
      setResendMessage({ type: "error", text: "エラーが発生しました" })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">メールを確認してください</CardTitle>
            </div>
            <CardDescription>登録ありがとうございます</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                登録が完了しました。メールアドレスに確認メールを送信しましたので、メール内のリンクをクリックしてアカウントを有効化してください。
              </p>

              <div className="rounded-lg bg-muted p-4 space-y-2">
                <p className="text-sm font-medium">メールが届かない場合：</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>迷惑メールフォルダを確認してください</li>
                  <li>数分待ってから再度確認してください</li>
                  <li>下のボタンから確認メールを再送信できます</li>
                </ul>
              </div>

              {resendMessage && (
                <div
                  className={`flex items-center gap-2 rounded-lg p-3 ${
                    resendMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}
                >
                  {resendMessage.type === "success" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <p className="text-sm">{resendMessage.text}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleResendEmail}
                disabled={isResending}
                variant="outline"
                className="w-full bg-transparent"
              >
                {isResending ? "送信中..." : "確認メールを再送信"}
              </Button>

              <Button asChild className="w-full">
                <Link href="/">ホームに戻る</Link>
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                <strong>開発者向け：</strong> 開発環境でメール確認を無効にするには、Supabaseダッシュボード →
                Authentication → Providers → Email → "Confirm email"をOFFにしてください。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
