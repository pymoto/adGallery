import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")
    const limit = parseInt(searchParams.get("limit") || "20") // デフォルトを20に変更
    const offset = parseInt(searchParams.get("offset") || "0")

    // ローカル広告を取得（開発用）
    const localAds = [
      {
        id: "00000000-0000-0000-0000-000000000001",
        title: "ローカル広告1",
        company: "ローカル会社",
        category: "tech",
        description: "ローカルで作成された広告です",
        image_url: "https://picsum.photos/400/300?random=1",
        link_url: "https://example.com",
        is_published: true,
        created_at: new Date().toISOString(),
        user_id: "14e2b7a0-875a-486e-932d-c6846fc34377",
        tags: ["ローカル", "テスト"],
        views: 0,
        likes: 0
      },
      {
        id: "00000000-0000-0000-0000-000000000002",
        title: "サンプル広告",
        company: "サンプル会社",
        category: "fashion",
        description: "サンプル広告の説明です",
        image_url: "https://picsum.photos/400/300?random=2",
        link_url: "https://example.com/products",
        is_published: true,
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1日前
        user_id: "14e2b7a0-875a-486e-932d-c6846fc34377",
        tags: ["サンプル", "ファッション"],
        views: 0,
        likes: 0
      }
    ]

    // パラメータがない場合は公開済み広告のみを返す（ページネーション付き）
    if (!query && !category && !tag) {
      const { data: ads, error } = await supabase
        .from("ads")
        .select("id, title, company, category, image_url, link_url, created_at, views, likes")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)
      
      if (error) {
        console.error("Fetch all ads error:", error)
        return NextResponse.json({ error: "広告の取得に失敗しました" }, { status: 500 })
      }
      
      // 数値の安全性を確保
      const safeAds = (ads || []).map(ad => ({
        ...ad,
        views: Number(ad.views) || 0,
        likes: Number(ad.likes) || 0
      }))
      
      const response = NextResponse.json({ ads: safeAds })
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
      return response
    }

    let queryBuilder = supabase
      .from("ads")
      .select("id, title, company, category, image_url, link_url, created_at, views, likes")
      .eq("is_published", true) // 公開済み広告のみ

    // カテゴリフィルタ
    if (category && category !== "all") {
      queryBuilder = queryBuilder.eq("category", category)
    }

    // タグ検索
    if (tag) {
      queryBuilder = queryBuilder.contains("tags", [tag])
    }

    // テキスト検索（タイトル、説明、会社名）
    if (query) {
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query}%,description.ilike.%${query}%,company.ilike.%${query}%`
      )
    }

    const { data: ads, error } = await queryBuilder
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Search error:", error)
      return NextResponse.json({ 
        error: "検索に失敗しました", 
        details: error.message 
      }, { status: 500 })
    }

    // 数値の安全性を確保
    const safeAds = (ads || []).map(ad => ({
      ...ad,
      views: Number(ad.views) || 0,
      likes: Number(ad.likes) || 0
    }))
    
    const searchResponse = NextResponse.json({ ads: safeAds })
    searchResponse.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=120')
    return searchResponse
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ 
      error: "サーバーエラーが発生しました", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
