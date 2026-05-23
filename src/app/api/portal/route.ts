import { auth } from "@clerk/nextjs/server"
import { CustomerPortal } from "@polar-sh/nextjs"

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: (process.env.POLAR_SERVER as "sandbox" | "production") ?? "production",
  getExternalCustomerId: async () => {
    const { userId } = await auth()
    return userId ?? ""
  },
})
