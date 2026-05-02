import { useState } from "react";
import "./App.css";

type Message = {
  id: string;
  role: "user" | "agent";
  content: string;
};

const THINKING_DELAY_MS = 1200;
const TEMPORARY_AGENT_REPLY = "Got it. I'll turn this into a SwiftUI screen.";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  function sendPrompt(formData: FormData) {
    const content = String(formData.get("prompt") ?? "").trim();

    if (!content) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    setMessages((messages) => [...messages, userMessage]);

    setIsThinking(true);

    setTimeout(() => {
      const agentMessage: Message = {
        id: crypto.randomUUID(),
        role: "agent",
        content: TEMPORARY_AGENT_REPLY,
      };

      setMessages((messages) => [...messages, agentMessage]);
      setIsThinking(false);
    }, THINKING_DELAY_MS);
  }

  return (
    <main className="app-shell">
      <aside className="chat-rail">
        <section className="conversation">
          {messages.length === 0 ? (
            <p className="empty-state">Describe an iOS screen to start</p>
          ) : (
            messages.map((message) => {
              const label = message.role === "user" ? "You" : "Agent";

              return (
                <div className={`message ${message.role}`} key={message.id}>
                  <span className="message-label">{label}</span>
                  <p className="message-bubble">{message.content}</p>
                </div>
              );
            })
          )}
          {isThinking ? (
            <div className="message agent">
              <span className="message-label">Agent</span>
              <p className="message-bubble typing-dots">...</p>
            </div>
          ) : null}
        </section>
        <form action={sendPrompt} className="composer">
          <textarea name="prompt" placeholder="Describe an iOS screen..." />
          <button type="submit">Send</button>
        </form>
      </aside>

      <section className="workspace">
        <header className="workspace-header">
          <h1>Honeycrisp</h1>
        </header>
      </section>
    </main>
  );
}

export default App;
