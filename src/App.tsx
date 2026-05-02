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
    <main>
      <h1>Honeycrisp</h1>
      <p>Generate native SwiftUI interfaces from prompts.</p>

      <form action={sendPrompt}>
        <textarea name="prompt" placeholder="Describe an iOS screen..." />
        <button type="submit">Send</button>
      </form>

      <section>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </section>
    </main>
  );
}

export default App;
