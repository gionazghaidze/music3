import React, { useState, useEffect } from 'react';
import './AuthModal.css';

/**
 * AuthModal კომპონენტი (Child Component)
 * უზრუნველყოფს Sign In (რეგისტრაცია) და Log In (შესვლა) ფორმებს.
 * @param {boolean} isOpen - მოდალის ხილვადობა
 * @param {string} initialMode - საწყისი რეჟიმი ('login' ან 'signin')
 * @param {function} onClose - მოდალის დახურვა
 * @param {function} onAuthSuccess - ავტორიზაციის წარმატებით დასრულების callback
 */
export default function AuthModal({
  isOpen,
  initialMode = 'login',
  onClose,
  onAuthSuccess
}) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // რეჟიმის სინქრონიზაცია როდესაც initialMode იცვლება
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Escape ღილაკზე დახურვა
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKey);
    }
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const displayName = mode === 'signin' ? (name || 'მომხმარებელი') : (email.split('@')[0] || 'მომხმარებელი');
    onAuthSuccess({
      name: displayName,
      email: email || 'user@melomix.ge',
      avatar: '🎧'
    });
    onClose();
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose} title="დახურვა">
          ✕
        </button>

        <div className="auth-header">
          <div className="auth-header-icon">🎵</div>
          <h3>{mode === 'login' ? 'სისტემაში შესვლა' : 'ანგარიშის შექმნა'}</h3>
          <p>
            {mode === 'login'
              ? 'შედით Melomix-ში თქვენი რჩეული მუსიკების შესანახად'
              : 'დარეგისტრირდით და მიიღეთ პერსონალური რეკომენდაციები'}
          </p>
        </div>

        {/* გადამრთველი ტაბები (Log In / Sign In) */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Log In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'signin' ? 'active' : ''}`}
            onClick={() => setMode('signin')}
          >
            Sign In
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signin' && (
            <div className="form-group">
              <label>თქვენი სახელი</label>
              <input
                type="text"
                className="form-input"
                placeholder="მაგ: ნათია"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>ელ-ფოსტა</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>პაროლი</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            {mode === 'login' ? 'Log In ➔' : 'Sign In ➔'}
          </button>
        </form>

        <p className="demo-account-hint">
          💡 შეგიძლიათ შეიყვანოთ ნებისმიერი სატესტო მონაცემი
        </p>
      </div>
    </div>
  );
}

