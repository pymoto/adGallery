import { NextRequest, NextResponse } from "next/server"

// ローカルストレージの代替（開発用）
const localAds: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 簡単なバリデーション
    if (!body.title || !body.company || !body.category) {
      return NextResponse.json({ 
        error: "必須項目が不足しています" 
      }, { status: 400 })
    }

    // ローカルストレージに保存
    const newAd = {
      id: `local-${Date.now()}`,
      ...body,
      user_id: "local-user-id",
      is_published: false,
      created_at: new Date().toISOString()
    }

    localAds.push(newAd)

    console.log("Local ad created:", newAd)
    console.log("Total local ads:", localAds.length)

    return NextResponse.json({ 
      ad: newAd,
      message: "ローカルストレージに保存されました（開発用）"
    })

  } catch (error) {
    console.error("Local API error:", error)
    return NextResponse.json({ 
      error: "ローカル保存エラーが発生しました" 
    }, { status: 500 })
  }
}

// ローカル広告を取得するエンドポイント
export async function GET() {
  return NextResponse.json({ ads: localAds })
}
