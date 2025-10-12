import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { reason, description } = await request.json()
    const adId = params.id

    if (!reason) {
      return NextResponse.json(
        { error: "通報理由を選択してください" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 }
      )
    }

    // 広告の存在確認
    const { data: ad, error: adError } = await supabase
      .from("ads")
      .select("id, title")
      .eq("id", adId)
      .single()

    if (adError || !ad) {
      return NextResponse.json(
        { error: "広告が見つかりません" },
        { status: 404 }
      )
    }

    // 通報レコードを作成
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .insert({
        ad_id: adId,
        reporter_id: user.id,
        reason,
        description: description || null,
        status: "pending",
      })
      .select()
      .single()

    if (reportError) {
      console.error("Report creation error:", reportError)
      return NextResponse.json(
        { error: "通報の送信に失敗しました" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "通報を受け付けました。審査いたします。",
      reportId: report.id,
    })

  } catch (error) {
    console.error("Report API error:", error)
    return NextResponse.json(
      { error: "通報の送信に失敗しました" },
      { status: 500 }
    )
  }
}
