"use client";

import { useState } from "react";
import type { Service, ServiceOptionGroup } from "@/types";
import { ko } from "@/messages";

type ServiceOptionsProps = {
  service: Service;
  note?: string;
  onNoteChange?: (value: string) => void;
  uploadDisabled?: boolean;
};

export function ServiceOptions({
  service,
  note: controlledNote,
  onNoteChange,
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

  const note = controlledNote ?? internalNote;
  const setNote = onNoteChange ?? setInternalNote;

  const matchedTierNote = quantityTiers?.find((item) => {
    const withinMin = quantity >= item.minQuantity;
    const withinMax =
      item.maxQuantity === null || quantity <= item.maxQuantity;
    return withinMin && withinMax;
  })?.note;

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
            disabled={uploadDisabled}
          >
            −
          </button>
          <input
            id="service-quantity"
            type="number"
            min={minQuantity}
            value={quantity}
            disabled={uploadDisabled}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (Number.isNaN(next)) return;
              setQuantity(Math.max(minQuantity, next));
            }}
            className="h-9 w-16 rounded-lg border border-[#E2E8F0] px-2 text-center text-[14px] tabular-nums outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/15 disabled:opacity-60"
          />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]"
            onClick={() => setQuantity((value) => value + 1)}
            aria-label="수량 증가"
            disabled={uploadDisabled}
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
          disabled={uploadDisabled}
          onChange={(event) => setNote(event.target.value)}
          placeholder={ko.service.customRequestPlaceholder}
          className="w-full resize-y rounded-lg border border-[#E2E8F0] px-3 py-2 text-[14px] leading-relaxed text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/15 disabled:opacity-60"
        />
        <p className="mt-1.5 break-keep text-[11px] text-[#94A3B8]">
          {ko.service.referenceInChatHint}
        </p>
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
