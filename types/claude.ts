export type ClaudeContentBlock = {
  type?: string;
  text?: string;
  name?: string;
  is_error?: boolean;
};

export type ClaudeRawEvent = {
  type?: string;
  subtype?: string;
  model?: string;
  message?: {
    content?: ClaudeContentBlock[];
  };
  is_error?: boolean;
  duration_ms?: number;
};
