import { httpRouter } from "convex/server"
import { authComponent } from "./auth"
import { createAuth } from "./betterAuth/auth"

const http = httpRouter()

authComponent.registerRoutesLazy(http, createAuth, {
  basePath: "/api/auth",
})

export default http
