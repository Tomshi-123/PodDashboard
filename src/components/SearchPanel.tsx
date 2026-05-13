import type { SearchResult } from "../api";

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  onSearch: () => void;
  searchResults: SearchResult[];
  adding: string | null;
  addError: string | null;
  onAdd: (result: SearchResult) => void;
}

export function SearchPanel({
  query,
  onQueryChange,
  onSearch,
  searchResults,
  adding,
  addError,
  onAdd,
}: Props) {
  return (
    <div className="search-panel">
      <div className="search-input-row">
        <input
          type="text"
          placeholder="Search for a podcast..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          autoFocus
        />
        <button onClick={onSearch}>Search</button>
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
                onClick={() => onAdd(r)}
                disabled={adding === r.spotify_id}
              >
                {adding === r.spotify_id ? "Adding..." : "+ Add"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
