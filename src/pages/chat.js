import { useState } from "react";
import { sendMessage } from "../services/Api";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function handleSend() {
    if (!input) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const res = await sendMessage(input);

    const botMessage = { role: "bot", text: res.reply };
    setMessages((prev) => [...prev, botMessage]);

    setInput("");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Chat</h1>

      <div style={{ border: "1px solid #ccc", height: 300, overflowY: "auto", marginBottom: 10 }}>
        {messages.map((m, i) => (
          <p key={i}><b>{m.role}:</b> {m.text}</p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite..."
      />
      <button onClick={handleSend}>Enviar</button>
    </div>
  );
}
