import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // 認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    // 広告データを挿入
    const { data: adData, error: insertError } = await supabase
      .from("ads")
      .insert({
        ...body,
        user_id: user.id,
        is_published: false
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error inserting ad:", insertError)
      return NextResponse.json({ 
        error: "広告の作成に失敗しました", 
        details: insertError.message 
      }, { status: 500 })
    }

    return NextResponse.json({ ad: adData })

  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ 
      error: "サーバーエラーが発生しました" 
    }, { status: 500 })
  }
}
