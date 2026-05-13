interface Props {
  activeTab: "podcasts" | "latest";
  onTabChange: (tab: "podcasts" | "latest") => void;
}

export function TabBar({ activeTab, onTabChange }: Props) {
  return (
    <nav className="tab-bar">
      <button
        className={"tab-btn" + (activeTab === "podcasts" ? " active" : "")}
        onClick={() => onTabChange("podcasts")}
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
        onClick={() => onTabChange("latest")}
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
  );
}
