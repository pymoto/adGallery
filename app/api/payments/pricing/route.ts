import { NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // セール情報を取得
    const { data: saleTier, error: saleError } = await supabase
      .from("pricing_tiers")
      .select("current_uses, max_uses")
      .eq("name", "sale")
      .single()

    if (saleError) {
      console.error("Sale tier fetch error:", saleError)
      return NextResponse.json(
        { error: "セール情報の取得に失敗しました" },
        { status: 500 }
      )
    }

    // セールが有効かどうかを判定
    const saleCount = saleTier?.current_uses || 0
    const maxSaleCount = saleTier?.max_uses || 100
    const isSale = saleCount < maxSaleCount
    const currentPrice = isSale ? 500 : 5000

    return NextResponse.json({
      currentPrice,
      isSale,
      saleCount,
      maxSaleCount,
    })

  } catch (error) {
    console.error("Pricing API error:", error)
    return NextResponse.json(
      { error: "価格情報の取得に失敗しました" },
      { status: 500 }
    )
  }
}
