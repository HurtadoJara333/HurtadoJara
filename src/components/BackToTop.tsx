import React, { useEffect, useState } from 'react';
import './BackToTop.css';

const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <button
      className={`btt ${visible ? 'btt--visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <span className="btt__rune">⚜</span>
      <span className="btt__arrow">↑</span>
    </button>
  );
};

export default BackToTop;
