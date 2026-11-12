import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar.jsx';
import HeroBanner from './components/HeroBanner/HeroBanner.jsx';
import MoodSelector from './components/MoodSelector/MoodSelector.jsx';
import RecommendationBox from './components/RecommendationBox/RecommendationBox.jsx';
import MusicList from './components/MusicList/MusicList.jsx';
import Player from './components/Player/Player.jsx';
import MusicModal from './components/MusicModal/MusicModal.jsx';
import StatsBar from './components/StatsBar/StatsBar.jsx';
import AuthModal from './components/AuthModal/AuthModal.jsx';

import { MOOD_CATEGORIES, INITIAL_SONGS } from './data/musicDatabase.js';
import { fetchSongsApi, getSmartRecommendationApi } from './services/musicApi.js';
import './App.css';

/**
 * მთავარი მშობელი კომპონენტი (Parent Component)
 * მართავს გლობალურ State-ებს (useState) და ეფექტებს (useEffect).
 * ინფორმაციას გადასცემს შვილ კომპონენტებს Props-ების სახით.
 */
export default function App() {
  // 1. STATE MANAGEMENT (useState)
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home'); // SPA Router იმიტაცია: 'home', 'recommender', 'favorites', 'stats'

  // რეკომენდატორის State
  const [recommendedSong, setRecommendedSong] = useState(null);
  const [recLoading, setRecLoading] = useState(false);

  // აუდიო ფლეიერის State
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // რჩეულების (Favorites) State (შენახვა localStorage-ში)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('melomix_favorites');
      return saved ? JSON.parse(saved) : [1, 3, 14]; // საწყისად რამდენიმე რჩეული
    } catch {
      return [1, 3, 14];
    }
  });

  // ავტორიზაციის State (Sign In / Log In)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('melomix_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' ან 'signin'

  // მოდალის State (სიმღერის დეტალური ინფორმაცია)
  const [modalSong, setModalSong] = useState(null);

  // შეტყობინების (Toast) State
  const [toastMessage, setToastMessage] = useState('');

  // 2. SIDE EFFECTS (useEffect)

  // ეფექტი 1: მუსიკების სიის წამოღება API-დან (კატეგორიის ან ძიების შეცვლისას)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchSongsApi(selectedCategory, searchQuery)
      .then((res) => {
        if (isMounted) {
          setSongs(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("API შეცდომა:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, searchQuery]);

  // ეფექტი 2: საწყისი ჭკვიანი რეკომენდაციის გენერირება
  useEffect(() => {
    handleGenerateRecommendation();
  }, []);

  // ეფექტი 3: რჩეულების შენახვა localStorage-ში
  useEffect(() => {
    try {
      localStorage.setItem('melomix_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn("localStorage შენახვა ვერ მოხერხდა", e);
    }
  }, [favorites]);

  // ეფექტი 4: მომხმარებლის შენახვა localStorage-ში
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('melomix_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('melomix_user');
      }
    } catch (e) {
      console.warn("localStorage user შენახვა ვერ მოხერხდა", e);
    }
  }, [currentUser]);

  // ეფექტი 5: ბრაუზერის სათაურის (Document Title) დინამიური განახლება
  useEffect(() => {
    if (currentTrack && isPlaying) {
      document.title = `▶ ${currentTrack.title} - ${currentTrack.artist} | Melomix`;
    } else {
      document.title = "Melomix - მუსიკების შემომთავაზებელი & ამრჩევი";
    }
  }, [currentTrack, isPlaying]);

  // ეფექტი 6: Router / URL Hash სინქრონიზაცია (ბრაუზერის Back/Forward ღილაკებისთვის)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'recommender', 'favorites', 'stats'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // ტაბის ცვლილებისას URL ჰეშის განახლება
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. HANDLER FUNCTIONS

  // ახალი რეკომენდაციის მოთხოვნა API-დან
  const handleGenerateRecommendation = async (preferredMood = selectedCategory) => {
    setRecLoading(true);
    try {
      const res = await getSmartRecommendationApi(preferredMood);
      setRecommendedSong(res.recommendedSong);
    } catch (err) {
      console.error("რეკომენდაციის შეცდომა:", err);
    } finally {
      setRecLoading(false);
    }
  };

  // სიმღერის დაკვრის მართვა
  const handlePlaySong = (song) => {
    if (currentTrack?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(song);
      setIsPlaying(true);
      showToast(`უკრავს: ${song.title} - ${song.artist}`);
    }
  };

  // შემდეგი სიმღერის ჩართვა
  const handleNextTrack = () => {
    if (!currentTrack || songs.length === 0) return;
    const currentIndex = songs.findIndex((s) => s.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentTrack(songs[nextIndex]);
    setIsPlaying(true);
  };

  // წინა სიმღერის ჩართვა
  const handlePrevTrack = () => {
    if (!currentTrack || songs.length === 0) return;
    const currentIndex = songs.findIndex((s) => s.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentTrack(songs[prevIndex]);
    setIsPlaying(true);
  };

  // რჩეულებში დამატება/წაშლა
  const handleToggleFavorite = (songId) => {
    setFavorites((prev) => {
      const exists = prev.includes(songId);
      if (exists) {
        showToast("ამოიშალა რჩეულებიდან");
        return prev.filter((id) => id !== songId);
      } else {
        showToast("დაემატა რჩეულებში! ❤️");
        return [...prev, songId];
      }
    });
  };

  // შეტყობინების ჩვენება
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  // შემთხვევითი სიმღერის არჩევა ("გამაკვირვე")
  const handleSurpriseMe = () => {
    const randomSong = INITIAL_SONGS[Math.floor(Math.random() * INITIAL_SONGS.length)];
    handlePlaySong(randomSong);
    showToast(`🎲 შემთხვევით შეირჩა: ${randomSong.title}`);
  };

  // ფილტრების გასუფთავება
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  // ავტორიზაციის ფუნქციები
  const handleOpenLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenSignIn = () => {
    setAuthMode('signin');
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    showToast(`კეთილი იყოს თქვენი მობრძანება, ${user.name}! 👋`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast("სისტემიდან გამოხვედით");
  };

  // ფავორიტების გაფილტვრა
  const favoriteSongs = INITIAL_SONGS.filter((s) => favorites.includes(s.id));

  return (
    <div className="app-container">
      {/* 1. შვილი კომპონენტი: Navbar (გადაეცემა ნავიგაცია, ძიება და ავტორიზაციის props) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoritesCount={favorites.length}
        user={currentUser}
        onOpenLogin={handleOpenLogin}
        onOpenSignIn={handleOpenSignIn}
        onLogout={handleLogout}
      />

      {/* ძირითადი კონტენტი */}
      <main className="main-content">
        {/* VIEW 1: მთავარი გვერდი (HOME) */}
        {activeTab === 'home' && (
          <>
            {/* 2. შვილი კომპონენტი: HeroBanner */}
            <HeroBanner
              onFindRecommendation={() => handleTabChange('recommender')}
              onSelectPopular={() => setSelectedCategory('popular')}
              onSurpriseMe={handleSurpriseMe}
            />

            {/* 3. შვილი კომპონენტი: MoodSelector (განწყობის ამრჩევი) */}
            <MoodSelector
              categories={MOOD_CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                handleGenerateRecommendation(catId);
              }}
            />

            {/* 4. შვილი კომპონენტი: RecommendationBox (შერჩეული რეკომენდაცია) */}
            <RecommendationBox
              song={recommendedSong}
              isPlaying={isPlaying}
              currentTrack={currentTrack}
              onPlay={handlePlaySong}
              onRefresh={() => handleGenerateRecommendation(selectedCategory)}
              isFavorite={favorites.includes(recommendedSong?.id)}
              onToggleFavorite={handleToggleFavorite}
              onViewDetails={(s) => setModalSong(s)}
              loading={recLoading}
            />

            {/* 5. შვილი კომპონენტი: MusicList (მუსიკების სია) */}
            <MusicList
              songs={songs}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              favorites={favorites}
              onPlaySong={handlePlaySong}
              onToggleFavorite={handleToggleFavorite}
              onViewDetails={(s) => setModalSong(s)}
              loading={loading}
              title={
                searchQuery
                  ? `ძიების შედეგები ("${searchQuery}")`
                  : selectedCategory === 'all'
                  ? 'პოპულარული და რეკომენდებული მუსიკები'
                  : `კატეგორია: ${selectedCategory}`
              }
              onResetFilters={handleResetFilters}
            />
          </>
        )}

        {/* VIEW 2: რეკომენდატორის გვერდი (RECOMMENDER VIEW) */}
        {activeTab === 'recommender' && (
          <div className="tab-view">
            <div className="view-header">
              <div>
                <h2 className="view-heading">✨ ჭკვიანი მუსიკალური ამრჩევი</h2>
                <p className="view-sub">
                  მიიღეთ პერსონალიზებული რეკომენდაცია განწყობის მიხედვით
                </p>
              </div>
            </div>

            <MoodSelector
              categories={MOOD_CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                handleGenerateRecommendation(catId);
              }}
            />

            <RecommendationBox
              song={recommendedSong}
              isPlaying={isPlaying}
              currentTrack={currentTrack}
              onPlay={handlePlaySong}
              onRefresh={() => handleGenerateRecommendation(selectedCategory)}
              isFavorite={favorites.includes(recommendedSong?.id)}
              onToggleFavorite={handleToggleFavorite}
              onViewDetails={(s) => setModalSong(s)}
              loading={recLoading}
            />

            <MusicList
              songs={songs.filter((s) => s.id !== recommendedSong?.id)}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              favorites={favorites}
              onPlaySong={handlePlaySong}
              onToggleFavorite={handleToggleFavorite}
              onViewDetails={(s) => setModalSong(s)}
              loading={loading}
              title="დამატებითი რეკომენდაციები ამ განწყობისთვის"
              onResetFilters={handleResetFilters}
            />
          </div>
        )}

        {/* VIEW 3: რჩეულების გვერდი (FAVORITES VIEW) */}
        {activeTab === 'favorites' && (
          <div className="tab-view">
            <div className="view-header">
              <div>
                <h2 className="view-heading">❤️ შენი რჩეული სიმღერები</h2>
                <p className="view-sub">
                  თქვენს მიერ მოწონებული კომპოზიციების პირადი კოლექცია
                </p>
              </div>
            </div>

            <MusicList
              songs={favoriteSongs}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              favorites={favorites}
              onPlaySong={handlePlaySong}
              onToggleFavorite={handleToggleFavorite}
              onViewDetails={(s) => setModalSong(s)}
              loading={false}
              title="რჩეულები"
              onResetFilters={() => handleTabChange('home')}
            />
          </div>
        )}

        {/* VIEW 4: სტატისტიკის გვერდი (STATS VIEW) */}
        {activeTab === 'stats' && (
          <div className="tab-view">
            <div className="view-header">
              <div>
                <h2 className="view-heading">📊 მუსიკალური ანალიტიკა</h2>
                <p className="view-sub">
                  საიტის მონაცემთა ბაზისა და თქვენი აქტივობის სტატისტიკა
                </p>
              </div>
            </div>

            {/* 6. შვილი კომპონენტი: StatsBar */}
            <StatsBar
              totalSongs={INITIAL_SONGS.length}
              favoritesCount={favorites.length}
              activeMood={selectedCategory}
              popularCount={INITIAL_SONGS.filter((s) => s.isPopular).length}
            />

            <MusicList
              songs={INITIAL_SONGS.filter((s) => s.isPopular)}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              favorites={favorites}
              onPlaySong={handlePlaySong}
              onToggleFavorite={handleToggleFavorite}
              onViewDetails={(s) => setModalSong(s)}
              loading={false}
              title="ყველა დროის ყველაზე პოპულარული ჰიტები"
            />
          </div>
        )}
      </main>

      {/* 7. შვილი კომპონენტი: MusicModal (დეტალების მოდალი) */}
      {modalSong && (
        <MusicModal
          song={modalSong}
          onClose={() => setModalSong(null)}
          isPlaying={isPlaying}
          currentTrack={currentTrack}
          onPlay={handlePlaySong}
          isFavorite={favorites.includes(modalSong.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* 8. შვილი კომპონენტი: AuthModal (Sign In / Log In მოდალი) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* 9. შვილი კომპონენტი: Player (ქვედა აუდიო ფლეიერი) */}
      <Player
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        isFavorite={favorites.includes(currentTrack?.id)}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* შეტყობინების Toast */}
      {toastMessage && (
        <div className="toast-notice">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>Melomix © 2026 — მუსიკების შემომთავაზებელი და ამრჩევი პლატფორმა • შექმნილია React-ზე</p>
      </footer>
    </div>
  );
}
