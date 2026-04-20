import React, { useEffect, useRef, useState } from 'react';
import './Projects.css';

interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  link?: string;
  repo?: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'TaskFlow',
    subtitle: 'Gestión de tareas',
    description: 'Aplicación de gestión de tareas con interfaz intuitiva y flujos de trabajo optimizados. Construida con React y TypeScript, con persistencia en tiempo real.',
    tags: ['React', 'TypeScript', 'Node.js'],
    link: 'https://pt-taskflow-andres-hurtado.vercel.app/',
    repo: 'https://github.com/HurtadoJara333/pt-taskflow-Andres-Hurtado',
    featured: true,
  },
  {
    id: 2,
    title: 'Bankruptn-T',
    subtitle: 'Plataforma financiera',
    description: 'Plataforma financiera con sistema de autenticación seguro, dashboard de métricas y gestión de datos en tiempo real.',
    tags: ['React', 'TypeScript', 'Auth', 'Dashboard'],
    link: 'https://bankruptn-t-eight.vercel.app/login',
    repo: 'https://github.com/HurtadoJara333/bankruptn-t',
  },
];

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    cardRef.current!.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    setHovered(false);
    cardRef.current!.style.transform = '';
  };

  return (
    <article
      ref={cardRef}
      className={`project-card ${project.featured ? 'project-card--featured' : ''}`}
      style={{ animationDelay: `${index * 0.12}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {project.featured && <div className="project-card__badge"><span>✦</span> Destacado</div>}
      <div className="project-card__header">
        <div className="project-card__number">0{project.id}</div>
        <div>
          <p className="project-card__subtitle">{project.subtitle}</p>
          <h3 className="project-card__title">{project.title}</h3>
        </div>
      </div>
      <p className="project-card__desc">{project.description}</p>
      <div className="project-card__tags">
        {project.tags.map(tag => <span key={tag} className="project-card__tag">{tag}</span>)}
      </div>
      <div className="project-card__footer">
        {project.link && <a href={project.link} className="project-card__link" target="_blank" rel="noopener noreferrer">Ver proyecto →</a>}
        {project.repo && <a href={project.repo} className="project-card__repo" target="_blank" rel="noopener noreferrer">Código</a>}
      </div>
      <div className="project-card__glow" />
    </article>
  );
};

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={`projects ${visible ? 'projects--visible' : ''}`} ref={sectionRef}>
      <div className="projects__inner">
        <div className="projects__header">
          <span className="section-eyebrow">✦ Obra Forjada</span>
          <h2 className="section-title">Proyectos</h2>
          <p className="projects__intro">Proyectos reales construidos con cuidado, atención al detalle y pasión por el código limpio.</p>
        </div>
        <div className="projects__grid">
          {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </div>
        <div className="projects__footer">
          <a href="https://github.com/HurtadoJara333" className="btn-ghost" target="_blank" rel="noopener noreferrer">Ver todos en GitHub →</a>
        </div>
      </div>
    </div>
  );
};

export default Projects;
