"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdCard } from "@/components/ad-card"
import { MyAdCard } from "@/components/my-ad-card"
import { Button } from "@/components/ui/button"
import { LogOut, Home } from "lucide-react"
import type { Ad } from "@/lib/types"
import type { User as SupabaseUser, Session } from "@supabase/supabase-js"

export default function MyPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [myAds, setMyAds] = useState<Ad[]>([])
  const [likedAds, setLikedAds] = useState<Ad[]>([])
  const [isLoading, setIsLoading] = useState(true)
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
      
      // 自分が投稿した広告を取得
      const { data: myAdsData } = await supabase
        .from("ads")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      
      setMyAds(myAdsData || [])
      
      // 自分がいいねした広告を取得
      const { data: likedAdsData } = await supabase
        .from("likes")
        .select(
          `
          ad_id,
          ads (*)
        `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      
      const likedAdsList = likedAdsData?.map((item: any) => item.ads).filter(Boolean) || []
      setLikedAds(likedAdsList)
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
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="my-ads">投稿した広告 ({myAds?.length || 0})</TabsTrigger>
            <TabsTrigger value="liked-ads">いいねした広告 ({likedAds.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="my-ads" className="mt-8">
            {myAds && myAds.length > 0 ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
                {myAds.map((ad) => (
                  <MyAdCard key={ad.id} ad={ad as Ad} onDelete={handleDeleteAd} />
                ))}
              </div>
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
        </Tabs>
      </div>
    </div>
  )
}
