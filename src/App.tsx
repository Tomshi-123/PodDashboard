import { useEffect, useState } from "react";
import {
  fetchPodcasts,
  fetchEpisodes,
  searchPodcasts,
  deletePodcast,
} from "./api";
import type { Podcast, Episode, SearchResult } from "./api";
import { Header } from "./components/Header";
import { SearchPanel } from "./components/SearchPanel";
import { PodcastGrid } from "./components/PodcastGrid";
import { PodcastDetail } from "./components/PodcastDetail";
import { LatestEpisodes } from "./components/LatestEpisodes";
import { TabBar } from "./components/TabBar";
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
      <Header
        selectedPodcast={selectedPodcast}
        showSearch={showSearch}
        onBack={() => setSelectedPodcast(null)}
        onLogoClick={() => {
          setSelectedPodcast(null);
          setActiveTab("podcasts");
        }}
        onToggleSearch={() => setShowSearch(!showSearch)}
      />

      {showSearch && (
        <SearchPanel
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          searchResults={searchResults}
          adding={adding}
          addError={addError}
          onAdd={handleAdd}
        />
      )}

      <main className="main">
        {activeTab === "podcasts" ? (
          !selectedPodcast ? (
            <PodcastGrid podcasts={podcasts} onSelect={setSelectedPodcast} />
          ) : (
            <PodcastDetail
              podcast={selectedPodcast}
              episodes={episodes}
              onDelete={handleDelete}
            />
          )
        ) : (
          <LatestEpisodes episodes={latestEpisodes} />
        )}
      </main>

      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default App;
