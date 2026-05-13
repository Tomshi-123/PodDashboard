import type { Podcast } from "../api";

interface Props {
  selectedPodcast: Podcast | null;
  showSearch: boolean;
  onBack: () => void;
  onLogoClick: () => void;
  onToggleSearch: () => void;
}

export function Header({
  selectedPodcast,
  showSearch,
  onBack,
  onLogoClick,
  onToggleSearch,
}: Props) {
  return (
    <header className="header">
      <div className="header-left">
        {selectedPodcast && (
          <button className="back-btn" onClick={onBack}>
            Back
          </button>
        )}
        <span className="logo" onClick={onLogoClick}>
          PodDashboard
        </span>
      </div>
      <button className="find-btn" onClick={onToggleSearch}>
        {showSearch ? "Close" : "+ Find Podcast"}
      </button>
    </header>
  );
}
