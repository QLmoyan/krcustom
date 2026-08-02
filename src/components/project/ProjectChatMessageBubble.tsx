"use client";

import Image from "next/image";
import Link from "next/link";
import {
  StatusBadge,
  inferStatusToneFromKoreanLabel,
} from "@/components/ui/StatusBadge";
import { DesignProofStatus } from "@/constants/status";
import { formatKRW } from "@/lib/format";
import { ko } from "@/messages";
import type { ProjectChatMessage } from "@/types/Project";

type ProjectChatMessageBubbleProps = {
  message: ProjectChatMessage;
};

function isDesignProofStatusCode(value: string): boolean {
  return Object.values(DesignProofStatus).includes(
    value as (typeof DesignProofStatus)[keyof typeof DesignProofStatus],
  );
}

export function ProjectChatMessageBubble({
  message,
}: ProjectChatMessageBubbleProps) {
  if (message.type === "system" || message.sender === "system") {
    return (
      <div className="flex justify-center px-2 py-1.5">
        <p className="max-w-[90%] rounded-full bg-[#F1F5F9] px-3 py-1.5 text-center text-[12px] leading-relaxed text-[#64748B]">
          {message.text}
        </p>
      </div>
    );
  }

  const isCustomer = message.sender === "customer";

  return (
    <div
      className={[
        "flex w-full",
        isCustomer ? "justify-end" : "justify-start",
      ].join(" ")}
    >
      <div
        className={[
          "max-w-[88%] rounded-xl px-3 py-2.5 text-[14px] leading-relaxed",
          isCustomer
            ? "rounded-br-md bg-[#0F766E] text-white"
            : "rounded-bl-md border border-[#E2E8F0] bg-white text-[#0F172A]",
        ].join(" ")}
      >
        <div
          className={[
            "mb-1 flex items-center gap-2 text-[11px]",
            isCustomer ? "text-white/80" : "text-[#94A3B8]",
          ].join(" ")}
        >
          <span className="font-medium">{message.senderName}</span>
          <span>{message.createdAt}</span>
        </div>

        {message.type === "text" && message.text ? (
          <p className="break-keep whitespace-pre-wrap">{message.text}</p>
        ) : null}

        {message.type === "image" && message.imageUrl ? (
          <div className="space-y-2">
            {message.text ? (
              <p className="break-keep">{message.text}</p>
            ) : null}
            <div className="relative aspect-[4/3] w-full min-w-[180px] overflow-hidden rounded-lg bg-[#F1F5F9]">
              <Image
                src={message.imageUrl}
                alt={message.text || "첨부 이미지"}
                fill
                sizes="280px"
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        ) : null}

        {message.type === "file" || message.type === "psd" ? (
          <div
            className={[
              "rounded-lg border px-3 py-2",
              isCustomer
                ? "border-white/25 bg-white/10"
                : "border-[#E2E8F0] bg-[#F8FAFC]",
            ].join(" ")}
          >
            <p className="text-[12px] font-semibold">
              {message.type === "psd" ? ko.project.psdLabel : ko.project.fileLabel}
            </p>
            <p className="mt-0.5 break-all text-[13px] font-medium">
              {message.fileName}
            </p>
            {message.fileSize ? (
              <p
                className={[
                  "mt-0.5 text-[11px]",
                  isCustomer ? "text-white/75" : "text-[#64748B]",
                ].join(" ")}
              >
                {message.fileSize}
              </p>
            ) : null}
            {message.text ? (
              <p className="mt-1.5 break-keep text-[13px]">{message.text}</p>
            ) : null}
          </div>
        ) : null}

        {message.type === "quote" ? (
          <div
            className={[
              "rounded-lg border px-3 py-2.5",
              isCustomer
                ? "border-white/25 bg-white/10"
                : "border-[#BAE6FD] bg-[#F0F9FF]",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[12px] font-semibold">{ko.project.quoteCard}</p>
              {message.quoteStatus ? (
                <StatusBadge
                  label={message.quoteStatus}
                  tone={inferStatusToneFromKoreanLabel(message.quoteStatus)}
                  size="sm"
                />
              ) : null}
            </div>
            <p className="mt-1 text-[13px]">{message.quoteId}</p>
            {message.quoteAmount != null ? (
              <p className="mt-1 text-[16px] font-bold tabular-nums">
                {formatKRW(message.quoteAmount)}
              </p>
            ) : null}
            {message.text ? (
              <p className="mt-1.5 break-keep text-[13px]">{message.text}</p>
            ) : null}
            <Link
              href={`/project/prj-001/quote`}
              className={[
                "mt-2 inline-flex text-[12px] font-semibold underline",
                isCustomer ? "text-white" : "text-[#0369A1]",
              ].join(" ")}
            >
              {ko.project.viewQuote}
            </Link>
          </div>
        ) : null}

        {message.type === "order" ? (
          <div
            className={[
              "rounded-lg border px-3 py-2.5",
              isCustomer
                ? "border-white/25 bg-white/10"
                : "border-[#E2E8F0] bg-[#F8FAFC]",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[12px] font-semibold">{ko.order.orderCard}</p>
              {message.orderStatus ? (
                <StatusBadge
                  label={message.orderStatus}
                  tone={inferStatusToneFromKoreanLabel(message.orderStatus)}
                  size="sm"
                />
              ) : null}
            </div>
            {message.orderNumber ? (
              <p className="mt-1 text-[13px] tabular-nums">{message.orderNumber}</p>
            ) : null}
            {message.orderAmount != null ? (
              <p className="mt-1 text-[16px] font-bold tabular-nums">
                {formatKRW(message.orderAmount)}
              </p>
            ) : null}
            {message.text ? (
              <p className="mt-1.5 break-keep text-[13px]">{message.text}</p>
            ) : null}
            {message.orderId ? (
              <Link
                href={`/orders/${message.orderId}`}
                className={[
                  "mt-2 inline-flex text-[12px] font-semibold underline",
                  isCustomer ? "text-white" : "text-[#0369A1]",
                ].join(" ")}
              >
                {ko.order.openOrder}
              </Link>
            ) : null}
          </div>
        ) : null}

        {message.type === "designProof" ? (
          <div
            className={[
              "rounded-lg border px-3 py-2.5",
              isCustomer
                ? "border-white/25 bg-white/10"
                : "border-[#99F6E4] bg-[#F0FDFA]",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[12px] font-semibold">{ko.project.proofCard}</p>
              {message.designProofStatus ? (
                isDesignProofStatusCode(message.designProofStatus) ? (
                  <StatusBadge
                    domain="designProof"
                    status={message.designProofStatus}
                    size="sm"
                  />
                ) : (
                  <StatusBadge
                    label={message.designProofStatus}
                    tone={inferStatusToneFromKoreanLabel(
                      message.designProofStatus,
                    )}
                    size="sm"
                  />
                )
              ) : null}
            </div>
            <p className="mt-1 text-[13px]">
              {ko.project.proofVersion} {message.designProofVersion}
            </p>
            {message.designProofImageUrl ? (
              <div className="relative mt-2 aspect-[4/3] overflow-hidden rounded-md bg-[#F1F5F9]">
                <Image
                  src={message.designProofImageUrl}
                  alt={`${ko.project.proofCard} ${message.designProofVersion}`}
                  fill
                  sizes="280px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : null}
            {message.text ? (
              <p className="mt-1.5 break-keep text-[13px]">{message.text}</p>
            ) : null}
            {message.designProofStatus === "LOCKED" ||
            message.designProofStatus === "확정" ||
            message.designProofStatus === "시안 확정" ? (
              <p
                className={[
                  "mt-2 text-[11px]",
                  isCustomer ? "text-white/80" : "text-[#15803D]",
                ].join(" ")}
              >
                {ko.designProof.lockedBanner}
              </p>
            ) : (
              <p
                className={[
                  "mt-2 text-[11px]",
                  isCustomer ? "text-white/80" : "text-[#A16207]",
                ].join(" ")}
              >
                {ko.designProof.cannotProduce}
              </p>
            )}
            {message.designProofId ? (
              <Link
                href={`/design-proofs/${message.designProofId}`}
                className={[
                  "mt-2 inline-flex text-[12px] font-semibold underline",
                  isCustomer ? "text-white" : "text-[#0369A1]",
                ].join(" ")}
              >
                {ko.designProof.viewCustomerProof}
              </Link>
            ) : null}
          </div>
        ) : null}

        {message.type === "shipping" ? (
          <div
            className={[
              "rounded-lg border px-3 py-2.5",
              isCustomer
                ? "border-white/25 bg-white/10"
                : "border-[#E2E8F0] bg-[#F8FAFC]",
            ].join(" ")}
          >
            <p className="text-[12px] font-semibold">
              {ko.project.shippingCard}
            </p>
            <p className="mt-1 text-[13px]">
              {message.shippingDirection === "return"
                ? ko.project.returnShipment
                : ko.project.outbound}
            </p>
            <p className="mt-1 text-[13px] font-medium">
              {message.trackingCompany} · {message.trackingNumber}
            </p>
            {message.text ? (
              <p className="mt-1.5 break-keep text-[13px]">{message.text}</p>
            ) : null}
            <Link
              href="/orders/ord-001#owned"
              className={[
                "mt-2 inline-flex text-[12px] font-semibold underline",
                isCustomer ? "text-white" : "text-[#0369A1]",
              ].join(" ")}
            >
              {ko.order.openOrder}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
