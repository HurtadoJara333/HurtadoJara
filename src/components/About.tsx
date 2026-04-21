import React, { useEffect, useRef, useState } from 'react';
import './About.css';

const skills = [
  { category: 'Frontend',   items: ['React.js', 'Next.js', 'Angular', 'TypeScript', 'CSS3 / SASS'] },
  { category: 'Backend',    items: ['Node.js', 'REST APIs', 'GraphQL', 'MySQL', 'MongoDB'] },
  { category: 'CMS & Tools', items: ['Drupal', 'WordPress', 'Storybook', 'Figma'] },
  { category: 'DevOps',     items: ['Docker', 'Jenkins', 'Git', 'Linux', 'OAuth 2.0'] },
];

const stats = [
  { value: '4+', label: 'Years of experience' },
  { value: '10+', label: 'Projects in production' },
  { value: '2', label: 'Languages: ES / EN' },
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
        <span className="section-eyebrow">✦ The Artisan</span>
        <h2 className="section-title">About me</h2>
          <div className="about__body">
          <p>I am a Web Developer from Medellín with over 4 years building production-grade interfaces for Fortune 500 clients at Globant — including Rockwell Automation and Ernst & Young.</p>
          <p>I specialize in React, TypeScript, and Next.js, with solid experience in Angular, Node.js, and CMS architectures like Drupal and WordPress. I work well independently or leading teams, with a strong focus on <em>accessibility</em>, <em>performance</em>, and <em>pixel-perfect design</em>.</p>
          <p>I integrate AI tools, agents, and automation into modern web systems, leveraging language models to boost product capabilities and team productivity.</p>
          <p>When I'm not coding, I learn new technologies, play video games with deep lore, or explore visual design.</p>
          </div>
          <div className="about__stats">
            {stats.map((s, i) => (
              <div key={i} className="about__stat" style={{ animationDelay: `${i * 0.15}s` }}>
                <span className="about__stat-value">{s.value}</span>
                <span className="about__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
          <a href="/Andres_Hurtado_Resume_ATS.pdf" className="btn-primary about__cv-btn" download>Download CV ↓</a>
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