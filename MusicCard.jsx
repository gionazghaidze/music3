import React from 'react';
import './MusicCard.css';

/**
 * MusicCard კომპონენტი (Child Component)
 * იღებს ერთეულ მონაცემს (song) და მართვის ფუნქციებს მშობელი MusicList-იდან props-ების სახით:
 * @param {Object} song - სიმღერის ობიექტი
 * @param {boolean} isCurrent - არის თუ არა ეს სიმღერა აქტიური ფლეიერში
 * @param {boolean} isPlaying - უკრავს თუ არა
 * @param {boolean} isFavorite - არის თუ არა რჩეულებში
 * @param {function} onPlay - დაკვრის ფუნქცია
 * @param {function} onToggleFavorite - რჩეულებში დამატების/წაშლის ფუნქცია
 * @param {function} onViewDetails - დეტალების მოდალის გამოძახება
 */
export default function MusicCard({
  song,
  isCurrent,
  isPlaying,
  isFavorite,
  onPlay,
  onToggleFavorite,
  onViewDetails
}) {
  const isCurrentlyPlaying = isCurrent && isPlaying;

  return (
    <article className={`music-card ${isCurrentlyPlaying ? 'playing' : ''}`}>
      {/* ალბომის სურათის კონტეინერი & Overlay */}
      <div className="card-cover-container">
        <img
          src={song.coverUrl}
          alt={song.title}
          className="card-img"
          loading="lazy"
        />

        {/* რჩეულების (Like) ღილაკი */}
        <button
          className={`fav-float-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(song.id);
          }}
          title={isFavorite ? 'რჩეულებიდან ამოშლა' : 'რჩეულებში დამატება'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>

        {/* Hover / Active Play Button Overlay */}
        <div className={`card-overlay ${isCurrentlyPlaying ? 'active' : ''}`}>
          <button
            className="card-play-btn"
            onClick={() => onPlay(song)}
            title={isCurrentlyPlaying ? 'პაუზა' : 'დაკვრა'}
          >
            {isCurrentlyPlaying ? '⏸' : '▶'}
          </button>
        </div>
      </div>

      {/* ბარათის ტექსტური ინფორმაცია */}
      <div className="card-body">
        <div className="card-header-row">
          <h4 className="card-title" title={song.title}>
            {song.title}
          </h4>
        </div>

        <p className="card-artist" title={song.artist}>
          {song.artist}
        </p>

        {/* ჟანრისა და განწყობის ტეგები */}
        <div className="card-tags">
          <span className="tag-badge mood">✨ {song.mood}</span>
          <span className="tag-badge">{song.genre}</span>
        </div>

        {/* ქვედა ზოლი: ხანგრძლივობა, რეიტინგი და დეტალების ბმული */}
        <div className="card-footer">
          <span>⏱ {song.duration}</span>
          <span>⭐ {song.rating}</span>
          <button
            className="card-details-link"
            onClick={() => onViewDetails(song)}
          >
            დეტალები ➔
          </button>
        </div>
      </div>
    </article>
  );
}

