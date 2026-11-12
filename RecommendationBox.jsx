import React from 'react';
import './RecommendationBox.css';

/**
 * RecommendationBox კომპონენტი (Child Component)
 * მშობლისგან (App.jsx) იღებს რეკომენდირებულ სიმღერას და სამართავ ფუნქციებს:
 * @param {Object} song - რეკომენდებული სიმღერის ობიექტი
 * @param {boolean} isPlaying - უკრავს თუ არა მოცემული სიმღერა
 * @param {Object} currentTrack - ამჟამად არჩეული სიმღერა ფლეიერში
 * @param {function} onPlay - დაკვრის ფუნქცია
 * @param {function} onRefresh - ახალი რეკომენდაციის მოთხოვნა
 * @param {boolean} isFavorite - არის თუ არა ფავორიტებში
 * @param {function} onToggleFavorite - ფავორიტებში დამატება/წაშლა
 * @param {function} onViewDetails - დეტალების მოდალის გახსნა
 * @param {boolean} loading - ჩატვირთვის სტატუსი
 */
export default function RecommendationBox({
  song,
  isPlaying,
  currentTrack,
  onPlay,
  onRefresh,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
  loading
}) {
  if (!song) return null;

  const isCurrentSongPlaying = currentTrack?.id === song.id && isPlaying;

  return (
    <div className="recommendation-box">
      {/* ზედა ზოლი: ბეიჯი და ხელახალი რეკომენდაციის ღილაკი */}
      <div className="rec-header">
        <div className="rec-badge-group">
          <span className="rec-badge">
            <span>✨</span> ჭკვიანი რეკომენდაცია
          </span>
          <span className="rec-timestamp">შერჩეულია სპეციალურად თქვენთვის</span>
        </div>

        <button
          className="btn-shuffle"
          onClick={onRefresh}
          disabled={loading}
          title="სხვა სიმღერის შემოთავაზება"
        >
          <span>🔄</span>
          <span>{loading ? 'არჩევა...' : 'სხვა რეკომენდაცია'}</span>
        </button>
      </div>

      {/* ბარათის შიგთავსი */}
      <div className="rec-card-body">
        {/* ალბომის სურათი & დაკვრის ღილაკი */}
        <div className="rec-cover-wrapper" onClick={() => onPlay(song)}>
          <img
            src={song.coverUrl}
            alt={song.title}
            className="rec-cover-img"
            loading="lazy"
          />
          <div className={`rec-play-overlay ${isCurrentSongPlaying ? 'active' : ''}`}>
            <div className="rec-play-icon">
              {isCurrentSongPlaying ? '⏸' : '▶'}
            </div>
          </div>
        </div>

        {/* ინფორმაცია სიმღერაზე და რეკომენდაციის მიზეზი */}
        <div className="rec-info">
          <h4 className="rec-title">{song.title}</h4>
          <p className="rec-artist">{song.artist} • {song.album} ({song.year})</p>

          <div className="rec-reason">
            <strong>💡 რატომ მოგეწონებათ:</strong> {song.whyRecommended}
          </div>

          <div className="rec-meta-tags">
            <span className="meta-pill">🎭 {song.mood}</span>
            <span className="meta-pill">🎸 {song.genre}</span>
            <span className="meta-pill">⏱ {song.duration}</span>
            <span className="meta-pill">⭐ {song.rating}/5.0</span>
          </div>
        </div>

        {/* მოქმედების ღილაკები */}
        <div className="rec-actions">
          <button
            className={`btn-icon-rec favorite ${isFavorite ? 'active' : ''}`}
            onClick={() => onToggleFavorite(song.id)}
            title={isFavorite ? 'რჩეულებიდან ამოშლა' : 'რჩეულებში დამატება'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>

          <button
            className="btn-icon-rec"
            onClick={() => onViewDetails(song)}
            title="სრული დეტალების ნახვა"
          >
            ℹ️
          </button>
        </div>
      </div>
    </div>
  );
}

