import type { Podcast } from "../api";

interface Props {
  podcasts: Podcast[];
  onSelect: (podcast: Podcast) => void;
}

export function PodcastGrid({ podcasts, onSelect }: Props) {
  return (
    <>
      <h2 className="section-title">My Podcasts</h2>
      {podcasts.length === 0 ? (
        <p className="empty">
          No podcasts yet. Click "+ Find Podcast" to add one.
        </p>
      ) : (
        <div className="podcast-grid">
          {podcasts.map((p) => (
            <button
              key={p.id}
              className="podcast-card"
              onClick={() => onSelect(p)}
            >
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} />
              ) : (
                <div className="podcast-card-placeholder">??</div>
              )}
              <span className="podcast-card-title">{p.title}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
