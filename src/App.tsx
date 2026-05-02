import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState<string[]>([]);

  function sendPrompt(formData: FormData) {
    const prompt = String(formData.get("prompt") ?? "").trim();

    if (!prompt) {
      return;
    }

    setMessages((messages) => [...messages, prompt]);
  }

  return (
    <main className="app-shell">
      <aside className="chat-rail">
        <section className="conversation">
          {messages.map((message, index) => (
            <div className="message" key={index}>
              <strong>You said:</strong> {message}
            </div>
          ))}
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
