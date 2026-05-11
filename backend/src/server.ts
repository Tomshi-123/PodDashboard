import mongoose from "mongoose";
import app from "./app.js";
import { connectDB } from "./db.js";
import { startRssCronJob } from "./jobs/rssFetchJob.js";

const PORT = Number(process.env.PORT) || 3000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
    const cronJob = startRssCronJob();

    function shutdown(signal: string): void {
      console.log(
        `\n[Server] ${signal} received — shutting down gracefully...`,
      );
      cronJob.stop();
      server.close(async () => {
        await mongoose.connection.close();
        console.log("[Server] MongoDB connection closed. Bye!");
        process.exit(0);
      });
    }

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
