"use client";

import Image from "next/image";
import { useState } from "react";

type ServiceGalleryProps = {
  title: string;
  images: string[];
};

export function ServiceGallery({ title, images }: ServiceGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  if (!activeImage) {
    return (
      <div className="aspect-[5/4] max-h-[360px] rounded-xl bg-[#F1F5F9]" aria-hidden />
    );
  }

  return (
    <div className="w-full min-w-0 lg:sticky lg:top-[4.75rem] lg:self-start">
      <div className="relative mx-auto aspect-[5/4] w-full max-h-[380px] overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F1F5F9]">
        <Image
          src={activeImage}
          alt={`${title} 이미지 ${activeIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 42vw"
          className="object-cover object-center"
          unoptimized
          priority
        />
      </div>
      <ul className="mt-2 flex gap-1.5 overflow-x-auto pb-0.5">
        {images.map((image, index) => {
          const selected = index === activeIndex;
          return (
            <li key={image} className="shrink-0">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className={[
                  "relative h-12 w-12 overflow-hidden rounded-md border-2",
                  selected
                    ? "border-[#0F766E]"
                    : "border-transparent opacity-80 hover:opacity-100",
                ].join(" ")}
                aria-label={`${title} 썸네일 ${index + 1}`}
                aria-pressed={selected}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                  unoptimized
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
