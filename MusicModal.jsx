import React, { useEffect } from 'react';
import './MusicModal.css';

/**
 * MusicModal კომპონენტი (Child Component)
 * გამოდის ეკრანზე დეტალური ინფორმაციის საჩვენებლად.
 * იყენებს useEffect ჰუკს კლავიატურის 'Escape' ღილაკზე მოსასმენად.
 * @param {Object} song - არჩეული სიმღერის ობიექტი
 * @param {function} onClose - მოდალის დახურვის ფუნქცია
 * @param {boolean} isPlaying - დაკვრის სტატუსი
 * @param {Object} currentTrack - ამჟამად არჩეული სიმღერა
 * @param {function} onPlay - დაკვრის დაწყება/შეჩერება
 * @param {boolean} isFavorite - არის თუ არა რჩეულებში
 * @param {function} onToggleFavorite - რჩეულებში დამატება/წაშლა
 */
export default function MusicModal({
  song,
  onClose,
  isPlaying,
  currentTrack,
  onPlay,
  isFavorite,
  onToggleFavorite
}) {
  // useEffect - Escape ღილაკზე მოდალის დახურვის ივენთი
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!song) return null;

  const isCurrentSongPlaying = currentTrack?.id === song.id && isPlaying;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation ხელს უშლის შიდა დაკლიკებაზე მოდალის დახურვას */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} title="დახურვა">
          ✕
        </button>

        {/* ზედა სექცია: სურათი და მთავარი მეტამონაცემები */}
        <div className="modal-header-section">
          <img
            src={song.coverUrl}
            alt={song.title}
            className="modal-cover-img"
          />

          <div className="modal-meta-info">
            <h3 className="modal-song-title">{song.title}</h3>
            <p className="modal-song-artist">
              {song.artist} • {song.album} ({song.year})
            </p>

            <div className="modal-tags">
              <span className="modal-tag">🎭 {song.mood}</span>
              <span className="modal-tag">🎸 {song.genre}</span>
              <span className="modal-tag">⏱ {song.duration}</span>
              <span className="modal-tag">⭐ {song.rating} / 5.0</span>
            </div>
          </div>
        </div>

        {/* შუა სექცია: რეკომენდაციის მიზეზი და აღწერა */}
        <div className="modal-body-section">
          <div className="info-block">
            <h6>💡 რატომ გირჩევთ ამ მუსიკას:</h6>
            <p>{song.whyRecommended}</p>
          </div>

          <div className="info-block">
            <h6>📖 კომპოზიციის შესახებ:</h6>
            <p>{song.description}</p>
          </div>
        </div>

        {/* ქვედა სექცია: მოქმედების ღილაკები */}
        <div className="modal-actions">
          <button
            className="btn-modal-play"
            onClick={() => onPlay(song)}
          >
            <span>{isCurrentSongPlaying ? '⏸' : '▶'}</span>
            <span>{isCurrentSongPlaying ? 'შეჩერება' : 'მოსმენა'}</span>
          </button>

          <button
            className={`btn-modal-fav ${isFavorite ? 'active' : ''}`}
            onClick={() => onToggleFavorite(song.id)}
          >
            <span>{isFavorite ? '❤️' : '🤍'}</span>
            <span>{isFavorite ? 'რჩეულებშია' : 'რჩეულებში დამატება'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

