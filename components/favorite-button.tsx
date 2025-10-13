"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/client"
import { useRouter } from "next/navigation"

interface FavoriteButtonProps {
  adId: string
  className?: string
}

export function FavoriteButton({ adId, className }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setIsChecking(false)
          return
        }
        
        // フォールバック広告の場合はお気に入り機能を無効化
        if (adId.startsWith("00000000-0000-0000-0000-000000000")) {
          setIsFavorited(false)
          setIsChecking(false)
          return
        }

        const { data, error } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("ad_id", adId)
          .maybeSingle()

        if (error) {
          console.error("Favorite status check error:", error)
        } else {
          setIsFavorited(!!data)
        }
      } catch (error) {
        console.error("Favorite status check error:", error)
      } finally {
        setIsChecking(false)
      }
    }

    checkFavoriteStatus()
  }, [adId, supabase])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // フォールバック広告の場合はお気に入り機能を無効化
    if (adId.startsWith("00000000-0000-0000-0000-000000000")) {
      return
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push("/auth/login")
      return
    }

    setIsLoading(true)

    try {
      if (isFavorited) {
        // お気に入りから削除
        const response = await fetch(`/api/favorites/${adId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "お気に入りの削除に失敗しました")
        }

        setIsFavorited(false)
      } else {
        // お気に入りに追加
        const response = await fetch(`/api/favorites/${adId}`, {
          method: "POST",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "お気に入りの追加に失敗しました")
        }

        setIsFavorited(true)
      }
    } catch (error) {
      console.error("お気に入りエラー:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={`h-auto p-1 ${className}`}
        disabled
      >
        <Star className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-auto p-1 hover:bg-yellow-50 transition-colors ${isFavorited ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"} ${className}`}
      onClick={handleToggle}
      disabled={isLoading}
      title={isFavorited ? "お気に入りから削除" : "お気に入りに追加"}
    >
      <div className="flex items-center gap-1">
        <Star className={`w-4 h-4 transition-colors ${isFavorited ? "fill-yellow-500 text-yellow-500" : ""}`} />
        {isLoading && <span className="text-xs">...</span>}
      </div>
    </Button>
  )
}
