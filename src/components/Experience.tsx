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
    company: 'Globant · Client: GORE',
    location: 'Medellín, Colombia',
  description: 'Development of reusable UI components in Vanilla JavaScript, SASS, and Twig integrated into Drupal CMS. Integration of AI tools, agents, and automation in modern web systems, leveraging LLMs to enhance product capabilities and productivity.',
  achievements: [
    'Reusable components in Vanilla JS + SASS + Twig for Drupal',
    'Component libraries with Storybook for design system documentation',
    'Integration of AI agents and automation workflows with LLMs',
    'Translation of Figma mockups into pixel-perfect accessible components',
  ],
    type: 'work',
  },
  {
    id: 2,
    period: 'Feb 2022 – Nov 2022',
    role: 'Web UI Developer',
  company: 'Globant · Client: Rockwell Automation (RAIDER)',
  location: 'Medellín, Colombia',
  description: 'Contributed to a browser-based IDE in Angular for programming industrial microcontrollers used in assembly lines. Self-taught Angular with production-level deliveries.',
  achievements: [
    'Browser-based IDE in Angular for industrial microcontroller programming',
    'Self-taught Angular with production-level deliveries and no senior supervision',
    'Critical bug resolution in bug-bash sessions improving platform stability',
    'Hands-on exposure to IoT contexts and embedded systems',
  ],
    type: 'work',
  },
  {
    id: 3,
    period: 'May 2023 – Dic 2023',
    role: 'Web UI Developer',
  company: 'Globant · Clients: Ernst & Young / Maryville Education',
  location: 'Medellín, Colombia',
  description: 'Implementation of UI components under strict UX guidelines to ensure brand consistency for E&Y. Migration of the Maryville Education site to a new domain with WordPress Gutenberg.',
  achievements: [
    'UI components with brand consistency for Ernst & Young',
    'Complete migration of Maryville Education site preserving visual fidelity',
    'Custom blocks with WordPress Gutenberg',
  ],
    type: 'work',
  },
  {
    id: 4,
    period: 'Oct 2021 – Feb 2022',
    role: 'Web UI Developer',
  company: 'Globant · Client: Rain (Trading Platform)',
  location: 'Medellín, Colombia',
  description: 'React + TypeScript components for a real-time trading platform. Component stories with Storybook and continuous UX improvements.',
  achievements: [
    'Responsive components in React + TypeScript for real-time trading',
    'Component stories with Storybook',
    'Iterative UX improvements through bug fixes',
  ],
    type: 'work',
  },
  {
    id: 5,
    period: 'Ene 2021 – Mar 2021',
    role: 'Frontend Developer',
    company: 'TeamClass',
    location: 'Medellín, Colombia',
  description: 'Led frontend development for an educational event creation platform, coordinating the team and defining the application architecture.',
  achievements: [
    'Frontend team leadership and architecture definition',
    'Interactive UIs with React.js focused on UI/UX best practices',
    'Google Calendar integration via OAuth 2.0',
  ],
    type: 'work',
  },
  {
    id: 6,
    period: 'Ene 2020 – May 2021',
    role: 'Fullstack Developer Program',
    company: 'Holberton School',
    location: 'Medellín, Colombia',
  description: 'Intensive fullstack development program with a focus on solid computing fundamentals, algorithms, and modern web development.',
  achievements: ['Graduated from the Fullstack Developer Program', 'Solid fundamentals in C, Python, JavaScript, and SQL'],
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
            <span className="exp-item__type-badge">{item.type === 'education' ? '✦ Education' : '✦ Work'}</span>
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
      <span className="section-eyebrow">✦ The Path Traveled</span>
      <h2 className="section-title">Experience</h2>
      <p className="experience__subtitle">4+ years at Globant building for Fortune 500. Every project, a battle won.</p>
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