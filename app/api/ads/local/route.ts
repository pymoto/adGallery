import { NextResponse } from "next/server"

// ローカル広告の取得（開発用）
export async function GET() {
  try {
    // ローカルストレージから広告を取得
    // 実際の実装では、メモリ内の配列を使用
    const localAds = [
      {
        id: "local-1",
        title: "ローカル広告1",
        company: "ローカル会社",
        category: "tech",
        description: "ローカルで作成された広告です",
        image_url: "https://picsum.photos/400/300?random=1",
        is_published: false,
        created_at: new Date().toISOString()
      }
    ]

    return NextResponse.json({ ads: localAds })

  } catch (error) {
    console.error("Local ads fetch error:", error)
    return NextResponse.json({ 
      error: "ローカル広告の取得に失敗しました" 
    }, { status: 500 })
  }
}
