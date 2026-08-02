"use client";

import { useState } from "react";
import type { Service, ServiceOptionGroup } from "@/types";

type ServiceOptionsProps = {
  service: Service;
};

export function ServiceOptions({ service }: ServiceOptionsProps) {
  const optionGroups = service.availableOptions ?? [];
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => buildDefaultSelections(optionGroups),
  );

  if (optionGroups.length === 0) return null;

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
