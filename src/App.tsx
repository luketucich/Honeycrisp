import { useState } from "react";
import "./App.css";

type Message = {
  id: string;
  kind: "user" | "agent" | "status" | "tool";
  content: string;
};

const FAKE_AGENT_EVENTS: Array<{
  delay: number;
  kind: Message["kind"];
  content: string;
}> = [
  {
    delay: 500,
    kind: "status",
    content: "Reading prompt...",
  },
  {
    delay: 1100,
    kind: "agent",
    content: "I'll turn this into a SwiftUI screen.",
  },
  {
    delay: 1700,
    kind: "tool",
    content: "Generated ContentView.swift",
  },
  {
    delay: 2300,
    kind: "status",
    content: "Preparing preview...",
  },
  {
    delay: 2900,
    kind: "agent",
    content: "Done. The first version is ready.",
  },
];

const MESSAGE_LABELS: Record<Message["kind"], string> = {
  user: "You",
  agent: "Agent",
  status: "Status",
  tool: "Tool",
};

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
      kind: "user",
      content,
    };

    setMessages((messages) => [...messages, userMessage]);

    setIsThinking(true);

    FAKE_AGENT_EVENTS.forEach((event, index) => {
      setTimeout(() => {
        const message: Message = {
          id: crypto.randomUUID(),
          kind: event.kind,
          content: event.content,
        };

        setMessages((messages) => [...messages, message]);

        if (index === FAKE_AGENT_EVENTS.length - 1) {
          setIsThinking(false);
        }
      }, event.delay);
    });
  }

  return (
    <main className="app-shell">
      <aside className="chat-rail">
        <section className="conversation">
          {messages.length === 0 ? (
            <p className="empty-state">Describe an iOS screen to start</p>
          ) : (
            messages.map((message) => {
              return (
                <div className={`message ${message.kind}`} key={message.id}>
                  <span className="message-label">
                    {MESSAGE_LABELS[message.kind]}
                  </span>
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
