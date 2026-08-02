import { ko } from "@/messages";

type CapabilityGroup = {
  id: string;
  label: string;
  items: string[];
};

const DEFAULT_CAPABILITIES: CapabilityGroup[] = [
  {
    id: "items",
    label: ko.service.capabilityItems,
    items: ["티셔츠", "후드", "모자", "에코백"],
  },
  {
    id: "files",
    label: ko.service.capabilityFiles,
    items: ["PNG", "JPG", "PDF", "AI", "PSD"],
  },
  {
    id: "designs",
    label: ko.service.capabilityDesigns,
    items: ["로고", "사진", "일러스트", "QR"],
  },
];

type ServiceCapabilitiesProps = {
  groups?: CapabilityGroup[];
};

export function ServiceCapabilities({
  groups = DEFAULT_CAPABILITIES,
}: ServiceCapabilitiesProps) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
      {groups.map((group) => (
        <p key={group.id} className="min-w-0 text-[12px] leading-relaxed text-[#64748B]">
          <span className="font-medium text-[#94A3B8]">{group.label}</span>
          <span className="mx-1.5 text-[#CBD5E1]" aria-hidden>
            ·
          </span>
          <span className="tabular-nums text-[#475569]">
            {group.items.join(" · ")}
          </span>
        </p>
      ))}
    </div>
  );
}
