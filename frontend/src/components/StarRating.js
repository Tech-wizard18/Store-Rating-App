import React, { useState } from 'react';

export function StarDisplay({ value, size = '1.1rem' }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span className="stars" style={{ fontSize: size }}>
      {stars.map((s) => (
        <span key={s} className={`star ${s <= Math.round(value) ? 'filled' : 'empty'}`}>★</span>
      ))}
    </span>
  );
}

export function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
  const active = hover || value;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
      <span style={{ display: 'flex', gap: '0.5rem' }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <span
            key={s}
            onClick={() => onChange(s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            role="button"
            aria-label={`Rate ${s} stars`}
            style={{
              fontSize: '2.5rem',
              cursor: 'pointer',
              color: s <= active ? '#f59e0b' : '#d1d5db',
              transition: 'color 0.1s, transform 0.1s',
              transform: s <= active ? 'scale(1.15)' : 'scale(1)',
              userSelect: 'none',
              lineHeight: 1,
            }}
          >
            ★
          </span>
        ))}
      </span>
      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: active ? '#f59e0b' : '#9ca3af', minHeight: '1.2rem' }}>
        {active ? labels[active] : 'Click a star to rate'}
      </span>
    </div>
  );
}
