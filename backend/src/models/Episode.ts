import { Schema, model, Document, Types } from "mongoose";
import type { IPodcast } from "./Podcast.js";

export interface IEpisode extends Document {
  podcast: Types.ObjectId | IPodcast;
  title: string;
  description: string | null;
  spotify_url: string;
  published_at: Date;
}

const episodeSchema = new Schema<IEpisode>({
  podcast: { type: Schema.Types.ObjectId, ref: "Podcast", required: true },
  title: { type: String, required: true },
  description: { type: String, default: null },
  spotify_url: { type: String, required: true, unique: true },
  published_at: { type: Date, required: true },
});

episodeSchema.set("toJSON", {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export default model<IEpisode>("Episode", episodeSchema);
