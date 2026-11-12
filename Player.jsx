import React, { useState, useEffect, useRef } from 'react';
import './Player.css';

/**
 * Player კომპონენტი (Child Component)
 * აუდიო ფლეიერის კომპონენტი, რომელიც იყენებს React Hooks-ს (useState, useEffect, useRef).
 * მშობლისგან (App.jsx) იღებს props-ებს:
 * @param {Object} currentTrack - ამჟამად არჩეული სიმღერა
 * @param {boolean} isPlaying - უკრავს თუ არა
 * @param {function} onTogglePlay - დაკვრა/დაპაუზების გადამრთველი
 * @param {function} onNext - შემდეგ სიმღერაზე გადასვლა
 * @param {function} onPrev - წინა სიმღერაზე დაბრუნება
 * @param {boolean} isFavorite - არის თუ არა რჩეულებში
 * @param {function} onToggleFavorite - რჩეულებში დამატება/წაშლა
 */
export default function Player({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  isFavorite,
  onToggleFavorite
}) {
  // ლოკალური მდგომარეობები (useState)
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

  // useEffect - აუდიო ფაილის დაკვრის კონტროლი isPlaying ცვლილებისას
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        // ბრაუზერის autoplay პოლიტიკის ერორის უსაფრთხო დამუშავება
        console.warn("Autoplay policy warning:", err.message);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  // useEffect - ხმის დონის (Volume) კონტროლი
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  if (!currentTrack) return null;

  // დროის ფორმატირება (წამები -> mm:ss)
  const formatTime = (timeInSec) => {
    if (isNaN(timeInSec)) return "0:00";
    const minutes = Math.floor(timeInSec / 60);
    const seconds = Math.floor(timeInSec % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // აუდიოს დროის განახლება
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // მეტამონაცემების ჩატვირთვა
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  // პროგრეს ბარის ხელით გადახვევა (Seek)
  const handleSeek = (e) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <div className="music-player-bar">
      {/* HTML5 Audio ელემენტი */}
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onNext}
      />

      {/* მარცხენა ბლოკი: სიმღერის ინფორმაცია */}
      <div className="player-track-info">
        <div className="player-cover-wrap">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="player-cover"
          />
          {isPlaying && (
            <div className="equalizer">
              <span className="eq-bar"></span>
              <span className="eq-bar"></span>
              <span className="eq-bar"></span>
              <span className="eq-bar"></span>
            </div>
          )}
        </div>

        <div className="player-text">
          <h5 className="player-title">{currentTrack.title}</h5>
          <p className="player-artist">{currentTrack.artist}</p>
        </div>

        <button
          className={`player-fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={() => onToggleFavorite(currentTrack.id)}
          title={isFavorite ? 'რჩეულებიდან ამოშლა' : 'რჩეულებში დამატება'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      {/* ცენტრალური ბლოკი: კონტროლის ღილაკები და დროის ზოლი */}
      <div className="player-controls">
        <div className="control-buttons">
          <button className="ctrl-btn" onClick={onPrev} title="წინა სიმღერა">
            ⏮
          </button>

          <button
            className="play-toggle-btn"
            onClick={onTogglePlay}
            title={isPlaying ? 'პაუზა' : 'დაკვრა'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <button className="ctrl-btn" onClick={onNext} title="შემდეგი სიმღერა">
            ⏭
          </button>
        </div>

        <div className="progress-container">
          <span className="time-text">{formatTime(currentTime)}</span>
          <input
            type="range"
            className="progress-bar-slider"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
          />
          <span className="time-text">{formatTime(duration)}</span>
        </div>
      </div>

      {/* მარჯვენა ბლოკი: ხმის რეგულირება (Volume Slider) */}
      <div className="player-volume-wrapper">
        <button
          className="vol-icon-btn"
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? 'ხმის ჩართვა' : 'დადუმება'}
        >
          {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
        </button>

        <input
          type="range"
          className="volume-slider"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(Number(e.target.value));
            setIsMuted(false);
          }}
        />
      </div>
    </div>
  );
}

