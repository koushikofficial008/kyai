import { useEffect, useRef, useState } from "react";
import { Bot, Send, Plus, Menu, Sparkles, User, AlertCircle } from "lucide-react";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8787").replace(/\/$/, "");

const starterPrompts = [
  "Explain a difficult topic simply",
  "Help me write some code",
  "Give me ideas for a new project"
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, busy]);

  async function sendMessage(text = input) {
    const prompt = text.trim();
    if (!prompt || busy) return;
    const next = [...messages, { role: "user", content: prompt }];
    setMessages(next);
    setInput("");
    setError("");
    setBusy(true);
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err.message || "Could not reach Kyai API. Check the backend URL and server.");
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  function resetChat() {
    if (busy) return;
    setMessages([]);
    setError("");
    setInput("");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Sparkles size={19}/></span><span>Kyai</span></div>
        <button className="new-chat" onClick={resetChat}><Plus size={17}/> New chat</button>
        <div className="side-note"><span className="online-dot"/> Your personal AI workspace</div>
        <div className="sidebar-bottom">Independent project · Kyai AI</div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Menu"><Menu size={20}/></button>
          <div><strong>Kyai AI</strong><span className="model-label">Personal assistant</span></div>
          <span className="status-pill"><span className="online-dot"/> Ready</span>
        </header>

        <section className={messages.length ? "conversation" : "welcome"}>
          {messages.length === 0 ? (
            <div className="welcome-content">
              <div className="hero-icon"><Bot size={30}/></div>
              <p className="eyebrow">YOUR PERSONAL AI</p>
              <h1>What can I help<br/><em>you with today?</em></h1>
              <p className="welcome-copy">Ask a question, explore an idea, or build something new with Kyai.</p>
              <div className="prompt-grid">
                {starterPrompts.map((prompt) => <button key={prompt} onClick={() => sendMessage(prompt)}>{prompt}<span>↗</span></button>)}
              </div>
            </div>
          ) : (
            <div className="message-list">
              {messages.map((message, index) => (
                <article className={`message ${message.role}`} key={index}>
                  <div className="avatar">{message.role === "assistant" ? <Bot size={18}/> : <User size={18}/>}</div>
                  <div className="message-body"><div className="message-author">{message.role === "assistant" ? "Kyai" : "You"}</div><div className="message-text">{message.content}</div></div>
                </article>
              ))}
              {busy && <article className="message assistant"><div className="avatar"><Bot size={18}/></div><div className="message-body"><div className="message-author">Kyai</div><div className="typing"><i/><i/><i/></div></div></article>}
              <div ref={endRef}/>
            </div>
          )}
        </section>

        <footer className="composer-wrap">
          {error && <div className="error-banner"><AlertCircle size={16}/>{error}</div>}
          <form className="composer" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
            <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Message Kyai..." rows={1} disabled={busy}/>
            <button className="send-button" type="submit" disabled={busy || !input.trim()} aria-label="Send message"><Send size={18}/></button>
          </form>
          <p className="disclaimer">Kyai can make mistakes. Check important information.</p>
        </footer>
      </main>
    </div>
  );
}