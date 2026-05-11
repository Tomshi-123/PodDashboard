import type { Request, Response, NextFunction } from "express";
import Episode from "../models/Episode.js";

export async function getAllEpisodes(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { podcast_id } = req.query;
    const filter =
      typeof podcast_id === "string" ? { podcast: podcast_id } : {};
    const episodes = await Episode.find(filter)
      .sort({ published_at: -1 })
      .populate("podcast", "title image_url");
    res.json(episodes);
  } catch (err) {
    next(err);
  }
}

export async function getEpisodeById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const episode = await Episode.findById(req.params.id).populate(
      "podcast",
      "title image_url",
    );
    if (!episode) {
      res.status(404).json({ error: "Episode not found" });
      return;
    }
    res.json(episode);
  } catch (err) {
    next(err);
  }
}
