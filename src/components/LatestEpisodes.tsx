import type { Episode } from "../api";
import { EpisodeCard } from "./EpisodeCard";

interface Props {
  episodes: Episode[];
}

export function LatestEpisodes({ episodes }: Props) {
  return (
    <>
      <h2 className="section-title">Latest Episodes</h2>
      <div className="episode-list">
        {episodes.map((ep) => (
          <EpisodeCard
            key={ep.id}
            episode={ep}
            coverUrl={ep.podcast?.image_url ?? null}
            showPodcastName
          />
        ))}
      </div>
    </>
  );
}
