"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Eye, Trash2, ExternalLink, Edit, BarChart3, CheckCircle, Clock, XCircle, EyeOff } from "lucide-react"
import type { Ad } from "@/lib/types"
import { createClient } from "@/lib/client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"

interface MyAdCardProps {
  ad: Ad
  onDelete: (adId: string) => void
  onStatusChange?: (adId: string, newStatus: boolean | null) => void
}

export function MyAdCard({ ad, onDelete, onStatusChange }: MyAdCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(ad.likes)
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTogglingStatus, setIsTogglingStatus] = useState(false)
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

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/ads/${ad.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "削除に失敗しました")
      }

      onDelete(ad.id)
      setShowDeleteDialog(false)
    } catch (error) {
      console.error("削除エラー:", error)
      alert("削除に失敗しました。もう一度お試しください。")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleStatus = async () => {
    // 承認待ちの広告はステータス変更不可
    if (ad.is_published === false) {
      alert('承認待ちの広告はステータスを変更できません。管理者の承認をお待ちください。')
      return
    }

    setIsTogglingStatus(true)
    try {
      // 現在のステータスに基づいて新しいステータスを決定
      let newStatus: boolean | null
      if (ad.is_published === true) {
        newStatus = null // 公開済み → 非公開
      } else {
        newStatus = true // 非公開 → 公開
      }

      const response = await fetch(`/api/ads/${ad.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_published: newStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'ステータスの更新に失敗しました')
      }

      // 親コンポーネントに変更を通知
      if (onStatusChange) {
        onStatusChange(ad.id, newStatus)
      }
    } catch (error) {
      console.error('ステータス更新エラー:', error)
      alert('ステータスの更新に失敗しました。もう一度お試しください。')
    } finally {
      setIsTogglingStatus(false)
    }
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

  // ステータスの判定
  const getStatusInfo = () => {
    if (ad.is_published === true) {
      return {
        label: "公開済み",
        variant: "default" as const,
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 border-green-200"
      }
    } else if (ad.is_published === false) {
      return {
        label: "承認待ち",
        variant: "secondary" as const,
        icon: Clock,
        className: "bg-yellow-100 text-yellow-800 border-yellow-200"
      }
    } else {
      return {
        label: "非公開",
        variant: "destructive" as const,
        icon: XCircle,
        className: "bg-red-100 text-red-800 border-red-200"
      }
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  return (
    <>
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
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                  {categoryLabel}
                </Badge>
                <Badge 
                  variant={statusInfo.variant}
                  className={`${statusInfo.className} backdrop-blur flex items-center gap-1`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {statusInfo.label}
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
            </div>
          </Card>
        </Link>
        
        {/* 編集ボタン */}
        <Button
          variant="outline"
          size="sm"
          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            router.push(`/edit/${ad.id}`)
          }}
        >
          <Edit className="w-4 h-4" />
        </Button>
        
        {/* 分析ボタン */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-2 left-12 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            router.push(`/analytics/${ad.id}`)
          }}
        >
          <BarChart3 className="w-4 h-4" />
        </Button>
        
        {/* 公開/非公開切り替えボタン */}
        <Button
          variant="outline"
          size="sm"
          className={`absolute top-2 right-12 opacity-0 group-hover:opacity-100 transition-opacity ${
            ad.is_published === false ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleToggleStatus()
          }}
          disabled={isTogglingStatus || ad.is_published === false}
          title={
            ad.is_published === true 
              ? "非公開にする" 
              : ad.is_published === false 
                ? "承認待ちの広告は変更できません" 
                : "公開する"
          }
        >
          {isTogglingStatus ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          ) : ad.is_published === true ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </Button>
        
        {/* 削除ボタン */}
        <Button
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setShowDeleteDialog(true)
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        adTitle={ad.title}
        isDeleting={isDeleting}
      />
    </>
  )
}
