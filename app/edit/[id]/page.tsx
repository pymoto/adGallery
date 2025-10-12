"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { createClient } from "@/lib/client"
import type { Ad } from "@/lib/types"

export default function EditAdPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [ad, setAd] = useState<Ad | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    category: "",
    description: "",
    tags: "",
    link_url: "",
  })

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const resolvedParams = await params
        const supabase = createClient()
        
        // 認証チェック
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }

        const { data: adData, error } = await supabase
          .from("ads")
          .select("*")
          .eq("id", resolvedParams.id)
          .single()

        if (error || !adData) {
          setError("広告が見つかりません")
          return
        }

        // 所有者チェック
        if (adData.user_id !== user.id) {
          setError("この広告を編集する権限がありません")
          return
        }

        setAd(adData)
        setFormData({
          title: adData.title,
          company: adData.company,
          category: adData.category,
          description: adData.description,
          tags: adData.tags.join(", "),
          link_url: adData.link_url || "",
        })
      } catch (error) {
        console.error("Error fetching ad:", error)
        setError("広告の取得に失敗しました")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAd()
  }, [params, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const resolvedParams = await params
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const response = await fetch(`/api/ads/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          company: formData.company,
          category: formData.category,
          description: formData.description,
          tags: tagsArray,
          link_url: formData.link_url || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "更新に失敗しました")
      }

      router.push("/mypage")
    } catch (error) {
      console.error("Update error:", error)
      setError(error instanceof Error ? error.message : "更新に失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">読み込み中...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !ad) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => router.push("/mypage")}>
              マイページに戻る
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-4 gap-2"
              onClick={() => router.push("/mypage")}
            >
              <ArrowLeft className="w-4 h-4" />
              マイページに戻る
            </Button>
            <h1 className="text-4xl font-bold text-balance mb-3">広告を編集</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              広告の情報を更新して、より魅力的な広告にしましょう
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>広告情報を編集</CardTitle>
              <CardDescription>変更したい項目を編集してください</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    disabled={isSubmitting}
                    size="lg"
                  >
                    <Save className="w-5 h-5" />
                    {isSubmitting ? "保存中..." : "変更を保存"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/mypage")}
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
      </main>
    </div>
  )
}

