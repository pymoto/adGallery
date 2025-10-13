import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const supabase = await createClient()

    // 認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      )
    }

    // 管理者権限チェック
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (profileError || !profile?.is_admin) {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 }
      )
    }

    // 自分自身の削除を防ぐ
    if (userId === user.id) {
      return NextResponse.json(
        { error: "自分自身を削除することはできません" },
        { status: 400 }
      )
    }

    // 削除対象ユーザーの存在確認
    const { data: targetUser, error: userError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("id", userId)
      .single()

    if (userError || !targetUser) {
      console.error("Target user not found:", { userId, userError })
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      )
    }

    console.log("Deleting user:", { id: targetUser.id, email: targetUser.email })

    // ユーザーに関連するデータを削除
    // 1. ユーザーの広告を削除
    console.log("Deleting user ads...")
    const { error: adsError } = await supabase
      .from("ads")
      .delete()
      .eq("user_id", userId)

    if (adsError) {
      console.error("Error deleting user ads:", adsError)
      return NextResponse.json(
        { error: "ユーザーの広告の削除に失敗しました" },
        { status: 500 }
      )
    }
    console.log("User ads deleted successfully")

    // 2. ユーザーのお気に入りを削除
    console.log("Deleting user favorites...")
    const { error: favoritesError } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)

    if (favoritesError) {
      console.error("Error deleting user favorites:", favoritesError)
      return NextResponse.json(
        { error: "ユーザーのお気に入りの削除に失敗しました" },
        { status: 500 }
      )
    }
    console.log("User favorites deleted successfully")

    // 3. ユーザーの通報を削除（エラーがあっても続行）
    console.log("Deleting user reports...")
    const { error: reportsError } = await supabase
      .from("reports")
      .delete()
      .eq("user_id", userId)

    if (reportsError) {
      console.error("Error deleting user reports:", reportsError)
      // 通報の削除に失敗しても続行（通報は必須ではない）
      console.log("Continuing with user deletion despite reports deletion error")
    } else {
      console.log("User reports deleted successfully")
    }

    // 4. ユーザーのプロファイルを削除
    console.log("Deleting user profile...")
    const { error: profileDeleteError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId)

    if (profileDeleteError) {
      console.error("Error deleting user profile:", profileDeleteError)
      return NextResponse.json(
        { error: "ユーザープロファイルの削除に失敗しました" },
        { status: 500 }
      )
    }
    console.log("User profile deleted successfully")

    // 5. 最後にauth.usersから削除（Supabaseの制限により、通常は自動削除される）
    // 注意: auth.usersからの削除はSupabaseの制限により、通常はプロファイル削除時に自動的に行われる

    return NextResponse.json({
      success: true,
      message: `ユーザー ${targetUser.email} を削除しました`,
      deletedUser: {
        id: targetUser.id,
        email: targetUser.email
      }
    })

  } catch (error) {
    console.error("User deletion error:", error)
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    )
  }
}
