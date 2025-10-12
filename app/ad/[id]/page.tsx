"use client"

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Heart, Eye, Share2, ArrowLeft, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/client"
import { RelatedAds } from "@/components/related-ads"
import { LikeButton } from "@/components/like-button"
import { useEffect, useState } from "react"
import type { Ad } from "@/lib/types"

export default function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [ad, setAd] = useState<Ad | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [id, setId] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params
        setId(resolvedParams.id)
        
        const supabase = createClient()
        const { data: adData, error } = await supabase
          .from("ads")
          .select("*")
          .eq("id", resolvedParams.id)
          .single()

        if (error || !adData) {
          notFound()
          return
        }

        setAd(adData)

      } catch (error) {
        console.error("Error fetching ad:", error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params])

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

  if (!ad) {
    notFound()
  }

  const categoryLabels = {
    fashion: "ファッション",
    tech: "テクノロジー",
    food: "飲食",
    travel: "旅行",
    beauty: "美容",
    sports: "スポーツ",
  } as const

  const categoryLabel = categoryLabels[ad.category as keyof typeof categoryLabels] || ad.category

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            ギャラリーに戻る
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* 画像セクション */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="relative bg-muted">
                <Image 
                  src={ad.image_url || "/placeholder.svg"} 
                  alt={ad.title} 
                  width={600}
                  height={0}
                  className="w-full h-auto object-cover" 
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={true}
                />
              </div>
            </Card>
          </div>

          {/* 詳細情報セクション */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-3">{categoryLabel}</Badge>
              <h1 className="text-4xl font-bold text-balance mb-4">{ad.title}</h1>
              <p className="text-xl text-muted-foreground">{ad.company}</p>
            </div>

            <Separator />

            {/* 統計情報 */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-muted-foreground" />
                <span className="text-lg font-semibold">{ad.likes.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">いいね</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-muted-foreground" />
                <span className="text-lg font-semibold">{ad.views.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">閲覧</span>
              </div>
            </div>

            <Separator />

            {/* 説明 */}
            <div>
              <h2 className="text-lg font-semibold mb-3">説明</h2>
              <p className="text-muted-foreground leading-relaxed">{ad.description}</p>
            </div>

            {/* タグ */}
            <div>
              <h2 className="text-lg font-semibold mb-3">タグ</h2>
              <div className="flex flex-wrap gap-2">
                {ad.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* アクションボタン */}
            <div className="flex gap-3">
              <LikeButton adId={ad.id} initialLikeCount={ad.likes} />
              {ad.link_url && (
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => window.open(ad.link_url, '_blank', 'noopener,noreferrer')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 関連広告 */}
        {id && <RelatedAds currentAdId={id} category={ad.category} />}
      </main>
    </div>
  )
}
