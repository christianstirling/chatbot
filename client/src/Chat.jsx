import { useState } from "react";
import "./Chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful assistant." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;

    const next = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await response.json();
      const reply = data.reply ?? "(no reply)";

      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("Send Function: ❌");
      console.error(error);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Error: could not reach server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Chat">
      <h1>Chatbot Version Alpha</h1>
      <div className="History">
        {messages
          .filter((m) => m.role !== "system")
          .map((m, i) => (
            <div
              className="MessageContainer"
              key={i}
              style={{ textAlign: m.role === "user" ? "right" : "left" }}
            >
              <div
                className="Message"
                style={{
                  background: m.role === "user" ? "#cfe8ff" : "#eee",
                }}
              >
                {m.content}
              </div>
            </div>
          ))}
      </div>

      <div className="Form">
        <input
          className="Input"
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          disabled={loading}
        />
        <button
          className="SendButton"
          onClick={send}
          disabled={loading || !input.trim()}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
