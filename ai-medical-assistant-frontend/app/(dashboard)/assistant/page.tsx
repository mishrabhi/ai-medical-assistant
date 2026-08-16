"use client";

import { useMemo, useState } from "react";
import { Bot, SendHorizonal, Sparkles, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const suggestedPrompts = [
  "Explain my blood test",
  "What do these symptoms mean?",
  "How should I prepare for my appointment?",
  "Help me understand this report",
];

const initialMessages = [
  {
    role: "assistant",
    content: "I can help explain reports, symptoms, and care questions using general health information. Always discuss serious concerns with a clinician.",
  },
];

export default function AssistantPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const currentConversation = useMemo(
    () => [
      { id: "new", title: "New conversation" },
    ],
    [],
  );

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((current) => [
      ...current,
      { role: "user", content: input.trim() },
      { role: "assistant", content: "I’m reviewing that question and can offer general guidance based on your symptoms or report details." },
    ]);
    setInput("");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.16em] text-teal-700">AI Assistant</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">AI Health Assistant</h1>
        <p className="mt-2 text-sm text-slate-500">Ask questions about health information, symptoms, reports, and more.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <Card className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Conversations</h2>
            <Button variant="secondary" size="sm" className="rounded-lg">New</Button>
          </div>

          <div className="space-y-2">
            {currentConversation.map((chat) => (
              <button
                key={chat.id}
                type="button"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-medium text-slate-700"
              >
                {chat.title}
              </button>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-700 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">AI Health Assistant</p>
            </div>
          </div>

          <div className="space-y-4 p-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "bg-teal-700 text-white"
                      : "border border-slate-200 bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2">
                    {message.role === "user" ? <UserRound className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                    <span className="text-[11px] uppercase tracking-[0.12em] opacity-80">
                      {message.role === "user" ? "You" : "AI"}
                    </span>
                  </div>
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
          </div>

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
              />
              <Button onClick={handleSend} className="gap-2 rounded-xl">
                <SendHorizonal className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
