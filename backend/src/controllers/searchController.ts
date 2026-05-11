import type { Request, Response, NextFunction } from "express";
import { searchShows } from "../services/rssService.js";

export async function search(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      res.status(400).json({ error: "q is required" });
      return;
    }
    const results = await searchShows(q);
    res.json(results);
  } catch (err) {
    next(err);
  }
}
