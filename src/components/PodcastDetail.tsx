import type { Podcast, Episode } from "../api";
import { EpisodeCard } from "./EpisodeCard";

interface Props {
  podcast: Podcast;
  episodes: Episode[];
  onDelete: (id: string) => void;
}

export function PodcastDetail({ podcast, episodes, onDelete }: Props) {
  return (
    <>
      <div className="podcast-detail-header">
        {podcast.image_url && (
          <img
            src={podcast.image_url}
            alt={podcast.title}
            className="detail-cover"
          />
        )}
        <div className="detail-header-info">
          <h2>{podcast.title}</h2>
          <button className="delete-btn" onClick={() => onDelete(podcast.id)}>
            Remove podcast
          </button>
        </div>
      </div>
      <div className="episode-list">
        {episodes.map((ep) => (
          <EpisodeCard key={ep.id} episode={ep} coverUrl={podcast.image_url} />
        ))}
      </div>
    </>
  );
}
