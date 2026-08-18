"use client";

import { useEffect, useMemo, useState } from "react";
import { Bot, SendHorizonal, Sparkles, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  useChatMessages,
  useChatSession,
  useChatSessions,
  useSendChatMessage,
} from "@/hooks/useChat";

const suggestedPrompts = [
  "Explain my blood test",
  "What do these symptoms mean?",
  "How should I prepare for my appointment?",
  "Help me understand this report",
];

function toChatMessageView(message: {
  role: string;
  message: string;
}) {
  return {
    role: message.role === "USER" ? "user" : "assistant",
    content: message.message,
  };
}

export default function AssistantPage() {
  const { listQuery, createSessionMutation } = useChatSessions();

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");

  // Show only the 10 most recent conversations.
  // Older conversations remain in the database.
  const sessions = useMemo(
    () => (listQuery.data?.data ?? []).slice(0, 10),
    [listQuery.data],
  );

  /*
   * If the user hasn't explicitly selected a conversation,
   * use the first available conversation.
   *
   * This avoids calling setState synchronously inside useEffect.
   */
  const selectedSessionId =
    activeSessionId ?? sessions[0]?.id ?? "";

  const sessionData = useChatSession(selectedSessionId);
  const messagesData = useChatMessages(selectedSessionId);
  const sendMessageMutation = useSendChatMessage();

  /*
   * Only create a conversation when the user has no conversations.
   *
   * We intentionally do NOT set the first existing conversation
   * into state here because selectedSessionId already derives it.
   */
  useEffect(() => {
    if (!sessions.length && !activeSessionId) {
      createSessionMutation.mutateAsync(undefined).then((response) => {
        setActiveSessionId(response.data.id);
      });
    }
  }, [activeSessionId, createSessionMutation, sessions.length]);

  const currentMessages = useMemo(
    () => (messagesData.data?.data ?? []).map(toChatMessageView),
    [messagesData.data],
  );

  const handleNewChat = async () => {
    const response = await createSessionMutation.mutateAsync(
      `Conversation ${sessions.length + 1}`,
    );

    setActiveSessionId(response.data.id);
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedSessionId) {
      return;
    }

    const message = input.trim();

    setInput("");

    await sendMessageMutation.mutateAsync({
      sessionId: selectedSessionId,
      message,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.16em] text-teal-700">
          AI Assistant
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          AI Health Assistant
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Ask questions about health information, symptoms, reports, and more.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        {/* Conversation sidebar */}
        <Card className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">
              Conversations
            </h2>

            <Button
              variant="secondary"
              size="sm"
              className="rounded-lg"
              onClick={handleNewChat}
              disabled={createSessionMutation.isPending}
            >
              {createSessionMutation.isPending ? "Creating..." : "New"}
            </Button>
          </div>

          <div className="space-y-2">
            {sessions.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => setActiveSessionId(chat.id)}
                className={`w-full rounded-xl border px-3 py-2 text-left text-sm font-medium transition-colors ${
                  selectedSessionId === chat.id
                    ? "border-teal-200 bg-teal-50 text-teal-900"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-teal-200 hover:bg-teal-50/50"
                }`}
              >
                {chat.title || "Untitled conversation"}
              </button>
            ))}

            {sessions.length === 0 && !createSessionMutation.isPending && (
              <p className="rounded-xl border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500">
                No conversations yet.
              </p>
            )}
          </div>
        </Card>

        {/* Chat area */}
        <Card className="overflow-hidden">
          <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-700 text-white">
              <Sparkles className="h-4 w-4" />
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                {sessionData.data?.data?.title || "AI Health Assistant"}
              </p>
            </div>
          </div>

          <div className="space-y-4 p-4">
            {currentMessages.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                Start the conversation by asking about a symptom, report, or
                general health question.
              </div>
            ) : (
              currentMessages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.role === "user"
                        ? "bg-teal-700 text-white"
                        : "border border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      {message.role === "user" ? (
                        <UserRound className="h-3.5 w-3.5" />
                      ) : (
                        <Bot className="h-3.5 w-3.5" />
                      )}

                      <span className="text-[11px] uppercase tracking-[0.12em] opacity-80">
                        {message.role === "user" ? "You" : "AI"}
                      </span>
                    </div>

                    <p>{message.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input area */}
          <div className="border-t border-slate-200 p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask a health question..."
                className="flex-1"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void handleSend();
                  }
                }}
              />

              <Button
                onClick={() => void handleSend()}
                className="gap-2 rounded-xl"
                disabled={
                  !selectedSessionId || sendMessageMutation.isPending
                }
              >
                <SendHorizonal className="h-4 w-4" />

                {sendMessageMutation.isPending ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}