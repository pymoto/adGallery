import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"
import { createClient as createStripeClient } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const { adId } = await request.json()

    if (!adId) {
      return NextResponse.json(
        { error: "広告IDが必要です" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const stripe = createStripeClient()

    // 認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      )
    }

    // 広告の存在確認
    const { data: ad, error: adError } = await supabase
      .from("ads")
      .select("id, title, user_id")
      .eq("id", adId)
      .single()

    if (adError || !ad) {
      return NextResponse.json(
        { error: "広告が見つかりません" },
        { status: 404 }
      )
    }

    // 既に決済済みかチェック
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("id, status")
      .eq("ad_id", adId)
      .eq("user_id", user.id)
      .eq("status", "completed")
      .single()

    if (existingPayment) {
      return NextResponse.json(
        { error: "この広告は既に決済済みです" },
        { status: 400 }
      )
    }

    // セール情報を取得して価格を決定
    const { data: saleTier, error: saleError } = await supabase
      .from("pricing_tiers")
      .select("current_uses, max_uses")
      .eq("name", "sale")
      .single()

    if (saleError) {
      console.error("Sale tier fetch error:", saleError)
      return NextResponse.json(
        { error: "価格情報の取得に失敗しました" },
        { status: 500 }
      )
    }

    const saleCount = saleTier?.current_uses || 0
    const maxSaleCount = saleTier?.max_uses || 100
    const isSale = saleCount < maxSaleCount
    const currentPrice = isSale ? 500 : 5000

    // 価格設定を取得
    const { data: pricingTier } = await supabase
      .from("pricing_tiers")
      .select("id, name")
      .eq("name", isSale ? "sale" : "regular")
      .single()

    // Stripe決済セッションを作成
    if (!stripe) {
      console.error("Stripe client not initialized. Check STRIPE_SECRET_KEY environment variable.")
      
      // 開発環境でのテスト用フォールバック
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          sessionId: "test-session-" + Date.now(),
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/upload/success?session_id=test-session-${Date.now()}`,
          amount: currentPrice,
          isSale,
        })
      }
      
      return NextResponse.json(
        { error: "決済システムが設定されていません。管理者にお問い合わせください。" },
        { status: 500 }
      )
    }

    let session
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "jpy",
              product_data: {
                name: `広告投稿料金 - ${ad.title}`,
                description: isSale ? "先着100投稿セール価格" : "通常価格",
              },
              unit_amount: currentPrice,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/upload/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/upload?cancelled=true`,
        metadata: {
          ad_id: adId,
          user_id: user.id,
          pricing_tier_id: pricingTier?.id,
        },
      })
    } catch (stripeError) {
      console.error("Stripe session creation failed:", stripeError)
      
      // 開発環境でのテスト用フォールバック
      if (process.env.NODE_ENV === 'development') {
        const testSessionId = "test-session-" + Date.now()
        
        // テスト用の決済レコードを作成
        const { data: testPayment, error: testPaymentError } = await supabase
          .from("payments")
          .insert({
            user_id: user.id,
            ad_id: adId,
            pricing_tier_id: pricingTier?.id,
            amount: currentPrice,
            stripe_session_id: testSessionId,
            status: "completed", // テスト用なので完了状態
          })
          .select()
          .single()

        if (testPaymentError) {
          console.error("Test payment creation error:", testPaymentError)
        }

        // 広告を公開状態に更新
        const { error: adUpdateError } = await supabase
          .from("ads")
          .update({ is_published: true })
          .eq("id", adId)

        if (adUpdateError) {
          console.error("Test ad update error:", adUpdateError)
        }

        return NextResponse.json({
          sessionId: testSessionId,
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/upload/success?session_id=${testSessionId}`,
          amount: currentPrice,
          isSale,
        })
      }
      
      return NextResponse.json(
        { error: "決済セッションの作成に失敗しました。Stripeの設定を確認してください。" },
        { status: 500 }
      )
    }

    // 決済レコードを作成
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        ad_id: adId,
        pricing_tier_id: pricingTier?.id,
        amount: currentPrice,
        stripe_session_id: session.id,
        status: "pending",
      })
      .select()
      .single()

    if (paymentError) {
      console.error("Payment creation error:", paymentError)
      return NextResponse.json(
        { error: "決済レコードの作成に失敗しました" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      amount: currentPrice,
      isSale,
    })

  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json(
      { error: "決済セッションの作成に失敗しました" },
      { status: 500 }
    )
  }
}
