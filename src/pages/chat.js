import { useState } from "react";
import { Link } from "react-router-dom";
import { sendMessage } from "../services/api";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const res = await sendMessage(input);

    const botMessage = { role: "bot", text: res.reply };
    setMessages((prev) => [...prev, botMessage]);

    setInput("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="story-back">← Voltar</Link>
        <h1>Chat</h1>
        <p>Converse sobre situações do ambiente de trabalho.</p>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-empty">
              <div className="chat-empty-icon">💬</div>
              <p>Nenhuma mensagem ainda.<br />Comece a conversa!</p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`message ${m.role}`}>
                <span className="message-label">{m.role === "user" ? "Você" : "Assistente"}</span>
                <div className="message-bubble">{m.text}</div>
              </div>
            ))
          )}
        </div>

        <div className="chat-input-row">
          <input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
          />
          <button className="btn btn-primary" onClick={handleSend}>Enviar</button>
        </div>
      </div>
    </div>
  );
}
