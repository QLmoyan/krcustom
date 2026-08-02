import { Badge } from "@/components/ui/Badge";
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
    items: ["로고", "사진", "일러스트", "QR 코드"],
  },
];

type ServiceCapabilitiesProps = {
  groups?: CapabilityGroup[];
};

export function ServiceCapabilities({
  groups = DEFAULT_CAPABILITIES,
}: ServiceCapabilitiesProps) {
  return (
    <section className="space-y-2.5">
      <h2 className="text-[14px] font-semibold text-[#0F172A]">
        {ko.service.capabilitiesTitle}
      </h2>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {groups.map((group) => (
          <div key={group.id} className="min-w-0">
            <p className="mb-1.5 text-[12px] font-medium text-[#64748B]">
              {group.label}
            </p>
            <div className="flex flex-wrap gap-1">
              {group.items.map((item) => (
                <Badge key={item} tone="neutral">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
