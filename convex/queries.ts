import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import { authComponent } from "./auth"

export const getAuthUser = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.getAuthUser(ctx)
  },
})

export const listTelemetryEvents = query({
  args: { userId: v.id("users"), limit: v.optional(v.number()) },
  handler: async (ctx, { userId, limit }) => {
    const events = await ctx.db
      .query("telemetry_events")
      .withIndex("by_userId_timestamp", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit ?? 100)
    return events
  },
})

export const listCliSnapshots = query({
  args: { userId: v.id("users"), limit: v.optional(v.number()) },
  handler: async (ctx, { userId, limit }) => {
    const snapshots = await ctx.db
      .query("cli_snapshots")
      .withIndex("by_userId_timestamp", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit ?? 50)
    return snapshots
  },
})

export const getDailyAggregate = query({
  args: { userId: v.id("users"), date: v.string() },
  handler: async (ctx, { userId, date }) => {
    return await ctx.db
      .query("daily_aggregates")
      .withIndex("by_userId_date", (q) => q.eq("userId", userId).eq("date", date))
      .first()
  },
})

export const getTrustedContact = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("trusted_contacts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()
  },
})
