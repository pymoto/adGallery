import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { type, userAgent, ipAddress } = await request.json()
    
    const supabase = await createClient()

    // ユーザー認証（オプション）
    const { data: { user } } = await supabase.auth.getUser()

    // デバイス情報を解析
    const deviceInfo = parseUserAgent(userAgent || "")
    
    // IPアドレスから地域情報を取得（簡易版）
    const locationInfo = await getLocationFromIP(ipAddress)

    if (type === "view") {
      // 閲覧を記録
      const { error } = await supabase
        .from("ad_views")
        .insert({
          ad_id: id,
          user_id: user?.id || null,
          ip_address: ipAddress,
          user_agent: userAgent,
          device_type: deviceInfo.deviceType,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          country: locationInfo.country,
          city: locationInfo.city,
          referrer: request.headers.get("referer") || null
        })

      if (error) {
        console.error("View tracking error:", error)
        return NextResponse.json({ error: "閲覧の記録に失敗しました" }, { status: 500 })
      }

      // 広告の閲覧数を更新
      await supabase.rpc('increment_views', { ad_id: id })

    } else if (type === "click") {
      // クリックを記録
      const { error } = await supabase
        .from("link_clicks")
        .insert({
          ad_id: id,
          user_id: user?.id || null,
          ip_address: ipAddress,
          user_agent: userAgent,
          device_type: deviceInfo.deviceType,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          country: locationInfo.country,
          city: locationInfo.city,
          referrer: request.headers.get("referer") || null
        })

      if (error) {
        console.error("Click tracking error:", error)
        return NextResponse.json({ error: "クリックの記録に失敗しました" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Tracking API error:", error)
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 })
  }
}

// ユーザーエージェントを解析する関数
function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase()
  
  // デバイスタイプを判定
  let deviceType = "desktop"
  if (ua.includes("mobile") || ua.includes("android")) {
    deviceType = "mobile"
  } else if (ua.includes("tablet") || ua.includes("ipad")) {
    deviceType = "tablet"
  }
  
  // ブラウザを判定
  let browser = "unknown"
  if (ua.includes("chrome")) browser = "Chrome"
  else if (ua.includes("firefox")) browser = "Firefox"
  else if (ua.includes("safari")) browser = "Safari"
  else if (ua.includes("edge")) browser = "Edge"
  else if (ua.includes("opera")) browser = "Opera"
  
  // OSを判定
  let os = "unknown"
  if (ua.includes("windows")) os = "Windows"
  else if (ua.includes("mac")) os = "macOS"
  else if (ua.includes("linux")) os = "Linux"
  else if (ua.includes("android")) os = "Android"
  else if (ua.includes("ios")) os = "iOS"
  
  return {
    deviceType,
    browser,
    os
  }
}

// IPアドレスから地域情報を取得する関数（簡易版）
async function getLocationFromIP(ipAddress: string) {
  try {
    // 実際の実装では、IP Geolocation APIを使用
    // ここでは簡易的な実装
    if (ipAddress === "127.0.0.1" || ipAddress === "::1") {
      return { country: "Japan", city: "Tokyo" }
    }
    
    // 外部APIを使用する場合はここで実装
    // const response = await fetch(`https://ipapi.co/${ipAddress}/json/`)
    // const data = await response.json()
    // return { country: data.country_name, city: data.city }
    
    return { country: "Unknown", city: "Unknown" }
  } catch (error) {
    console.error("Location fetch error:", error)
    return { country: "Unknown", city: "Unknown" }
  }
}
