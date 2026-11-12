import React from 'react';
import './MoodSelector.css';

/**
 * MoodSelector კომპონენტი (Child Component)
 * მშობელი კომპონენტიდან (App.jsx) იღებს მონაცემთა მასივს და ფუნქციას:
 * @param {Array} categories - განწყობებისა და ჟანრების მასივი
 * @param {string} selectedCategory - არჩეული კატეგორიის ID
 * @param {function} onSelectCategory - კატეგორიის შეცვლის callback ფუნქცია
 */
export default function MoodSelector({
  categories,
  selectedCategory,
  onSelectCategory
}) {
  return (
    <section className="mood-selector">
      <div className="section-header">
        <h3 className="section-title">
          <span>🎧</span> რა განწყობაზე ხარ დღეს?
        </h3>
        <span className="section-subtitle">აირჩიე კატეგორია რეკომენდაციისთვის</span>
      </div>

      {/* მასივის გამოსახვა .map() მეთოდის გამოყენებით */}
      <div className="mood-chips-container">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              className={`mood-chip ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <span className="mood-icon">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

