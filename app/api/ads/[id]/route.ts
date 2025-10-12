import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = await createClient()

    // 認証チェック
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    // 広告の所有者を確認
    const { data: ad, error: fetchError } = await supabase
      .from("ads")
      .select("user_id")
      .eq("id", id)
      .single()

    if (fetchError || !ad) {
      return NextResponse.json({ error: "広告が見つかりません" }, { status: 404 })
    }

    if (ad.user_id !== user.id) {
      return NextResponse.json({ error: "この広告を編集する権限がありません" }, { status: 403 })
    }

    // 広告を更新
    const { data: updatedAd, error: updateError } = await supabase
      .from("ads")
      .update({
        title: body.title,
        company: body.company,
        category: body.category,
        description: body.description,
        tags: body.tags,
        link_url: body.link_url || null,
      })
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      console.error("Update error:", updateError)
      return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 })
    }

    return NextResponse.json({ ad: updatedAd })
  } catch (error) {
    console.error("Update API error:", error)
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

    // 広告の所有者を確認
    const { data: ad, error: fetchError } = await supabase
      .from("ads")
      .select("user_id")
      .eq("id", id)
      .single()

    if (fetchError || !ad) {
      return NextResponse.json({ error: "広告が見つかりません" }, { status: 404 })
    }

    if (ad.user_id !== user.id) {
      return NextResponse.json({ error: "この広告を削除する権限がありません" }, { status: 403 })
    }

    // 広告を削除
    const { error: deleteError } = await supabase
      .from("ads")
      .delete()
      .eq("id", id)

    if (deleteError) {
      return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 })
    }

    return NextResponse.json({ message: "広告を削除しました" })
  } catch (error) {
    console.error("Delete ad error:", error)
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 })
  }
}
