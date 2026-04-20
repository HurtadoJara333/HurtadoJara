import { useEffect } from 'react';

export const useCursor = () => {
  useEffect(() => {
    const dot  = document.getElementById('cursor-dot')!;
    const ring = document.getElementById('cursor-ring')!;
    if (!dot || !ring) return;

    let rx = 0, ry = 0;

    const move = (e: MouseEvent) => {
      dot.style.left  = `${e.clientX}px`;
      dot.style.top   = `${e.clientY}px`;
    };

    const lerp = () => {
      const dot  = document.getElementById('cursor-dot')!;
      const ring = document.getElementById('cursor-ring')!;
      if (!dot || !ring) return;
      const tx = parseFloat(dot.style.left) || 0;
      const ty = parseFloat(dot.style.top)  || 0;
      rx += (tx - rx) * 0.12;
      ry += (ty - ry) * 0.12;
      ring.style.left = `${rx}px`;
      ring.style.top  = `${ry}px`;
      requestAnimationFrame(lerp);
    };

    const over  = () => { dot.classList.add('hovering'); ring.classList.add('hovering'); };
    const leave = () => { dot.classList.remove('hovering'); ring.classList.remove('hovering'); };

    document.addEventListener('mousemove', move);
    document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', over);
      el.addEventListener('mouseleave', leave);
    });

    const raf = requestAnimationFrame(lerp);
    return () => {
      document.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, []);
};
