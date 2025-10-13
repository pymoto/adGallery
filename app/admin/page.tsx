"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Image, 
  Flag, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"

interface DashboardStats {
  totalUsers: number
  totalAds: number
  totalReports: number
  pendingReports: number
  publishedAds: number
  recentAds: any[]
  recentReports: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalAds: 0,
    totalReports: 0,
    pendingReports: 0,
    publishedAds: 0,
    recentAds: [],
    recentReports: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()
      
      try {
        // ユーザー数
        const { count: userCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })

        // 広告数
        const { count: adCount } = await supabase
          .from("ads")
          .select("*", { count: "exact", head: true })

        // 公開済み広告数
        const { count: publishedCount } = await supabase
          .from("ads")
          .select("*", { count: "exact", head: true })
          .eq("is_published", true)

        // 通報数
        const { count: reportCount } = await supabase
          .from("reports")
          .select("*", { count: "exact", head: true })

        // 未処理通報数
        const { count: pendingCount } = await supabase
          .from("reports")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending")

        // 最近の広告（シンプルなクエリ）
        const { data: recentAds } = await supabase
          .from("ads")
          .select("id, title, created_at, is_published, user_id")
          .order("created_at", { ascending: false })
          .limit(5)

        // 最近の通報（シンプルなクエリ）
        const { data: recentReports } = await supabase
          .from("reports")
          .select("id, reason, created_at, status, ad_id, reporter_id")
          .order("created_at", { ascending: false })
          .limit(5)

        setStats({
          totalUsers: userCount || 0,
          totalAds: adCount || 0,
          totalReports: reportCount || 0,
          pendingReports: pendingCount || 0,
          publishedAds: publishedCount || 0,
          recentAds: recentAds || [],
          recentReports: recentReports || []
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">ダッシュボード</h1>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ダッシュボード</h1>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総ユーザー数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総広告数</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAds}</div>
            <p className="text-xs text-muted-foreground">
              公開済み: {stats.publishedAds}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">通報数</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
            <p className="text-xs text-muted-foreground">
              未処理: {stats.pendingReports}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">公開率</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalAds > 0 ? Math.round((stats.publishedAds / stats.totalAds) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 最近の活動 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>最近の広告</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentAds.map((ad) => (
                <div key={ad.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{ad.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(ad.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {ad.is_published ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近の通報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">通報 #{report.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.reason} • {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.status === "pending" ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* クイックアクション */}
      <Card>
        <CardHeader>
          <CardTitle>クイックアクション</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">
              <Flag className="mr-2 h-4 w-4" />
              通報を確認
            </Button>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              ユーザー管理
            </Button>
            <Button variant="outline">
              <Image className="mr-2 h-4 w-4" />
              広告管理
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
