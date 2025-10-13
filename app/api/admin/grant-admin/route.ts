import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "メールアドレスが必要です" },
        { status: 400 }
      )
    }

    // 現在のユーザーが管理者かチェック
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      )
    }

    const { data: currentUser } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (!currentUser?.is_admin) {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 }
      )
    }

    // 対象ユーザーを検索
    const { data: targetUser, error: userError } = await supabase
      .from("profiles")
      .select("id, email, name")
      .eq("email", email)
      .single()

    if (userError || !targetUser) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      )
    }

    // 管理者権限を付与
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ is_admin: true })
      .eq("id", targetUser.id)

    if (updateError) {
      console.error("Error granting admin:", updateError)
      return NextResponse.json(
        { error: "管理者権限の付与に失敗しました" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: `${targetUser.name || targetUser.email} に管理者権限を付与しました`,
      user: {
        id: targetUser.id,
        email: targetUser.email,
        name: targetUser.name
      }
    })

  } catch (error) {
    console.error("Grant admin API error:", error)
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    )
  }
}
