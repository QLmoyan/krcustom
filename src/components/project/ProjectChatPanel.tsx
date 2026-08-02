"use client";

import { ProjectChatMessageBubble } from "@/components/project/ProjectChatMessageBubble";
import { Button } from "@/components/ui/Button";
import { ko } from "@/messages";
import type { ProjectChatMessage } from "@/types/Project";

type ProjectChatPanelProps = {
  messages: ProjectChatMessage[];
};

export function ProjectChatPanel({ messages }: ProjectChatPanelProps) {
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
      </div>

      <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] p-3">
        <div className="flex items-end gap-2">
          <button
            type="button"
            className="inline-flex h-10 shrink-0 items-center rounded-lg border border-[#E2E8F0] bg-white px-3 text-[12px] font-semibold text-[#64748B]"
          >
            {ko.project.attach}
          </button>
          <label htmlFor="project-chat-input" className="sr-only">
            {ko.project.composerPlaceholder}
          </label>
          <textarea
            id="project-chat-input"
            rows={2}
            disabled
            placeholder={ko.project.composerPlaceholder}
            className="min-w-0 flex-1 resize-none rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[14px] text-[#0F172A] outline-none placeholder:text-[#94A3B8] disabled:cursor-not-allowed disabled:opacity-80"
          />
          <Button type="button" size="md" disabled className="shrink-0">
            {ko.project.send}
          </Button>
        </div>
      </div>
    </section>
  );
}
