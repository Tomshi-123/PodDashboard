import { Schema, model, Document } from "mongoose";

export interface IPodcast extends Document {
  title: string;
  spotify_id: string;
  image_url: string | null;
  created_at: Date;
}

const podcastSchema = new Schema<IPodcast>({
  title: { type: String, required: true },
  spotify_id: { type: String, required: true, unique: true },
  image_url: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
});

podcastSchema.set("toJSON", {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export default model<IPodcast>("Podcast", podcastSchema);
