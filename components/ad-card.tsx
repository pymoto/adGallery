"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Eye, ExternalLink } from "lucide-react"
import type { Ad } from "@/lib/types"
import { createClient } from "@/lib/client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FavoriteButton } from "@/components/favorite-button"
import { ReportButton } from "@/components/report-button"

interface AdCardProps {
  ad: Ad
}

export function AdCard({ ad }: AdCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(ad.likes)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkLikeStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      try {
        const { data, error } = await supabase
          .from("likes")
          .select("id")
          .eq("user_id", user.id)
          .eq("ad_id", ad.id)
          .maybeSingle()

        if (error) {
          console.error("Like status check error:", error)
          return
        }

        setIsLiked(!!data)
      } catch (error) {
        console.error("Like status check error:", error)
      }
    }

    checkLikeStatus()
  }, [ad.id, supabase])

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    setIsLoading(true)

    try {
      if (isLiked) {
        // いいねを削除
        const response = await fetch(`/api/ads/${ad.id}/like`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error("いいね削除エラー:", errorData)
          throw new Error(errorData.error || "いいねの削除に失敗しました")
        }

        setIsLiked(false)
        setLikeCount((prev) => prev - 1)
      } else {
        // いいねを追加
        const response = await fetch(`/api/ads/${ad.id}/like`, {
          method: "POST",
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error("いいね追加エラー:", errorData)
          throw new Error(errorData.error || "いいねの追加に失敗しました")
        }

        setIsLiked(true)
        setLikeCount((prev) => prev + 1)
      }
    } catch (error) {
      console.error("いいねエラー:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="break-inside-avoid mb-4 relative group">
      <Link href={`/ad/${ad.id}`} className="block">
        <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
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
                {ad.category === "fashion" && "ファッション"}
                {ad.category === "tech" && "テクノロジー"}
                {ad.category === "food" && "飲食"}
                {ad.category === "travel" && "旅行"}
                {ad.category === "beauty" && "美容"}
                {ad.category === "sports" && "スポーツ"}
              </Badge>
            </div>
          </div>

          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2 text-balance">{ad.title}</h3>
            <p className="text-sm text-muted-foreground">{ad.company}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
              <Button
                variant="ghost"
                size="sm"
                className={`h-auto p-1 hover:bg-red-50 transition-colors ${isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
                onClick={handleLike}
                disabled={isLoading}
              >
                <div className="flex items-center gap-1">
                  <Heart className={`w-4 h-4 transition-colors ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                  <span className="text-sm">{likeCount}</span>
                  {isLoading && <span className="text-xs">...</span>}
                </div>
              </Button>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{ad.views}</span>
              </div>
              {ad.link_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(ad.link_url, '_blank', 'noopener,noreferrer')
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {/* 通報ボタン */}
            <div className="flex justify-end mt-2">
              <ReportButton adId={ad.id} adTitle={ad.title} />
            </div>
          </div>
        </Card>
      </Link>
      
      {/* お気に入りボタンを独立して配置 */}
      <div className="absolute top-2 left-2">
        <FavoriteButton adId={ad.id} />
      </div>
    </div>
  )
}
