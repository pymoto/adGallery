import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // 認証チェック
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    // 既存のいいねをチェック
    const { data: existingLike } = await supabase
      .from("likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("ad_id", id)
      .single()

    if (existingLike) {
      return NextResponse.json({ error: "既にいいねしています" }, { status: 400 })
    }

    // いいねを追加
    const { error: likeError } = await supabase
      .from("likes")
      .insert({
        user_id: user.id,
        ad_id: id,
      })

    if (likeError) {
      return NextResponse.json({ error: "いいねの追加に失敗しました" }, { status: 500 })
    }

    // adsテーブルのlikesカウントを増加
    const { data: currentAd, error: fetchError } = await supabase
      .from("ads")
      .select("likes")
      .eq("id", id)
      .single()

    if (fetchError) {
      console.error("Fetch ad error:", fetchError)
    } else {
      const { error: updateError } = await supabase
        .from("ads")
        .update({ likes: (currentAd.likes || 0) + 1 })
        .eq("id", id)

      if (updateError) {
        console.error("Like count update error:", updateError)
      }
    }

    return NextResponse.json({ message: "いいねを追加しました" })
  } catch (error) {
    console.error("Like API error:", error)
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // 認証チェック
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    // いいねを削除
    const { error: deleteError } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", user.id)
      .eq("ad_id", id)

    if (deleteError) {
      return NextResponse.json({ error: "いいねの削除に失敗しました" }, { status: 500 })
    }

    // adsテーブルのlikesカウントを減少
    const { data: currentAd, error: fetchError } = await supabase
      .from("ads")
      .select("likes")
      .eq("id", id)
      .single()

    if (fetchError) {
      console.error("Fetch ad error:", fetchError)
    } else {
      const { error: updateError } = await supabase
        .from("ads")
        .update({ likes: Math.max((currentAd.likes || 0) - 1, 0) })
        .eq("id", id)

      if (updateError) {
        console.error("Like count update error:", updateError)
      }
    }

    return NextResponse.json({ message: "いいねを削除しました" })
  } catch (error) {
    console.error("Unlike API error:", error)
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 })
  }
}
