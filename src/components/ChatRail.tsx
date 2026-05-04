import { SendHorizontal } from "lucide-react";
import type { ChatMessage } from "../../types/chat";
import { MessageBubble } from "./MessageBubble";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "./ui/input-group";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";

type ChatRailProps = {
  messages: ChatMessage[];
  prompt: string;
  isThinking: boolean;
  onPromptChange: (prompt: string) => void;
  onSubmitPrompt: (formData: FormData) => void;
};

const THINKING_MESSAGE: ChatMessage = {
  id: "agent-thinking",
  kind: "agent",
  content: "...",
};

export function ChatRail({
  messages,
  prompt,
  isThinking,
  onPromptChange,
  onSubmitPrompt,
}: ChatRailProps) {
  const canSubmit = prompt.trim().length > 0 && !isThinking;

  return (
    <aside className="flex h-full min-w-0 flex-1 flex-col bg-background">
      <ScrollArea className="min-h-0 flex-1">
        <section className="flex flex-col gap-3 p-4">
          {messages.length === 0 ? (
            <p className="rounded-lg border border-dashed bg-muted/30 p-3 text-sm text-muted-foreground">
              No messages yet.
            </p>
          ) : (
            messages.map((message) => (
              <MessageBubble message={message} key={message.id} />
            ))
          )}

          {isThinking ? (
            <MessageBubble message={THINKING_MESSAGE} />
          ) : null}
        </section>
      </ScrollArea>

      <Separator />

      <form action={onSubmitPrompt} className="p-3">
        <InputGroup className="min-h-24 items-end">
          <InputGroupTextarea
            aria-label="Prompt"
            autoCapitalize="off"
            autoCorrect="off"
            className="max-h-40 min-h-24 text-sm"
            name="prompt"
            placeholder="Describe an iOS screen..."
            spellCheck={false}
            value={prompt}
            onChange={(event) => onPromptChange(event.currentTarget.value)}
          />
          <InputGroupAddon align="block-end" className="justify-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton
                  aria-label="Send prompt"
                  disabled={!canSubmit}
                  size="icon-sm"
                  type="submit"
                >
                  <SendHorizontal data-icon="inline-start" />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>Send prompt</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </aside>
  );
}
