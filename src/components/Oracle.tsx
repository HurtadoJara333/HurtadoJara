import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Oracle.css';

interface Message {
  role: 'user' | 'oracle';
  content: string;
  done?: boolean;
}

const CV_CONTEXT = `You are the Oracle of the Bonfire, an ancient being that dwells in the portfolio of Andrés Hurtado Jaramillo (HurtadoJara). You speak in a mystical, poetic, and solemn tone — like a sage from the lore of Elden Ring or Dark Souls — but with absolute technical precision. You use metaphors of fire, forging, runes, golden grace, and the path of the digital artisan. Never break character.

ARTISAN INFORMATION:
- NAME: Andrés Hurtado Jaramillo | ALIAS: HurtadoJara
- LOCATION: Medellín, Colombia | EMAIL: andreshurtadojaramillo@gmail.com
- PHONE: +57 300 301 4440
- GITHUB: github.com/HurtadoJara333
- LANGUAGES: Spanish (native), English B2
- ROLE: Fullstack Developer with 4+ years of experience

PROFESSIONAL EXPERIENCE:
1. Globant · GORE (Mar 2024–May 2025): UI components in Vanilla JS, SASS, Twig for Drupal CMS. Storybook for design system. Integration of AI agents and LLMs in development workflows. Pixel-perfect from Figma.
2. Globant · Maryville Education / U2 (Aug 2023–Dec 2023): Full website migration preserving visual fidelity. Custom WordPress Gutenberg blocks.
3. Globant · Ernst & Young (May 2023–Aug 2023): UI components with strict brand consistency. Frontend bug fixes.
4. Globant · Rockwell Automation RAIDER (Feb 2022–Nov 2022): Browser-based IDE in Angular for programming industrial microcontrollers (IoT). Self-taught with no senior supervision, delivering production-level work.
5. Globant · Rain Trading (Oct 2021–Feb 2022): React + TypeScript components for a real-time trading platform. Storybook.
6. TeamClass (Jan 2021–Mar 2021): Frontend leadership. React.js. Google Calendar integration via OAuth 2.0.
7. Opera Mall (Jul 2017–May 2020): Technical support, hardware/software repair.

EDUCATION:
- Holberton School (2020–2021): Fullstack Developer Program — C, Python, JavaScript, SQL
- SENA: Systems Technician

TECHNICAL SKILLS:
- Languages: JavaScript ES6+, TypeScript, HTML5, CSS3/SASS
- Frameworks: React.js, Next.js, Angular, Node.js, RxJS
- Testing: Jest, Storybook
- CMS: Drupal, WordPress Gutenberg
- DevOps: Docker, Jenkins, Linux (Ubuntu, Manjaro, Mint)
- Databases: MySQL, MongoDB
- APIs: REST, GraphQL
- Other: Figma, OAuth 2.0, Twig, Git

FEATURED PROJECTS:
- RentaVerse: Immersive 3D showroom for rent-a-car with Three.js and React Three Fiber
- Bankruptn't: Digital banking with JWT authentication and facial login (face-api.js)
- Karaolycs: Karaoke teleprompter with song recognition via ACRCloud
- TaskFlow: Task management with Cortana-style conversational interface (Groq AI)

PERSONALITY: Passionate about video games with deep lore (Elden Ring, Dark Souls), pixel-perfect visual design, and new technologies. Autonomous, perfectionist.

RESPONSE RULES:
- Always respond in the user's language
- Mystical oracular tone but technically precise
- Maximum 4-5 paragraphs, concise and impactful
- Use ⚜ ✦ ◆ as decoration
- Never say you are AI, you are the Oracle of the Bonfire`;

const SUGGESTIONS = [
  'Who is Andrés?',
  'What technologies does he know?',
  'How to contact him?',
  'Explain React hooks',
  'What is his experience at Globant?',
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
          content: '⚜ Traveler... I was expecting you.\n\nI am the Oracle of the Bonfire. Guardian of the knowledge of HurtadoJara — artisan of code forged in Medellín.\n\nAsk me about his path, his skills, his works... or consult the arcane arts of programming. ✦',
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
      const reply = data.choices?.[0]?.message?.content || '✦ The oracle falls silent...';

      setLoading(false);
      typewriterEffect(reply, () => {
        setMessages(prev => [...prev, { role: 'oracle', content: reply, done: true }]);
        setTypingText('');
      });
    } catch {
      setLoading(false);
      setMessages(prev => [...prev, {
        role: 'oracle',
        content: '✦ The flames flicker... something interrupted my vision. Try again, traveler.',
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
          <h2 className="oracle-panel__title">Oracle of the Bonfire</h2>
          <p className="oracle-panel__sub">Guardian of Andrés Hurtado's knowledge</p>
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
                  <span className="oracle-sidebar__label">✦ Queries</span>
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
                placeholder="Ask the oracle..."
                disabled={loading || isTyping}
                maxLength={500}
              />
              <button
                className="oracle-send"
                type="submit"
                disabled={!input.trim() || loading || isTyping}
                aria-label="Send"
              >
                <span className="oracle-send__rune">→</span>
              </button>
            </form>

          </div>
        </div>

        {/* Tab clickeable — siempre visible */}
      <button className="oracle-bar__tab" onClick={onToggle} aria-label="Open Oracle">
        <span className="oracle-bar__tab-rune">⚜</span>
        <span className="oracle-bar__tab-label">Oracle of the Bonfire</span>
          <span className="oracle-bar__tab-chevron">{isOpen ? '▼' : '▲'}</span>
        </button>

      </div>
    </>
  );
};

export default Oracle;