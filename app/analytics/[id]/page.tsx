"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnalyticsChart } from "@/components/analytics-chart"
import { ArrowLeft, Eye, MousePointer, Heart, TrendingUp } from "lucide-react"

interface AnalyticsData {
  ad: {
    id: string
    title: string
  }
  summary: {
    totalViews: number
    totalClicks: number
    totalLikes: number
    clickThroughRate: string
  }
  dailyStats: Array<{
    date: string
    views: number
    clicks: number
  }>
  deviceStats: Array<{
    device: string
    views: number
    clicks: number
  }>
  browserStats: Array<{
    browser: string
    views: number
    clicks: number
  }>
  locationStats: Array<{
    location: string
    views: number
    clicks: number
  }>
  recentViews: Array<{
    id: string
    viewed_at: string
    device_type: string
    browser: string
    country: string
  }>
  recentClicks: Array<{
    id: string
    clicked_at: string
    device_type: string
    browser: string
    country: string
  }>
}

export default function AnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/ads/${params.id}/analytics`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "分析データの取得に失敗しました")
        }
        
        const data = await response.json()
        setAnalyticsData(data)
      } catch (err) {
        console.error("Analytics fetch error:", err)
        setError(err instanceof Error ? err.message : "不明なエラーが発生しました")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchAnalytics()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>分析データを読み込み中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">エラー</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">データが見つかりません</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <h1 className="text-3xl font-bold">広告分析</h1>
          <p className="text-gray-600 mt-2">{analyticsData.ad.title}</p>
        </div>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総閲覧数</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.summary.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              過去30日間
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総クリック数</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.summary.totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              外部リンクへのクリック
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総いいね数</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.summary.totalLikes}</div>
            <p className="text-xs text-muted-foreground">
              ユーザーからのいいね
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">クリック率</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.summary.clickThroughRate}</div>
            <p className="text-xs text-muted-foreground">
              閲覧に対するクリック率
            </p>
          </CardContent>
        </Card>
      </div>

      {/* チャート */}
      <div className="mb-8">
        <AnalyticsChart
          dailyStats={analyticsData.dailyStats}
          deviceStats={analyticsData.deviceStats}
          browserStats={analyticsData.browserStats}
          locationStats={analyticsData.locationStats}
        />
      </div>

      {/* 最近のアクティビティ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近の閲覧 */}
        <Card>
          <CardHeader>
            <CardTitle>最近の閲覧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.recentViews.length > 0 ? (
                analyticsData.recentViews.map((view) => (
                  <div key={view.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(view.viewed_at).toLocaleString("ja-JP")}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {view.device_type === "desktop" && "デスクトップ"}
                          {view.device_type === "mobile" && "モバイル"}
                          {view.device_type === "tablet" && "タブレット"}
                          {view.device_type === "unknown" && "不明"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {view.browser}
                        </Badge>
                        {view.country && (
                          <Badge variant="outline" className="text-xs">
                            {view.country}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">閲覧データがありません</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 最近のクリック */}
        <Card>
          <CardHeader>
            <CardTitle>最近のクリック</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.recentClicks.length > 0 ? (
                analyticsData.recentClicks.map((click) => (
                  <div key={click.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(click.clicked_at).toLocaleString("ja-JP")}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {click.device_type === "desktop" && "デスクトップ"}
                          {click.device_type === "mobile" && "モバイル"}
                          {click.device_type === "tablet" && "タブレット"}
                          {click.device_type === "unknown" && "不明"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {click.browser}
                        </Badge>
                        {click.country && (
                          <Badge variant="outline" className="text-xs">
                            {click.country}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">クリックデータがありません</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
