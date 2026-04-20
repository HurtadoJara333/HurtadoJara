import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__line" />
      <div className="footer__inner">
        <div className="footer__rune">⚜</div>
        <p className="footer__copy">© {year} Andrés Hurtado Jaramillo · Forjado con fuego y TypeScript</p>
        <p className="footer__sub">Que la gracia dorada te guíe · Medellín, Colombia</p>
      </div>
    </footer>
  );
};

export default Footer;
