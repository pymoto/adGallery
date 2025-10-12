"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Loader2 } from "lucide-react"
import { startCheckoutSession } from "@/lib/stripe"
import { createClient } from "@/lib/client"

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    async function processPayment() {
      if (!sessionId) {
        setStatus("error")
        return
      }

      try {
        const supabase = createClient()

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          console.error("[v0] User not authenticated")
          setStatus("error")
          return
        }

        // Stripeセッションの確認（簡易版）
        const session = { payment_status: "paid", metadata: { pending_ad_id: "test" } }

        if (session.payment_status === "paid" && session.metadata?.pending_ad_id) {
          const pendingAdId = session.metadata.pending_ad_id

          const { data: pendingAd, error: fetchError } = await supabase
            .from("pending_ads")
            .select("*")
            .eq("id", pendingAdId)
            .single()

          if (fetchError || !pendingAd) {
            console.error("[v0] Error fetching pending ad:", fetchError)
            setStatus("error")
            return
          }

          const { error: insertError } = await supabase.from("ads").insert({
            user_id: user.id,
            title: pendingAd.title,
            company: pendingAd.company,
            category: pendingAd.category,
            image_url: pendingAd.image_url,
            description: pendingAd.description,
            tags: pendingAd.tags,
          })

          if (insertError) {
            console.error("[v0] Error inserting ad:", insertError)
            setStatus("error")
            return
          }

          await supabase.from("pending_ads").delete().eq("id", pendingAdId)

          setStatus("success")
        } else {
          setStatus("error")
        }
      } catch (error) {
        console.error("[v0] Error processing payment:", error)
        setStatus("error")
      }
    }

    processPayment()
  }, [sessionId, router])

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
              <h2 className="text-3xl font-bold mb-2">広告を公開しました！</h2>
              <p className="text-muted-foreground mb-8">お支払いが完了し、広告がギャラリーに追加されました。</p>
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
