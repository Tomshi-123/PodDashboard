import { useEffect, useState } from "react";
import {
  fetchPodcasts,
  fetchEpisodes,
  searchPodcasts,
  deletePodcast,
} from "./api";
import type { Podcast, Episode, SearchResult } from "./api";
import "./App.css";

function App() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [adding, setAdding] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"podcasts" | "latest">("podcasts");
  const [latestEpisodes, setLatestEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    fetchPodcasts().then(setPodcasts);
  }, []);

  useEffect(() => {
    if (selectedPodcast) {
      fetchEpisodes(selectedPodcast.id).then(setEpisodes);
    }
  }, [selectedPodcast]);

  useEffect(() => {
    if (activeTab === "latest") {
      fetchEpisodes().then((eps) => setLatestEpisodes(eps.slice(0, 10)));
    }
  }, [activeTab]);

  function handleTabChange(tab: "podcasts" | "latest") {
    setActiveTab(tab);
    setSelectedPodcast(null);
    setShowSearch(false);
  }

  async function handleSearch() {
    if (!query.trim()) return;
    const results = await searchPodcasts(query);
    setSearchResults(results);
  }

  async function handleDelete(id: string) {
    await deletePodcast(id);
    setSelectedPodcast(null);
    const updated = await fetchPodcasts();
    setPodcasts(updated);
  }

  async function handleAdd(result: SearchResult) {
    setAdding(result.spotify_id);
    setAddError(null);
    const res = await fetch("http://localhost:3000/api/podcasts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    });
    setAdding(null);
    if (res.status === 409) {
      setAddError(`"${result.title}" is already in your library.`);
    } else {
      setSearchResults([]);
      setQuery("");
      setShowSearch(false);
    }
    const updated = await fetchPodcasts();
    setPodcasts(updated);
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          {selectedPodcast && (
            <button
              className="back-btn"
              onClick={() => setSelectedPodcast(null)}
            >
              Back
            </button>
          )}
          <span
            className="logo"
            onClick={() => {
              setSelectedPodcast(null);
              setActiveTab("podcasts");
            }}
          >
            PodDashboard
          </span>
        </div>
        <button className="find-btn" onClick={() => setShowSearch(!showSearch)}>
          {showSearch ? "Close" : "+ Find Podcast"}
        </button>
      </header>

      {showSearch && (
        <div className="search-panel">
          <div className="search-input-row">
            <input
              type="text"
              placeholder="Search for a podcast..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              autoFocus
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          {searchResults.length > 0 && (
            <ul className="search-results">
              {addError && <li className="search-error">{addError}</li>}
              {searchResults.map((r) => (
                <li key={r.spotify_id} className="search-result-item">
                  {r.image_url && <img src={r.image_url} alt={r.title} />}
                  <span>{r.title}</span>
                  <button
                    className="add-btn"
                    onClick={() => handleAdd(r)}
                    disabled={adding === r.spotify_id}
                  >
                    {adding === r.spotify_id ? "Adding..." : "+ Add"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <main className="main">
        {activeTab === "podcasts" ? (
          !selectedPodcast ? (
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
                      onClick={() => setSelectedPodcast(p)}
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
          ) : (
            <>
              <div className="podcast-detail-header">
                {selectedPodcast.image_url && (
                  <img
                    src={selectedPodcast.image_url}
                    alt={selectedPodcast.title}
                    className="detail-cover"
                  />
                )}
                <div className="detail-header-info">
                  <h2>{selectedPodcast.title}</h2>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(selectedPodcast.id)}
                  >
                    Remove podcast
                  </button>
                </div>
              </div>
              <div className="episode-list">
                {episodes.map((ep) => (
                  <EpisodeCard
                    key={ep.id}
                    episode={ep}
                    coverUrl={selectedPodcast.image_url}
                  />
                ))}
              </div>
            </>
          )
        ) : (
          <>
            <h2 className="section-title">Latest Episodes</h2>
            <div className="episode-list">
              {latestEpisodes.map((ep) => (
                <EpisodeCard
                  key={ep.id}
                  episode={ep}
                  coverUrl={ep.podcast?.image_url ?? null}
                  showPodcastName
                />
              ))}
            </div>
          </>
        )}
      </main>

      <nav className="tab-bar">
        <button
          className={"tab-btn" + (activeTab === "podcasts" ? " active" : "")}
          onClick={() => handleTabChange("podcasts")}
        >
          <svg
            className="tab-icon"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span className="tab-label">Podcasts</span>
        </button>
        <button
          className={"tab-btn" + (activeTab === "latest" ? " active" : "")}
          onClick={() => handleTabChange("latest")}
        >
          <svg
            className="tab-icon"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <span className="tab-label">Latest</span>
        </button>
      </nav>
    </div>
  );
}

function EpisodeCard({
  episode,
  coverUrl,
  showPodcastName = false,
}: {
  episode: Episode;
  coverUrl: string | null;
  showPodcastName?: boolean;
}) {
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

export default App;
