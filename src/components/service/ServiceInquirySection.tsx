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
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function startChat() {
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("serviceId", service.id);
      formData.set("serviceTitle", service.title);
      formData.set("storeName", service.storeName);

      const result = await createInquiryProject(formData);

      if (!result.ok) {
        if (result.needAuth) {
          const returnTo = encodeURIComponent(`/service/${service.id}`);
          router.push(`/login?returnTo=${returnTo}`);
          return;
        }
        setError(ko.service.createFailed);
        return;
      }

      // Project is created silently; land on chat workspace for that project.
      router.push(`/project/${result.projectId}`);
      router.refresh();
    });
  }

  return (
    <div className="space-y-3.5">
      <ServiceOptions service={service} uploadDisabled={pending} />

      {error ? (
        <p className="break-keep text-[13px] text-[#DC2626]" role="alert">
          {error}
        </p>
      ) : null}

      <div className="hidden lg:block">
        <ServiceActionPanel
          layout="stack"
          pending={pending}
          onStartChat={startChat}
        />
      </div>

      <div className="fixed inset-x-0 bottom-14 z-30 md:bottom-0 lg:hidden">
        <ServiceActionPanel
          layout="mobile-bar"
          pending={pending}
          onStartChat={startChat}
        />
      </div>
    </div>
  );
}
