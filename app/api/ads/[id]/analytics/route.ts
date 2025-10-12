import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // ユーザー認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    // 広告の所有者チェック
    const { data: ad, error: adError } = await supabase
      .from("ads")
      .select("id, user_id, title")
      .eq("id", id)
      .single()

    if (adError || !ad) {
      return NextResponse.json({ error: "広告が見つかりません" }, { status: 404 })
    }

    if (ad.user_id !== user.id) {
      return NextResponse.json({ error: "この広告の分析データを閲覧する権限がありません" }, { status: 403 })
    }

    // 基本統計データを取得
    const [
      { data: viewsData, error: viewsError },
      { data: clicksData, error: clicksError },
      { data: likesData, error: likesError }
    ] = await Promise.all([
      supabase
        .from("ad_views")
        .select("id, viewed_at, device_type, browser, os, country, city")
        .eq("ad_id", id)
        .order("viewed_at", { ascending: false }),
      supabase
        .from("link_clicks")
        .select("id, clicked_at, device_type, browser, os, country, city")
        .eq("ad_id", id)
        .order("clicked_at", { ascending: false }),
      supabase
        .from("likes")
        .select("id, created_at")
        .eq("ad_id", id)
    ])

    if (viewsError || clicksError || likesError) {
      console.error("Analytics data fetch error:", { viewsError, clicksError, likesError })
      return NextResponse.json({ error: "分析データの取得に失敗しました" }, { status: 500 })
    }

    // 日別統計を計算
    const dailyStats = calculateDailyStats(viewsData || [], clicksData || [])
    
    // デバイス別統計を計算
    const deviceStats = calculateDeviceStats(viewsData || [], clicksData || [])
    
    // ブラウザ別統計を計算
    const browserStats = calculateBrowserStats(viewsData || [], clicksData || [])
    
    // 地域別統計を計算
    const locationStats = calculateLocationStats(viewsData || [], clicksData || [])

    // 総合統計
    const totalViews = viewsData?.length || 0
    const totalClicks = clicksData?.length || 0
    const totalLikes = likesData?.length || 0
    const clickThroughRate = totalViews > 0 ? (totalClicks / totalViews * 100).toFixed(2) : "0.00"

    return NextResponse.json({
      ad: {
        id: ad.id,
        title: ad.title
      },
      summary: {
        totalViews,
        totalClicks,
        totalLikes,
        clickThroughRate: `${clickThroughRate}%`
      },
      dailyStats,
      deviceStats,
      browserStats,
      locationStats,
      recentViews: viewsData?.slice(0, 10) || [],
      recentClicks: clicksData?.slice(0, 10) || []
    })

  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 })
  }
}

// 日別統計を計算する関数
function calculateDailyStats(views: any[], clicks: any[]) {
  const stats: { [key: string]: { views: number; clicks: number } } = {}
  
  // 過去30日分のデータを準備
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  // 閲覧データを日別に集計
  views.forEach(view => {
    const date = new Date(view.viewed_at).toISOString().split('T')[0]
    if (new Date(view.viewed_at) >= thirtyDaysAgo) {
      if (!stats[date]) {
        stats[date] = { views: 0, clicks: 0 }
      }
      stats[date].views++
    }
  })
  
  // クリックデータを日別に集計
  clicks.forEach(click => {
    const date = new Date(click.clicked_at).toISOString().split('T')[0]
    if (new Date(click.clicked_at) >= thirtyDaysAgo) {
      if (!stats[date]) {
        stats[date] = { views: 0, clicks: 0 }
      }
      stats[date].clicks++
    }
  })
  
  // 日付順にソートして配列に変換
  return Object.entries(stats)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({
      date,
      views: data.views,
      clicks: data.clicks
    }))
}

// デバイス別統計を計算する関数
function calculateDeviceStats(views: any[], clicks: any[]) {
  const deviceStats: { [key: string]: { views: number; clicks: number } } = {}
  
  views.forEach(view => {
    const device = view.device_type || 'unknown'
    if (!deviceStats[device]) {
      deviceStats[device] = { views: 0, clicks: 0 }
    }
    deviceStats[device].views++
  })
  
  clicks.forEach(click => {
    const device = click.device_type || 'unknown'
    if (!deviceStats[device]) {
      deviceStats[device] = { views: 0, clicks: 0 }
    }
    deviceStats[device].clicks++
  })
  
  return Object.entries(deviceStats).map(([device, data]) => ({
    device,
    views: data.views,
    clicks: data.clicks
  }))
}

// ブラウザ別統計を計算する関数
function calculateBrowserStats(views: any[], clicks: any[]) {
  const browserStats: { [key: string]: { views: number; clicks: number } } = {}
  
  views.forEach(view => {
    const browser = view.browser || 'unknown'
    if (!browserStats[browser]) {
      browserStats[browser] = { views: 0, clicks: 0 }
    }
    browserStats[browser].views++
  })
  
  clicks.forEach(click => {
    const browser = click.browser || 'unknown'
    if (!browserStats[browser]) {
      browserStats[browser] = { views: 0, clicks: 0 }
    }
    browserStats[browser].clicks++
  })
  
  return Object.entries(browserStats).map(([browser, data]) => ({
    browser,
    views: data.views,
    clicks: data.clicks
  }))
}

// 地域別統計を計算する関数
function calculateLocationStats(views: any[], clicks: any[]) {
  const locationStats: { [key: string]: { views: number; clicks: number } } = {}
  
  views.forEach(view => {
    const location = view.country || 'unknown'
    if (!locationStats[location]) {
      locationStats[location] = { views: 0, clicks: 0 }
    }
    locationStats[location].views++
  })
  
  clicks.forEach(click => {
    const location = click.country || 'unknown'
    if (!locationStats[location]) {
      locationStats[location] = { views: 0, clicks: 0 }
    }
    locationStats[location].clicks++
  })
  
  return Object.entries(locationStats).map(([location, data]) => ({
    location,
    views: data.views,
    clicks: data.clicks
  }))
}
