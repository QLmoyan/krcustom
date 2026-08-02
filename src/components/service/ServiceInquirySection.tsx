"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ServiceActionPanel } from "@/components/service/ServiceActionPanel";
import { ServiceOptions } from "@/components/service/ServiceOptions";
import { createInquiryProject } from "@/lib/actions/project";
import { ko } from "@/messages";
import type { Service } from "@/types";

type ServiceInquirySectionProps = {
  service: Service;
};

export function ServiceInquirySection({ service }: ServiceInquirySectionProps) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function startInquiry(mode: "chat" | "quote") {
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("serviceId", service.id);
      formData.set("serviceTitle", service.title);
      formData.set("storeName", service.storeName);
      formData.set("note", note);
      if (referenceFile) {
        formData.set("referenceImage", referenceFile);
      }

      const result = await createInquiryProject(formData);

      if (!result.ok) {
        if (result.needAuth) {
          const next = encodeURIComponent(`/service/${service.id}`);
          router.push(`/login?next=${next}`);
          return;
        }
        setError(ko.service.createFailed);
        return;
      }

      const path =
        mode === "quote"
          ? `/project/${result.projectId}/quote`
          : `/project/${result.projectId}`;
      router.push(path);
      router.refresh();
    });
  }

  return (
    <div className="space-y-3.5">
      <ServiceOptions
        service={service}
        note={note}
        onNoteChange={setNote}
        referenceFile={referenceFile}
        onReferenceFileChange={setReferenceFile}
        uploadDisabled={pending}
      />

      {error ? (
        <p className="break-keep text-[13px] text-[#DC2626]" role="alert">
          {error}
        </p>
      ) : null}

      <div className="hidden lg:block">
        <ServiceActionPanel
          service={service}
          layout="stack"
          pending={pending}
          onChatInquiry={() => startInquiry("chat")}
          onRequestQuote={() => startInquiry("quote")}
        />
      </div>

      <div className="fixed inset-x-0 bottom-14 z-30 md:bottom-0 lg:hidden">
        <ServiceActionPanel
          service={service}
          layout="mobile-bar"
          pending={pending}
          onChatInquiry={() => startInquiry("chat")}
          onRequestQuote={() => startInquiry("quote")}
        />
      </div>
    </div>
  );
}
