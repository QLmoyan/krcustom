"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createInquiryProject } from "@/lib/actions/project";
import { formatCount } from "@/lib/format";
import { ko } from "@/messages";
import type { Store } from "@/types";

type StoreInfoCardChatService = {
  id: string;
  title: string;
  storeName: string;
};

type StoreInfoCardProps = {
  store: Store;
  chatService?: StoreInfoCardChatService;
};

export function StoreInfoCard({ store, chatService }: StoreInfoCardProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const responseLabel = formatResponseLabel(store.responseTime);
  const completedLabel = `${ko.store.completedOrdersShort} ${formatCount(store.completedOrders)}${ko.store.orderUnit}`;

  function startChat() {
    if (!chatService) return;

    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("serviceId", chatService.id);
      formData.set("serviceTitle", chatService.title);
      formData.set("storeName", chatService.storeName);

      const result = await createInquiryProject(formData);

      if (!result.ok) {
        if (result.needAuth) {
          const returnTo = encodeURIComponent(`/service/${chatService.id}`);
          router.push(`/login?returnTo=${returnTo}`);
          return;
        }
        setError(ko.service.createFailed);
        return;
      }

      router.push(`/project/${result.projectId}`);
      router.refresh();
    });
  }

  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-3.5">
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F1F5F9]">
          <Image
            src={store.logo}
            alt={`${store.name} 로고`}
            fill
            sizes="48px"
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h2 className="truncate text-[15px] font-semibold text-[#0F172A]">
              {store.name}
            </h2>
            {store.verified ? (
              <Badge tone="success">{ko.store.verified}</Badge>
            ) : null}
          </div>
          <p className="mt-1 text-[13px] text-[#0F172A]">
            ★ {store.rating.toFixed(1)} · {formatCount(store.reviewCount)}{" "}
            {ko.store.reviews}
          </p>
          <ul className="mt-2 space-y-1 text-[12px] text-[#64748B]">
            <li>{responseLabel}</li>
            <li>{completedLabel}</li>
            {store.verified ? (
              <li className="font-medium text-[#15803D]">
                {ko.store.recentActivity}
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      {error ? (
        <p className="mt-3 break-keep text-[13px] text-[#DC2626]" role="alert">
          {error}
        </p>
      ) : null}

      {chatService ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            href={`/store/${store.id}`}
            variant="outline"
            size="md"
            className="w-full whitespace-nowrap px-2 text-[13px]"
          >
            {ko.service.visitStore}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            className="w-full whitespace-nowrap px-2 text-[13px]"
            disabled={pending}
            onClick={startChat}
          >
            {pending ? ko.service.creatingProject : ko.service.chatInquiry}
          </Button>
        </div>
      ) : (
        <div className="mt-3">
          <Button
            href={`/store/${store.id}`}
            variant="outline"
            size="md"
            className="w-full text-[13px]"
          >
            {ko.service.visitStore}
          </Button>
        </div>
      )}
    </section>
  );
}

function formatResponseLabel(responseTime: string): string {
  const minutes = responseTime.match(/\d+/);
  if (minutes?.[0]) {
    return `${ko.store.avgResponsePrefix} ${minutes[0]}${ko.store.avgResponseSuffix}`;
  }
  return `${ko.store.response} ${responseTime}`;
}
