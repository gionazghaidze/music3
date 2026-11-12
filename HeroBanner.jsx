import React from 'react';
import './HeroBanner.css';

/**
 * HeroBanner კომპონენტი (Child Component)
 * მშობელი კომპონენტიდან იღებს callback ფუნქციებს მოვლენების სამართავად:
 * @param {function} onFindRecommendation - ჭკვიანი ამრჩევის გახსნა
 * @param {function} onSelectPopular - ტოპ ჰიტების ფილტრაცია
 * @param {function} onSurpriseMe - შემთხვევითი მუსიკის არჩევა
 */
export default function HeroBanner({
  onFindRecommendation,
  onSelectPopular,
  onSurpriseMe
}) {
  return (
    <section className="hero-banner">
      <div className="hero-glow"></div>
      
      <div className="hero-content">
        <div className="hero-tag">
          <span>✨</span> მუსიკალური ინტელექტი & პერსონალური რეკომენდაციები
        </div>

        <h2 className="hero-title">
          არ იცი რა მოუსმინო? <br />
          <span className="highlight">აარჩიე იდეალური მუსიკა</span> შენი განწყობისთვის
        </h2>

        <p className="hero-description">
          Melomix გაგიწევს საუკეთესო მეგზურობას მუსიკის სამყაროში. გვითხარი რა განწყობაზე ხარ 
          ან რას საქმიანობ — სისტემა შემოგთავაზებს ყველაზე პოპულარულ, შთამაგონებელ და 
          შენზე მორგებულ ჰიტებს!
        </p>

        <div className="hero-actions">
          <button className="btn-primary" onClick={onFindRecommendation}>
            <span>🪄</span> მირჩიე მუსიკა
          </button>
          <button className="btn-secondary" onClick={onSelectPopular}>
            <span>🔥</span> ტოპ ჰიტები
          </button>
          <button className="btn-secondary" onClick={onSurpriseMe}>
            <span>🎲</span> გამაკვირვე
          </button>
        </div>
      </div>
    </section>
  );
}

