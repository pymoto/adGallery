import Stripe from "stripe"

// Stripeクライアントを条件付きで初期化
function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("Stripe secret key not configured. Stripe functionality disabled.")
    return null
  }
  
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-09-30.clover",
  })
}

// エクスポート用の関数
export function createClient() {
  return getStripeClient()
}

export async function startCheckoutSession(priceId: string, userId: string) {
  const stripe = getStripeClient()
  
  if (!stripe) {
    console.warn("Stripe not configured. Returning mock session.")
    return "mock-client-secret"
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/upload/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/upload`,
      metadata: {
        userId,
      },
    })

    return session.client_secret
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw new Error("Failed to create checkout session")
  }
}

export async function retrieveCheckoutSession(sessionId: string) {
  const stripe = getStripeClient()
  
  if (!stripe) {
    console.warn("Stripe not configured. Returning mock session.")
    return {
      id: sessionId,
      status: "complete",
      payment_status: "paid"
    }
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return session
  } catch (error) {
    console.error("Error retrieving checkout session:", error)
    throw new Error("Failed to retrieve checkout session")
  }
}
