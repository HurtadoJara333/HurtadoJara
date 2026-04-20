import React, { useEffect, useRef, useState } from 'react';
import './Contact.css';

const socialLinks = [
  { name: 'GitHub',   href: 'https://github.com/HurtadoJara333',                    icon: '◈' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/andres-hurtado-dev',        icon: '◆' },
  { name: 'Email',    href: 'mailto:andreshurtadojaramillo@gmail.com',               icon: '✉' },
];

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible]   = useState(false);
  const [form, setForm]         = useState({ name: '', email: '', message: '' });
  const [sent, setSent]         = useState(false);
  const [focused, setFocused]   = useState<string | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  };

  return (
    <div className={`contact ${visible ? 'contact--visible' : ''}`} ref={sectionRef}>
      <div className="contact__divider" />
      <div className="contact__inner">
        <div className="contact__header">
          <span className="section-eyebrow">✦ Alianza</span>
          <h2 className="section-title">Contacto</h2>
          <p className="contact__subtitle">¿Tienes un proyecto en mente? Hablemos.</p>
        </div>
        <div className="contact__layout">
          <div className="contact__info">
            <div className="contact__lore">
              <div className="contact__lore-ornament">⚜</div>
              <p>"Si buscas a alguien que construya con precisión, autonomía y fuego — aquí estoy."</p>
            </div>
            <div className="contact__details">
              <div className="contact__detail">
                <span className="contact__detail-label">Disponibilidad</span>
                <span className="contact__detail-value"><span className="contact__dot" />Open to work</span>
              </div>
              <div className="contact__detail">
                <span className="contact__detail-label">Ubicación</span>
                <span className="contact__detail-value">Medellín, Colombia 🔥</span>
              </div>
              <div className="contact__detail">
                <span className="contact__detail-label">Teléfono</span>
                <span className="contact__detail-value">+57 300 301 4440</span>
              </div>
              <div className="contact__detail">
                <span className="contact__detail-label">Idiomas</span>
                <span className="contact__detail-value">Español (nativo) · English (B2)</span>
              </div>
            </div>
            <div className="contact__social">
              {socialLinks.map(s => (
                <a key={s.name} href={s.href} className="contact__social-link" target="_blank" rel="noopener noreferrer">
                  <span className="contact__social-icon">{s.icon}</span>
                  <span>{s.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="contact__form-wrap">
            {sent ? (
              <div className="contact__success">
                <div className="contact__success-rune">⚜</div>
                <h3>Mensaje enviado</h3>
                <p>Gracias por escribir, Inluminado. Te respondo pronto.</p>
                <button className="btn-ghost" onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }); }}>Enviar otro</button>
              </div>
            ) : (
              <div className="contact__form">
                {(['name','email'] as const).map(field => (
                  <div key={field} className={`contact__field ${focused===field?'contact__field--focused':''} ${form[field]?'contact__field--filled':''}`}>
                    <label className="contact__label">{field === 'name' ? 'Nombre' : 'Email'}</label>
                    <input type={field==='email'?'email':'text'} name={field} className="contact__input" value={form[field]} onChange={handleChange} onFocus={()=>setFocused(field)} onBlur={()=>setFocused(null)} />
                    <div className="contact__field-line" />
                  </div>
                ))}
                <div className={`contact__field contact__field--textarea ${focused==='message'?'contact__field--focused':''} ${form.message?'contact__field--filled':''}`}>
                  <label className="contact__label">Mensaje</label>
                  <textarea name="message" className="contact__input contact__textarea" rows={5} value={form.message} onChange={handleChange} onFocus={()=>setFocused('message')} onBlur={()=>setFocused(null)} />
                  <div className="contact__field-line" />
                </div>
                <button className="btn-primary contact__submit" onClick={handleSubmit}>Enviar mensaje →</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
