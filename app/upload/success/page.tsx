"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Loader2 } from "lucide-react"
import { createClient } from "@/lib/client"

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [adTitle, setAdTitle] = useState<string>("")

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId) {
        setStatus("error")
        return
      }

      try {
        const supabase = createClient()

        // テスト用セッションIDの処理
        if (sessionId.startsWith("test-session-")) {
          setAdTitle("テスト広告")
          setStatus("success")
          return
        }

        // ローカル決済用セッションIDの処理
        if (sessionId.startsWith("local-session-")) {
          setAdTitle("ローカル広告")
          setStatus("success")
          return
        }

        // 決済情報を確認
        const { data: payment, error: paymentError } = await supabase
          .from("payments")
          .select(`
            id,
            status,
            amount,
            ads!inner(
              id,
              title,
              is_published
            )
          `)
          .eq("stripe_session_id", sessionId)
          .single()

        if (paymentError || !payment) {
          console.error("Payment verification error:", paymentError)
          setStatus("error")
          return
        }

        if (payment.status === "completed" && payment.ads && Array.isArray(payment.ads) && payment.ads.length > 0 && payment.ads[0].is_published) {
          setAdTitle(payment.ads[0].title)
          setStatus("success")
        } else {
          // 決済は完了しているが、広告がまだ公開されていない場合
          // Webhookが処理中かもしれないので少し待つ
          setTimeout(() => {
            setStatus("success")
          }, 2000)
        }

      } catch (error) {
        console.error("Error verifying payment:", error)
        setStatus("error")
      }
    }

    verifyPayment()
  }, [sessionId])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-primary" />
                <h2 className="text-2xl font-bold mb-2">処理中...</h2>
                <p className="text-muted-foreground">広告を公開しています。しばらくお待ちください。</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">エラーが発生しました</CardTitle>
                <CardDescription>広告の公開に失敗しました。サポートにお問い合わせください。</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push("/")} className="w-full">
                  ホームに戻る
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-3xl font-bold mb-2">決済完了！</h2>
              <p className="text-muted-foreground mb-4">
                お支払いが完了しました。広告は管理者の承認後に公開されます。
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <strong>承認プロセス：</strong> 管理者が内容を確認し、承認後（通常24時間以内）にギャラリーに公開されます。
                </p>
              </div>
              {adTitle && (
                <p className="text-lg font-medium text-primary mb-8">
                  「{adTitle}」
                </p>
              )}
              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push("/")} size="lg">
                  ギャラリーを見る
                </Button>
                <Button onClick={() => router.push("/upload")} variant="outline" size="lg">
                  別の広告を投稿
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-primary" />
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
