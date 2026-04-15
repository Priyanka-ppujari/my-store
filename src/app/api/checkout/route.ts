import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { auth } from '@/server/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const { items } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items' }, { status: 400 })
    }

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      customer_email: session?.user?.email ?? undefined,
      metadata: {
        userId: session?.user?.id ?? 'guest',
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}