import { cronJobs } from "convex/server"
import { internal } from "./_generated/api"

const crons = cronJobs()

crons.interval(
  "check email schedules",
  { hours: 1 },
  internal.email.checkAndSendDue,
)

export default crons
