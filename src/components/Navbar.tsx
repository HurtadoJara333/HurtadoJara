import React from 'react';
import './Navbar.css';

interface NavbarProps {
  activeSection: string;
  scrolled: boolean;
}

const navLinks = [
  { id: 'inicio',      label: 'Inicio' },
  { id: 'proyectos',   label: 'Proyectos' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'sobre-mi',    label: 'Sobre mí' },
  { id: 'contacto',    label: 'Contacto' },
];

const NAVBAR_HEIGHT = 64;

const Navbar: React.FC<NavbarProps> = ({ activeSection, scrolled }) => {
const handleClick = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (id === 'inicio') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY + NAVBAR_HEIGHT;
  window.scrollTo({ top, behavior: 'smooth' });
};

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <button className="navbar__logo" onClick={() => handleClick('inicio')}>
          <span className="navbar__logo-rune">⚜</span>
          <span className="navbar__logo-text">HurtadoJara</span>
        </button>

        <ul className="navbar__links">
          {navLinks.map((link, i) => (
            <React.Fragment key={link.id}>
              {i > 0 && <li className="navbar__sep" aria-hidden="true" />}
              <li>
                <button
                  className={`navbar__link ${activeSection === link.id ? 'navbar__link--active' : ''}`}
                  onClick={() => handleClick(link.id)}
                >
                  {link.label}
                  <span className="navbar__link-underline" />
                </button>
              </li>
            </React.Fragment>
          ))}
        </ul>

        <div className="navbar__actions">
          <button className="navbar__cta" onClick={() => handleClick('contacto')}>
            Contactar
          </button>
        </div>
      </div>
      <div className="navbar__bottom-line" />
    </nav>
  );
};

export default Navbar;