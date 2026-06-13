import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  telemetry_events: defineTable({
    userId: v.id("users"),
    cli: v.number(),
    event: v.string(),
    details: v.optional(v.any()),
    timestamp: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_userId_timestamp", ["userId", "timestamp"]),

  cli_snapshots: defineTable({
    userId: v.id("users"),
    cli: v.number(),
    taskComplexity: v.number(),
    workHours: v.number(),
    sleepHours: v.number(),
    faultCodes: v.array(v.string()),
    isOverloaded: v.boolean(),
    timestamp: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_userId_timestamp", ["userId", "timestamp"]),

  daily_aggregates: defineTable({
    userId: v.id("users"),
    date: v.string(),
    avgCli: v.number(),
    maxCli: v.number(),
    minCli: v.number(),
    overloadCount: v.number(),
    totalSnapshots: v.number(),
    sessionDuration: v.number(),
  }).index("by_userId_date", ["userId", "date"]),

  trusted_contacts: defineTable({
    userId: v.id("users"),
    email: v.string(),
    optIn: v.boolean(),
  }).index("by_userId", ["userId"]),

  nudges: defineTable({
    userId: v.id("users"),
    contactEmail: v.string(),
    cliAtNudge: v.number(),
    sentAt: v.number(),
    delivered: v.boolean(),
  }).index("by_userId", ["userId"]),

  email_schedules: defineTable({
    userId: v.id("users"),
    email: v.string(),
    frequency: v.union(
      v.literal("off"),
      v.literal("hourly"),
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly"),
      v.literal("yearly"),
    ),
    lastSent: v.optional(v.number()),
    nextSend: v.optional(v.number()),
  }).index("by_userId", ["userId"]),
})
