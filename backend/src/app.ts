import express, { type Request, type Response } from "express";
import cors from "cors";
import podcastRoutes from "./routes/podcasts.js";
import episodeRoutes from "./routes/episodes.js";
import searchRoutes from "./routes/search.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`[${new Date().toLocaleString("sv-SE")}] ${req.method} ${req.url} → ${res.statusCode} (${ms}ms)`);
  });
  next();
});

app.use("/api/podcasts", podcastRoutes);
app.use("/api/episodes", episodeRoutes);
app.use("/api/search", searchRoutes);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use(notFound);
app.use(errorHandler);

export default app;
