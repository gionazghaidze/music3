import React from 'react';
import MusicCard from '../MusicCard/MusicCard.jsx';
import './MusicList.css';

/**
 * MusicList კომპონენტი (Child Component)
 * იღებს მასივს მშობელი App კომპონენტიდან და .map() მეთოდით ასახავს თითოეულ MusicCard-ს.
 * @param {Array} songs - სიმღერების მასივი
 * @param {Object} currentTrack - აქტიური სიმღერა
 * @param {boolean} isPlaying - დაკვრის სტატუსი
 * @param {Array} favorites - რჩეული სიმღერების ID-ების სია
 * @param {function} onPlaySong - სიმღერის დაკვრის ფუნქცია
 * @param {function} onToggleFavorite - რჩეულებში დამატება/წაშლა
 * @param {function} onViewDetails - დეტალების გახსნის ფუნქცია
 * @param {boolean} loading - ჩატვირთვის სტატუსი
 * @param {string} title - სიის სათაური
 * @param {function} onResetFilters - ფილტრების გასუფთავება
 */
export default function MusicList({
  songs,
  currentTrack,
  isPlaying,
  favorites,
  onPlaySong,
  onToggleFavorite,
  onViewDetails,
  loading,
  title = "მუსიკების კოლექცია",
  onResetFilters
}) {
  return (
    <section className="music-list-section">
      {/* სიის ზედა ზოლი */}
      <div className="list-header">
        <h3 className="list-title">
          <span>🎵</span> {title}
        </h3>
        <span className="list-count">
          სულ: {songs.length} კომპოზიცია
        </span>
      </div>

      {/* ჩატვირთვის ინდიკატორი (Loading Skeleton) */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>მუსიკების ბაზა იტვირთება API-დან...</p>
        </div>
      ) : songs.length === 0 ? (
        /* ცარიელი მდგომარეობა (Empty State) */
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h4 className="empty-title">მუსიკა ვერ მოიძებნა</h4>
          <p className="empty-desc">
            სცადეთ სხვა საძიებო სიტყვა ან შეცვალეთ არჩეული განწყობა/ფილტრი.
          </p>
          {onResetFilters && (
            <button className="btn-reset" onClick={onResetFilters}>
              ყველა მუსიკის ნახვა
            </button>
          )}
        </div>
      ) : (
        /* მასივის გამოსახვა .map() მეთოდით და props-ების გადაცემა შვილ კომპონენტზე */
        <div className="music-grid">
          {songs.map((song) => {
            const isFav = favorites.includes(song.id);
            const isCurrent = currentTrack?.id === song.id;

            return (
              <MusicCard
                key={song.id}
                song={song}
                isCurrent={isCurrent}
                isPlaying={isPlaying}
                isFavorite={isFav}
                onPlay={onPlaySong}
                onToggleFavorite={onToggleFavorite}
                onViewDetails={onViewDetails}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

