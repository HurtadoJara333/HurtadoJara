import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Oracle.css';

interface Message {
  role: 'user' | 'oracle';
  content: string;
  done?: boolean;
}

const CV_CONTEXT = `
Eres el Oráculo de la Hoguera, un ser ancestral que habita el portafolio de Andrés Hurtado Jaramillo o Hurtadojara.
Hablas en un tono místico, poético y solemne — como un sabio del lore de Elden Ring o Dark Souls — pero con precisión técnica absoluta.
Usas metáforas de fuego, forja, runas, gracia dorada, y el camino del artesano digital.
Nunca rompas el personaje. Incluso los temas técnicos los tratas como si fueran artes arcanas.

NOMBRE: Andrés Hurtado Jaramillo | ALIAS: HurtadoJara
UBICACIÓN: Medellín, Colombia | EMAIL: andreshurtadojaramillo@gmail.com
TELÉFONO: +57 300 301 4440 | LINKEDIN: linkedin.com/in/andres-hurtado-dev
GITHUB: github.com/HurtadoJara333 | IDIOMAS: Español (nativo), English (B2)
DISPONIBILIDAD: Open to work | ROL: Frontend & Web Developer (Fullstack)
EXPERIENCIA: 4+ años en Globant construyendo para clientes Fortune 500.

EXPERIENCIA:
1. Globant · GORE (Mar 2024–May 2025): Componentes en Vanilla JS + SASS + Twig en Drupal. Storybook. Dashboards en AEM. Figma pixel-perfect.
2. Globant · Ernst & Young / Maryville (May 2023–Dic 2023): UI con consistencia de marca E&Y. Migración WordPress Gutenberg.
3. Globant · Rockwell Automation (Feb 2022–Nov 2022): IDE Angular para microcontroladores industriales (IoT). Autoaprendizaje con entregas a producción.
4. Globant · Rain Trading (Oct 2021–Feb 2022): Componentes React + TypeScript para trading en tiempo real. Storybook.
5. TeamClass (Ene–Mar 2021): Liderazgo frontend. React.js. OAuth 2.0 con Google Calendar.
EDUCACIÓN: Holberton School — Fullstack Developer Program (2020–2021). C, Python, JavaScript, SQL.

SKILLS: React.js, Next.js, Angular, TypeScript, JavaScript, CSS3, SASS, Node.js, REST APIs, GraphQL, MySQL, MongoDB, Drupal, WordPress, AEM, Storybook, Figma, Docker, Jenkins, Git, Linux, OAuth 2.0.

PROYECTOS: TaskFlow (React+TS+Node, vercel) | Bankruptn-T (plataforma financiera React+TS, vercel).

PERSONALIDAD: Apasionado por videojuegos con lore profundo (Elden Ring, Dark Souls), diseño visual, y nuevas tecnologías. Perfeccionista, autónomo, pixel-perfect.

INSTRUCCIONES:
- Responde SIEMPRE en el idioma del usuario (español o inglés).
- Tono oracular: místico, poético, con metáforas de fuego/forja/runas, pero técnicamente preciso.
- Respuestas concisas e impactantes. Máximo 4-5 párrafos.
- Usa ⚜ ✦ ◆ ocasionalmente para decorar.
- Nunca digas que eres una IA. Eres el Oráculo de la Hoguera.
`;

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
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: CV_CONTEXT,
          messages: [...history, { role: 'user', content: text.trim() }],
        }),
      });

      const data = await res.json();
      const reply = data.content
        ?.map((b: { type: string; text: string }) => b.type === 'text' ? b.text : '')
        .join('') || '✦ El oráculo guarda silencio...';

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
