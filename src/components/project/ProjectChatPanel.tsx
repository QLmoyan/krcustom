"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { ProjectChatMessageBubble } from "@/components/project/ProjectChatMessageBubble";
import { Button } from "@/components/ui/Button";
import { sendProjectChatMessage } from "@/lib/actions/chat";
import { ko } from "@/messages";
import type { ProjectChatMessage } from "@/types/Project";

type ProjectChatPanelProps = {
  projectId: string;
  conversationId: string | null;
  messages: ProjectChatMessage[];
};

export function ProjectChatPanel({
  projectId,
  conversationId,
  messages: serverMessages,
}: ProjectChatPanelProps) {
  const router = useRouter();
  const [optimistic, setOptimistic] = useState<ProjectChatMessage[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const messages = useMemo(() => {
    const seen = new Set(serverMessages.map((message) => message.id));
    return [
      ...serverMessages,
      ...optimistic.filter((message) => !seen.has(message.id)),
    ];
  }, [serverMessages, optimistic]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  function submit() {
    const body = text.trim();
    if (!body || pending) return;

    setError(null);
    startTransition(async () => {
      const result = await sendProjectChatMessage({
        projectId,
        conversationId,
        body,
      });

      if (!result.ok) {
        if (result.needAuth) {
          setError(ko.project.chatLoginRequired);
          router.push(
            `/login?next=${encodeURIComponent(`/project/${projectId}`)}`,
          );
          return;
        }
        setError(ko.project.chatSendFailed);
        return;
      }

      setText("");
      setOptimistic((prev) => [...prev, result.message]);
      router.refresh();
    });
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    submit();
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <section className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-xl border border-[#E2E8F0] bg-white lg:min-h-0">
      <div className="border-b border-[#E2E8F0] px-4 py-3">
        <h2 className="text-[15px] font-semibold text-[#0F172A]">
          {ko.project.chatTitle}
        </h2>
        <p className="mt-0.5 text-[11px] text-[#94A3B8]">{ko.project.demoChat}</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[200px] items-center justify-center px-4">
            <p className="text-center text-[13px] text-[#94A3B8]">
              {ko.system.emptyDescription}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ProjectChatMessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={onSubmit}
        className="border-t border-[#E2E8F0] bg-[#F8FAFC] p-3"
      >
        {error ? (
          <p className="mb-2 break-keep text-[12px] text-[#DC2626]" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex items-end gap-2">
          <label htmlFor="project-chat-input" className="sr-only">
            {ko.project.composerPlaceholder}
          </label>
          <textarea
            id="project-chat-input"
            rows={2}
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={onKeyDown}
            disabled={pending}
            placeholder={ko.project.composerPlaceholder}
            className="min-w-0 flex-1 resize-none rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[14px] text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/15 disabled:cursor-not-allowed disabled:opacity-80"
          />
          <Button
            type="submit"
            size="md"
            disabled={pending || !text.trim()}
            className="shrink-0"
          >
            {pending ? ko.project.sending : ko.project.send}
          </Button>
        </div>
      </form>
    </section>
  );
}
