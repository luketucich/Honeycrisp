import type { ChatMessage } from "../../types/chat";
import { MessageBubble } from "./MessageBubble";

type ChatRailProps = {
  messages: ChatMessage[];
  prompt: string;
  isThinking: boolean;
  onPromptChange: (prompt: string) => void;
  onSubmitPrompt: (formData: FormData) => void;
};

export function ChatRail({
  messages,
  prompt,
  isThinking,
  onPromptChange,
  onSubmitPrompt,
}: ChatRailProps) {
  return (
    <aside className="chat-rail">
      <section className="conversation">
        {messages.length === 0 ? (
          <p className="empty-state">Describe an iOS screen to start</p>
        ) : (
          messages.map((message) => (
            <MessageBubble message={message} key={message.id} />
          ))
        )}

        {isThinking ? (
          <div className="message agent">
            <span className="message-label">Agent</span>
            <p className="message-bubble typing-dots">...</p>
          </div>
        ) : null}
      </section>

      <form action={onSubmitPrompt} className="composer">
        <textarea
          name="prompt"
          placeholder="Describe an iOS screen..."
          value={prompt}
          onChange={(event) => onPromptChange(event.currentTarget.value)}
        />
        <button type="submit">Send</button>
      </form>
    </aside>
  );
}
