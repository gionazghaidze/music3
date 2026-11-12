import React from 'react';
import './Navbar.css';

/**
 * Navbar კომპონენტი (Child Component)
 * მშობელი კომპონენტიდან (App.jsx) იღებს props-ებს:
 * @param {string} activeTab - აქტიური გვერდი/ჩანართი
 * @param {function} setActiveTab - ჩანართის შეცვლის ფუნქცია
 * @param {string} searchQuery - ძიების ტექსტი
 * @param {function} setSearchQuery - ძიების ტექსტის განახლება
 * @param {number} favoritesCount - რჩეული სიმღერების რაოდენობა
 * @param {Object|null} user - ავტორიზებული მომხმარებელი
 * @param {function} onOpenLogin - Log In მოდალის გახსნის ფუნქცია
 * @param {function} onOpenSignIn - Sign In მოდალის გახსნის ფუნქცია
 * @param {function} onLogout - სისტემიდან გამოსვლის ფუნქცია
 */
export default function Navbar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  favoritesCount,
  user,
  onOpenLogin,
  onOpenSignIn,
  onLogout
}) {
  return (
    <header className="navbar">
      {/* ლოგო და საიტის სახელი */}
      <div className="nav-brand" onClick={() => setActiveTab('home')}>
        <div className="brand-icon">🎧</div>
        <div className="brand-info">
          <h1>Melomix</h1>
          <p>მუსიკის შემომთავაზებელი & ამრჩევი</p>
        </div>
      </div>

      {/* საძიებო ველი (Search Input) */}
      <div className="nav-search">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="მოძებნე სიმღერა, შემსრულებელი ან ჟანრი..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="clear-search"
            onClick={() => setSearchQuery('')}
            title="გასუფთავება"
          >
            ✕
          </button>
        )}
      </div>

      {/* ნავიგაციის ღილაკები (Router/Tabs) */}
      <nav>
        <ul className="nav-links">
          <li>
            <button
              className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              <span>🏠</span>
              <span className="label">მთავარი</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activeTab === 'recommender' ? 'active' : ''}`}
              onClick={() => setActiveTab('recommender')}
            >
              <span>✨</span>
              <span className="label">რეკომენდატორი</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              <span>❤️</span>
              <span className="label">რჩეულები</span>
              {favoritesCount > 0 && (
                <span className="fav-badge">{favoritesCount}</span>
              )}
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              <span>📊</span>
              <span className="label">სტატისტიკა</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* მარჯვენა მხარე: Sign In & Log In ღილაკები */}
      <div className="nav-auth-group">
        {user ? (
          <div className="user-profile-badge">
            <span>{user.avatar || '👤'}</span>
            <span className="user-name">{user.name}</span>
            <button
              className="btn-logout"
              onClick={onLogout}
              title="გამოსვლა"
            >
              (გასვლა)
            </button>
          </div>
        ) : (
          <>
            <button
              className="btn-auth-login"
              onClick={onOpenLogin}
              title="სისტემაში შესვლა"
            >
              Log In
            </button>
            <button
              className="btn-auth-signin"
              onClick={onOpenSignIn}
              title="ანგარიშის შექმნა / Sign In"
            >
              Sign In
            </button>
          </>
        )}
      </div>
    </header>
  );
}
