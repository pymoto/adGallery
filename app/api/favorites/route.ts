import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // ユーザー認証を確認
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    // お気に入り一覧を取得
    const { data: favorites, error } = await supabase
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
          description,
          tags,
          views,
          likes,
          link_url,
          created_at
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Favorites fetch error:", error)
      return NextResponse.json({ error: "お気に入りの取得に失敗しました" }, { status: 500 })
    }

    return NextResponse.json({ favorites })
  } catch (error) {
    console.error("Favorites API error:", error)
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 })
  }
}
