"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, ImageIcon, Upload, CreditCard } from "lucide-react"
import { createClient } from "@/lib/client"
import { PricingDisplay } from "@/components/pricing-display"

export default function UploadPage() {
  const router = useRouter()
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    category: "",
    description: "",
    tags: "",
    link_url: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCreatingPayment, setIsCreatingPayment] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 認証チェック
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { user }, error } = await supabase.auth.getUser()
        
        console.log("Auth check:", { user, error })
        
        if (error) {
          console.error("Auth error:", error)
          setError("認証エラーが発生しました。ログインし直してください。")
          router.push("/auth/login")
          return
        }
        
        if (!user) {
          console.log("No user found, redirecting to login")
          router.push("/auth/login")
          return
        }
        
        console.log("User authenticated:", user.id)
        setIsLoading(false)
      } catch (error) {
        console.error("Auth check failed:", error)
        setError("認証チェックに失敗しました。")
        router.push("/auth/login")
      }
    }
    
    checkAuth()
  }, [router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // フォームデータを検証
    if (!formData.title || !formData.company || !formData.category || !formData.description || !imagePreview) {
      setError("すべての必須項目を入力してください")
      setIsSubmitting(false)
      return
    }

    const supabase = createClient()

    try {
      // 現在のユーザーを取得
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      console.log("User authentication check:", { user, userError })
      
      if (userError || !user) {
        console.error("Authentication failed:", userError)
        setError("ログインが必要です。ログインページに移動してください。")
        setIsSubmitting(false)
        return
      }

      console.log("User ID for ad creation:", user.id)

      // タグを配列に変換
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      // 広告データを挿入（未公開状態）
      const insertData: any = {
        title: formData.title,
        company: formData.company,
        category: formData.category,
        image_url: imagePreview,
        description: formData.description,
        tags: tagsArray,
        user_id: user.id,
        is_published: false, // 決済完了まで未公開
      }

      // link_urlが存在する場合のみ追加
      if (formData.link_url && formData.link_url.trim()) {
        insertData.link_url = formData.link_url.trim()
      }

      // データベースに直接挿入
      const { data: adData, error: insertError } = await supabase
        .from("ads")
        .insert(insertData)
        .select()
        .single()

      if (insertError) {
        console.error("Error inserting ad:", insertError)
        console.error("Full error details:", JSON.stringify(insertError, null, 2))
        setError(`広告の作成に失敗しました: ${insertError.message || insertError.details || JSON.stringify(insertError) || '不明なエラー'}`)
        setIsSubmitting(false)
        return
      }

      // 決済セッションを作成
      setIsCreatingPayment(true)
      
      try {
        console.log("Creating payment for ad:", adData.id)
        
        const paymentResponse = await fetch("/api/payments/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adId: adData.id }),
        })

        console.log("Payment response status:", paymentResponse.status)
        
        if (!paymentResponse.ok) {
          const errorData = await paymentResponse.json()
          console.error("Payment API error:", errorData)
          throw new Error(errorData.error || "決済セッションの作成に失敗しました")
        }

        const paymentData = await paymentResponse.json()
        console.log("Payment response data:", paymentData)
        console.log("Payment data keys:", Object.keys(paymentData))
        console.log("Payment URL:", paymentData.url)
        console.log("Payment sessionId:", paymentData.sessionId)
        
        // Stripe Checkoutにリダイレクト
        if (paymentData.url) {
          console.log("Redirecting to Stripe:", paymentData.url)
          window.location.href = paymentData.url
        } else {
          console.error("No payment URL received:", paymentData)
          console.error("Available keys:", Object.keys(paymentData))
          throw new Error("決済URLが取得できませんでした")
        }

      } catch (paymentError) {
        console.error("Payment creation error:", paymentError)
        const errorMessage = paymentError instanceof Error ? paymentError.message : "不明なエラー"
        setError(`決済処理に失敗しました: ${errorMessage}`)
        setIsSubmitting(false)
        setIsCreatingPayment(false)
        return
      }

    } catch (error) {
      console.error("Error:", error)
      setError("予期しないエラーが発生しました。")
      setIsSubmitting(false)
      setIsCreatingPayment(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">認証を確認中...</p>
          {error && (
            <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-balance mb-3">広告をアップロード</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              あなたの広告をギャラリーに追加して、多くの人にインスピレーションを提供しましょう
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
            <CardHeader>
              <CardTitle>広告情報を入力</CardTitle>
              <CardDescription>すべての項目を入力して、広告をギャラリーに公開しましょう</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 画像アップロード */}
                <div className="space-y-2">
                  <Label htmlFor="image">広告画像</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="プレビュー"
                          className="max-h-96 mx-auto rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => setImagePreview("")}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="image" className="cursor-pointer text-primary hover:underline">
                            クリックして画像を選択
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">PNG, JPG, GIF (最大10MB)</p>
                        </div>
                      </div>
                    )}
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                {/* タイトル */}
                <div className="space-y-2">
                  <Label htmlFor="title">広告タイトル</Label>
                  <Input
                    id="title"
                    placeholder="例: 春の新作コレクション"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                {/* 企業名 */}
                <div className="space-y-2">
                  <Label htmlFor="company">企業名</Label>
                  <Input
                    id="company"
                    placeholder="例: Fashion Brand Co."
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>

                {/* カテゴリー */}
                <div className="space-y-2">
                  <Label htmlFor="category">カテゴリー</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="カテゴリーを選択" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      <SelectItem value="fashion">ファッション</SelectItem>
                      <SelectItem value="tech">テクノロジー</SelectItem>
                      <SelectItem value="food">飲食</SelectItem>
                      <SelectItem value="travel">旅行</SelectItem>
                      <SelectItem value="beauty">美容</SelectItem>
                      <SelectItem value="sports">スポーツ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 説明 */}
                <div className="space-y-2">
                  <Label htmlFor="description">説明</Label>
                  <Textarea
                    id="description"
                    placeholder="広告の詳細な説明を入力してください"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                {/* タグ */}
                <div className="space-y-2">
                  <Label htmlFor="tags">タグ</Label>
                  <Input
                    id="tags"
                    placeholder="例: 春, エレガント, ファッション（カンマ区切り）"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">カンマで区切って複数のタグを入力できます</p>
                </div>

                {/* リンクURL */}
                <div className="space-y-2">
                  <Label htmlFor="link_url">リンクURL（任意）</Label>
                  <Input
                    id="link_url"
                    type="url"
                    placeholder="例: https://example.com"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">
                    広告に関連するWebサイトや商品ページのURLを入力してください
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {/* 送信ボタン */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 gap-2 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow"
                    disabled={isSubmitting || isCreatingPayment}
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Upload className="w-5 h-5" />
                        投稿中...
                      </>
                    ) : isCreatingPayment ? (
                      <>
                        <CreditCard className="w-5 h-5" />
                        決済処理中...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        決済して投稿
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/")}
                    disabled={isSubmitting}
                    size="lg"
                    className="h-12"
                  >
                    キャンセル
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
            </div>
            
            {/* 価格表示 */}
            <div className="lg:col-span-1">
              <PricingDisplay />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}