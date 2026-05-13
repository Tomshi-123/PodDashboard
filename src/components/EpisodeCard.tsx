import type { Episode } from "../api";

interface Props {
  episode: Episode;
  coverUrl: string | null;
  showPodcastName?: boolean;
}

export function EpisodeCard({
  episode,
  coverUrl,
  showPodcastName = false,
}: Props) {
  return (
    <a
      href={episode.spotify_url}
      target="_blank"
      rel="noopener noreferrer"
      className="episode-card"
    >
      {coverUrl && <img src={coverUrl} alt={episode.title} />}
      <div className="episode-card-info">
        {showPodcastName && episode.podcast && (
          <span className="episode-card-podcast">{episode.podcast.title}</span>
        )}
        <span className="episode-card-title">{episode.title}</span>
        <span className="episode-card-date">
          {new Date(episode.published_at).toLocaleDateString("sv-SE")}
        </span>
      </div>
      <span className="play-icon">&#9654;</span>
    </a>
  );
}
