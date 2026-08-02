"use client";

import Image from "next/image";
import { useState } from "react";
import { ko } from "@/messages";
import type { DesignProof } from "@/types/DesignProof";

const copy = ko.designProof;

type DesignProofPreviewProps = {
  proof: DesignProof;
  large?: boolean;
};

export function DesignProofPreview({
  proof,
  large = false,
}: DesignProofPreviewProps) {
  const images = proof.previewImages;
  const [activeId, setActiveId] = useState(images[0]?.id ?? "");
  const active =
    images.find((image) => image.id === activeId) ?? images[0] ?? null;

  if (!active) {
    return (
      <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] px-4 py-10 text-center text-[13px] text-[#64748B]">
        {copy.preview}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className={[
          "relative overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F1F5F9]",
          large ? "aspect-[4/3] md:aspect-[16/10]" : "aspect-[4/3]",
        ].join(" ")}
      >
        <Image
          src={active.url}
          alt={`${proof.title} V${proof.version}`}
          fill
          sizes="(max-width: 768px) 100vw, 720px"
          className="object-cover"
          unoptimized
        />
      </div>
      {images.length > 1 ? (
        <div>
          <p className="mb-2 text-[12px] font-medium text-[#64748B]">
            {copy.thumbnails}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((image) => {
              const selected = image.id === active.id;
              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setActiveId(image.id)}
                  className={[
                    "relative h-16 w-20 shrink-0 overflow-hidden rounded-md border-2",
                    selected
                      ? "border-[#0F766E]"
                      : "border-transparent ring-1 ring-[#E2E8F0]",
                  ].join(" ")}
                >
                  <Image
                    src={image.thumbnailUrl || image.url}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
