import React, { useEffect, useState } from 'react';
import './ScrollProgress.css';

const ScrollProgress: React.FC = () => {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const update = () => {
      const el  = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress__bar" style={{ width: `${pct}%` }} />
      <div
        className="scroll-progress__tip"
        style={{ left: `${pct}%` }}
      />
    </div>
  );
};

export default ScrollProgress;
