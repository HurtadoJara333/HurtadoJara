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
    title: 'RentaVerse',
    subtitle: '3D Showroom for Rent-a-Car',
    description: 'Immersive platform that enables vehicle rental businesses to showcase their fleet in a navigable 3D environment, with cinematic lighting, post-processing, and real-time HDRI reflections.',
    tags: ['Next.js', 'Three.js', 'React Three Fiber', 'TypeScript'],
    link: 'https://rentaverse-2-0.vercel.app/',
    repo: 'https://github.com/HurtadoJara333/Rentaverse-2.0',
    featured: true,
  },
  {
    id: 2,
    title: "Bankruptn't",
    subtitle: 'Digital Banking',
    description: 'Digital banking web app with JWT authentication, facial login with face-api.js, transaction dashboard, and real-time balance management.',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
    link: 'https://bankruptn-t-eight.vercel.app/login',
    repo: 'https://github.com/HurtadoJara333/bankruptn-t',
  },
  {
    id: 3,
    title: 'Karaolycs',
    subtitle: 'Karaoke Teleprompter',
    description: 'Karaoke app that automatically detects the playing song and displays synchronized lyrics in real time using ACRCloud and LRCLIB.',
    tags: ['Next.js', 'Python', 'FastAPI', 'ACRCloud'],
    link: 'https://karaolycs.vercel.app/',
    repo: 'https://github.com/HurtadoJara333/karaolycs',
  },
  {
    id: 4,
    title: 'TaskFlow',
    subtitle: 'AI-powered Task Management',
    description: 'Task management app with a Cortana-style conversational interface. Control tasks with natural language powered by Groq LLM (Llama 3.3 70B).',
    tags: ['Next.js', 'React', 'TypeScript', 'Groq AI'],
    link: 'https://pt-taskflow-andres-hurtado.vercel.app/',
    repo: 'https://github.com/HurtadoJara333/pt-taskflow-Andres-Hurtado',
  },
];

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    cardRef.current!.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    cardRef.current!.style.transform = '';
  };

  return (
    <article
      ref={cardRef}
      className={`project-card ${project.featured ? 'project-card--featured' : ''}`}
      style={{ animationDelay: `${index * 0.12}s` }}
      onMouseEnter={() => {}}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {project.featured && <div className="project-card__badge"><span>✦</span> Featured</div>}
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
      {project.link && <a href={project.link} className="project-card__link" target="_blank" rel="noopener noreferrer">View project →</a>}
      {project.repo && <a href={project.repo} className="project-card__repo" target="_blank" rel="noopener noreferrer">Code</a>}
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
      <div className="projects__divider" />
      <div className="projects__inner">
        <div className="projects__header">
      <span className="section-eyebrow">✦ Forged Work</span>
      <h2 className="section-title">Projects</h2>
      <p className="projects__intro">Real projects built with care, attention to detail, and passion for clean code.</p>
        </div>
        <div className="projects__grid">
          {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </div>
        <div className="projects__footer">
          <a href="https://github.com/HurtadoJara333" className="btn-ghost" target="_blank" rel="noopener noreferrer">View all on GitHub →</a>
        </div>
      </div>
    </div>
  );
};

export default Projects;