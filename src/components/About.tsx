import React, { useEffect, useRef, useState } from 'react';
import './About.css';

const skills = [
  { category: 'Frontend',   items: ['React.js', 'Next.js', 'Angular', 'TypeScript', 'CSS3 / SASS'] },
  { category: 'Backend',    items: ['Node.js', 'REST APIs', 'GraphQL', 'MySQL', 'MongoDB'] },
  { category: 'CMS & Tools', items: ['Drupal', 'WordPress', 'AEM', 'Storybook', 'Figma'] },
  { category: 'DevOps',     items: ['Docker', 'Jenkins', 'Git', 'Linux', 'OAuth 2.0'] },
];

const stats = [
  { value: '4+',  label: 'Años de experiencia' },
  { value: '10+', label: 'Proyectos en producción' },
  { value: '2',   label: 'Idiomas: ES / EN' },
];

const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={`about ${visible ? 'about--visible' : ''}`} ref={sectionRef}>
      <div className="about__divider" />
      <div className="about__inner">
        <div className="about__text-col">
          <span className="section-eyebrow">✦ El Artesano</span>
          <h2 className="section-title">Sobre mí</h2>
          <div className="about__body">
            <p>Soy un Fullstack Developer de Medellín con más de 4 años construyendo interfaces de producción para clientes Fortune 500 en Globant — incluyendo Rockwell Automation y Ernst & Young.</p>
            <p>Me especializo en React, TypeScript y Next.js, con experiencia sólida en Angular, Node.js y arquitecturas CMS como Drupal y AEM. Trabajo bien solo o liderando equipos, con fuerte enfoque en <em>accesibilidad</em>, <em>performance</em> y <em>diseño pixel-perfect</em>.</p>
            <p>Cuando no estoy codificando, aprendo nuevas tecnologías, juego videojuegos con lore profundo, o exploro diseño visual.</p>
          </div>
          <div className="about__stats">
            {stats.map((s, i) => (
              <div key={i} className="about__stat" style={{ animationDelay: `${i * 0.15}s` }}>
                <span className="about__stat-value">{s.value}</span>
                <span className="about__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
          <a href="/Andres_Hurtado_Resume_ATS.pdf" className="btn-primary about__cv-btn" download>Descargar CV ↓</a>
        </div>
        <div className="about__skills-col">
          <div className="about__avatar">
            <div className="about__avatar-ring" />
            <div className="about__avatar-inner"><span className="about__avatar-rune">⚜</span></div>
          </div>
          <div className="about__skills">
            {skills.map((group, gi) => (
              <div key={group.category} className="about__skill-group" style={{ animationDelay: `${gi * 0.2}s` }}>
                <h4 className="about__skill-category">{group.category}</h4>
                <div className="about__skill-items">
                  {group.items.map((item, ii) => (
                    <span key={item} className="about__skill-item" style={{ animationDelay: `${gi * 0.15 + ii * 0.06}s` }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
