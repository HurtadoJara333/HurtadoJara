import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Oracle.css';

interface Message {
  role: 'user' | 'oracle';
  content: string;
  done?: boolean;
}

const CV_CONTEXT = `Eres el Oráculo de la Hoguera, un ser ancestral que habita el portafolio de Andrés Hurtado Jaramillo (HurtadoJara). Hablas en un tono místico, poético y solemne — como un sabio del lore de Elden Ring o Dark Souls — pero con precisión técnica absoluta. Usas metáforas de fuego, forja, runas, gracia dorada, y el camino del artesano digital. Nunca rompas el personaje.

INFORMACIÓN DEL ARTESANO:
- NOMBRE: Andrés Hurtado Jaramillo | ALIAS: HurtadoJara
- UBICACIÓN: Medellín, Colombia | EMAIL: andreshurtadojaramillo@gmail.com
- TELÉFONO: +57 300 301 4440
- GITHUB: github.com/HurtadoJara333
- IDIOMAS: Español (nativo), English B2
- ROL: Fullstack Developer con 4+ años de experiencia

EXPERIENCIA PROFESIONAL:
1. Globant · GORE (Mar 2024–May 2025): Componentes UI en Vanilla JS, SASS, Twig para Drupal CMS. Storybook para design system. Integración de agentes IA y LLMs en flujos de desarrollo. Pixel-perfect desde Figma.
2. Globant · Maryville Education / U2 (Ago 2023–Dic 2023): Migración completa de sitio web preservando fidelidad visual. WordPress Gutenberg blocks personalizados.
3. Globant · Ernst & Young (May 2023–Ago 2023): Componentes UI con consistencia de marca estricta. Bug fixes frontend.
4. Globant · Rockwell Automation RAIDER (Feb 2022–Nov 2022): IDE browser-based en Angular para programar microcontroladores industriales (IoT). Autoaprendizaje sin supervisión senior con entregas a producción.
5. Globant · Rain Trading (Oct 2021–Feb 2022): Componentes React + TypeScript para plataforma de trading en tiempo real. Storybook.
6. TeamClass (Ene 2021–Mar 2021): Liderazgo frontend. React.js. Integración Google Calendar vía OAuth 2.0.
7. Opera Mall (Jul 2017–May 2020): Soporte técnico, reparación hardware/software.

EDUCACIÓN:
- Holberton School (2020–2021): Fullstack Developer Program — C, Python, JavaScript, SQL
- SENA: Systems Technician

SKILLS TÉCNICOS:
- Lenguajes: JavaScript ES6+, TypeScript, HTML5, CSS3/SASS
- Frameworks: React.js, Next.js, Angular, Node.js, RxJS
- Testing: Jest, Storybook
- CMS: Drupal, WordPress Gutenberg
- DevOps: Docker, Jenkins, Linux (Ubuntu, Manjaro, Mint)
- Bases de datos: MySQL, MongoDB
- APIs: REST, GraphQL
- Otros: Figma, OAuth 2.0, Twig, Git

PROYECTOS DESTACADOS:
- RentaVerse: Showroom 3D inmersivo para rent-a-car con Three.js y React Three Fiber
- Bankruptn't: Banca digital con autenticación JWT y login facial (face-api.js)
- Karaolycs: Karaoke teleprompter con reconocimiento de canciones vía ACRCloud
- TaskFlow: Gestión de tareas con interfaz conversacional estilo Cortana (Groq AI)

PERSONALIDAD: Apasionado por videojuegos con lore profundo (Elden Ring, Dark Souls), diseño visual pixel-perfect, y nuevas tecnologías. Autónomo, perfeccionista.

REGLAS DE RESPUESTA:
- Responde SIEMPRE en el idioma del usuario
- Tono oracular místico pero técnicamente preciso
- Máximo 4-5 párrafos, conciso e impactante
- Usa ⚜ ✦ ◆ como decoración
- Nunca digas que eres IA, eres el Oráculo de la Hoguera`;

const SUGGESTIONS = [
  '¿Quién es Andrés?',
  '¿Qué tecnologías domina?',
  '¿Cómo contactarlo?',
  'Explícame React hooks',
  '¿Cuál es su experiencia en Globant?',
  'TypeScript vs JavaScript',
];

