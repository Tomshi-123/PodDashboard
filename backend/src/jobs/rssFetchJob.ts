import cron, { type ScheduledTask } from "node-cron";
import { refreshAllFeeds } from "../services/rssService.js";

/** Runs every hour. Returns the task so it can be stopped on shutdown. */
export function startRssCronJob(): ScheduledTask {
  const task = cron.schedule("0 * * * *", async () => {
    console.log("[Cron] Starting RSS refresh...");
    try {
      await refreshAllFeeds();
    } catch (err) {
      console.error("[Cron] RSS refresh failed:", err);
    }
  });

  console.log("[Cron] RSS job scheduled (every hour)");
  return task;
}
