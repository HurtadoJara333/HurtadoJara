import React, { useEffect, useRef, useState } from 'react';
import './Experience.css';

interface ExperienceItem {
  id: number;
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  achievements: string[];
  type: 'work' | 'education';
}

const experiences: ExperienceItem[] = [
  {
    id: 1,
    period: 'Mar 2024 – May 2025',
    role: 'Web UI Developer',
    company: 'Globant · Cliente: GORE',
    location: 'Medellín, Colombia',
    description: 'Desarrollo de componentes UI reutilizables en Vanilla JavaScript, SASS y Twig integrados en Drupal CMS. Implementación de métricas y dashboards de analítica en Adobe Experience Manager (AEM).',
    achievements: [
      'Componentes reutilizables en Vanilla JS + SASS + Twig para Drupal',
      'Bibliotecas de componentes con Storybook para documentación de design system',
      'Dashboards de métricas en Adobe Experience Manager (AEM)',
      'Traducción de mockups Figma a componentes accesibles pixel-perfect',
    ],
    type: 'work',
  },
  {
    id: 2,
    period: 'Feb 2022 – Nov 2022',
    role: 'Web UI Developer',
    company: 'Globant · Cliente: Rockwell Automation (RAIDER)',
    location: 'Medellín, Colombia',
    description: 'Contribución a un IDE basado en navegador en Angular para programar microcontroladores industriales usados en líneas de ensamblaje. Aprendizaje autónomo de Angular con entregas a nivel de producción.',
    achievements: [
      'IDE browser-based en Angular para programación de microcontroladores industriales',
      'Aprendizaje autónomo de Angular con entregas a nivel de producción sin supervisión senior',
      'Resolución de bugs críticos en bug-bash sessions mejorando estabilidad de la plataforma',
      'Exposición práctica a contextos IoT y sistemas embebidos',
    ],
    type: 'work',
  },
  {
    id: 3,
    period: 'May 2023 – Dic 2023',
    role: 'Web UI Developer',
    company: 'Globant · Clientes: Ernst & Young / Maryville Education',
    location: 'Medellín, Colombia',
    description: 'Implementación de componentes UI bajo estrictas guías UX para garantizar consistencia de marca en E&Y. Migración del sitio de Maryville Education a nuevo dominio con WordPress Gutenberg.',
    achievements: [
      'Componentes UI con consistencia de marca para Ernst & Young',
      'Migración completa del sitio Maryville Education preservando fidelidad visual',
      'Bloques personalizados con WordPress Gutenberg',
    ],
    type: 'work',
  },
  {
    id: 4,
    period: 'Oct 2021 – Feb 2022',
    role: 'Web UI Developer',
    company: 'Globant · Cliente: Rain (Trading Platform)',
    location: 'Medellín, Colombia',
    description: 'Componentes React + TypeScript para una plataforma de trading en tiempo real. Historias de componentes con Storybook y mejoras UX continuas.',
    achievements: [
      'Componentes responsivos en React + TypeScript para trading en tiempo real',
      'Historias de componentes con Storybook',
      'Mejoras UX iterativas a través de bug fixes',
    ],
    type: 'work',
  },
  {
    id: 5,
    period: 'Ene 2021 – Mar 2021',
    role: 'Frontend Developer',
    company: 'TeamClass',
    location: 'Medellín, Colombia',
    description: 'Lideré el desarrollo frontend de una plataforma de creación de eventos educativos, coordinando el equipo y definiendo la arquitectura de la aplicación.',
    achievements: [
      'Liderazgo del equipo frontend y definición de arquitectura',
      'UIs interactivas con React.js con foco en UI/UX best practices',
      'Integración de Google Calendar via OAuth 2.0',
    ],
    type: 'work',
  },
  {
    id: 6,
    period: 'Ene 2020 – May 2021',
    role: 'Fullstack Developer Program',
    company: 'Holberton School',
    location: 'Medellín, Colombia',
    description: 'Programa intensivo de desarrollo fullstack con enfoque en fundamentos sólidos de computación, algoritmos y desarrollo web moderno.',
    achievements: ['Graduado del programa Fullstack Developer', 'Fundamentos sólidos en C, Python, JavaScript y SQL'],
    type: 'education',
  },
];

const ExperienceCard: React.FC<{ item: ExperienceItem; index: number; isLast: boolean }> = ({ item, index, isLast }) => {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className={`exp-item ${open ? 'exp-item--open' : ''} ${item.type === 'education' ? 'exp-item--edu' : ''}`} style={{ animationDelay: `${index * 0.12}s` }}>
      <div className="exp-item__spine">
        <div className="exp-item__node"><div className="exp-item__node-inner" /></div>
        {!isLast && <div className="exp-item__line" />}
      </div>
      <div className="exp-item__content">
        <button className="exp-item__header" onClick={() => setOpen(o => !o)}>
          <div className="exp-item__meta">
            <span className="exp-item__period">{item.period}</span>
            <span className="exp-item__type-badge">{item.type === 'education' ? '✦ Formación' : '✦ Trabajo'}</span>
          </div>
          <h3 className="exp-item__role">{item.role}</h3>
          <div className="exp-item__company-row">
            <span className="exp-item__company">{item.company}</span>
            <span className="exp-item__sep">·</span>
            <span className="exp-item__location">{item.location}</span>
          </div>
          <div className={`exp-item__chevron ${open ? 'exp-item__chevron--open' : ''}`}>↓</div>
        </button>
        <div className="exp-item__body">
          <p className="exp-item__desc">{item.description}</p>
          <ul className="exp-item__achievements">
            {item.achievements.map((a, i) => (
              <li key={i} className="exp-item__achievement"><span className="exp-item__bullet">◆</span>{a}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div className={`experience ${visible ? 'experience--visible' : ''}`} ref={sectionRef}>
      <div className="experience__divider" />
      <div className="experience__inner">
        <div className="experience__header">
          <span className="section-eyebrow">✦ El Camino Recorrido</span>
          <h2 className="section-title">Experiencia</h2>
          <p className="experience__subtitle">4+ años en Globant construyendo para Fortune 500. Cada proyecto, una batalla ganada.</p>
        </div>
        <div className="experience__timeline">
          {experiences.map((item, i) => (
            <ExperienceCard key={item.id} item={item} index={i} isLast={i === experiences.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;
