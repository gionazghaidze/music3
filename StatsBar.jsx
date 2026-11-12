import React from 'react';
import './StatsBar.css';

/**
 * StatsBar კომპონენტი (Child Component)
 * მშობელი კომპონენტიდან (App.jsx) იღებს სტატისტიკურ მონაცემებს props-ების სახით:
 * @param {number} totalSongs - სიმღერების საერთო რაოდენობა
 * @param {number} favoritesCount - რჩეულების რაოდენობა
 * @param {string} activeMood - მიმდინარე არჩეული განწყობა
 * @param {number} popularCount - პოპულარული ჰიტების რაოდენობა
 */
export default function StatsBar({
  totalSongs,
  favoritesCount,
  activeMood,
  popularCount
}) {
  const stats = [
    { id: 1, icon: "🎵", value: totalSongs, label: "სულ სიმღერა" },
    { id: 2, icon: "🔥", value: popularCount, label: "ტოპ ჰიტი" },
    { id: 3, icon: "❤️", value: favoritesCount, label: "შენი რჩეული" },
    { id: 4, icon: "✨", value: activeMood === "all" ? "ყველა" : activeMood, label: "აქტიური განწყობა" }
  ];

  return (
    <div className="stats-bar-container">
      {/* მასივის გამოსახვა .map() მეთოდით */}
      {stats.map((item) => (
        <div key={item.id} className="stat-card">
          <div className="stat-icon">{item.icon}</div>
          <div className="stat-info">
            <span className="stat-value">{item.value}</span>
            <span className="stat-label">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

