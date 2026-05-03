import { useState } from "react";
import "./App.css";
import { runAgent, type AgentEvent } from "./lib/agentClient";

type Message = {
  id: string;
  kind: "user" | AgentEvent["kind"];
  content: string;
};

const MESSAGE_LABELS: Record<Message["kind"], string> = {
  user: "You",
  agent: "Agent",
  status: "Status",
  tool: "Tool",
};

function createMessage(kind: Message["kind"], content: string): Message {
  return {
    id: crypto.randomUUID(),
    kind,
    content,
  };
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  async function sendPrompt(formData: FormData) {
    const content = String(formData.get("prompt") ?? "").trim();

    if (!content) {
      return;
    }

    setMessages((messages) => [...messages, createMessage("user", content)]);

    setIsThinking(true);

    try {
      const agentEvents = await runAgent(content);
      const agentMessages = agentEvents.map((event) =>
        createMessage(event.kind, event.content),
      );

      setMessages((messages) => [...messages, ...agentMessages]);
    } catch {
      setMessages((messages) => [
        ...messages,
        createMessage("agent", "I could not reach the Tauri agent bridge."),
      ]);
    } finally {
      setIsThinking(false);
    }
  }

  return (
    <main className="app-shell">
      <aside className="chat-rail">
        <section className="conversation">
          {messages.length === 0 ? (
            <p className="empty-state">Describe an iOS screen to start</p>
          ) : (
            messages.map((message) => (
              <div className={`message ${message.kind}`} key={message.id}>
                <span className="message-label">
                  {MESSAGE_LABELS[message.kind]}
                </span>
                <p className="message-bubble">{message.content}</p>
              </div>
            ))
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
