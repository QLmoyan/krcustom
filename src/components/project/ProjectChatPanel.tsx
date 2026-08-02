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
import {
  sendProjectChatMessage,
  uploadProjectReferenceImage,
} from "@/lib/actions/chat";
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
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    if ((!body && !pendingFile) || pending) return;

    setError(null);
    startTransition(async () => {
      let imageUrl: string | null = null;

      if (pendingFile) {
        const formData = new FormData();
        formData.set("file", pendingFile);
        const upload = await uploadProjectReferenceImage({
          projectId,
          formData,
        });
        if (!upload.ok) {
          if (upload.needAuth) {
            setError(ko.project.chatLoginRequired);
            router.push(
              `/login?next=${encodeURIComponent(`/project/${projectId}`)}`,
            );
            return;
          }
          setError(upload.error || ko.project.chatSendFailed);
          return;
        }
        imageUrl = upload.url;
      }

      const result = await sendProjectChatMessage({
        projectId,
        conversationId,
        body,
        imageUrl,
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
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
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

  const canSend = Boolean(text.trim() || pendingFile);

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
        {pendingFile ? (
          <div className="mb-2 flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5">
            <p className="min-w-0 flex-1 truncate text-[12px] text-[#64748B]">
              {pendingFile.name}
            </p>
            <button
              type="button"
              className="shrink-0 text-[12px] font-semibold text-[#DC2626] hover:underline"
              disabled={pending}
              onClick={() => {
                setPendingFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              {ko.service.referenceRemove}
            </button>
          </div>
        ) : null}
        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={pending}
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              if (file && file.type.startsWith("image/")) {
                setPendingFile(file);
              }
            }}
          />
          <button
            type="button"
            disabled={pending}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white px-3 text-[13px] font-semibold text-[#0F766E] hover:bg-[#F0FDFA] disabled:opacity-60"
            aria-label={ko.project.attach}
          >
            {ko.project.attach}
          </button>
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
            disabled={pending || !canSend}
            className="shrink-0"
          >
            {pending ? ko.project.sending : ko.project.send}
          </Button>
        </div>
      </form>
    </section>
  );
}
