"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Image as ImageIcon, 
  Search,
  Eye,
  EyeOff,
  Trash2,
  User,
  Calendar,
  TrendingUp,
  AlertTriangle
} from "lucide-react"

interface Ad {
  id: string
  title: string
  description: string
  image_url: string
  category: string
  tags: string[]
  is_published: boolean
  created_at: string
  views: number
  user_id: string
}

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  useEffect(() => {
    fetchAds()
  }, [searchQuery, statusFilter, categoryFilter])

  async function fetchAds() {
    const supabase = createClient()
    setIsLoading(true)

    try {
      let query = supabase
        .from("ads")
        .select(`
          id,
          title,
          description,
          image_url,
          category,
          tags,
          is_published,
          created_at,
          views,
          user_id
        `)
        .order("created_at", { ascending: false })

      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      if (statusFilter !== "all") {
        query = query.eq("is_published", statusFilter === "published")
      }

      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching ads:", error)
        return
      }

      setAds(data || [])
    } catch (error) {
      console.error("Error fetching ads:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function togglePublishStatus(adId: string, currentStatus: boolean) {
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("ads")
        .update({ is_published: !currentStatus })
        .eq("id", adId)

      if (error) {
        console.error("Error updating ad:", error)
        return
      }

      fetchAds()
    } catch (error) {
      console.error("Error updating ad:", error)
    }
  }

  async function deleteAd(adId: string) {
    if (!confirm("この広告を削除しますか？この操作は取り消せません。")) {
      return
    }

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("ads")
        .delete()
        .eq("id", adId)

      if (error) {
        console.error("Error deleting ad:", error)
        return
      }

      fetchAds()
    } catch (error) {
      console.error("Error deleting ad:", error)
    }
  }

  const categories = [
    "technology", "fashion", "food", "travel", "health", "education", "entertainment", "business", "other"
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">広告管理</h1>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">広告管理</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="広告を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="ステータス" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="published">公開済み</SelectItem>
              <SelectItem value="draft">下書き</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="カテゴリ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総広告数</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ads.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">公開済み</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ads.filter(ad => ad.is_published).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">下書き</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ads.filter(ad => !ad.is_published).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総閲覧数</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ads.reduce((sum, ad) => sum + ad.views, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 広告一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>広告一覧</CardTitle>
        </CardHeader>
        <CardContent>
          {ads.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">広告が見つかりません</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ads.map((ad) => (
                <div key={ad.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img 
                        src={ad.image_url} 
                        alt={ad.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{ad.title}</h3>
                        {ad.is_published ? (
                          <Badge variant="default" className="text-xs">公開済み</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">下書き</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">{ad.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {ad.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {ad.user_id}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(ad.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {ad.views} 閲覧
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublishStatus(ad.id, ad.is_published)}
                    >
                      {ad.is_published ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          非公開
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          公開
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteAd(ad.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      削除
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