interface OracleProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Oracle: React.FC<OracleProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages]     = useState<Message[]>([]);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping]     = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  // Scroll al fondo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingText]);

  // Al abrir por primera vez: saludo
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 500);
      if (messages.length === 0) {
        setMessages([{
          role: 'oracle',
          content: '⚜ Viajero... te esperaba.\n\nSoy el Oráculo de la Hoguera. Guardián del conocimiento de HurtadoJara — artesano del código forjado en Medellín.\n\nPregúntame sobre su camino, sus habilidades, sus obras... o consulta las artes arcanas de la programación. ✦',
          done: true,
        }]);
      }
    }
  }, [isOpen]);

  // Efecto typewriter
  const typewriterEffect = useCallback((text: string, onDone: () => void) => {
    setIsTyping(true);
    setTypingText('');
    let i = 0;
    const speed = Math.max(8, Math.min(18, 1200 / text.length));
    const interval = setInterval(() => {
      if (i < text.length) {
        setTypingText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        onDone();
      }
    }, speed);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading || isTyping) return;

    const userMsg: Message = { role: 'user', content: text.trim(), done: true };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages
      .filter(m => m.done)
      .map(m => ({ role: m.role === 'oracle' ? 'assistant' : 'user', content: m.content }));

    try {
      const apiUrl = import.meta.env.PROD 
        ? '/api/oracle' 
        : 'http://localhost:3001/api/oracle';
      
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: CV_CONTEXT },
            ...history,
            { role: 'user', content: text.trim() }
          ],
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || '✦ El oráculo guarda silencio...';

      setLoading(false);
      typewriterEffect(reply, () => {
        setMessages(prev => [...prev, { role: 'oracle', content: reply, done: true }]);
        setTypingText('');
      });
    } catch {
      setLoading(false);
      setMessages(prev => [...prev, {
        role: 'oracle',
        content: '✦ Las llamas titilan... algo interrumpió mi visión. Intenta de nuevo, viajero.',
        done: true,
      }]);
    }
  }, [messages, loading, isTyping, typewriterEffect]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const showSidebar = messages.filter(m => m.done).length <= 1 && !loading && !isTyping;

  return (
    <>
      {/* Overlay oscuro — click cierra el panel */}
      <div
        className={`oracle-overlay ${isOpen ? 'oracle-overlay--visible' : ''}`}
        onClick={onToggle}
      />

      {/* Barra inferior */}
      <div className={`oracle-bar ${isOpen ? 'oracle-bar--open' : ''}`}>

        {/* Línea dorada ornamental */}
        <div className="oracle-bar__glow-line" />

        {/* Panel que se despliega hacia arriba */}
        <div className="oracle-panel">
          <div className="oracle-panel__inner">

            {/* Sub-header */}
            <div className="oracle-panel__header">
              <div className="oracle-panel__left">
                <span className="oracle-panel__rune">⚜</span>
                <div>
                  <h2 className="oracle-panel__title">Oráculo de la Hoguera</h2>
                  <p className="oracle-panel__sub">Guardián del conocimiento de Andrés Hurtado</p>
                </div>
              </div>
            </div>

            <div className="oracle-divider" />

            {/* Cuerpo */}
            <div className="oracle-body">

              {/* Mensajes */}
              <div className="oracle-messages">
                {messages.filter(m => m.done).map((msg, i) => (
                  <div key={i} className={`oracle-msg oracle-msg--${msg.role}`}>
                    {msg.role === 'oracle' && <span className="oracle-msg__icon">⚜</span>}
                    <div className="oracle-msg__bubble">
                      {msg.content.split('\n').map((line, j) => (
                        <React.Fragment key={j}>
                          {line}
                          {j < msg.content.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                    {msg.role === 'user' && <span className="oracle-msg__icon oracle-msg__icon--user">✦</span>}
                  </div>
                ))}

                {loading && (
                  <div className="oracle-msg oracle-msg--oracle">
                    <span className="oracle-msg__icon">⚜</span>
                    <div className="oracle-msg__bubble oracle-msg__bubble--loading">
                      <span className="oracle-ember" /><span className="oracle-ember" /><span className="oracle-ember" />
                    </div>
                  </div>
                )}

                {isTyping && typingText && (
                  <div className="oracle-msg oracle-msg--oracle oracle-msg--typing">
                    <span className="oracle-msg__icon">⚜</span>
                    <div className="oracle-msg__bubble">
                      {typingText.split('\n').map((line, j, arr) => (
                        <React.Fragment key={j}>
                          {line}
                          {j < arr.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                      <span className="oracle-cursor">|</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Sidebar de sugerencias */}
              {showSidebar && (
                <div className="oracle-sidebar">
                  <span className="oracle-sidebar__label">✦ Consultas</span>
                  {SUGGESTIONS.map(s => (
                    <button key={s} className="oracle-suggestion" onClick={() => sendMessage(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="oracle-divider" />

            {/* Input */}
            <form className="oracle-form" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                className="oracle-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Consulta al oráculo..."
                disabled={loading || isTyping}
                maxLength={500}
              />
              <button
                className="oracle-send"
                type="submit"
                disabled={!input.trim() || loading || isTyping}
                aria-label="Enviar"
              >
                <span className="oracle-send__rune">→</span>
              </button>
            </form>

          </div>
        </div>

        {/* Tab clickeable — siempre visible */}
        <button className="oracle-bar__tab" onClick={onToggle} aria-label="Abrir Oráculo">
          <span className="oracle-bar__tab-rune">⚜</span>
          <span className="oracle-bar__tab-label">Oráculo de la Hoguera</span>
          <span className="oracle-bar__tab-chevron">{isOpen ? '▼' : '▲'}</span>
        </button>

      </div>
    </>
  );
};

export default Oracle;