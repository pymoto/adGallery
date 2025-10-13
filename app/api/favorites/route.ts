import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // 認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    // お気に入り広告を取得
    const { data: favorites, error: favoritesError } = await supabase
      .from("favorites")
      .select(`
        id,
        created_at,
        ads (
          id,
          title,
          company,
          category,
          image_url,
          link_url,
          created_at,
          views
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (favoritesError) {
      console.error("Favorites fetch error:", favoritesError)
      return NextResponse.json({ error: "お気に入りの取得に失敗しました" }, { status: 500 })
    }

    // データを整形
    const favoriteAds = favorites?.map(fav => ({
      ...fav.ads,
      favorited_at: fav.created_at
    })).filter(ad => ad !== null) || []

    return NextResponse.json(favoriteAds)

  } catch (error) {
    console.error("Favorites API error:", error)
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 })
  }
}