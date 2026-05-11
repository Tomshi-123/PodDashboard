import type { Request, Response, NextFunction } from "express";
import Podcast from "../models/Podcast.js";
import Episode from "../models/Episode.js";
import { fetchAndSaveEpisodes } from "../services/rssService.js";

export async function getAllPodcasts(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const podcasts = await Podcast.find().sort({ created_at: -1 });
    res.json(podcasts);
  } catch (err) {
    next(err);
  }
}

export async function getPodcastById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      res.status(404).json({ error: "Podcast not found" });
      return;
    }
    res.json(podcast);
  } catch (err) {
    next(err);
  }
}

export async function createPodcast(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { title, spotify_id, image_url } = req.body;
    if (!title || !spotify_id) {
      res.status(400).json({ error: "title and spotify_id are required" });
      return;
    }
    const podcast = await Podcast.create({
      title,
      spotify_id,
      image_url: image_url ?? null,
    });
    res.status(201).json(podcast);
    fetchAndSaveEpisodes(podcast).catch((err) =>
      console.error(`[Spotify] Failed to fetch episodes: ${err}`),
    );
  } catch (err) {
    next(err);
  }
}

export async function deletePodcast(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    await Episode.deleteMany({ podcast: id });
    await Podcast.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
