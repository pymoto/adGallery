import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"
import { createClient as createStripeClient } from "@/lib/stripe"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      return NextResponse.json(
        { error: "Stripe signature not found" },
        { status: 400 }
      )
    }

    const stripe = createStripeClient()
    const supabase = await createClient()

    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe client not initialized" },
        { status: 500 }
      )
    }

    let event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      )
    }

    // 決済完了時の処理
    if (event.type === "checkout.session.completed") {
      const session = event.data.object
      const { ad_id, user_id, pricing_tier_id } = session.metadata

      // 決済ステータスを更新
      const { error: updateError } = await supabase
        .from("payments")
        .update({
          status: "completed",
          stripe_payment_intent_id: session.payment_intent,
          completed_at: new Date().toISOString(),
        })
        .eq("stripe_session_id", session.id)

      if (updateError) {
        console.error("Payment update error:", updateError)
        return NextResponse.json(
          { error: "Payment update failed" },
          { status: 500 }
        )
      }

      // 広告を公開状態に更新
      const { error: adUpdateError } = await supabase
        .from("ads")
        .update({ is_published: true })
        .eq("id", ad_id)

      if (adUpdateError) {
        console.error("Ad update error:", adUpdateError)
        return NextResponse.json(
          { error: "Ad update failed" },
          { status: 500 }
        )
      }

      console.log(`Payment completed for ad ${ad_id} by user ${user_id}`)
    }

    // 決済失敗時の処理
    if (event.type === "checkout.session.expired") {
      const session = event.data.object

      const { error: updateError } = await supabase
        .from("payments")
        .update({
          status: "cancelled",
          failed_at: new Date().toISOString(),
        })
        .eq("stripe_session_id", session.id)

      if (updateError) {
        console.error("Payment cancellation error:", updateError)
      }
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

