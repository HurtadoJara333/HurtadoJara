import React, { useEffect, useState } from 'react';
import loaderImg from '../assets/bonfire-loader.jpg';
import './Loader.css';

interface LoaderProps {
  onDone: () => void;
}

const FADE_DURATION_MS = 800;

const Loader: React.FC<LoaderProps> = ({ onDone }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 3000);
    const t2 = setTimeout(() => onDone(), 3000 + FADE_DURATION_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className={`loader ${fadeOut ? 'loader--out' : ''}`}>
      {/* Floating embers */}
      <div className="loader__embers" aria-hidden="true">
        {Array.from({ length: 300 }).map((_, i) => (
          <div key={i} className="loader__ember" style={{
            left:              `${5 + Math.random() * 90}%`,
            animationDelay:    `${Math.random() * 5}s`,
            animationDuration: `${3.5 + Math.random() * 4}s`,
            width:             `${1 + Math.random() * 2.5}px`,
            height:            `${1 + Math.random() * 2.5}px`,
          }} />
        ))}
      </div>

      {/* ── Bonfire image — bottom-left corner ── */}
      <div className="loader__bonfire">
        <img src={loaderImg} alt="Bonfire" className="loader__bonfire-img" />
        {/* Glow overlay on the image */}
        <div className="loader__bonfire-glow" />
      </div>

      {/* Brand name below the bonfire */}
      <div className="loader__brand">
        <span className="loader__brand-text">HurtadoJara</span>
        <div className="loader__brand-line" />
      </div>

      {/* Corner ornaments */}
      <div className="loader__corner loader__corner--tl" />
      <div className="loader__corner loader__corner--tr" />
      <div className="loader__corner loader__corner--bl" />
      <div className="loader__corner loader__corner--br" />
    </div>
  );
};

export default Loader;