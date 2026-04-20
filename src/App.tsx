import React, { useState, useEffect, useCallback } from 'react';
import Loader         from './components/Loader';
import Navbar         from './components/Navbar';
import Hero           from './components/Hero';
import Projects       from './components/Projects';
import Experience     from './components/Experience';
import About          from './components/About';
import Contact        from './components/Contact';
import Footer         from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import BackToTop      from './components/BackToTop';
import Oracle         from './components/Oracle';
import { useCursor }  from './hooks/useCursor';
import './styles/global.css';

const App: React.FC = () => {
  const [loading, setLoading]             = useState(true);
  const [activeSection, setActiveSection] = useState('inicio');
  const [scrolled, setScrolled]           = useState(false);
  const [oracleOpen, setOracleOpen]       = useState(false);

  useCursor();

  const handleLoaderDone = useCallback(() => setLoading(false), []);
  const toggleOracle = useCallback(() => setOracleOpen(o => !o), []);

  useEffect(() => {
    if (loading) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const ids = ['inicio', 'proyectos', 'experiencia', 'sobre-mi', 'contacto'];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom > 100) { setActiveSection(id); break; }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <>
      {loading && <Loader onDone={handleLoaderDone} />}

      <div className="app" style={{ visibility: loading ? 'hidden' : 'visible' }}>
        <div className="cursor-dot"  id="cursor-dot"  />
        <div className="cursor-ring" id="cursor-ring" />
        <div className="noise-overlay" />
        <ScrollProgress />
        <Navbar activeSection={activeSection} scrolled={scrolled} onOpenOracle={toggleOracle} />
        <main>
          <section id="inicio">      <Hero onOpenOracle={toggleOracle} />  </section>
          <section id="proyectos">   <Projects />   </section>
          <section id="experiencia"> <Experience /> </section>
          <section id="sobre-mi">    <About />      </section>
          <section id="contacto">    <Contact />    </section>
        </main>
        <Footer />
        <BackToTop />
        <Oracle isOpen={oracleOpen} onToggle={toggleOracle} />
      </div>
    </>
  );
};

export default App;
