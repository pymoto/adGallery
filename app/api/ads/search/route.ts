import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    // パラメータがない場合は公開済み広告のみを返す（ページネーション付き）
    if (!query && !category && !tag) {
      const { data: ads, error } = await supabase
        .from("ads")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)
      
      if (error) {
        console.error("Fetch all ads error:", error)
        return NextResponse.json({ error: "広告の取得に失敗しました" }, { status: 500 })
      }
      
      return NextResponse.json({ ads: ads || [] })
    }

    let queryBuilder = supabase
      .from("ads")
      .select("*")
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

    return NextResponse.json({ ads: ads || [] })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ 
      error: "サーバーエラーが発生しました", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
