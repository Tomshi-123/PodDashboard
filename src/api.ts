// Types
interface Podcast {
  id: string;
  title: string;
  image_url: string | null;
}

interface Episode {
  id: string;
  title: string;
  description: string | null;
  spotify_url: string;
  published_at: string;
  podcast: { title: string; image_url: string | null };
}

interface SearchResult {
  title: string;
  spotify_id: string;
  image_url: string | null;
}

const API = "http://localhost:3000/api";

async function fetchEpisodes(podcastId?: string): Promise<Episode[]> {
  const url = podcastId
    ? `${API}/episodes?podcast_id=${podcastId}`
    : `${API}/episodes`;
  const res = await fetch(url);
  return res.json();
}

async function fetchPodcasts(): Promise<Podcast[]> {
  const res = await fetch(`${API}/podcasts`);
  return res.json();
}

async function deletePodcast(id: string): Promise<void> {
  await fetch(`${API}/podcasts/${id}`, { method: "DELETE" });
}

async function searchPodcasts(q: string): Promise<SearchResult[]> {
  const res = await fetch(`${API}/search?q=${encodeURIComponent(q)}`);
  return res.json();
}

export { fetchEpisodes, fetchPodcasts, searchPodcasts, deletePodcast };
export type { Podcast, Episode, SearchResult };
