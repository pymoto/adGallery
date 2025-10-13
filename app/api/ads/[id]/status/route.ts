import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { is_published } = await request.json()

    console.log("Status update request:", { id, is_published })

    if (typeof is_published !== 'boolean' && is_published !== null) {
      return NextResponse.json(
        { error: "is_published must be boolean or null" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log("Auth check:", { user: user?.id, authError })
    if (authError || !user) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      )
    }

    // 広告の所有者チェック
    const { data: ad, error: adError } = await supabase
      .from("ads")
      .select("user_id, is_published")
      .eq("id", id)
      .single()

    console.log("Ad check:", { ad, adError })
    if (adError || !ad) {
      return NextResponse.json(
        { error: "広告が見つかりません" },
        { status: 404 }
      )
    }

    if (ad.user_id !== user.id) {
      return NextResponse.json(
        { error: "この広告を編集する権限がありません" },
        { status: 403 }
      )
    }

    // 承認待ちの広告はステータス変更不可
    if (ad.is_published === false) {
      return NextResponse.json(
        { error: "承認待ちの広告はステータスを変更できません。管理者の承認をお待ちください。" },
        { status: 403 }
      )
    }

    // ステータスを更新
    const { data: updatedAd, error: updateError } = await supabase
      .from("ads")
      .update({ is_published })
      .eq("id", id)
      .select("id, is_published")
      .single()

    console.log("Update result:", { updatedAd, updateError })
    if (updateError) {
      console.error("Update error:", updateError)
      return NextResponse.json(
        { error: "ステータスの更新に失敗しました" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      ad: updatedAd
    })

  } catch (error) {
    console.error("Status update error:", error)
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    )
  }
}
