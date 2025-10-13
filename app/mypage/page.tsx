"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdCard } from "@/components/ad-card"
import { MyAdCard } from "@/components/my-ad-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LogOut, Home, Filter } from "lucide-react"
import type { Ad } from "@/lib/types"
import type { User as SupabaseUser, Session } from "@supabase/supabase-js"

export default function MyPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [myAds, setMyAds] = useState<Ad[]>([])
  const [likedAds, setLikedAds] = useState<Ad[]>([])
  const [favoriteAds, setFavoriteAds] = useState<Ad[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth/login")
        return
      }
      
      setUser(user)
      
      // 自分が投稿した広告を取得（最適化されたクエリ）
      try {
        // タイムアウト設定を追加
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒でタイムアウト
        
        const { data: myAdsData, error: myAdsError } = await supabase
          .from("ads")
          .select("id, title, company, category, image_url, link_url, created_at, is_published")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50) // 制限を追加
          .abortSignal(controller.signal) // タイムアウト制御
        
        clearTimeout(timeoutId)
        
        if (myAdsError) {
          console.error("My ads fetch error:", myAdsError)
          setError("投稿した広告の取得に失敗しました")
        } else {
          setMyAds(myAdsData || [])
        }
      } catch (error) {
        console.error("My ads fetch error:", error)
        setError("投稿した広告の取得に失敗しました")
      }
      
      // 自分がいいねした広告を取得（最適化されたクエリ）
      try {
        // タイムアウト設定を追加
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒でタイムアウト
        
        const { data: likedAdsData, error: likedAdsError } = await supabase
          .from("likes")
          .select(
            `
            ad_id,
            ads (id, title, company, category, image_url, link_url, created_at)
          `,
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50) // 制限を追加
          .abortSignal(controller.signal) // タイムアウト制御
        
        clearTimeout(timeoutId)
        
        if (likedAdsError) {
          console.error("Liked ads fetch error:", likedAdsError)
          setError("いいねした広告の取得に失敗しました")
        } else {
          const likedAdsList = likedAdsData?.map((item: any) => item.ads).filter(Boolean) || []
          setLikedAds(likedAdsList)
        }
      } catch (error) {
        console.error("Liked ads fetch error:", error)
        setError("いいねした広告の取得に失敗しました")
      }
      
      // お気に入り広告を取得（最適化されたクエリ）
      try {
        // タイムアウト設定を追加
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒でタイムアウト
        
        const { data: favoriteAdsData, error: favoriteAdsError } = await supabase
          .from("favorites")
          .select(
            `
            ad_id,
            ads (id, title, company, category, image_url, link_url, created_at)
          `,
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50) // 制限を追加
          .abortSignal(controller.signal) // タイムアウト制御
        
        clearTimeout(timeoutId)
        
        if (favoriteAdsError) {
          console.error("Favorite ads fetch error:", favoriteAdsError)
          setError("お気に入り広告の取得に失敗しました")
        } else {
          const favoriteAdsList = favoriteAdsData?.map((item: any) => item.ads).filter(Boolean) || []
          setFavoriteAds(favoriteAdsList)
        }
      } catch (error) {
        console.error("Favorite ads fetch error:", error)
        setError("お気に入り広告の取得に失敗しました")
      }
      
      setIsLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: Session | null) => {
      if (!session?.user) {
        router.push("/auth/login")
      } else {
        setUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const handleDeleteAd = (adId: string) => {
    setMyAds(prevAds => prevAds.filter(ad => ad.id !== adId))
  }

  const handleStatusChange = (adId: string, newStatus: boolean | null) => {
    setMyAds(prevAds => 
      prevAds.map(ad => 
        ad.id === adId 
          ? { ...ad, is_published: newStatus }
          : ad
      )
    )
  }

  // ステータスフィルターの適用
  const getFilteredAds = () => {
    if (statusFilter === "all") return myAds
    
    return myAds.filter(ad => {
      switch (statusFilter) {
        case "published":
          return ad.is_published === true
        case "pending":
          return ad.is_published === false
        case "unpublished":
          return ad.is_published === null || ad.is_published === undefined
        default:
          return true
      }
    })
  }

  const filteredAds = getFilteredAds()

  // ステータス別のカウント
  const getStatusCounts = () => {
    const published = myAds.filter(ad => ad.is_published === true).length
    const pending = myAds.filter(ad => ad.is_published === false).length
    const unpublished = myAds.filter(ad => ad.is_published === null || ad.is_published === undefined).length
    
    return { published, pending, unpublished }
  }

  const statusCounts = getStatusCounts()

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

  if (!user) {
    return null
  }

  // エラー表示
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">マイページ</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 bg-transparent" 
                onClick={() => router.push("/")}
              >
                <Home className="w-4 h-4" />
                ホーム
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 bg-transparent" 
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push("/")
                }}
              >
                <LogOut className="w-4 h-4" />
                ログアウト
              </Button>
            </div>
          </div>
          
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 font-medium">⚠️ データ取得エラー</p>
              <p className="text-red-700 text-sm mt-2">{error}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => {
                  setError(null)
                  setIsLoading(true)
                  window.location.reload()
                }} 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                🔄 再試行
              </button>
              <button 
                onClick={() => router.push("/")} 
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                🏠 ホームに戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">マイページ</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 bg-transparent" 
              onClick={() => router.push("/")}
            >
              <Home className="w-4 h-4" />
              ホーム
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 bg-transparent" 
              onClick={async () => {
                await supabase.auth.signOut()
                router.push("/")
              }}
            >
              <LogOut className="w-4 h-4" />
              ログアウト
            </Button>
          </div>
        </div>

        <Tabs defaultValue="my-ads" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="my-ads">投稿した広告 ({myAds?.length || 0})</TabsTrigger>
            <TabsTrigger value="liked-ads">いいねした広告 ({likedAds.length})</TabsTrigger>
            <TabsTrigger value="favorite-ads">お気に入り ({favoriteAds.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="my-ads" className="mt-8">
            {myAds && myAds.length > 0 ? (
              <>
                {/* ステータスフィルター */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">ステータス:</span>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="ステータスを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて ({myAds.length})</SelectItem>
                      <SelectItem value="published">公開済み ({statusCounts.published})</SelectItem>
                      <SelectItem value="pending">承認待ち ({statusCounts.pending})</SelectItem>
                      <SelectItem value="unpublished">非公開 ({statusCounts.unpublished})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 広告一覧 */}
                {filteredAds.length > 0 ? (
                  <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
                    {filteredAds.map((ad) => (
                      <MyAdCard 
                        key={ad.id} 
                        ad={ad as Ad} 
                        onDelete={handleDeleteAd}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      {statusFilter === "all" 
                        ? "まだ広告を投稿していません" 
                        : "選択したステータスの広告がありません"
                      }
                    </p>
                    {statusFilter === "all" && (
                      <Button asChild className="mt-4">
                        <a href="/upload">広告を投稿する</a>
                      </Button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">まだ広告を投稿していません</p>
                <Button asChild>
                  <a href="/upload">広告を投稿する</a>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="liked-ads" className="mt-8">
            {likedAds.length > 0 ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
                {likedAds.map((ad) => (
                  <AdCard key={ad.id} ad={ad as Ad} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">まだ広告にいいねしていません</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorite-ads" className="mt-8">
            {favoriteAds.length > 0 ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
                {favoriteAds.map((ad) => (
                  <AdCard key={ad.id} ad={ad as Ad} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">まだお気に入りに登録していません</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
