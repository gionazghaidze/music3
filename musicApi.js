import { INITIAL_SONGS } from '../data/musicDatabase.js';

export const fetchSongsApi = async (category = "all", searchQuery = "") => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...INITIAL_SONGS];

      if (category === "popular") {
        filtered = filtered.filter((s) => s.isPopular);
      } else if (category !== "all") {
        filtered = filtered.filter(
          (s) => s.mood === category || s.genre.toLowerCase().includes(category.toLowerCase())
        );
      }

      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.title.toLowerCase().includes(query) ||
            s.artist.toLowerCase().includes(query) ||
            s.genre.toLowerCase().includes(query)
        );
      }

      resolve({
        status: 200,
        data: filtered,
        total: filtered.length
      });
    }, 400);
  });
};

export const fetchSongByIdApi = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const song = INITIAL_SONGS.find((s) => s.id === Number(id));
      if (song) {
        resolve({ status: 200, data: song });
      } else {
        reject(new Error("სიმღერა ვერ მოიძებნა"));
      }
    }, 250);
  });
};

export const getSmartRecommendationApi = async (preferredMood = null) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let pool = INITIAL_SONGS;
      if (preferredMood && preferredMood !== "all") {
        const matching = INITIAL_SONGS.filter((s) => s.mood === preferredMood);
        if (matching.length > 0) {
          pool = matching;
        }
      }
      const randomIndex = Math.floor(Math.random() * pool.length);
      const chosen = pool[randomIndex];

      resolve({
        status: 200,
        recommendedSong: chosen,
        timestamp: new Date().toLocaleTimeString(),
        reason: chosen.whyRecommended
      });
    }, 450);
  });
};

