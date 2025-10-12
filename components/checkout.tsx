"use client"

import { useCallback } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import { startCheckoutSession } from "@/lib/stripe"

// Stripeキーが設定されている場合のみloadStripeを呼び出し
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

export default function Checkout({ productId, adData }: { productId: string; adData: string }) {
  const startCheckoutSessionForProduct = useCallback(() => startCheckoutSession(productId, adData), [productId, adData])

  // Stripeが設定されていない場合はモック決済画面を表示
  if (!stripePromise) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💳</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">決済機能は準備中です</h3>
          <p className="text-muted-foreground mb-4">
            Stripeの設定が完了していません。現在はモック決済として動作します。
          </p>
        </div>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            実際の決済機能を使用するには、StripeのAPIキーを設定してください。
          </p>
        </div>
      </div>
    )
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret: startCheckoutSessionForProduct }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
