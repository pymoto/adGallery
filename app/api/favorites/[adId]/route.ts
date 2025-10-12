import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ adId: string }> }
) {
  try {
    const { adId } = await params
    const supabase = await createClient()
    
    // ユーザー認証を確認
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    // お気に入りを追加
    const { data, error } = await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        ad_id: adId
      })
      .select()

    if (error) {
      console.error("Favorite add error:", error)
      return NextResponse.json({ error: "お気に入りの追加に失敗しました" }, { status: 500 })
    }

    return NextResponse.json({ message: "お気に入りに追加しました", favorite: data[0] })
  } catch (error) {
    console.error("Favorite add API error:", error)
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ adId: string }> }
) {
  try {
    const { adId } = await params
    const supabase = await createClient()
    
    // ユーザー認証を確認
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    // お気に入りを削除
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("ad_id", adId)

    if (error) {
      console.error("Favorite remove error:", error)
      return NextResponse.json({ error: "お気に入りの削除に失敗しました" }, { status: 500 })
    }

    return NextResponse.json({ message: "お気に入りから削除しました" })
  } catch (error) {
    console.error("Favorite remove API error:", error)
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 })
  }
}
