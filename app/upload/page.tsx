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
import { X, ImageIcon, Upload } from "lucide-react"
import { createClient } from "@/lib/client"

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
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 認証チェック
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth/login")
        return
      }
      
      setIsLoading(false)
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
      
      if (userError || !user) {
        setError("ログインが必要です。ログインページに移動してください。")
        setIsSubmitting(false)
        return
      }

      // タグを配列に変換
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      // 広告データを挿入
      const insertData: any = {
        title: formData.title,
        company: formData.company,
        category: formData.category,
        image_url: imagePreview,
        description: formData.description,
        tags: tagsArray,
        user_id: user.id, // ユーザーIDを追加
      }

      // link_urlが存在する場合のみ追加
      if (formData.link_url && formData.link_url.trim()) {
        insertData.link_url = formData.link_url.trim()
      }

      const { data, error: insertError } = await supabase
        .from("ads")
        .insert(insertData)
        .select()

      if (insertError) {
        console.error("Error inserting ad:", insertError)
        console.error("Full error details:", JSON.stringify(insertError, null, 2))
        
        // link_urlカラムが存在しない場合のエラーメッセージ
        if (insertError.message && insertError.message.includes('link_url')) {
          setError(`データベースにlink_urlカラムが存在しません。管理者にお問い合わせください。`)
        } else {
          setError(`広告の公開に失敗しました: ${insertError.message || insertError.details || '不明なエラー'}`)
        }
        return
      }

      console.log("Ad created successfully:", data)
      router.push("/")
    } catch (error) {
      console.error("Error:", error)
      setError("予期しないエラーが発生しました。")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-balance mb-3">広告をアップロード</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              あなたの広告をギャラリーに追加して、多くの人にインスピレーションを提供しましょう
            </p>
          </div>

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
                      required
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
                    disabled={isSubmitting}
                    size="lg"
                  >
                    <Upload className="w-5 h-5" />
                    {isSubmitting ? "公開中..." : "広告を公開"}
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
      </main>
    </div>
  )
}

