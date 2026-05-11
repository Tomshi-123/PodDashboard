import { Router } from "express";
import {
  getAllPodcasts,
  getPodcastById,
  createPodcast,
  deletePodcast,
} from "../controllers/podcastController.js";

const router = Router();

router.get("/", getAllPodcasts);
router.get("/:id", getPodcastById);
router.post("/", createPodcast);
router.delete("/:id", deletePodcast);

export default router;
