import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { Polar } from "@polar-sh/sdk"

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: (process.env.POLAR_SERVER as "sandbox" | "production") ?? "production",
})

export async function GET(req: NextRequest) {
  const { userId } = await auth()

  const checkout = await polar.checkouts.create({
    products: [process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID!],
    externalCustomerId: userId ?? undefined,
    successUrl: new URL("/?success=true", req.nextUrl.origin).href,
  })

  return NextResponse.redirect(checkout.url)
}
