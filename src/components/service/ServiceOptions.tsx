"use client";

import { useState } from "react";
import type { Service, ServiceOptionGroup } from "@/types";
import { ko } from "@/messages";

type ServiceOptionsProps = {
  service: Service;
  note?: string;
  onNoteChange?: (value: string) => void;
  referenceFile?: File | null;
  onReferenceFileChange?: (file: File | null) => void;
  uploadDisabled?: boolean;
};

export function ServiceOptions({
  service,
  note: controlledNote,
  onNoteChange,
  referenceFile,
  onReferenceFileChange,
  uploadDisabled = false,
}: ServiceOptionsProps) {
  const optionGroups = service.availableOptions ?? [];
  const minQuantity = service.minimumOrderQuantity ?? 1;
  const quantityTiers = service.quantityTiers;

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => buildDefaultSelections(optionGroups),
  );
  const [quantity, setQuantity] = useState(minQuantity);
  const [internalNote, setInternalNote] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const note = controlledNote ?? internalNote;
  const setNote = onNoteChange ?? setInternalNote;
  const fileName = referenceFile?.name ?? null;

  const matchedTierNote = quantityTiers?.find((item) => {
    const withinMin = quantity >= item.minQuantity;
    const withinMax =
      item.maxQuantity === null || quantity <= item.maxQuantity;
    return withinMin && withinMax;
  })?.note;

  function assignFile(file: File | null) {
    onReferenceFileChange?.(file);
  }

  return (
    <div className="space-y-4">
      {optionGroups.map((group) => (
        <fieldset key={group.id} className="min-w-0">
          <legend className="mb-1.5 text-[13px] font-semibold text-[#0F172A]">
            {group.name}
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {group.choices.map((choice) => {
              const selected = selectedOptions[group.id] === choice.id;
              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() =>
                    setSelectedOptions((prev) => ({
                      ...prev,
                      [group.id]: choice.id,
                    }))
                  }
                  className={[
                    "rounded-md border px-2.5 py-1.5 text-[12px] font-medium transition",
                    selected
                      ? "border-[#0F766E] bg-[#F0FDFA] text-[#0F766E]"
                      : "border-[#E2E8F0] bg-white text-[#0F172A] hover:border-[#CBD5E1]",
                  ].join(" ")}
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div>
        <label
          htmlFor="service-quantity"
          className="mb-1.5 block text-[13px] font-semibold text-[#0F172A]"
        >
          {ko.service.quantity}
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]"
            onClick={() =>
              setQuantity((value) => Math.max(minQuantity, value - 1))
            }
            aria-label="수량 감소"
          >
            −
          </button>
          <input
            id="service-quantity"
            type="number"
            min={minQuantity}
            value={quantity}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (Number.isNaN(next)) return;
              setQuantity(Math.max(minQuantity, next));
            }}
            className="h-9 w-16 rounded-lg border border-[#E2E8F0] px-2 text-center text-[14px] tabular-nums outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/15"
          />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]"
            onClick={() => setQuantity((value) => value + 1)}
            aria-label="수량 증가"
          >
            +
          </button>
        </div>
        {matchedTierNote ? (
          <p className="mt-1.5 text-[12px] text-[#0369A1]">{matchedTierNote}</p>
        ) : null}
        {quantityTiers && quantityTiers.length > 0 ? (
          <ul className="mt-2 space-y-0.5 text-[12px] text-[#64748B]">
            <li className="font-semibold text-[#0F172A]">
              {ko.service.quantityTiers}
            </li>
            {quantityTiers.map((tier) => (
              <li key={`${tier.minQuantity}-${tier.unitPrice}`}>{tier.note}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <div>
        <p className="mb-1.5 text-[13px] font-semibold text-[#0F172A]">
          {ko.service.referenceUpload}
        </p>
        <label
          className={[
            "flex cursor-pointer flex-col items-start gap-0.5 rounded-lg border border-dashed bg-[#F8FAFC] px-3 py-2.5 transition",
            dragOver
              ? "border-[#0F766E] bg-[#F0FDFA]"
              : "border-[#CBD5E1] hover:border-[#0F766E]",
            uploadDisabled ? "pointer-events-none opacity-60" : "",
          ].join(" ")}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragOver(false);
            const file = event.dataTransfer.files?.[0];
            if (file && file.type.startsWith("image/")) {
              assignFile(file);
            }
          }}
        >
          <span className="text-[13px] font-medium text-[#0F766E]">
            {ko.service.referenceUpload}
          </span>
          <span className="text-[11px] text-[#64748B]">
            {ko.service.referenceUploadHint}
          </span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={uploadDisabled}
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              assignFile(file);
            }}
          />
        </label>
        {fileName ? (
          <div className="mt-1.5 flex items-center gap-2">
            <p className="min-w-0 flex-1 truncate text-[12px] text-[#64748B]">
              {ko.service.selectedFile}: {fileName}
            </p>
            <button
              type="button"
              className="shrink-0 text-[12px] font-semibold text-[#DC2626] hover:underline"
              onClick={() => assignFile(null)}
              disabled={uploadDisabled}
            >
              {ko.service.referenceRemove}
            </button>
          </div>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="service-note"
          className="mb-1.5 block text-[13px] font-semibold text-[#0F172A]"
        >
          {ko.service.customRequestNote}
        </label>
        <textarea
          id="service-note"
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={ko.service.customRequestPlaceholder}
          className="w-full resize-y rounded-lg border border-[#E2E8F0] px-3 py-2 text-[14px] leading-relaxed text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/15"
        />
      </div>
    </div>
  );
}

function buildDefaultSelections(
  groups: ServiceOptionGroup[],
): Record<string, string> {
  return groups.reduce<Record<string, string>>((acc, group) => {
    const first = group.choices[0];
    if (first) acc[group.id] = first.id;
    return acc;
  }, {});
}
