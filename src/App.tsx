import { useState } from "react";
import "./App.css";
import { ChatRail } from "./components/ChatRail";
import { runAgent } from "./lib/agentClient";
import { createMessage } from "./lib/messages";
import type { ChatMessage } from "../types/chat";

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  function sendPrompt(formData: FormData) {
    const content = String(formData.get("prompt") ?? "").trim();

    if (!content) {
      return;
    }

    setPrompt("");
    setMessages((messages) => [...messages, createMessage("user", content)]);
    setIsThinking(true);

    void loadAgentResponse(content);
  }

  async function loadAgentResponse(content: string) {
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
      <ChatRail
        messages={messages}
        prompt={prompt}
        isThinking={isThinking}
        onPromptChange={setPrompt}
        onSubmitPrompt={sendPrompt}
      />

      <section className="workspace">
        <header className="workspace-header">
          <h1>Honeycrisp</h1>
        </header>
      </section>
    </main>
  );
}

export default App;
