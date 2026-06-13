import { type ReactNode } from "react"
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"
import { convexClientInstance, authClient } from "@/lib/convex"

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexBetterAuthProvider client={convexClientInstance} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  )
}
