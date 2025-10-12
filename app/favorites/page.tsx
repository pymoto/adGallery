"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Eye, ExternalLink, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/client"
import type { Ad } from "@/lib/types"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Ad[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setError("ログインが必要です")
          setIsLoading(false)
          return
        }

        const response = await fetch("/api/favorites")
        if (!response.ok) {
          throw new Error("お気に入りの取得に失敗しました")
        }

        const { favorites: favoritesData } = await response.json()
        setFavorites(favoritesData.map((fav: any) => fav.ads).filter(Boolean))
      } catch (error) {
        console.error("Favorites fetch error:", error)
        setError("お気に入りの取得に失敗しました")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavorites()
  }, [supabase])

  const categoryLabels = {
    fashion: "ファッション",
    tech: "テクノロジー",
    food: "飲食",
    travel: "旅行",
    beauty: "美容",
    sports: "スポーツ",
  } as const

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              ホームに戻る
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">お気に入り</h1>
        </div>
        <div className="text-center py-8">読み込み中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              ホームに戻る
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">お気に入り</h1>
        </div>
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            ホームに戻る
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">お気に入り</h1>
        <Badge variant="secondary">{favorites.length}件</Badge>
      </div>

      {favorites.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">お気に入りがありません</h3>
            <p className="text-muted-foreground mb-4">
              気になる広告を星マークでお気に入りに追加しましょう
            </p>
            <Button asChild>
              <Link href="/">広告を探す</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((ad) => (
            <Card key={ad.id} className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
              <div className="relative overflow-hidden bg-muted">
                <Image
                  src={ad.image_url || "/placeholder.svg"}
                  alt={ad.title}
                  width={400}
                  height={0}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={false}
                />
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                    {categoryLabels[ad.category as keyof typeof categoryLabels] || ad.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold text-lg line-clamp-2 text-balance">{ad.title}</h3>
                <p className="text-sm text-muted-foreground">{ad.company}</p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>{ad.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{ad.views}</span>
                  </div>
                  {ad.link_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
                      onClick={() => window.open(ad.link_url, '_blank', 'noopener,noreferrer')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
