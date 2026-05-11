import { Router } from "express";
import {
  getAllEpisodes,
  getEpisodeById,
} from "../controllers/episodeController.js";

const router = Router();

router.get("/", getAllEpisodes);
router.get("/:id", getEpisodeById);

export default router;
