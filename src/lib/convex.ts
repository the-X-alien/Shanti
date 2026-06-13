import { ConvexReactClient } from "convex/react"
import { createAuthClient } from "better-auth/react"
import { convexClient, crossDomainClient } from "@convex-dev/better-auth/client/plugins"

const convexUrl = import.meta.env.VITE_CONVEX_URL
const siteUrl = import.meta.env.VITE_CONVEX_SITE_URL

export const convexClientInstance = new ConvexReactClient(convexUrl)

const clientPlugins = [convexClient(), crossDomainClient()] as const

export const authClient = createAuthClient({
  plugins: clientPlugins as any,
  baseURL: (siteUrl || convexUrl) + "/api/auth",
})
