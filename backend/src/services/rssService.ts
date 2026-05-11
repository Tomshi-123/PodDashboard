import type { IPodcast } from "../models/Podcast.js";
import Episode from "../models/Episode.js";
import Podcast from "../models/Podcast.js";

let accessToken = "";
let tokenExpiry = 0;

async function getAccessToken(): Promise<string> {
  if (Date.now() < tokenExpiry) return accessToken;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
        ).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };
  accessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return accessToken;
}

export async function searchShows(q: string) {
  const token = await getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=show&market=SE&limit=10`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const data = (await res.json()) as {
    shows: {
      items: Array<{
        id: string;
        name: string;
        images: Array<{ url: string }>;
      }>;
    };
  };
  return data.shows.items.map((s) => ({
    spotify_id: s.id,
    title: s.name,
    image_url: s.images[0]?.url ?? null,
  }));
}

export async function fetchAndSaveEpisodes(podcast: IPodcast): Promise<void> {
  const token = await getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/shows/${podcast.spotify_id}/episodes?market=SE&limit=50`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const data = (await res.json()) as {
    items: Array<{
      id: string;
      name: string;
      description: string;
      release_date: string;
      external_urls: { spotify: string };
    }>;
  };

  if (!Array.isArray(data.items)) {
    console.error(
      `[Spotify] Unexpected response for show ${podcast.spotify_id}:`,
      data,
    );
    return;
  }
  for (const ep of data.items) {
    await Episode.findOneAndUpdate(
      { spotify_url: ep.external_urls.spotify },
      {
        $setOnInsert: {
          podcast: podcast._id,
          title: ep.name,
          description: ep.description ?? null,
          spotify_url: ep.external_urls.spotify,
          published_at: new Date(ep.release_date),
        },
      },
      { upsert: true, new: true },
    );
  }
}

export async function refreshAllFeeds(): Promise<void> {
  const podcasts = await Podcast.find();
  await Promise.all(podcasts.map(fetchAndSaveEpisodes));
  console.log(`[Spotify] Refreshed ${podcasts.length} podcast(s)`);
}
