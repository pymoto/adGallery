"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { createClient } from "@/lib/client"
import { useRouter } from "next/navigation"

interface LikeButtonProps {
  adId: string
  initialLikeCount: number
  className?: string
}

export function LikeButton({ adId, initialLikeCount, className }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
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
          .eq("ad_id", adId)
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
  }, [adId, supabase])

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
        const response = await fetch(`/api/ads/${adId}/like`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "いいねの削除に失敗しました")
        }

        setIsLiked(false)
        setLikeCount((prev) => prev - 1)
      } else {
        // いいねを追加
        const response = await fetch(`/api/ads/${adId}/like`, {
          method: "POST",
        })

        if (!response.ok) {
          const errorData = await response.json()
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
    <Button
      className={`flex-1 gap-2 ${isLiked ? "bg-red-50 text-red-600 hover:bg-red-100" : ""} ${className}`}
      onClick={handleLike}
      disabled={isLoading}
    >
      <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
      {isLoading ? "処理中..." : `${likeCount.toLocaleString()} いいね`}
    </Button>
  )
}
